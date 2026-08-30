import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('completes a keyboard-first recall sprint and persists its recap', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/');
  await expect(page).toHaveTitle(/Focus Study Sprint/);
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Study what you brought. Then be done.' })).toBeVisible();

  const scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: 'Change color theme' }).click();
  await page.getByRole('button', { name: 'Change color theme' }).click();
  const darkScan = await new AxeBuilder({ page }).analyze();
  expect(darkScan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);

  await page.getByRole('button', { name: 'Use an example' }).click();
  await expect(page.getByText('5 / 30 ready')).toBeVisible();
  await page.getByRole('button', { name: /Begin this sprint/ }).click();
  await expect(page.getByText('PROMPT 1 OF 5')).toBeVisible();
  const sessionScan = await new AxeBuilder({ page }).analyze();
  expect(sessionScan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  for (let index = 0; index < 5; index += 1) {
    await page.keyboard.press('Enter');
    await expect(page.getByRole('region', { name: 'Expected answer' })).toBeVisible();
    await page.keyboard.press(index % 2 === 0 ? '2' : '1');
  }
  await expect(page.getByRole('heading', { name: 'You reached a stopping point.' })).toBeVisible();
  await expect(page.getByText('This is a record of today’s practice, not a grade.')).toBeVisible();
  await page.getByRole('button', { name: 'Library' }).click();
  await expect(page.getByText(/5 checked · 2 to revisit/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/5 checked · 2 to revisit/)).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('validates malformed input and exposes the recovery instruction', async ({ page }) => {
  await page.goto('/');
  const input = page.getByLabel(/One prompt and answer/);
  await input.fill('Valid :: answer\nThis line has no separator');
  await expect(page.getByText('Each non-empty line needs a prompt and answer separated by :: or a tab.')).toBeVisible();
  await expect(page.getByRole('button', { name: /Begin this sprint/ })).toBeDisabled();
});

test('rejects malformed nested backup records without replacing saved data', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/');
  await page.getByRole('button', { name: 'Use an example' }).click();
  await page.getByRole('button', { name: /Begin this sprint/ }).click();
  await page.keyboard.press('Enter');
  await page.keyboard.press('2');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'End session and see recap' }).click();
  await page.getByRole('button', { name: 'Library' }).click();
  await expect(page.getByText('1 checked · 0 to revisit')).toBeVisible();

  let replacementConfirmationShown = false;
  page.once('dialog', (dialog) => {
    replacementConfirmationShown = true;
    void dialog.accept();
  });
  await page.locator('input[data-import]').setInputFiles({
    name: 'malformed-backup.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"product":"focus-study-sprint","version":1,"exportedAt":"now","sessions":[{"id":"bad"}],"decks":[]}')
  });

  await expect(page.getByText('That file is not a valid Focus Study Sprint backup. Choose an exported JSON file.')).toBeVisible();
  expect(replacementConfirmationShown).toBe(false);
  await expect(page.getByText('1 checked · 0 to revisit')).toBeVisible();
  await page.reload();
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByText('1 checked · 0 to revisit')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('keeps recovery controls available for data poisoned by an older release', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', (error) => pageErrors.push(error.message));
  await page.goto('/');
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.ready).active && navigator.serviceWorker.controller));
  await page.evaluate(async () => new Promise<void>((resolve, reject) => {
    const open = indexedDB.open('focus-study-sprint', 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const database = open.result;
      const transaction = database.transaction('sessions', 'readwrite');
      transaction.objectStore('sessions').put({ id: 'bad' });
      transaction.oncomplete = () => { database.close(); resolve(); };
      transaction.onerror = () => reject(transaction.error);
    };
  }));

  await page.goto('/?recovery-test=1#library');
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByText('Stored data could not be read. Open Library to restore a valid backup or clear local data.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Clear local data' })).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Clear local data' }).click();
  await page.reload();
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByText('No sessions recorded')).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('restores an in-progress sprint and response after refresh', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Use an example' }).click();
  await page.getByRole('button', { name: /Begin this sprint/ }).click();
  await page.getByLabel(/Your answer/).fill('My working answer');
  await page.reload();
  await expect(page.getByText('PROMPT 1 OF 5')).toBeVisible();
  await expect(page.getByLabel(/Your answer/)).toHaveValue('My working answer');
});

test('app shell and saved draft work offline after first visit', async ({ page, context }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Use an example' }).click();
  await page.waitForFunction(async () => Boolean(await navigator.serviceWorker.ready));
  await context.setOffline(true);
  await expect(page.getByText('Offline — your session and saved data still work.')).toBeVisible();
  await page.reload();
  await expect(page.locator('main')).toBeVisible();
  await expect(page.getByText('5 / 30 ready')).toBeVisible();
  await page.getByRole('button', { name: /Begin this sprint/ }).click();
  await expect(page.getByText('PROMPT 1 OF 5')).toBeVisible();
});

test('legal pages have landmarks, titles, and one primary heading', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
  }
});

test('all visible controls retain 44px touch targets on mobile and desktop', async ({ browser }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('main')).toBeVisible();
    const tooSmall = await page.locator('a, button, input:not([type="radio"]):not([type="file"]):not([type="hidden"]), select').evaluateAll((elements) => elements
      .map((element) => {
        const bounds = element.getBoundingClientRect();
        return {
          name: (element.textContent || element.getAttribute('aria-label') || element.tagName).trim(),
          width: bounds.width,
          height: bounds.height
        };
      })
      .filter((target) => target.width < 44 || target.height < 44));
    expect(tooSmall).toEqual([]);

    await page.getByRole('button', { name: 'Use an example' }).click();
    await page.getByRole('button', { name: /Begin this sprint/ }).click();
    const pauseBounds = await page.getByRole('button', { name: 'Pause' }).boundingBox();
    expect(pauseBounds?.height).toBeGreaterThanOrEqual(44);
    await page.close();
  }
});

test('keeps setup and recovery controls usable at 200% text size on mobile', async ({ page }) => {
  await page.goto('/');
  await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.ready).active && navigator.serviceWorker.controller));
  await page.waitForSelector('main');
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });

  const expectNoHorizontalOverflow = async () => {
    const widths = await page.evaluate(() => ({
      content: document.documentElement.scrollWidth,
      viewport: document.documentElement.clientWidth
    }));
    expect(widths.content).toBeLessThanOrEqual(widths.viewport);
  };

  await expect(page.getByRole('button', { name: 'Use an example' })).toBeVisible();
  await expect(page.locator('.duration')).toHaveCount(3);
  await expectNoHorizontalOverflow();
  await page.getByRole('button', { name: 'Library' }).click();
  await expect(page.getByRole('button', { name: 'Clear local data' })).toBeVisible();
  await expectNoHorizontalOverflow();
});

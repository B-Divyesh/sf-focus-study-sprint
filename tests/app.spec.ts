import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFile } from 'node:fs/promises';

test('@claim:demo-isolation keeps sample work separate from real browser data', async ({ page }) => {
  const sentinel = 'REAL PRIVATE DRAFT :: must not appear in demo';
  await page.addInitScript((value) => localStorage.setItem('fss:draft', value), sentinel);

  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('What process do plants use to convert light into energy?')).toBeVisible();
  await expect(page.locator('#prompt-input')).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem('fss:draft'))).toBe(sentinel);
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:fss:')).length)).toBeGreaterThan(0);

  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByText('PROMPT 1 OF 5')).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('fss:draft'))).toBe(sentinel);

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByLabel(/One prompt and answer/)).toHaveValue(sentinel);
  expect(await page.evaluate(() => Object.keys(localStorage).filter((key) => key.startsWith('demo:fss:')))).toEqual([]);
});

test('@claim:input-limits enforces 5–30 prompt pairs and the three session lengths', async ({ page }) => {
  await page.goto('/demo?screen=setup');
  const input = page.getByLabel(/One prompt and answer/);
  const start = page.getByRole('button', { name: /Begin this sprint/ });
  await input.fill(Array.from({ length: 4 }, (_, index) => `Prompt ${index} :: Answer ${index}`).join('\n'));
  await expect(start).toBeDisabled();
  await expect(page.getByText('Add 1 more pair to begin.')).toBeVisible();
  await input.fill(Array.from({ length: 5 }, (_, index) => `Prompt ${index} :: Answer ${index}`).join('\n'));
  await expect(start).toBeEnabled();
  await expect(page.locator('input[name="duration"]')).toHaveCount(3);
  await input.fill(Array.from({ length: 31 }, (_, index) => `Prompt ${index} :: Answer ${index}`).join('\n'));
  await expect(start).toBeDisabled();
  await expect(page.getByText('Use 30 pairs or fewer.')).toBeVisible();
});

test('@claim:local-privacy sends no study data or analytics from the demo flow', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.goto('/demo');
  await page.getByLabel(/Your answer/).fill('A private response');
  await page.getByRole('button', { name: /Reveal answer/ }).click();
  await page.getByRole('button', { name: /Recalled/ }).click();
  expect(requests.length).toBeGreaterThan(0);
  expect(requests.every((url) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
});

test('@claim:study-flow completes a keyboard-first recall sprint and persists its recap', async ({ page }) => {
  const consoleErrors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  await page.goto('/demo');
  await expect(page).toHaveTitle('Demo — Focus Study Sprint');
  await expect(page.locator('main')).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.getByRole('heading', { name: 'Active recall session' })).toBeAttached();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();

  const scan = await new AxeBuilder({ page }).analyze();
  expect(scan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  await page.getByRole('button', { name: 'Change color theme' }).click();
  await page.getByRole('button', { name: 'Change color theme' }).click();
  const darkScan = await new AxeBuilder({ page }).analyze();
  expect(darkScan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);

  await expect(page.getByText('PROMPT 1 OF 5')).toBeVisible();
  const sessionScan = await new AxeBuilder({ page }).analyze();
  expect(sessionScan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  for (let index = 0; index < 5; index += 1) {
    await page.keyboard.press('Enter');
    await expect(page.getByRole('region', { name: 'Expected answer' })).toBeVisible();
    await page.keyboard.press(index % 2 === 0 ? '2' : '1');
  }
  await expect(page.getByRole('heading', { name: 'Your study session is complete.' })).toBeVisible();
  await expect(page.getByText('This is a record of today’s practice, not a grade.')).toBeVisible();
  await page.getByRole('link', { name: 'Library' }).click();
  await expect(page.getByText(/5 checked · 2 to revisit/)).toBeVisible();
  await page.reload();
  await expect(page.getByText(/5 checked · 2 to revisit/)).toBeVisible();
  expect(consoleErrors).toEqual([]);
});

test('@claim:json-backup exports and restores the complete local record', async ({ page }) => {
  await page.goto('/demo');
  await page.getByRole('button', { name: /Reveal answer/ }).click();
  await page.getByRole('button', { name: /Recalled/ }).click();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'End session and see recap' }).click();
  await page.getByRole('link', { name: 'Library' }).click();
  await expect(page.getByText('1 checked · 0 to revisit')).toBeVisible();

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: /Export JSON/ }).click();
  const download = await downloadPromise;
  const downloadPath = await download.path();
  if (!downloadPath) throw new Error('The JSON backup did not produce a local download.');
  const exported = JSON.parse(await readFile(downloadPath, 'utf8')) as { product: string; sessions: unknown[] };
  expect(exported.product).toBe('focus-study-sprint');
  expect(exported.sessions).toHaveLength(1);

  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'Clear local data' }).click();
  await expect(page.getByText('No sessions recorded')).toBeVisible();
  page.once('dialog', (dialog) => dialog.accept());
  await page.locator('input[data-import]').setInputFiles(downloadPath);
  await expect(page.getByText('1 checked · 0 to revisit')).toBeVisible();
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
  await page.getByRole('button', { name: 'Load sample into my draft' }).click();
  await page.getByRole('button', { name: /Begin this sprint/ }).click();
  await page.keyboard.press('Enter');
  await page.keyboard.press('2');
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'End session and see recap' }).click();
  await page.getByRole('link', { name: 'Library' }).click();
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

  await page.goto('/library?recovery-test=1');
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
  await page.getByRole('button', { name: 'Load sample into my draft' }).click();
  await page.getByRole('button', { name: /Begin this sprint/ }).click();
  await page.getByLabel(/Your answer/).fill('My working answer');
  await page.reload();
  await expect(page.getByText('PROMPT 1 OF 5')).toBeVisible();
  await expect(page.getByLabel(/Your answer/)).toHaveValue('My working answer');
});

test('@claim:offline-reload app shell and sample session work offline after the first visit', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  try {
    await page.goto('/demo');
    await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.ready).active && navigator.serviceWorker.controller));
    await context.setOffline(true);
    await page.reload();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByText('Offline — your session and saved data still work.')).toBeVisible();
    await expect(page.getByText('PROMPT 1 OF 5')).toBeVisible();
    await page.getByRole('button', { name: /Reveal answer/ }).click();
    await expect(page.getByRole('region', { name: 'Expected answer' })).toBeVisible();
  } finally {
    await context.close();
  }
});

test('legal pages have landmarks, titles, and one primary heading', async ({ page }) => {
  for (const path of ['/privacy/', '/terms/']) {
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(path.replaceAll('/', '\\/')));
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /social-card\.jpg$/);
    await expect(page.getByText('Built by Param Factory')).toBeVisible();
  }
});

test('publishes complete social metadata, standard landing sections, and a 1200×630 image', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://focus-study-sprint.sociobot.in/');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Focus Study Sprint — short active-recall sessions');
  await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  await expect(page.getByRole('heading', { name: 'Finish one study sprint in three steps' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Your study material stays local' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Keep reusable prompt sets for $12' })).toBeVisible();
  await expect(page.getByText('Built by Param Factory')).toBeVisible();
  const socialSize = await page.evaluate(async () => {
    const image = new Image();
    image.src = '/assets/social-card.jpg';
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  });
  expect(socialSize).toEqual({ width: 1200, height: 630 });
});

test('has no serious accessibility findings across app states and legal pages', async ({ page }) => {
  const expectClean = async () => {
    const scan = await new AxeBuilder({ page }).analyze();
    expect(scan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  };

  for (const path of ['/', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    await expectClean();
  }

  await page.goto('/demo');
  await page.getByRole('button', { name: /Reveal answer/ }).click();
  await expectClean();
  page.once('dialog', (dialog) => dialog.accept());
  await page.getByRole('button', { name: 'End session and see recap' }).click();
  await expectClean();
  await page.getByRole('link', { name: 'Library' }).click();
  await expectClean();
  await page.getByRole('link', { name: 'About' }).click();
  await expectClean();
});

test('supports skip-link and dialog focus without a keyboard trap', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  await page.goto('/library');
  await page.getByRole('button', { name: 'Have a license? Restore it' }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Close' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('@claim:accessible-layout keeps the first action visible and controls usable at 390px and desktop', async ({ browser }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 1000 }]) {
    const page = await browser.newPage({ viewport });
    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.locator('main')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Run a short active-recall study session.' })).toBeVisible();
    await expect(page.getByText(/For students and self-learners/)).toBeVisible();
    const firstAction = await page.getByRole('link', { name: 'Try it with sample data' }).boundingBox();
    expect(firstAction).not.toBeNull();
    if (viewport.width === 390 && firstAction) expect(firstAction.y + firstAction.height).toBeLessThanOrEqual(844);
    const pageWidth = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    expect(pageWidth.scroll).toBeLessThanOrEqual(pageWidth.client);
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

    await page.getByRole('button', { name: 'Load sample into my draft' }).click();
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

  await expect(page.getByRole('button', { name: 'Load sample into my draft' })).toBeVisible();
  await expect(page.locator('.duration')).toHaveCount(3);
  await expectNoHorizontalOverflow();
  await page.getByRole('link', { name: 'Library' }).click();
  await expect(page.getByRole('button', { name: 'Clear local data' })).toBeVisible();
  await expectNoHorizontalOverflow();
});

test('@claim:display-preferences applies dark contrast and reduced motion immediately', async ({ page }) => {
  await page.goto('/');
  const themeButton = page.getByRole('button', { name: 'Change color theme' });
  for (let run = 0; run < 10; run += 1) {
    const current = await page.locator('html').getAttribute('data-theme');
    const clicksToDark = current === 'dark' ? 3 : current === 'light' ? 1 : 2;
    for (let click = 0; click < clicksToDark; click += 1) await themeButton.click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    const scan = await new AxeBuilder({ page }).analyze();
    expect(scan.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }

  const longestMotion = await page.locator('*').evaluateAll((elements) => Math.max(...elements.flatMap((element) => {
    const style = getComputedStyle(element);
    const parse = (value: string) => value.split(',').map((part) => part.trim().endsWith('ms') ? Number.parseFloat(part) / 1000 : Number.parseFloat(part) || 0);
    return [...parse(style.animationDuration), ...parse(style.transitionDuration)];
  })));
  expect(longestMotion).toBeLessThanOrEqual(0.00001);
});

test('uses browser history, route titles, and heading focus for app navigation', async ({ page }) => {
  await page.goto('/');
  const initialLength = await page.evaluate(() => history.length);
  await page.getByRole('link', { name: 'Library' }).click();
  await expect(page).toHaveURL(/\/library$/);
  await expect(page).toHaveTitle('Library — Focus Study Sprint');
  await expect(page.locator('h1')).toBeFocused();
  await page.getByRole('link', { name: 'About' }).click();
  await expect(page).toHaveURL(/\/about$/);
  expect(await page.evaluate(() => history.length)).toBe(initialLength + 2);
  await page.goBack();
  await expect(page).toHaveURL(/\/library$/);
  await expect(page).toHaveTitle('Library — Focus Study Sprint');
  await expect(page.getByRole('heading', { name: 'Your library' })).toBeFocused();
});

test('does not reload when the service worker first claims a page', async ({ browser }) => {
  const context = await browser.newContext();
  await context.addInitScript(() => {
    const loads = Number(sessionStorage.getItem('fss:test-loads') ?? '0');
    sessionStorage.setItem('fss:test-loads', String(loads + 1));
  });
  const page = await context.newPage();
  const failed: string[] = [];
  page.on('requestfailed', (request) => failed.push(request.failure()?.errorText ?? request.url()));
  try {
    await page.goto('/');
    await page.waitForFunction(async () => Boolean((await navigator.serviceWorker.ready).active && navigator.serviceWorker.controller));
    await page.waitForTimeout(300);
    expect(await page.evaluate(() => sessionStorage.getItem('fss:test-loads'))).toBe('1');
    expect(failed.filter((failure) => failure.includes('ERR_ABORTED'))).toEqual([]);
  } finally {
    await context.close();
  }
});

test('offline fallback and designed 404 render without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto('/offline.html');
  await expect(page.getByRole('heading', { name: 'This page is offline' })).toBeVisible();
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(244, 240, 230)');
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Focus Study Sprint');
  await expect(page.getByRole('heading', { name: 'This page does not exist' })).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test('@claim:contour-price shows the one-time license terms and correct checkout target', async ({ page }) => {
  await page.goto('/');
  const purchase = page.getByRole('link', { name: 'Buy Contour once for $12' });
  await expect(purchase).toHaveAttribute('href', 'https://api.sociobot.in/api/v1/products/focus-study-sprint/checkout');
  await expect(page.getByText('Contour adds saved prompt sets and your latest 20 session records.')).toBeVisible();
  await expect(page.getByText('Study sessions and JSON backup remain free.')).toBeVisible();
});

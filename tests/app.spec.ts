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

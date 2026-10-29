import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page loads without broken images, console errors or horizontal overflow', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('./');
  await expect(page.locator('h1')).toBeVisible();
  for (const image of await page.locator('img').all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((node: HTMLImageElement) => node.complete && node.naturalWidth > 0)).toBeTruthy();
  }
  expect(errors).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
});

test('manual theme survives reload', async ({ page }) => {
  await page.goto('./');
  await page.locator('#themeSelect').selectOption('dark');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('#themeSelect')).toHaveValue('dark');
  await page.locator('#themeSelect').selectOption('light');
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('filters sync with URL and browser history', async ({ page }) => {
  await page.goto('./');
  const filter = page.locator('#filters button').nth(1);
  await filter.click();
  await expect(filter).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/category=/);
  await page.goBack();
  await expect(page.locator('#filters button').first()).toHaveAttribute('aria-pressed', 'true');
});

test('mobile disclosure supports Escape and removes closed links from focus', async ({ page }, info) => {
  test.skip(info.project.name !== 'mobile');
  await page.goto('./');
  const button = page.locator('#menuBtn');
  await button.click();
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mnav')).toHaveJSProperty('inert', false);
  await page.keyboard.press('Escape');
  await expect(button).toBeFocused();
  await expect(page.locator('#mnav')).toHaveJSProperty('inert', true);
});

test('clipboard failure gives a usable fallback', async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, 'clipboard', { value: undefined }));
  await page.goto('./');
  await page.locator('#copy').click();
  await expect(page.locator('#live')).toContainText('Select the email address');
});

for (const theme of ['light', 'dark']) {
  test(`accessibility scan in ${theme} theme`, async ({ page }) => {
    await page.goto('./');
    await page.locator('#themeSelect').selectOption(theme);
    const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    expect(result.violations).toEqual([]);
  });
}

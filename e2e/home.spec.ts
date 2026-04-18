import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads without console errors', async ({ page }) => {
    // Stub Vercel Analytics — 404s in non-Vercel environments
    await page.route('**/_vercel/insights/**', (route) => route.fulfill({ status: 200, body: '' }));

    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(consoleErrors).toHaveLength(0);
  });

  test('renders the theme switcher with all three options', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('radio', { name: /system/i })).toBeVisible();
    await expect(page.getByRole('radio', { name: /light/i })).toBeVisible();
    await expect(page.getByRole('radio', { name: /dark/i })).toBeVisible();
  });

  test('theme switcher changes selection on click', async ({ page }) => {
    await page.goto('/');

    const lightButton = page.getByRole('radio', { name: /light/i });
    await lightButton.click();

    await expect(lightButton).toHaveAttribute('aria-checked', 'true');
    await expect(page.getByRole('radio', { name: /system/i })).toHaveAttribute('aria-checked', 'false');
  });
});

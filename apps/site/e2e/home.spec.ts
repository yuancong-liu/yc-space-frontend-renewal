import { expect, test } from '@playwright/test';

test.describe('Homepage', () => {
  test('loads without console errors', async ({ page }) => {
    // Stub Vercel Analytics — 404s in non-Vercel environments
    await page.route('**/_vercel/insights/**', route =>
      route.fulfill({ status: 200, body: '' })
    );

    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(consoleErrors).toHaveLength(0);
  });

  test('renders the theme cycle button in the header', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('button', { name: /theme: system/i })
    ).toBeVisible();
  });

  test('theme button cycles through modes on click', async ({ page }) => {
    await page.goto('/');

    const themeButton = page.getByRole('button', { name: /theme:/i });
    await themeButton.click();

    await expect(themeButton).toHaveAccessibleName(/theme: light/i);
    await themeButton.click();

    await expect(themeButton).toHaveAccessibleName(/theme: dark/i);
  });

  test('keeps primary navigation usable without mobile page overflow', async ({
    page,
  }) => {
    await page.setViewportSize({ height: 812, width: 375 });
    await page.goto('/');

    const navigation = page.getByRole('navigation', { name: 'Primary' });
    await expect(navigation.getByRole('link')).toHaveCount(5);
    await expect(navigation.getByRole('link', { name: 'Blog' })).toBeVisible();

    await navigation.getByRole('link', { name: 'Blog' }).focus();
    await expect(navigation.getByRole('link', { name: 'Blog' })).toBeFocused();

    await expect(
      page.evaluate(
        () => document.documentElement.scrollHeight <= window.innerHeight
      )
    ).resolves.toBe(true);
  });
});

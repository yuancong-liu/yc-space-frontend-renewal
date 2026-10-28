import { expect, test } from '@playwright/test';

test.describe('Blog', () => {
  test('uses SVG refraction only when the browser supports it', async ({
    page,
  }) => {
    await page.goto('/blog');

    const liquidGlass = await page
      .locator('.site-primary-nav')
      .evaluate(element => ({
        backdropFilter: getComputedStyle(element).backdropFilter,
        supported: CSS.supports(
          'backdrop-filter',
          'url("#site-primary-liquid-glass")'
        ),
      }));

    if (liquidGlass.supported) {
      expect(liquidGlass.backdropFilter).toContain(
        'url("#site-primary-liquid-glass")'
      );
    } else {
      expect(liquidGlass.backdropFilter).toBe('none');
    }
  });

  test('keeps fixed navigation above a lifted post card', async ({ page }) => {
    await page.goto('/blog');

    const header = page.locator('.site-header');
    const card = page.locator('.post-card').nth(2);
    await card.hover();

    const [cardZIndex, headerZIndex] = await Promise.all([
      card.evaluate(element => Number(getComputedStyle(element).zIndex)),
      header.evaluate(element => Number(getComputedStyle(element).zIndex)),
    ]);

    expect(headerZIndex).toBeGreaterThan(cardZIndex);
  });
});

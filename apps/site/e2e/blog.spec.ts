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

  test('moves the navigation without glow', async ({
    page,
  }) => {
    await page.goto('/blog');

    const navigation = page.locator('.site-primary-nav');
    const hoverBackground = page.locator('.site-primary-hover-background');

    await expect(navigation).toHaveCSS('box-shadow', 'none');
    await expect(navigation).toHaveCSS('overflow', 'visible');
    await expect(hoverBackground).toHaveCSS('box-shadow', 'none');
    await navigation.hover({ position: { x: 12, y: 12 } });

    await expect
      .poll(() =>
        navigation.evaluate(element =>
          Math.abs(new DOMMatrixReadOnly(getComputedStyle(element).transform).m41)
        )
      )
      .toBeGreaterThan(0);
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

  test('keeps a stable hover target while its card link lifts', async ({
    page,
  }) => {
    await page.goto('/blog');

    const card = page.locator('.post-card').nth(2);
    const cardLink = card.locator('.post-card-link');
    const bounds = await card.boundingBox();
    expect(bounds).not.toBeNull();

    await page.mouse.move(
      (bounds?.x ?? 0) + 12,
      (bounds?.y ?? 0) + (bounds?.height ?? 0) - 2
    );

    await expect
      .poll(() => card.evaluate(element => element.matches(':hover')))
      .toBe(true);
    await expect(cardLink).toHaveCSS('translate', '10px -10px');

    await page.waitForTimeout(300);
    await expect
      .poll(() => card.evaluate(element => element.matches(':hover')))
      .toBe(true);
  });
});

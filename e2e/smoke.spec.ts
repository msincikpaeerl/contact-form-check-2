import { expect, test } from '@playwright/test';

test('the home page shows a title and a welcome text', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Welcome to contact-form-check-2',
  );
  await expect(page.getByText('Use the contact form')).toBeVisible();
});

test('the home page has a visible Contact link to /contact', async ({ page }) => {
  await page.goto('/');
  const link = page.getByRole('link', { name: 'Contact' });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/contact');
});

for (const [name, size] of [
  ['phone', { width: 360, height: 640 }],
  ['desktop', { width: 1440, height: 900 }],
] as const) {
  test(`the home page fits a ${name} screen`, async ({ page }) => {
    await page.setViewportSize(size);
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
    const overflows = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(overflows).toBe(false);
  });
}

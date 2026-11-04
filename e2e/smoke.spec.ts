import { expect, test } from '@playwright/test';

test('the site starts and serves its page', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('contact-form-check-2');
});

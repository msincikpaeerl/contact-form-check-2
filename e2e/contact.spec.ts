import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';

test('the contact page shows the form', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByLabel('Name')).toBeVisible();
  await expect(page.getByLabel('E-mail address')).toBeVisible();
  await expect(page.getByLabel('Message')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Send' })).toBeVisible();
});

test('the browser refuses empty fields and shows messages next to them', async ({ page }) => {
  let posted = false;
  page.on('request', (request) => {
    if (request.method() === 'POST') posted = true;
  });
  await page.goto('/contact');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.locator('#name-error')).toHaveText('Please enter your name.');
  await expect(page.locator('#email-error')).toHaveText('Please enter your e-mail address.');
  await expect(page.locator('#message-error')).toHaveText('Please enter a message.');
  expect(posted).toBe(false);
});

test('the browser refuses an invalid e-mail address', async ({ page }) => {
  let posted = false;
  page.on('request', (request) => {
    if (request.method() === 'POST') posted = true;
  });
  await page.goto('/contact');
  await page.getByLabel('Name').fill('Ada');
  await page.getByLabel('E-mail address').fill('not-an-address');
  await page.getByLabel('Message').fill('Hello');
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.locator('#email-error')).toHaveText('Please enter a valid e-mail address.');
  expect(posted).toBe(false);
});

test('the server refuses a submission that bypasses the browser check', async ({ request }) => {
  const response = await request.post('/contact', {
    form: { name: '', email: 'nope', message: '' },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(400);
  const html = await response.text();
  expect(html).toContain('Please enter your name.');
  expect(html).toContain('Please enter a valid e-mail address.');
  expect(html).toContain('Please enter a message.');
});

test('a valid message is saved and confirmed', async ({ page }) => {
  const unique = `Hello from the test ${Date.now()}`;
  await page.goto('/contact');
  await page.getByLabel('Name').fill('Ada');
  await page.getByLabel('E-mail address').fill('ada@example.com');
  await page.getByLabel('Message').fill(unique);
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByRole('status')).toHaveText('Thank you! Your message was received.');
  const saved = await readFile('data/messages.jsonl', 'utf8');
  const line = saved
    .trim()
    .split('\n')
    .map((l) => JSON.parse(l))
    .find((m) => m.message === unique);
  expect(line).toMatchObject({ name: 'Ada', email: 'ada@example.com' });
  expect(Number.isNaN(Date.parse(line.receivedAt))).toBe(false);
});

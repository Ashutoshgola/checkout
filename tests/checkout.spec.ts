import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('order-total')).toHaveText('$0.00');
});

test('1. successful checkout shows confirmation and order reference', async ({ page }) => {
  await page.getByTestId('add-notebook').click();
  await page.getByTestId('customer-name-input').fill('Rohan Verma');
  await page.getByTestId('place-order-btn').click();

  const confirmation = page.getByTestId('order-confirmation');
  await expect(confirmation).toBeVisible();
  await expect(confirmation).toHaveCount(1);
  await expect(page.getByTestId('order-ref')).toHaveText(/^ORD-\d{6}$/);
  await expect(confirmation).toContainText('$12.00');
});

test('2. missing required field blocks checkout and preserves input', async ({ page }) => {
  await page.getByTestId('add-mug').click();
  await page.getByTestId('customer-name-input').fill('   ');
  await page.getByTestId('place-order-btn').click();

  const errorBanner = page.getByTestId('validation-error');
  await expect(errorBanner).toBeVisible();
  await expect(errorBanner).toContainText(/enter your name/i);

  await expect(page.getByTestId('customer-name-input')).toHaveValue('   ');
  await expect(page.getByTestId('order-confirmation')).toHaveCount(0);
});

test('3. changing item quantity updates line total and order total accurately', async ({ page }) => {
  await page.getByTestId('add-notebook').click();
  await page.getByTestId('add-mug').click();
  await expect(page.getByTestId('order-total')).toHaveText('$30.00');

  const notebookQty = page.getByTestId('qty-input-notebook');
  await notebookQty.fill('3');

  await expect(page.getByTestId('line-total-notebook')).toHaveText('$36.00');
  await expect(page.getByTestId('order-total')).toHaveText('$54.00');
});

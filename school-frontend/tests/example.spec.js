import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
  await page.getByRole('searchbox', { name: 'Search for Vegetables and' }).click();
  await page.getByRole('searchbox', { name: 'Search for Vegetables and' }).fill('brocol');
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await page.getByRole('searchbox', { name: 'Search for Vegetables and' }).click();
  await page.getByRole('searchbox', { name: 'Search for Vegetables and' }).fill('');
  await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
  await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
  await page.getByRole('button', { name: 'ADD TO CART' }).first().click();
  await page.getByRole('button', { name: 'ADD TO CART' }).nth(1).click();
  await page.getByRole('button', { name: 'ADD TO CART' }).nth(5).click();
  await page.getByRole('link', { name: 'Cart' }).click();
  await page.getByRole('link', { name: '×' }).nth(4).click();
  await page.getByRole('listitem').filter({ hasText: 'Brocolli - 1 Kg1201 No. 120×' }).getByRole('link').click();
  await page.getByRole('button', { name: 'PROCEED TO CHECKOUT' }).click();
  await page.getByRole('textbox', { name: 'Enter promo code' }).click();
  await page.getByRole('textbox', { name: 'Enter promo code' }).fill('606203');
  await page.getByRole('button', { name: 'Apply' }).click();
  await page.getByRole('button', { name: 'Place Order' }).click();
  await page.getByRole('combobox').selectOption('Germany');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Proceed' }).click();
  await page.goto('https://rahulshettyacademy.com/seleniumPractise/#/');
});




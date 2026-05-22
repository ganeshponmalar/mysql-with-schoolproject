import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://www.saucedemo.com/');

  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-onesie"]').click();
  await page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-fleece-jacket"]').click();
  await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

  await page.locator('[data-test="shopping-cart-link"]').click();

  await page.locator('[data-test="remove-sauce-labs-bike-light"]').click();

  await page.locator('[data-test="checkout"]').click();

  await page.locator('[data-test="firstName"]').fill('ganesan');
  await page.locator('[data-test="lastName"]').fill('p');
  await page.locator('[data-test="postalCode"]').fill('606203');

  await page.locator('[data-test="continue"]').click();

  await page.getByRole('button', { name: 'Open Menu' }).click();
  await page.locator('[data-test="logout-sidebar-link"]').click();

  await context.close();
  await browser.close();
})();
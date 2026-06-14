import { test as base } from '@playwright/test';

import { AuthPage } from '../pages/AuthPage.js';
import { ProductsPage } from '../pages/ProductsPage.js';
import { ShoppingCartPage } from '../pages/ShoppingCartPage.js';
import { OrderPage } from '../pages/OrderPage.js';

export const test = base.extend({

  authPage: async ({ page }, use) => {
    await use(new AuthPage(page));
  },

  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },

  shoppingCartPage: async ({ page }, use) => {
    await use(new ShoppingCartPage(page));
  },

  orderPage: async ({ page }, use) => {
    await use(new OrderPage(page));
  }
});

export { expect } from '@playwright/test';
import { test as base } from '@playwright/test';

import { HomePage } from '../pages/HomePage.js';
import { CartPage } from '../pages/CartPage.js';
import { CheckoutPage } from '../pages/CheckOutPage.js';

export const test = base.extend({

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },

    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    }

});

export { expect } from '@playwright/test';
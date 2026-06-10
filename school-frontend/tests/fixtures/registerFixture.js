import { test as base } from '@playwright/test';

import { RegisterPage } from '../pages/RegisterPage.js';

export const test = base.extend({

  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  }

});

export { expect } from '@playwright/test';
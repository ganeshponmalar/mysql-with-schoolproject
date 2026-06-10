import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage.js';
import { ManageTeacherPage } from '../pages/ManageTeacherPage.js';

export const test = base.extend({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  manageTeacherPage: async ({ page }, use) => {
    await use(new ManageTeacherPage(page));
  }
});

export { expect } from '@playwright/test';
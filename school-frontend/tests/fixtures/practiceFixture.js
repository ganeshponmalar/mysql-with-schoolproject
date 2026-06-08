import { test as base } from '@playwright/test';
import { PracticePage } from '../pages/practicePage.js';

export const test = base.extend({
  practicePage: async ({ page }, use) => {
    const practicePage = new PracticePage(page);
    await use(practicePage);
  }
});

export { expect } from '@playwright/test';
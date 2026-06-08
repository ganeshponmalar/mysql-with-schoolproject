import { test as base } from '@playwright/test';
import { TodoPage } from '../tests/pages/todoPage.js';

export const test = base.extend({

  todoPage: async ({ page }, use) => {

    const todoPage = new TodoPage(page);

    await use(todoPage);
  }

});

export { expect } from '@playwright/test';
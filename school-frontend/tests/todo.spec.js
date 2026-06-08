import { test, expect } from '@playwright/test';
import { TodoPage } from "../tests/pages/todoPage.js"
import { todoItems } from '../tests/utils/testData.js';

test('TodoMVC Test', async ({ page }) => {

  const todoPage = new TodoPage(page);

  await todoPage.navigate();

  await todoPage.addTodo('Go for walk');
  await todoPage.addTodo('Rest for five minutes');
  await todoPage.addTodo('keep learning');
  await todoPage.addTodo(
    'keep practices is best option for success'
  );

  await todoPage.completeTodo('Go for walk');
  await todoPage.completeTodo('keep learning');

  await todoPage.uncheckTodo('keep learning');

  await todoPage.completeTodo('Rest for five minutes');

  await todoPage.clickActive();

  await todoPage.clickCompleted();

  await todoPage.clickActive();

  await expect(
    page.getByText(
      'keep practices is best option for success'
    )
  ).toBeVisible();

  await expect(
    todoPage.clearCompletedBtn
  ).toBeVisible();

  await todoPage.clickAll();

  await todoPage.uncheckTodo('Go for walk');

  await todoPage.uncheckTodo('Rest for five minutes');

  await todoPage.clickActive();

  await expect(
    page.getByText('Go for walk')
  ).toBeVisible();

  await expect(
    page.getByText('Rest for five minutes')
  ).toBeVisible();

  await expect(
    page.getByText('keep learning')
  ).toBeVisible();

  await expect(
    page.getByText(
      'keep practices is best option for success'
    )
  ).toBeVisible();
});
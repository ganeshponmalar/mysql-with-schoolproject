import { test, expect } from '@playwright/test';

// Import Page Object Model class
import { TodoPage } from "../tests/pages/todoPage.js";

// Import test data (currently not used in this test)
import { todoData } from '../tests/utils/testData.js';

test('TodoMVC Test', async ({ page }) => {

  // Create an object of TodoPage class
  // This gives access to all methods defined in the page object
  const todoPage = new TodoPage(page);

  // Navigate to TodoMVC application
  await todoPage.navigate();

  // Add four todo items
  await todoPage.addTodo('Go for walk');
  await todoPage.addTodo('Rest for five minutes');
  await todoPage.addTodo('keep learning');
  await todoPage.addTodo(
    'keep practices is best option for success'
  );

  // Mark "Go for walk" as completed
  await todoPage.completeTodo('Go for walk');

  // Mark "keep learning" as completed
  await todoPage.completeTodo('keep learning');

  // Undo completion of "keep learning"
  // It becomes active again
  await todoPage.uncheckTodo('keep learning');

  // Mark "Rest for five minutes" as completed
  await todoPage.completeTodo('Rest for five minutes');

  // Click Active filter
  // Shows only active tasks
  await todoPage.clickActive();

  // Click Completed filter
  // Shows only completed tasks
  await todoPage.clickCompleted();

  // Return to Active filter
  await todoPage.clickActive();

  // Verify active task is visible
  await expect(
    page.getByText(
      'keep practices is best option for success'
    )
  ).toBeVisible();

  // Verify "Clear completed" button appears
  // because completed items exist
  await expect(
    todoPage.clearCompletedBtn
  ).toBeVisible();

  // Switch to All filter
  await todoPage.clickAll();

  // Uncheck completed todos
  // All tasks become active
  await todoPage.uncheckTodo('Go for walk');
  await todoPage.uncheckTodo('Rest for five minutes');

  // View only active tasks
  await todoPage.clickActive();

  // Verify all tasks are active and visible

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
import { test, expect } from '@playwright/test';

test('TodoMVC Test', async ({ page }) => {
  // Open TodoMVC application
  await page.goto('https://todomvc.com/examples/react/dist/');

  // Add first todo
  await page.getByTestId('text-input').fill('Go for walk');
  await page.getByTestId('text-input').press('Enter');

  // Add second todo
  await page.getByTestId('text-input').fill('Rest for five minutes');
  await page.getByTestId('text-input').press('Enter');

  // Add third todo
  await page.getByTestId('text-input').fill('keep learning');
  await page.getByTestId('text-input').press('Enter');

  // Add fourth todo
  await page
    .getByTestId('text-input')
    .fill('keep practices is best option for success');
  await page.getByTestId('text-input').press('Enter');

  // Mark "Go for walk" as completed
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Go for walk' })
    .getByTestId('todo-item-toggle')
    .check();

  // Mark "keep learning" as completed
  await page
    .getByRole('listitem')
    .filter({ hasText: 'keep learning' })
    .getByTestId('todo-item-toggle')
    .check();

  // Uncheck "keep learning"
  await page
    .getByRole('listitem')
    .filter({ hasText: 'keep learning' })
    .getByTestId('todo-item-toggle')
    .uncheck();

  // Mark "Rest for five minutes" as completed
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Rest for five minutes' })
    .getByTestId('todo-item-toggle')
    .check();

  // Click Active filter
  await page.getByRole('link', { name: 'Active' }).click();

  // Click Completed filter
  await page.getByRole('link', { name: 'Completed' }).click();

  // Click Active filter again
  await page.getByRole('link', { name: 'Active' }).click();

  // Verify active todo is visible
  await expect(
    page.getByText('keep practices is best option for success')
  ).toBeVisible();

  // Verify "Clear completed" button is visible
  await expect(
    page.getByRole('button', { name: 'Clear completed' })
  ).toBeVisible();

  // Click All filter
  await page.getByRole('link', { name: 'All' }).click();

  // Uncheck completed todos
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Go for walk' })
    .getByTestId('todo-item-toggle')
    .uncheck();

  await page
    .getByRole('listitem')
    .filter({ hasText: 'Rest for five minutes' })
    .getByTestId('todo-item-toggle')
    .uncheck();

  // Click Active filter
  await page.getByRole('link', { name: 'Active' }).click();

  // Verify all tasks are active
  await expect(page.getByText('Go for walk')).toBeVisible();
  await expect(page.getByText('Rest for five minutes')).toBeVisible();
  await expect(page.getByText('keep learning')).toBeVisible();
  await expect(
    page.getByText('keep practices is best option for success')
  ).toBeVisible();
});

import { expect } from '@playwright/test';

export class TodoPage {
  constructor(page) {
    this.page = page;

    this.todoInput = page.getByTestId('text-input');

    this.activeFilter =
      page.getByRole('link', { name: 'Active' });

    this.completedFilter =
      page.getByRole('link', { name: 'Completed' });

    this.allFilter =
      page.getByRole('link', { name: 'All' });

    this.clearCompletedBtn =
      page.getByRole('button', {
        name: 'Clear completed'
      });
  }

  async navigate() {
    await this.page.goto(
      'https://todomvc.com/examples/react/dist/'
    );

    await this.todoInput.waitFor();
  }

  async addTodo(todoText) {
    await this.todoInput.fill(todoText);
    await this.todoInput.press('Enter');
  }

  async completeTodo(todoText) {
    await this.page
      .getByRole('listitem')
      .filter({ hasText: todoText })
      .getByTestId('todo-item-toggle')
      .check();
  }

  async uncheckTodo(todoText) {
    await this.page
      .getByRole('listitem')
      .filter({ hasText: todoText })
      .getByTestId('todo-item-toggle')
      .uncheck();
  }

  async clickActive() {
    await this.activeFilter.click();
  }

  async clickCompleted() {
    await this.completedFilter.click();
  }

  async clickAll() {
    await this.allFilter.click();
  }

  async verifyTodoVisible(todoText) {
    await expect(
      this.page.getByText(todoText)
    ).toBeVisible();
  }

  async verifyClearCompletedVisible() {
    await expect(
      this.clearCompletedBtn
    ).toBeVisible();
  }
}
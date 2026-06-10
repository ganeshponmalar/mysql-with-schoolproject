import { test, expect } from '@playwright/test';
import { RegisterPage } from './pages/RegisterPage.js';

test('User should register successfully',
async ({ page }) => {

  const registerPage =
    new RegisterPage(page);

  await registerPage.navigate();

  await registerPage.registerUser({
    name: 'Ganesh',
    email: `ganesh${Date.now()}@test.com`,
    password: 'password123',
    role: 'teacher'
  });

  await page.waitForURL('**/login');

  await expect(page).toHaveURL(/login/);
});


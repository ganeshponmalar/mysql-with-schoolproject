import { test, expect } from '@playwright/test';

test('User should register successfully', async ({ page }) => {
    await page.goto('http://localhost:5173/register');

    await page.getByLabel('Full Name').fill('Ganesh');
    await page.getByLabel('Email Address').fill(`ganesh${Date.now()}@test.com`);
    await page.getByLabel('Password').fill('password123');

    await page.getByLabel('Register As').selectOption('teacher');

    await page.getByRole('button', { name: 'Sign Up' }).click();

    // Wait for redirect to login page
    await page.waitForURL('**/login', { timeout: 10000 });

    // Verify login page loaded
    await expect(page).toHaveURL(/login/);
});

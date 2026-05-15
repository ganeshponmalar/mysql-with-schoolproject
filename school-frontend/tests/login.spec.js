import { test, expect } from '@playwright/test';

test('Student login test', async ({ page }) => {

    // Open login page
    await page.goto('http://localhost:5173/login');

    // Select Student role
    await page.getByRole('button', { name: 'student', exact: true }).click();

    // Fill email
    await page.getByPlaceholder('name@school.com').fill('ganesh@gmail.com');

    // Fill password
    await page.getByPlaceholder('••••••••').fill('ganesh123');

    // Click login button
    await page.getByRole('button', { name: 'Login to Student Dashboard' }).click();

    // Verify successful navigation
    await expect(page).toHaveURL(/student/);
});

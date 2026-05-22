import { test, expect } from '@playwright/test';

test('Teacher appointment + notification + fees flow', async ({ page }) => {

  page.on('dialog', async dialog => {
    await dialog.accept();
  });

  // Login
  await page.goto('http://localhost:5173/login');

  await page.getByRole('button', { name: 'teacher', exact: true }).click();
  await page.getByPlaceholder('name@school.com').fill('james@gmail.com');
  await page.getByPlaceholder('••••••••').fill('james123');
  await page.getByRole('button', { name: /login/i }).click();

  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/teacher/);

  // =========================
  // MANAGE TEACHERS
  // =========================
  await page.getByRole('link', { name: 'Profile' }).click();
  await page.getByRole('link', { name: 'Manage Teachers' }).click();

  await page.locator("//button[contains(@class,'bg-primary')]").click();

  await page.getByPlaceholder('ID Number...').fill('1001');
  await page.getByPlaceholder('Optional User ID...').fill('1');
  await page.getByPlaceholder('e.g. Jane Doe').fill('James');
  await page.getByPlaceholder('e.g. Mathematics').fill('Mathematics');
  await page.getByPlaceholder('e.g. Sciences').fill('Sciences');
  await page.getByPlaceholder('e.g. Ph.D. in Physics').fill('Ph.D. in Physics');

  const facultySubmit = page.locator("//button[@type='submit']");
  await facultySubmit.evaluate(el => el.click());

  await page.waitForTimeout(3000);
  await page.keyboard.press('Escape');

  // =========================
  // NOTIFICATIONS
  // =========================
  await page.getByRole('link', { name: 'Notifications' }).click();
  await expect(page).toHaveURL(/notifications/);

  await page.getByPlaceholder('Enter notification title...')
    .fill('Today Notification');

  await page.getByPlaceholder('Type your message here...')
    .fill('Coming Monday parents meet');

  await page.locator("select[name='recipientGroup']")
    .selectOption('all');

  const notificationSubmit = page.locator("//button[@type='submit']").last();
  await notificationSubmit.evaluate(el => el.click());

  await page.waitForTimeout(3000);

  // =========================
  // MANAGE FEES
  // =========================
  await page.locator("//a[normalize-space()='Manage Fees']").click();

  await page.waitForLoadState('networkidle');

  // Click open fees form button first
  await page.locator(
    "//button[@class='flex items-center gap-2 px-6 py-3 bg-secondary text-white font-bold rounded-2xl shadow-lg shadow-secondary/20 hover:scale-[1.02] transition-all active:scale-[0.98]']"
  ).click();

  // Wait for form
  await page.waitForTimeout(2000);

  // Fill fees form
  await page.locator("//input[@placeholder='e.g. 101 or UUID']")
    .fill('101');

  await page.locator("//input[@placeholder='0.00']")
    .fill('5000');

  await page.locator("//input[@name='dueDate']")
    .fill('2026-05-25');

  await page.locator("//input[@name='paymentDate']")
    .fill('2026-05-20');

  // Submit fees form
  const feesSubmit = page.locator("//button[@type='submit']").last();
  await feesSubmit.evaluate(el => el.click());

  await page.waitForTimeout(3000);
  
});

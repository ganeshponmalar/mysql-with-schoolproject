import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/#top');
  await page.getByText('Radio Button Example').click();
  await page.locator('label').filter({ hasText: 'Radio1' }).getByRole('radio').check();
  await page.locator('label').filter({ hasText: 'Radio2' }).getByRole('radio').check();
  await page.locator('label').filter({ hasText: 'Radio3' }).getByRole('radio').check();
  await page.getByRole('textbox', { name: 'Type to Select Countries' }).click();
  await page.getByRole('textbox', { name: 'Type to Select Countries' }).fill('india');
  await page.locator('#dropdown-class-example').selectOption('option2');
  await page.locator('#checkBoxOption1').check();
  await page.locator('#checkBoxOption2').check();
  await page.locator('#checkBoxOption3').check();
  await page.locator('#checkBoxOption3').uncheck();
  await page.getByText('Switch Window Example').click();
  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('button', { name: 'Open Window' }).click();
  const page1 = await page1Promise;
  const page2Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Open Tab' }).click();
  const page2 = await page2Promise;
});
import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  // Open website
  await page.goto(
    'https://rahulshettyacademy.com/AutomationPractice/#top',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  // Radio buttons
  await page.locator('label').filter({ hasText: 'Radio1' }).getByRole('radio').check();
  await page.locator('label').filter({ hasText: 'Radio2' }).getByRole('radio').check();
  await page.locator('label').filter({ hasText: 'Radio3' }).getByRole('radio').check();

  // Textbox
  await page.getByRole('textbox', {
    name: 'Type to Select Countries'
  }).fill('india');

  // Dropdown
  await page.locator('#dropdown-class-example')
    .selectOption('option2');

  // Checkboxes
  await page.locator('#checkBoxOption1').check();
  await page.locator('#checkBoxOption2').check();
  await page.locator('#checkBoxOption3').check();
  await page.locator('#checkBoxOption3').uncheck();

  // Popup window
  const [popup1] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('button', { name: 'Open Window' }).click()
  ]);

  await popup1.waitForLoadState();

  console.log('Popup title:', await popup1.title());

  // Open tab
  const [popup2] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Open Tab' }).click()
  ]);

  await popup2.waitForLoadState();

  console.log('Tab title:', await popup2.title());

});
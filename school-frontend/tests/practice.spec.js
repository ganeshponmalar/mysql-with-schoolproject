import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 1000 // Slow down actions by 1 second
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  // Open website
  await page.goto('https://rahulshettyacademy.com/AutomationPractice/#top');

  // Radio buttons
  await page.locator('label').filter({ hasText: 'Radio1' }).getByRole('radio').check();
  await page.locator('label').filter({ hasText: 'Radio2' }).getByRole('radio').check();
  await page.locator('label').filter({ hasText: 'Radio3' }).getByRole('radio').check();

  // Auto suggestion dropdown
  await page
    .getByRole('textbox', { name: 'Type to Select Countries' })
    .fill('British');

  // Select exact country
  await page.getByText('British Indian Ocean Territory', { exact: true }).click();

  // Static dropdown
  await page.locator('#dropdown-class-example').selectOption('option1');
  await page.locator('#dropdown-class-example').selectOption('option3');

  // Checkboxes
  await page.locator('#checkBoxOption1').check();
  await page.locator('#checkBoxOption2').check();
  await page.locator('#checkBoxOption3').check();

  await page.locator('#checkBoxOption1').uncheck();
  await page.locator('#checkBoxOption2').uncheck();

  // Alert handling
  await page
    .getByRole('textbox', { name: 'Enter Your Name' })
    .fill('ganesh');

  page.once('dialog', async dialog => {
    console.log(`Alert Message: ${dialog.message()}`);
    await dialog.accept();
  });

  await page.getByRole('button', { name: 'Alert' }).click();

  // Confirm popup
  await page
    .getByRole('textbox', { name: 'Enter Your Name' })
    .fill('web architect');

  page.once('dialog', async dialog => {
    console.log(`Confirm Message: ${dialog.message()}`);
    await dialog.dismiss();
  });

  await page.getByRole('button', { name: 'Confirm' }).click();

  // Hide / Show buttons
  await page.getByRole('button', { name: 'Hide' }).click();
  await page.waitForTimeout(1000);

  await page.getByRole('button', { name: 'Show' }).click();

  // Mouse hover
  await page.getByRole('button', { name: 'Mouse Hover' }).hover();

  await page.getByRole('link', { name: 'Top' }).click();

  // Hover again
  await page.getByRole('button', { name: 'Mouse Hover' }).hover();

  await page.getByRole('link', { name: 'Reload' }).click();

  // Pause before closing
  await page.waitForTimeout(5000);

  // Close browser
  await context.close();
  await browser.close();
})();
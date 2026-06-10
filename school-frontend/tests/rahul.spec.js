import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test('Rahul Shetty Practice Page', async ({ page }) => {

  // Open Website
  await page.goto(
    'https://rahulshettyacademy.com/AutomationPractice/',
    {
      waitUntil: 'load',
      timeout: 60000
    }
  );

  // Verify Page Loaded
  await expect(
    page.locator('h1')
  ).toContainText('Practice Page');

  // =====================================
  // RADIO BUTTONS
  // =====================================

  await page.locator("input[value='radio1']").check();
  await expect(
    page.locator("input[value='radio1']")
  ).toBeChecked();

  await page.locator("input[value='radio2']").check();
  await expect(
    page.locator("input[value='radio2']")
  ).toBeChecked();

  await page.locator("input[value='radio3']").check();
  await expect(
    page.locator("input[value='radio3']")
  ).toBeChecked();

  // =====================================
  // AUTO SUGGESTION
  // =====================================

  await page.locator('#autocomplete').fill('Ind');

  await page
    .locator('.ui-menu-item div')
    .filter({ hasText: 'India' })
    .first()
    .click();

  // =====================================
  // STATIC DROPDOWN
  // =====================================

  await page
    .locator('#dropdown-class-example')
    .selectOption('option2');

  await expect(
    page.locator('#dropdown-class-example')
  ).toHaveValue('option2');

  // =====================================
  // CHECKBOXES
  // =====================================

  await page.locator('#checkBoxOption1').check();
  await page.locator('#checkBoxOption2').check();
  await page.locator('#checkBoxOption3').check();

  await expect(
    page.locator('#checkBoxOption1')
  ).toBeChecked();

  await expect(
    page.locator('#checkBoxOption2')
  ).toBeChecked();

  await expect(
    page.locator('#checkBoxOption3')
  ).toBeChecked();

  await page.locator('#checkBoxOption3').uncheck();

  // =====================================
  // HIDE / SHOW TEXTBOX
  // =====================================

  await page.locator('#hide-textbox').click();

  await expect(
    page.locator('#displayed-text')
  ).toBeHidden();

  await page.locator('#show-textbox').click();

  await expect(
    page.locator('#displayed-text')
  ).toBeVisible();

  // =====================================
  // ALERT
  // =====================================

  page.once('dialog', async dialog => {

    console.log(
      'Alert Message:',
      dialog.message()
    );

    await dialog.accept();

  });

  await page.locator('#alertbtn').click();

  // =====================================
  // CONFIRM
  // =====================================

  page.once('dialog', async dialog => {

    console.log(
      'Confirm Message:',
      dialog.message()
    );

    await dialog.dismiss();

  });

  await page.locator('#confirmbtn').click();

  // =====================================
  // MOUSE HOVER
  // =====================================

  await page.locator('#mousehover').hover();

  await page
    .locator('.mouse-hover-content a')
    .filter({ hasText: 'Top' })
    .click();

  // =====================================
  // WEB TABLE
  // =====================================

  const rows =
    page.locator('.table-display tr');

  console.log(
    'Row Count:',
    await rows.count()
  );

  expect(await rows.count())
    .toBeGreaterThan(1);

  // =====================================
  // IFRAME
  // =====================================

  const frame =
    page.frameLocator('#courses-iframe');

  await frame
    .getByRole('link', { name: 'Courses' })
    .first()
    .click();

  // =====================================
  // FINAL ASSERTIONS
  // =====================================

  await expect(
    page.locator('#checkBoxOption1')
  ).toBeChecked();

  await expect(
    page.locator('#dropdown-class-example')
  ).toHaveValue('option2');

});
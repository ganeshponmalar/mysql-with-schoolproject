import { test, expect } from '@playwright/test';
test.setTimeout(120000);

test('Rahul Shetty Practice Page', async ({ page }) => {

  // Open website
  await page.goto(
    'https://rahulshettyacademy.com/AutomationPractice/#top',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  // =========================
  // Radio Buttons
  // =========================

  await page.locator('label')
    .filter({ hasText: 'Radio1' })
    .getByRole('radio')
    .check();

  await page.locator('label')
    .filter({ hasText: 'Radio2' })
    .getByRole('radio')
    .check();

  await page.locator('label')
    .filter({ hasText: 'Radio3' })
    .getByRole('radio')
    .check();

  // =========================
  // Auto Suggestion
  // =========================

  await page.locator('#autocomplete').fill('India');

  await page.getByText('India', { exact: true }).click();

  // =========================
  // Static Dropdown
  // =========================

  await page.locator('#dropdown-class-example')
    .selectOption('option2');

  // =========================
  // Checkboxes
  // =========================

  await page.locator('#checkBoxOption1').check();

  await page.locator('#checkBoxOption2').check();

  await page.locator('#checkBoxOption3').check();

  // Uncheck one checkbox
  await page.locator('#checkBoxOption3').uncheck();

  // =========================
  // Open Window Popup
  // =========================

  const popupPromise1 = page.context().waitForEvent('page');

  await page.locator('#openwindow').click();

  const popup1 = await popupPromise1;

  await popup1.waitForLoadState();

  console.log(
    'Popup Window Title:',
    await popup1.title()
  );

  await popup1.close();

  // =========================
  // Open Tab Popup
  // =========================

  const popupPromise2 = page.context().waitForEvent('page');

  await page.locator('#opentab').click();

  const popup2 = await popupPromise2;

  await popup2.waitForLoadState();

  console.log(
    'Open Tab Title:',
    await popup2.title()
  );

  await popup2.close();

  // Bring main page to front
  await page.bringToFront();

  // =========================
  // Hide / Show Textbox
  // =========================

  await page.locator('#hide-textbox').click();

  await page.waitForTimeout(1000);

  await page.locator('#show-textbox').click();

  // =========================
  // Mouse Hover
  // =========================

  await page.locator('#mousehover').hover();

  await page.waitForTimeout(1000);

  await page.getByRole('link', { name: 'Top' }).click();

  // =========================
  // Alert Popup
  // =========================

  page.once('dialog', async dialog => {

    console.log(
      'Alert Message:',
      dialog.message()
    );

    await dialog.accept();

  });

  await page.locator('#alertbtn').click();

  await page.waitForTimeout(1000);

  // =========================
  // Confirm Popup
  // =========================

  page.once('dialog', async dialog => {

    console.log(
      'Confirm Message:',
      dialog.message()
    );

    await dialog.dismiss();

  });

  await page.locator('#confirmbtn').click();

  await page.waitForTimeout(1000);

  // =========================
  // Web Table Rows
  // =========================

  const rows = page.locator('.table-display tr');

  console.log(
    'Row Count:',
    await rows.count()
  );

  // =========================
  // iFrame Handling
  // =========================

  const framePage = page.frameLocator('#courses-iframe');

  await framePage
    .locator('a[href*="lifetime-access"]')
    .first()
    .waitFor({
      state: 'visible'
    });

  await framePage
    .locator('a[href*="lifetime-access"]')
    .first()
    .click();

  // =========================
  // Assertions
  // =========================

  await expect(
    page.locator('#checkBoxOption1')
  ).toBeChecked();

  await expect(
    page.locator('#dropdown-class-example')
  ).toHaveValue('option2');

  // Pause for visibility
  await page.waitForTimeout(3000);

});
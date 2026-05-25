import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test('Rahul Shetty Practice Page', async ({ page }) => {

  // =====================================
  // OPEN WEBSITE
  // =====================================

  await page.goto(
    'https://rahulshettyacademy.com/AutomationPractice/#top',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  // =====================================
  // RADIO BUTTONS
  // =====================================

  await page.locator('#radio-btn-example input[value="radio1"]')
    .check();

  await page.locator('#radio-btn-example input[value="radio2"]')
    .check();

  await page.locator('#radio-btn-example input[value="radio3"]')
    .check();

  // =====================================
  // AUTO SUGGESTION
  // =====================================

  await page.locator('#autocomplete')
    .fill('Ind');

  await page.locator('.ui-menu-item div')
    .filter({ hasText: 'India' })
    .first()
    .click();

  // =====================================
  // STATIC DROPDOWN
  // =====================================

  await page.locator('#dropdown-class-example')
    .selectOption('option2');

  // =====================================
  // CHECKBOXES
  // =====================================

  await page.locator('#checkBoxOption1').check();

  await page.locator('#checkBoxOption2').check();

  await page.locator('#checkBoxOption3').check();

  await page.locator('#checkBoxOption3').uncheck();

  // =====================================
  // OPEN WINDOW
  // =====================================

  const [popup1] = await Promise.all([
    page.context().waitForEvent('page'),
    page.locator('#openwindow').click()
  ]);

  await popup1.waitForLoadState('domcontentloaded');

  console.log(
    'Popup Window Title:',
    await popup1.title()
  );

  await popup1.close();

  // =====================================
  // OPEN TAB
  // =====================================

  const [popup2] = await Promise.all([
    page.context().waitForEvent('page'),
    page.locator('#opentab').click()
  ]);

  await popup2.waitForLoadState('domcontentloaded');

  console.log(
    'Open Tab Title:',
    await popup2.title()
  );

  await popup2.close();

  // =====================================
  // BACK TO MAIN PAGE
  // =====================================

  await page.bringToFront();

  // =====================================
  // HIDE / SHOW TEXTBOX
  // =====================================

  await page.locator('#hide-textbox')
    .click();

  await page.waitForTimeout(1000);

  await page.locator('#show-textbox')
    .click({
      force: true
    });

  // =====================================
  // MOUSE HOVER
  // =====================================

  await page.locator('#mousehover')
    .hover();

  await page.locator('.mouse-hover-content a')
    .filter({ hasText: 'Top' })
    .click();

  // =====================================
  // ALERT POPUP
  // =====================================

  page.once('dialog', async dialog => {

    console.log(
      'Alert Message:',
      dialog.message()
    );

    await dialog.accept();

  });

  await page.locator('#alertbtn')
    .click();

  // =====================================
  // CONFIRM POPUP
  // =====================================

  page.once('dialog', async dialog => {

    console.log(
      'Confirm Message:',
      dialog.message()
    );

    await dialog.dismiss();

  });

  await page.locator('#confirmbtn')
    .click();

  // =====================================
  // WEB TABLE
  // =====================================

  const rows = page.locator('.table-display tr');

  console.log(
    'Row Count:',
    await rows.count()
  );

  // =====================================
  // IFRAME HANDLING
  // =====================================

  const framePage = page.frameLocator('#courses-iframe');

  // Wait iframe visible
  await page.locator('#courses-iframe')
    .waitFor({
      state: 'visible',
      timeout: 30000
    });

  // Click visible Courses link
  await framePage
    .getByRole('link', { name: 'Courses' })
    .first()
    .click({
      force: true
    });

  // =====================================
  // ASSERTIONS
  // =====================================

  await expect(
    page.locator('#checkBoxOption1')
  ).toBeChecked();

  await expect(
    page.locator('#dropdown-class-example')
  ).toHaveValue('option2');

  await page.waitForTimeout(3000);

});
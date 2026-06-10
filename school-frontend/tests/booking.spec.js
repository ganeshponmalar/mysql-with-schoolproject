import { test, expect } from '@playwright/test';

test.setTimeout(120000);

test('Flight Booking Test', async ({ page }) => {

  // Open Flight Booking Website Directly
  await page.goto(
    'https://rahulshettyacademy.com/dropdownsPractise/',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  // Round Trip
  await page.locator(
    '#ctl00_mainContent_rbtnl_Trip_1'
  ).check();

  // FROM City
  await page.locator(
    '#ctl00_mainContent_ddl_originStation1_CTXT'
  ).click();

  await page.locator("a[value='MAA']")
    .first()
    .click();

  // TO City
  await page.locator("a[value='TRV']")
    .last()
    .click();

  // Travel Date
  await page.locator('.ui-state-default')
    .nth(5)
    .click();

  // Passenger Selection
  await page.locator('#divpaxinfo')
    .click();

  // Adult +1
  await page.locator('#hrefIncAdt')
    .click();

  // Child +1
  await page.locator('#hrefIncChd')
    .click();

  // Infant +1
  await page.locator('#hrefIncInf')
    .click();

  // Done
  await page.locator('#btnclosepaxoption')
    .click();

  // Family & Friends
  await page.locator(
    '#ctl00_mainContent_chk_friendsandfamily'
  ).check();

  // Student Discount
  await page.locator(
    '#ctl00_mainContent_chk_StudentDiscount'
  ).check();

  // Currency
  await page.locator(
    '#ctl00_mainContent_DropDownListCurrency'
  ).selectOption('USD');

  // Assertions
  await expect(
    page.locator(
      '#ctl00_mainContent_chk_friendsandfamily'
    )
  ).toBeChecked();

  await expect(
    page.locator(
      '#ctl00_mainContent_chk_StudentDiscount'
    )
  ).toBeChecked();

  await expect(
    page.locator(
      '#ctl00_mainContent_DropDownListCurrency'
    )
  ).toHaveValue('USD');

  // Search Flight
  await page.locator(
    '#ctl00_mainContent_btn_FindFlights'
  ).click();

  // Wait for Result Page
  await page.waitForLoadState('networkidle');

});
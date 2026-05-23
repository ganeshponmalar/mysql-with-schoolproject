import { test, expect } from '@playwright/test';

test('Flight Booking Test', async ({ page }) => {

  // Open website
  await page.goto(
    'https://rahulshettyacademy.com/seleniumPractise/#/',
    {
      waitUntil: 'domcontentloaded',
      timeout: 60000
    }
  );

  // Open Flight Booking popup window
  const [flightPage] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'Flight Booking' }).click()
  ]);

  // Wait for popup page load
  await flightPage.waitForLoadState('domcontentloaded');
  await flightPage.waitForSelector('#ctl00_mainContent_ddl_originStation1_CTXT', { timeout: 20000 });

  // Select Round Trip
  await flightPage.locator('#ctl00_mainContent_rbtnl_Trip_1')
    .check();

  // Select FROM city
  await flightPage.locator('#ctl00_mainContent_ddl_originStation1_CTXT')
    .click();
  await flightPage.locator("a[value='MAA']")
    .first()
    .waitFor({ state: 'visible', timeout: 10000 });
  await flightPage.locator("a[value='MAA']")
    .first()
    .click();

  // Select TO city
  await flightPage.locator('#ctl00_mainContent_ddl_destinationStation1_CTXT')
    .click();
  await flightPage.locator("a[value='TRV']")
    .waitFor({ state: 'visible', timeout: 10000 });
  await flightPage.locator("a[value='TRV']")
    .click();

  // Select travel date
  await flightPage.locator('.ui-state-default')
    .filter({ hasText: '7' })
    .first()
    .click();

  // Passenger dropdown
  await flightPage.locator('#divpaxinfo')
    .click();

  // Increase Adult count
  await flightPage.locator('#hrefIncAdt')
    .click();

  // Increase Child count
  await flightPage.locator('#hrefIncChd')
    .click();

  // Increase Infant count
  await flightPage.locator('#hrefIncInf')
    .click();

  // Click Done
  await flightPage.locator('#btnclosepaxoption')
    .click();

  // Check Family and Friends
  await flightPage.locator('#ctl00_mainContent_chk_friendsandfamily')
    .check();

  // Check Student Discount
  await flightPage.locator('#ctl00_mainContent_chk_StudentDiscount')
    .check();

  // Select Currency
  await flightPage.locator('#ctl00_mainContent_DropDownListCurrency')
    .selectOption('USD');

  // Click Search
  await flightPage.locator('#ctl00_mainContent_btn_FindFlights')
    .click();

  // Wait for results
  await flightPage.waitForTimeout(5000);

});
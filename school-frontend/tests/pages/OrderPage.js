export class OrderPage {

  constructor(page) {

    this.page = page;

    this.firstName =
      page.locator('[data-test="firstName"]');

    this.lastName =
      page.locator('[data-test="lastName"]');

    this.zipCode =
      page.locator('[data-test="postalCode"]');

    this.continueBtn =
      page.locator('[data-test="continue"]');

    this.menu =
      page.getByRole('button', {
        name: 'Open Menu'
      });

    this.logout =
      page.locator(
        '[data-test="logout-sidebar-link"]'
      );
  }

  async fillOrderDetails(
    firstName,
    lastName,
    zipCode
  ) {

    await this.firstName.fill(firstName);

    await this.lastName.fill(lastName);

    await this.zipCode.fill(zipCode);
  }

  async continueOrder() {

    await this.continueBtn.click();
  }

  async logoutApplication() {

    await this.menu.click();

    await this.logout.click();
  }
}
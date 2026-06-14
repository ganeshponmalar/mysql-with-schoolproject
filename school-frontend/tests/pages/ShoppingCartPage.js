// tests/pages/ShoppingCartPage.js

export class ShoppingCartPage {

  constructor(page) {

    this.page = page;

    // Remove Backpack
    this.removeItem = page.locator(
      '[data-test="remove-sauce-labs-backpack"]'
    );

    this.checkoutBtn = page.locator(
      '[data-test="checkout"]'
    );
  }

  async removeProduct() {

    await this.removeItem.click();
  }

  async proceedToCheckout() {

    await this.checkoutBtn.click();
  }
}
export class ProductsPage {

  constructor(page) {

    this.page = page;

    this.backpack =
      page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');

    this.boltShirt =
      page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');

    this.onesie =
      page.locator('[data-test="add-to-cart-sauce-labs-onesie"]');

    this.cart =
      page.locator('[data-test="shopping-cart-link"]');
  }

  async addRequiredProducts() {

    await this.backpack.click();
    await this.boltShirt.click();
    await this.onesie.click();
  }

  async openCart() {
    await this.cart.click();
  }
}
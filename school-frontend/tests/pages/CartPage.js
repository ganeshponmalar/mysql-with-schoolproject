export class CartPage {
    constructor(page) {
        this.page = page;

        this.removeItem = page.getByRole('link', {
            name: '×'
        });

        this.checkoutBtn = page.getByRole('button', {
            name: 'PROCEED TO CHECKOUT'
        });
    }

    async removeProduct(index) {
        await this.removeItem.nth(index).click();
    }

    async proceedToCheckout() {
        await this.checkoutBtn.click();
    }
}
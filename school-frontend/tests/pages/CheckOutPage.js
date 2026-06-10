export class CheckoutPage {
    constructor(page) {
        this.page = page;

        this.promoCode = page.getByRole('textbox', {
            name: 'Enter promo code'
        });

        this.applyBtn = page.getByRole('button', {
            name: 'Apply'
        });

        this.placeOrderBtn = page.getByRole('button', {
            name: 'Place Order'
        });

        this.countryDropdown = page.getByRole('combobox');

        this.termsCheckbox = page.getByRole('checkbox');

        this.proceedBtn = page.getByRole('button', {
            name: 'Proceed'
        });
    }

    async applyPromo(code) {
        await this.promoCode.fill(code);
        await this.applyBtn.click();
    }

    async placeOrder() {
        await this.placeOrderBtn.click();
    }

    async selectCountry(country) {
        await this.countryDropdown.selectOption(country);
    }

    async acceptTerms() {
        await this.termsCheckbox.check();
    }

    async proceed() {
        await this.proceedBtn.click();
    }
}
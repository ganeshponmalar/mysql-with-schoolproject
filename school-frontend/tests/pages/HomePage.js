export class HomePage {
    constructor(page) {
        this.page = page;

        this.searchBox = page.getByRole('searchbox', {
            name: 'Search for Vegetables and'
        });

        this.addToCartBtn = page.getByRole('button', {
            name: 'ADD TO CART'
        });

        this.cartIcon = page.getByRole('link', {
            name: 'Cart'
        });
    }

    async navigate() {
        await this.page.goto(
            'https://rahulshettyacademy.com/seleniumPractise/#/'
        );
    }

    async searchProduct(product) {
        await this.searchBox.fill(product);
    }

    async clearSearch() {
        await this.searchBox.fill('');
    }

    async addProduct(index) {
        await this.addToCartBtn.nth(index).click();
    }

    async openCart() {
        await this.cartIcon.click();
    }
}
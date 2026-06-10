import { test, expect } from './fixtures/ecommerceFixture.js';

test('Place Order Using POM', async ({
    homePage,
    cartPage,
    checkoutPage
}) => {

    await homePage.navigate();

    await homePage.searchProduct('brocol');

    await homePage.clearSearch();

    await homePage.addProduct(0);
    await homePage.addProduct(1);

    await homePage.openCart();

    await cartPage.proceedToCheckout();

    await checkoutPage.placeOrder();

});
import { test } from "./fixtures/pageFixture.js";

test('SauceDemo Purchase Flow', async ({

  authPage,
  productsPage,
  shoppingCartPage,
  orderPage

}) => {

  await authPage.openApplication();

  await authPage.signIn(
    'standard_user',
    'secret_sauce'
  );

  await productsPage.addRequiredProducts();

  await productsPage.openCart();

  await shoppingCartPage.removeProduct();

  await shoppingCartPage.proceedToCheckout();

  await orderPage.fillOrderDetails(
    'ganesan',
    'p',
    '606203'
  );

  await orderPage.continueOrder();

  await orderPage.logoutApplication();
});
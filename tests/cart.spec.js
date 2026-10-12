const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const users = require('../test-data.json');

test.describe('Shopping Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);

    await loginPage.open();
    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.openCart();
  });

  test('should display the added product in the cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    await expect(cartPage.pageTitle).toHaveText('Your Cart');
    await expect(
      cartPage.item('Sauce Labs Backpack')
    ).toBeVisible();

    expect(
      await cartPage.hasProduct('Sauce Labs Backpack')
    ).toBeTruthy();
  });

  test('should remove a product from the cart', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.removeProduct('Sauce Labs Backpack');

    await expect(
      cartPage.item('Sauce Labs Backpack')
    ).toHaveCount(0);
  });

  test('should navigate to checkout', async ({ page }) => {
    const cartPage = new CartPage(page);

    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);
  });
});

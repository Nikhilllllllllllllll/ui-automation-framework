const { test, expect } = require('@playwright/test');

const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductPage');
const { CartPage } = require('../pages/CartPage');
const { CheckoutPage } = require('../pages/CheckoutPage');

const users = require('../test-data.json');

test.describe('Checkout Tests', () => {
  test('should complete an order successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Login
    await loginPage.open();
    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    // Step 2: Add product and open cart
    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.openCart();

    // Step 3: Go to checkout
    await cartPage.checkout();

    await expect(page).toHaveURL(/checkout-step-one\.html/);

    // Step 4: Enter customer information
    await checkoutPage.enterCustomerInformation(
      'Nikhil',
      'Khandelwal',
      '110001'
    );

    await expect(page).toHaveURL(/checkout-step-two\.html/);

    // Step 5: Verify order summary
    await expect(
      page.locator('.inventory_item_name')
    ).toHaveText('Sauce Labs Backpack');

    await expect(checkoutPage.subtotalLabel).toBeVisible();
    await expect(checkoutPage.taxLabel).toBeVisible();
    await expect(checkoutPage.totalLabel).toBeVisible();

    // Step 6: Finish order
    await checkoutPage.finishOrder();

    // Step 7: Verify confirmation
    await expect(page).toHaveURL(/checkout-complete\.html/);

    await expect(checkoutPage.completeHeader)
      .toHaveText('Thank you for your order!');
  });

  test('should show an error when first name is missing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productsPage = new ProductsPage(page);
    const cartPage = new CartPage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginPage.open();
    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    await productsPage.addProductToCart('Sauce Labs Backpack');
    await productsPage.openCart();
    await cartPage.checkout();

    // Leave all customer information blank
    await checkoutPage.continueButton.click();

    await expect(checkoutPage.errorMessage)
      .toContainText('First Name is required');
  });
});
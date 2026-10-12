const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ProductsPage } = require('../pages/ProductPage');
const users = require('../test-data.json');

test.describe('Products Tests', () => {
  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );
  });

  test('should display the products page', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.expectPageLoaded();

    await expect(productsPage.pageTitle).toHaveText('Products');
    await expect(productsPage.inventoryItems.first()).toBeVisible();
    expect(await productsPage.getProductNames()).not.toHaveLength(0);
  });

  test('should sort products from A to Z', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.sortProducts('az');

    const productNames = await productsPage.getProductNames();
    const expectedNames = [...productNames].sort((a, b) =>
      a.localeCompare(b)
    );

    expect(productNames).toEqual(expectedNames);
  });

  test('should add a product to the cart', async ({ page }) => {
    const productsPage = new ProductsPage(page);

    await productsPage.addProductToCart('Sauce Labs Backpack');

    await expect(productsPage.cartBadge).toHaveText('1');

    await expect(
      productsPage.productCard('Sauce Labs Backpack')
        .getByRole('button', { name: 'Remove' })
    ).toBeVisible();
  });
});
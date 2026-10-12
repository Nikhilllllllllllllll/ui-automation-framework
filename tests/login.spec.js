const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const users = require('../test-data.json');

test.describe('Login Tests', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(
      users.validUser.username,
      users.validUser.password
    );

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('should show an error for invalid credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(
      users.invalidUser.username,
      users.invalidUser.password
    );

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage)
      .toContainText('Username and password do not match');
  });

  test('should show an error for a locked-out user', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(
      users.lockedOutUser.username,
      users.lockedOutUser.password
    );

    await expect(loginPage.errorMessage).toContainText('locked out');
  });
});
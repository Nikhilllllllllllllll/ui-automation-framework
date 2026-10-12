class CartPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator(
      '[data-test="continue-shopping"]'
    );
  }

  item(productName) {
    return this.cartItems.filter({
      hasText: productName
    });
  }

  async hasProduct(productName) {
    return (await this.item(productName).count()) > 0;
  }

  async removeProduct(productName) {
    await this.item(productName)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  async checkout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}

module.exports = { CartPage };
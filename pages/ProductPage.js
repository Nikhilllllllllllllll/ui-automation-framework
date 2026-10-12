class ProductsPage {
  constructor(page) {
    this.page = page;
    this.pageTitle = page.locator('.title');
    this.inventoryItems = page.locator('.inventory_item');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async expectPageLoaded() {
    await this.pageTitle.waitFor({ state: 'visible' });
  }

  productCard(productName) {
    return this.inventoryItems.filter({
      hasText: productName
    });
  }

  async addProductToCart(productName) {
    const product = this.productCard(productName);

    await product.getByRole('button', {
      name: 'Add to cart'
    }).click();
  }

  async removeProductFromCart(productName) {
    const product = this.productCard(productName);

    await product.getByRole('button', {
      name: 'Remove'
    }).click();
  }

  async sortProducts(option) {
    await this.sortDropdown.selectOption(option);
  }

  async getProductNames() {
    return await this.inventoryItems
      .locator('.inventory_item_name')
      .allTextContents();
  }

  async openCart() {
    await this.cartLink.click();
  }

  async getCartCount() {
    if (await this.cartBadge.count() === 0) {
      return 0;
    }

    return Number(await this.cartBadge.textContent());
  }
}

module.exports = { ProductsPage };
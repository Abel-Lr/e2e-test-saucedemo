import {type Page, type Locator} from "@playwright/test";

export class ItemDetailPage {
    readonly page: Page;
    readonly title: Locator;
    readonly description: Locator;
    readonly price: Locator;
    readonly image: Locator;
    readonly addToCartButton: Locator;
    readonly removeFromCartButton: Locator;
    readonly backToProductsButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="inventory-item-name"]');
        this.description = page.locator('[data-test="inventory-item-desc"]');
        this.price = page.locator('[data-test="inventory-item-price"]');
        this.image = page.locator('.inventory_details_img');
        this.addToCartButton = page.locator('#add-to-cart');
        this.removeFromCartButton = page.locator('#remove');
        this.backToProductsButton = page.locator('#back-to-products');
    }

    async goto(id: number | string) {
        await this.page.goto(`/inventory-item.html?id=${id}`);
    }

    async backToProducts() {
        await this.backToProductsButton.click();
    }
}
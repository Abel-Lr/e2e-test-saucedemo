import {type Page, type Locator} from '@playwright/test';

export class BasketPage {
    readonly page: Page;
    readonly continueShoppingButton: Locator;
    readonly checkoutButton: Locator;
    readonly cartBadge: Locator;

    constructor(page: Page) {
        this.page = page;
        this.continueShoppingButton = page.locator("#continue-shopping");
        this.checkoutButton = page.locator("#checkout");
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    }

    getAllItemCards(): Locator {
        return this.page.locator('[data-test="inventory-item"]')
    }

    getItemCard(itemName: string): Locator {
        return this.page.locator('[data-test="inventory-item"]').filter({
            has: this.page.locator('[data-test="inventory-item-name"]', {hasText: itemName}),
        });
    }

    getItemPrice(itemCard: Locator): Locator {
        return itemCard.locator('[data-test="inventory-item-price"]');
    }

    getItemDescription(itemCard: Locator): Locator {
        return itemCard.locator('[data-test="inventory-item-desc"]');
    }

    getItemQuantity(itemCard: Locator): Locator {
        return itemCard.locator('[data-test="item-quantity"]');
    }

    getRemoveButton(itemCard: Locator): Locator {
        return itemCard.locator('button');
    }

    async continueShopping() {
        await this.continueShoppingButton.click();
    }

    async goToCheckout() {
        await this.checkoutButton.click();
    }
}
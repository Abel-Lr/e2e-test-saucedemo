import {type Page, type Locator} from '@playwright/test';

export class InventoryPage {
    readonly page: Page;
    readonly sortSelect: Locator;
    readonly cartLink: Locator;
    readonly cartBadge: Locator;
    readonly burgerMenuButton: Locator;
    readonly burgerCloseButton: Locator;
    readonly allItemsLink: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sortSelect = page.locator('[data-test="product-sort-container"]');
        this.cartLink = page.locator('[data-test="shopping-cart-link"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.burgerMenuButton = page.locator('#react-burger-menu-btn');
        this.burgerCloseButton = page.locator('#react-burger-cross-btn');
        this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    }

    getAllItemCards(): Locator {
        return this.page.locator('[data-test="inventory-item"]');
    }

    getAllItemNames(): Promise<string[]> {
        return this.page.locator('[data-test="inventory-item-name"]').allTextContents();
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

    getItemImage(itemCard: Locator): Locator {
        return itemCard.locator('img.inventory_item_img');
    }

    getAddRemoveToCartButton(itemCard: Locator): Locator {
        return itemCard.locator('button');
    }

    async clickTitleAndGetId(itemCard: Locator): Promise<number | null> {
        const titleLink = itemCard.locator('.inventory_item_label a');
        await titleLink.click();
        const idRet = this.page.url().split('?id=')[1];
        return idRet ? Number(idRet) : -1;
    }

    async clickImageAndGetId(itemCard: Locator): Promise<number | null> {
        const titleLink = itemCard.locator('.inventory_item_img a');
        await titleLink.click();
        const idRet = this.page.url().split('?id=')[1];
        return idRet ? Number(idRet) : -1;
    }

    async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
        await this.sortSelect.selectOption(option);
    }

    async openBurgerMenu() {
        await this.burgerMenuButton.click();
    }

    async closeBurgerMenu() {
        await this.burgerCloseButton.click();
    }

    async goToCart() {
        await this.cartLink.click();
    }

    async logout() {
        await this.logoutLink.click();
    }
}
import {type Page, type Locator} from '@playwright/test';

export class SidebarPage {
    readonly page: Page;
    readonly burgerMenuButton: Locator;
    readonly burgerCloseButton: Locator;
    readonly allItemsLink: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.burgerMenuButton = page.locator('#react-burger-menu-btn');
        this.burgerCloseButton = page.locator('#react-burger-cross-btn');
        this.allItemsLink = page.locator('[data-test="inventory-sidebar-link"]');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    }

    async open() {
        await this.burgerMenuButton.click();
    }

    async close() {
        await this.burgerCloseButton.click();
    }

    async goToAllItems() {
        await this.allItemsLink.click();
    }

    async logout() {
        await this.logoutLink.click();
    }
}
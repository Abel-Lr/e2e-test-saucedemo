import {type Page, type Locator} from "@playwright/test";

export class CheckoutOverviewPage {
    readonly page: Page;
    readonly cancelButton: Locator;
    readonly finishButton: Locator;
    readonly paymentInfo: Locator;
    readonly shippingInfo: Locator;
    readonly subtotal: Locator;
    readonly tax: Locator;
    readonly total: Locator;

    constructor(page: Page) {
        this.page = page;
        this.cancelButton = page.locator('#cancel');
        this.finishButton = page.locator('#finish');
        this.paymentInfo = page.locator('[data-test="payment-info-value"]');
        this.shippingInfo = page.locator('[data-test="shipping-info-value"]');
        this.subtotal = page.locator('[data-test="subtotal-label"]');
        this.tax = page.locator('[data-test="tax-label"]');
        this.total = page.locator('[data-test="total-label"]');
    }

    getItemCard(itemName: string): Locator {
        return this.page.locator('[data-test="inventory-item"]').filter({
            has: this.page.locator('[data-test="inventory-item-name"]', {hasText: itemName}),
        })
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

    async cancelCheckout() {
        await this.cancelButton.click();
    }

    async finishCheckout() {
        await this.finishButton.click();
    }
}
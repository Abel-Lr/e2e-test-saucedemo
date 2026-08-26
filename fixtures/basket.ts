import {Page} from "@playwright/test";
import {Account} from "./accounts";
import {BasketPage} from "../pages/BasketPage";
import {setupCheckoutCart} from "./checkout";

export async function setupBasketPage(
    page: Page,
    account: Account,
    itemIds: number[] = [0, 4]
): Promise<BasketPage> {
    await setupCheckoutCart(page, account, itemIds);
    await page.goto('/cart.html');

    return new BasketPage(page);
}

export async function setupBasketPageInvalidLocalStorage(page: Page, account: Account): Promise<BasketPage> {
    await setupCheckoutCart(page, account, [])
    await page.evaluate(() => {
        localStorage.setItem('cart-contents', 'test')
    })
    return new BasketPage(page);
}
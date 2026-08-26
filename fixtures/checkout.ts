import {standardUser, problemUser, performanceGlitchUser, errorUser, visualUser, Account} from "./accounts";
import {Page} from "@playwright/test";

export const accounts_to_test: Account[] = [standardUser, problemUser, performanceGlitchUser, errorUser, visualUser];

export async function setupCheckoutCart(
    page: Page,
    account: Account,
    itemIds: number[] = [0, 4]
) {
    await page.goto('/');

    await page.context().addCookies([
        {
            name: 'session-username',
            value: account.username,
            domain: "www.saucedemo.com",
            path: '/'
        }
    ]);

    await page.evaluate((ids) => {
        localStorage.setItem('cart-contents', JSON.stringify(ids));
    }, itemIds);

    await page.goto('/checkout-step-one.html');
}

export async function setupOverviewCart(
    page: Page,
    account: Account,
    itemIds: number[] = [0, 4]
) {
    await setupCheckoutCart(page, account, itemIds);
    await page.goto('/checkout-step-two.html');
}
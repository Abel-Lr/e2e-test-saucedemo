
import {Page} from "@playwright/test";
import {CheckoutClientInfoPage} from "../pages/CheckoutClientInfoPage";
import {CheckoutOverviewPage} from "../pages/CheckoutOverviewPage";
import {Account} from "./accounts";



export interface PDFInvoiceContent {
    orderDate: Date;
    fullName: string;
    zipCode: string;
    items: { name: string; price: number }[];
    subtotal: number;
    tax: number;
    total: number;
}

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

export async function setupCompleteCart(
    page: Page,
    account: Account,
    itemIds: number[] = [0, 4],
    firstName: string = 'Abel',
    lastName: string = 'Laroussi',
    zipCode: string = '69140'
) {
    await setupCheckoutCart(page, account, itemIds);

    const checkoutClientInfoPage = new CheckoutClientInfoPage(page);
    await checkoutClientInfoPage.fillClientInfo(firstName, lastName, zipCode);
    await checkoutClientInfoPage.confirmClientInfo();

    const checkoutOverviewPage = new CheckoutOverviewPage(page);
    await checkoutOverviewPage.finishCheckout();
}
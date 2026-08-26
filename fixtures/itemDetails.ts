import {Page} from "@playwright/test";
import {Account} from "./accounts";
import {ItemDetailPage} from "../pages/ItemDetailPage";
import {LoginPage} from "../pages/LoginPage";

export async function setupItemDetailPage(page: Page, account: Account, id: number | string, itemIds: number[] = []): Promise<ItemDetailPage> {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(account.username, account.password);
    await page.waitForURL(/inventory/);

    await page.evaluate((ids) => {
        localStorage.setItem('cart-contents', JSON.stringify(ids));
    }, itemIds);

    const itemDetailPage = new ItemDetailPage(page);
    await itemDetailPage.goto(id);

    return itemDetailPage;
}

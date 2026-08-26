import {Page} from "@playwright/test";
import {Account} from "./accounts";
import {InventoryPage} from "../pages/InventoryPage";
import {LoginPage} from "../pages/LoginPage";

export async function setupInventoryPage(page: Page, account: Account): Promise<InventoryPage> {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(account.username, account.password);
    await page.waitForURL(/inventory/);

    return new InventoryPage(page);
}

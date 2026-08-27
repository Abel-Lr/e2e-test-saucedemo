import {test, expect} from "@playwright/test";
import {toTestAfterLogin} from "../fixtures/accounts";
import {setupBasketPage} from "../fixtures/basket";
import {SidebarPage} from "../pages/SidebarPage";
import {setupInventoryPage} from "../fixtures/inventory";

test.describe('Transverse - Accès sans authentification', () => {
    const protectedUrls = [
        '/inventory.html',
        '/inventory-item.html?id=0',
        '/cart.html',
        '/checkout-step-one.html',
        '/checkout-step-two.html',
        '/checkout-complete.html',
    ]
    for (const url of protectedUrls)
        test(`Accès direct à une ${url} redirige vers Login`, async ({page}) => {
            await page.goto(url);

            await expect(page).toHaveURL('/');
        })
})

test.describe('Transverse - Sidebar', () => {
    for (const account of toTestAfterLogin) {
        test(`${account.username} - ouverture / fermeture de la sidebar`, async ({page}) => {
            await setupInventoryPage(page, account);
            const sidebarPage = new SidebarPage(page);

            await sidebarPage.open();
            await expect(sidebarPage.allItemsLink).toBeVisible();

            await sidebarPage.close();
            await expect(sidebarPage.allItemsLink).not.toBeVisible();
        })

        test(`${account.username} - déconnexion via le bouton Logout`, async ({page}) => {
            await setupInventoryPage(page, account);
            const sidebarPage = new SidebarPage(page);

            await sidebarPage.open();
            await sidebarPage.logout();

            await expect(page).toHaveURL('/');

            const cookies = await page.context().cookies();
            const authCookie = cookies.find(c => c.name === 'session-username');
            expect(authCookie).toBeUndefined();
        })

        test(`${account.username} - clic sur "All Items" redirige vers Inventory`, async ({page}) => {
            await setupBasketPage(page, account);
            const sidebarPage = new SidebarPage(page);

            await sidebarPage.open();
            await sidebarPage.goToAllItems();

            await expect(page).toHaveURL(/inventory/);
        })
    }
})

test.describe('Transverse - Anomalies visuelles', () => {
    for (const account of toTestAfterLogin) {
        test(`${account.username} - bouton menu burger sans rotation`, async ({page}) => {
            await setupInventoryPage(page, account);
            const sidebarPage = new SidebarPage(page);

            const transform = await sidebarPage.burgerMenuIcon.evaluate((el) => getComputedStyle(el).transform);
            expect(transform).toBe('none');
        });
        test(`${account.username} - l'icône du panier sans rotation`, async ({page}) => {
            await setupInventoryPage(page, account);
            const sidebarPage = new SidebarPage(page);

            const transform = await sidebarPage.cartContainer.evaluate((el) => getComputedStyle(el).transform);
            expect(transform).toBe('none');
        });
        test(`${account.username} - boutons de l'écran Basket bien positionnés`, async ({page}) => {
            const basketPage = await setupBasketPage(page, account);

            const buttonBox = await basketPage.checkoutButton.boundingBox();
            const footerBox = await page.locator('.cart_footer').boundingBox();

            if (!buttonBox || !footerBox) throw new Error('Impossible de récupérer les positions.')

            const footerCenterY = footerBox.y + footerBox.height / 2;

            expect(Math.abs(buttonBox.y - footerCenterY)).toBeLessThan(footerBox.height);
        })
    }
})
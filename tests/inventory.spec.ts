import {test, expect} from "@playwright/test";
import {InventoryPage} from "../pages/InventoryPage";
import {toTestAfterLogin} from "../fixtures/accounts";
import {LoginPage} from "../pages/LoginPage";
import {Product, products} from "../fixtures/products";
import {setupInventoryPage} from "../fixtures/inventory";

test.describe('Inventory - Chargement de la page', () => {
    for (const account of toTestAfterLogin) {
        test(`${account.username} - temps de chargement de la page`, async ({page}) => {
            const loginPage = new LoginPage(page);
            await loginPage.goto();

            const startTimer = Date.now();
            await loginPage.login(account.username, account.password);
            await page.waitForURL(/inventory/);
            const duration = Date.now() - startTimer;

            expect(duration).toBeLessThan(1000);
        })

        test(`${account.username} - affichage cohérent avec les données de test`, async ({page}) => {
            const inventoryPage = await setupInventoryPage(page, account);

            await expect(inventoryPage.getAllItemCards()).toHaveCount(products.length);

            for (const product of products) {
                const card = inventoryPage.getItemCard(product.name);

                await expect(inventoryPage.getItemPrice(card)).toHaveText(`$${product.price}`);
                await expect(inventoryPage.getItemDescription(card)).toHaveText(`${product.description}`);

                const imageSrc = await inventoryPage.getItemImage(card).getAttribute('src');
                expect(imageSrc).toBe(product.imageUrl);
            }
        })
    }
})

test.describe('Inventory - Sidebar', () => {
    for (const account of toTestAfterLogin) {
        test(`${account.username} - ouverture / fermeture de la sidebar`, async ({page}) => {
            const inventoryPage = await setupInventoryPage(page, account);

            await inventoryPage.openBurgerMenu();
            await expect(inventoryPage.allItemsLink).toBeVisible();

            await inventoryPage.closeBurgerMenu();
            await expect(inventoryPage.allItemsLink).not.toBeVisible();
        })

        test(`${account.username} - déconnexion via le bouton Logout`, async ({page}) => {
            const inventoryPage = await setupInventoryPage(page, account);

            await inventoryPage.openBurgerMenu();
            await inventoryPage.logout();

            await expect(page).toHaveURL('/');

            const cookies = await page.context().cookies();
            const authCookie = cookies.find(c => c.name === 'session-username');
            expect(authCookie).toBeUndefined();
        })
    }
})

test.describe('Inventory - Tri des items', () => {
    const sortOptions: {
        label: 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)',
        value: 'az' | 'za' | 'lohi' | 'hilo';
        sortFn: (a: Product, b: Product) => number
    }[] = [
        {label: 'Name (A to Z)', value: 'az', sortFn: (a, b) => a.name.localeCompare(b.name)},
        {label: 'Name (Z to A)', value: 'za', sortFn: (a, b) => b.name.localeCompare(a.name)},
        {label: 'Price (low to high)', value: 'lohi', sortFn: (a, b) => a.price - b.price},
        {label: 'Price (high to low)', value: 'hilo', sortFn: (a, b) => b.price - a.price},
    ];

    for (const account of toTestAfterLogin) {
        for (const sortOption of sortOptions) {
            test(`${account.username} - temps de tri ${sortOption.label}`, async ({page}) => {
                const inventoryPage = await setupInventoryPage(page, account);

                const startTimer = Date.now();
                await inventoryPage.sortBy(sortOption.value);
                const duration = Date.now() - startTimer;

                expect(duration).toBeLessThan(1000);
            })

            test(`${account.username} - tri ${sortOption.label} effectif`, async ({page}) => {
                const inventoryPage = await setupInventoryPage(page, account);

                await inventoryPage.sortBy(sortOption.value);

                const expectedOrder = [...products].sort(sortOption.sortFn).map(p => p.name);
                const displayedTitles = await inventoryPage.getAllItemNames();

                expect(displayedTitles).toEqual(expectedOrder);
            })
        }
    }
})

test.describe('Inventory - Ajout et Retrait des items', () => {
    for (const account of toTestAfterLogin) {
        test(`${account.username} - ajout puis retrait progressif des items`, async ({page}) => {
            const inventoryPage = await setupInventoryPage(page, account);

            const displayedNames = await inventoryPage.getAllItemNames();

            const expectedLocalStorage: number[] = [];

            for (const name of displayedNames) {
                const product = products.find(p => p.name === name);
                if (!product) throw new Error(`Produit "${name}" introuvable dans les données de test.`);

                const card = inventoryPage.getItemCard(name);
                const button = inventoryPage.getAddRemoveToCartButton(card);

                await button.click();
                await expect(button).toHaveText('Remove');

                expectedLocalStorage.push(product.id);

                const cartContents = await page.evaluate(() => localStorage.getItem('cart-contents'));
                expect(JSON.parse(cartContents ?? '[]')).toEqual(expectedLocalStorage);

                await expect(inventoryPage.cartBadge).toHaveText(String(expectedLocalStorage.length));
            }

            for (const name of [...displayedNames].reverse()) {
                const card = inventoryPage.getItemCard(name);
                const button = inventoryPage.getAddRemoveToCartButton(card);

                await button.click();
                await expect(button).toHaveText('Add to cart');

                expectedLocalStorage.pop();

                const cartContents = await page.evaluate(() => localStorage.getItem('cart-contents'));
                expect(JSON.parse(cartContents ?? '[]')).toEqual(expectedLocalStorage);

                if (expectedLocalStorage.length > 0)
                    await expect(inventoryPage.cartBadge).toHaveText(String(expectedLocalStorage.length));
                else
                    await expect(inventoryPage.cartBadge).not.toBeVisible();
            }
        })
    }
})

test.describe('Inventory - Accès au détail des items', () => {
    for (const account of toTestAfterLogin) {
        test(`${account.username} - clic sur le titre redirige vers le bon ID`, async ({page}) => {
            const inventoryPage = await setupInventoryPage(page, account);
            const displayedNames = await inventoryPage.getAllItemNames();

            for (const name of displayedNames) {
                const product = products.find(p => p.name === name);
                if (!product) throw new Error(`Produit "${name}" introuvable dans les données de test.`)

                const card = inventoryPage.getItemCard(name);
                const actualId = await inventoryPage.clickTitleAndGetId(card);

                expect(actualId).toBe(product.id);

                await page.goBack();
                await page.waitForURL(/inventory/);
            }
        });
        test(`${account.username} - clic sur l'illustration redirige vers le bon ID`, async ({page}) => {
            const inventoryPage = await setupInventoryPage(page, account);
            const displayedNames = await inventoryPage.getAllItemNames();

            for (const name of displayedNames) {
                const product = products.find(p => p.name === name);
                if (!product) throw new Error(`Produit "${name}" introuvable dans les données de test.`)

                const card = inventoryPage.getItemCard(name);
                const actualId = await inventoryPage.clickImageAndGetId(card);

                expect(actualId).toBe(product.id);

                await page.goBack();
                await page.waitForURL(/inventory/);
            }
        })
    }
})

test.describe('Inventory - Accès au panier', () => {
    for (const account of toTestAfterLogin) {
        test(`${account.username} - clic sur l'icône du panier redirige vers Basket`, async ({page}) => {
            const inventoryPage = await setupInventoryPage(page, account);

            await inventoryPage.goToCart();

            await expect(page).toHaveURL(/cart/);
        })
    }
})

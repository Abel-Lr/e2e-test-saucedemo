import {test, expect} from "@playwright/test";
import {standardUser} from "../fixtures/accounts";
import {products} from "../fixtures/products";
import {setupBasketPage, setupBasketPageInvalidLocalStorage} from "../fixtures/basket";

test.describe('Basket - Affichage des items', () => {
    test(`${standardUser.username} - affichage correct de 3 items distincts`, async ({page}) => {
        const selectedProducts = [products[0], products[3], products[5]];
        const basketPage = await setupBasketPage(page, standardUser, selectedProducts.map(p => p.id));

        await expect(basketPage.getAllItemCards()).toHaveCount(selectedProducts.length);

        for (const item of selectedProducts) {
            const card = basketPage.getItemCard(item.name);

            await expect(basketPage.getItemPrice(card)).toHaveText(`$${item.price}`);
            await expect(basketPage.getItemDescription(card)).toHaveText(item.description);
            await expect(basketPage.getItemQuantity(card)).toHaveText('1');
        }
    })
})

test.describe('Basket - Panier vide', () => {
    test(`${standardUser.username} - le bouton checkout n'est pas actif`, async ({page}) => {
        const basketPage = await setupBasketPage(page, standardUser, []);

        await expect(basketPage.getAllItemCards()).toHaveCount(0);

        await basketPage.goToCheckout();

        await expect(page).toHaveURL(/cart/)
    })
})

test.describe('Basket - Le LocalStorage a été manuellement modifié. ID inconnu ou changement de type', () => {
    test(`${standardUser.username} - ID inconnu > le basket n'affiche aucun item`, async ({page}) => {
        const basketPage = await setupBasketPage(page, standardUser, [999]);

        await expect(basketPage.getAllItemCards()).toHaveCount(0);
    })

    test(`${standardUser.username} - ID inconnu > le numéro de l'icône du basket est cohérent avec ce qui est affiché`, async ({page}) => {
        const basketPage = await setupBasketPage(page, standardUser, [999]);

        await expect(basketPage.cartBadge).not.toBeVisible();
    })

    test(`${standardUser.username} - le LocalStorage n'est pas un objet JSON`, async ({page}) => {
        await setupBasketPageInvalidLocalStorage(page, standardUser);

        const rootContent = await page.locator('#root').innerHTML();
        expect(rootContent.trim()).not.toBe('');
    })
})

test.describe('Basket - Retrait d\'un item', () => {
    test(`${standardUser.username} - retrait d'un item décrémente le panier et met à jour le LocalStorage`, async ({page}) => {
        const selectedProducts = [products[0], products[4], products[3]];
        const basketPage = await setupBasketPage(page, standardUser, selectedProducts.map(p => p.id));

        const productToRemove = selectedProducts[0];
        const card = basketPage.getItemCard(productToRemove.name)
        await basketPage.getRemoveButton(card).click();

        await expect(basketPage.getAllItemCards()).toHaveCount(selectedProducts.length - 1);

        const cartContents = await page.evaluate(() => localStorage.getItem('cart-contents'));
        expect(JSON.parse(cartContents ?? '[]')).toEqual([selectedProducts[1].id, selectedProducts[2].id]);
    })
})

test.describe('Basket - Navigation', () => {
    test(`${standardUser.username} - 'Continue Shopping' redirige vers Inventory`, async ({page}) => {
        const basketPage = await setupBasketPage(page, standardUser);
        await basketPage.continueShopping();
        await expect(page).toHaveURL(/inventory/);
    });

    test(`${standardUser.username} - 'Checkout' redirige vers CheckoutClientInfo`, async ({page}) => {
        const basketPage = await setupBasketPage(page, standardUser);
        await basketPage.goToCheckout();
        await expect(page).toHaveURL(/checkout-step-one/);
    })
})
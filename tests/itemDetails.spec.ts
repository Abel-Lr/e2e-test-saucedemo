import {test, expect} from "@playwright/test";
import {toTestAfterLogin} from "../fixtures/accounts";
import {products, productsWithUnknown} from "../fixtures/products";
import {setupItemDetailPage} from "../fixtures/itemDetails";

test.describe('ItemDetails - Cohérence des données affichées selon l\'ID', () => {
    for (const account of toTestAfterLogin) {
        for (const product of products) {
            test(`${account.username} - item ${product.id} affiche les bonnes données`, async ({page}) => {
                const itemDetailPage = await setupItemDetailPage(page, account, product.id);

                await expect(itemDetailPage.title).toHaveText(product.name);
                await expect(itemDetailPage.price).toHaveText(`$${product.price}`)
                await expect(itemDetailPage.description).toHaveText(product.description);

                const imgSrc = await itemDetailPage.image.getAttribute('src');
                expect(imgSrc).toBe(product.imageUrl);
            })
        }
    }
})

test.describe('ItemDetails - Comportement selon le panier de l\'utilisateur', () => {
    for (const account of toTestAfterLogin) {
        test(`${account.username} - Le panier ne contient pas l'item, affichage du bouton "Add to cart"`, async ({page}) => {
            const product = products[4];
            const itemDetailPage = await setupItemDetailPage(page, account, product.id, [products[0].id]);

            await expect(itemDetailPage.addToCartButton).toBeVisible();
            await expect(itemDetailPage.removeFromCartButton).not.toBeVisible();
        });

        test(`${account.username} - Le panier contient déjà l'item, affichage du bouton "Remove"`, async ({page}) => {
            const product = products[4];
            const itemDetailPage = await setupItemDetailPage(page, account, product.id, [product.id]);

            await expect(itemDetailPage.addToCartButton).not.toBeVisible();
            await expect(itemDetailPage.removeFromCartButton).toBeVisible();
        });

        test(`${account.username} - ajout de l'item au panier`, async ({page}) => {
            const product = products[2];
            const itemDetailPage = await setupItemDetailPage(page, account, product.id);

            await itemDetailPage.addToCartButton.click();

            await expect(itemDetailPage.removeFromCartButton).toBeVisible();

            const cartContents = await page.evaluate(() => localStorage.getItem('cart-contents'))
            expect(JSON.parse(cartContents ?? '[]')).toEqual([product.id])
        });

        test(`${account.username} - retrait de l'item du panier`, async ({page}) => {
            const product = products[0];
            const itemDetailPage = await setupItemDetailPage(page, account, product.id, [product.id]);

            await itemDetailPage.removeFromCartButton.click();

            await expect(itemDetailPage.addToCartButton).toBeVisible();

            const cartContents = await page.evaluate(() => localStorage.getItem('cart-contents'))
            expect(JSON.parse(cartContents ?? '[]')).toEqual([])
        })
    }
})

test.describe('ItemDetails - Accès à un ID inconnu', () => {
    const unknownProduct = productsWithUnknown.find(p => p.id === -1)!;

    function normalize(text: string): string {
        return text.replace(/\s+/g, ' ').trim();
    }

    for (const account of toTestAfterLogin) {
        test(`${account.username} - affichage du titre "ITEM NOT FOUND"`, async ({page}) => {
            const itemDetailPage = await setupItemDetailPage(page, account, 'unknown');
            await expect(itemDetailPage.title).toHaveText(unknownProduct.name);
        })
        test(`${account.username} - affichage de l'illustration`, async ({page}) => {
            const itemDetailPage = await setupItemDetailPage(page, account, 'unknown');
            const imgSrc = await itemDetailPage.image.getAttribute('src');
            expect(imgSrc).toBe(unknownProduct.imageUrl);
        })
        test(`${account.username} - affichage du prix "$√-1"`, async ({page}) => {
            const itemDetailPage = await setupItemDetailPage(page, account, 'unknown');
            await expect(itemDetailPage.price).toContainText('-1');
        })
        test(`${account.username} - affichage de la description`, async ({page}) => {
            const itemDetailPage = await setupItemDetailPage(page, account, 'unknown');
            const actualText = await itemDetailPage.description.textContent();
            expect(normalize(actualText ?? '')).toBe(normalize(unknownProduct.description))
        })
        test(`${account.username} - ajouter l'item ne doit pas modifier le panier`, async ({page}) => {
            const itemDetailPage = await setupItemDetailPage(page, account, 'unknown', []);

            await itemDetailPage.addToCartButton.click();

            const cartContents = await page.evaluate(() => localStorage.getItem('cart-contents'))
            expect(JSON.parse(cartContents ?? '[]')).toEqual([])
        });
        test(`${account.username} - retirer l'item inconnu doit fonctionner`, async ({page}) => {
            const itemDetailPage = await setupItemDetailPage(page, account, -1, [-1]);

            await expect(itemDetailPage.removeFromCartButton).toBeVisible();
            await itemDetailPage.removeFromCartButton.click();

            const cartContents = await page.evaluate(() => localStorage.getItem('cart-contents'))
            expect(JSON.parse(cartContents ?? '[]')).toEqual([])
        })
    }
})

test.describe('ItemDetails - Navigation', () => {
    for (const account of toTestAfterLogin) {
        test(`${account.username} - "Back to products" redirige vers Inventory`, async ({page}) => {
            const product = products[2];
            const itemDetailPage = await setupItemDetailPage(page, account, product.id);

            await itemDetailPage.backToProducts();

            await expect(page).toHaveURL(/inventory/)
        })
    }
})
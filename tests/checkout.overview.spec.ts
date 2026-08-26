import {test, expect} from "@playwright/test";
import {CheckoutOverviewPage} from "../pages/CheckoutOverviewPage";
import {accounts_to_test_overview, setupOverviewCart} from "../fixtures/checkout";
import {standardUser} from "../fixtures/accounts";
import {products, TAX} from "../fixtures/products";
import {extractAmount} from "../utils/parsing";
import {getRandomNumber, getRandomPick} from "../utils/random_pick";


test.describe('Résumé de la commande - Affichage des items du panier', () => {
    test('affichage correct de 3 items distincts', async ({page}) => {
        const selectedProducts = [products[0], products[3], products[5]];
        await setupOverviewCart(page, standardUser, selectedProducts.map(p => p.id));

        const checkoutOverviewPage = new CheckoutOverviewPage(page);

        for (const product of selectedProducts) {
            const card = checkoutOverviewPage.getItemCard(product.name);

            await expect(checkoutOverviewPage.getItemPrice(card)).toHaveText(`$${product.price}`);
            await expect(checkoutOverviewPage.getItemDescription(card)).toHaveText(`${product.description}`);
            await expect(checkoutOverviewPage.getItemQuantity(card)).toHaveText('1');
        }
    })
})

test.describe('Résumé de la commande - Calculs des valeurs numériques', () => {
    const selectedProducts = [products[0], products[3], products[5]];
    test('sous-total, taxe et total corrects', async ({page}) => {
        await setupOverviewCart(page, standardUser, selectedProducts.map(p => p.id));

        const checkoutOverviewPage = new CheckoutOverviewPage(page);

        const expectedSubTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
        const subtotalText = await checkoutOverviewPage.subtotal.textContent();

        const expectedTax = expectedSubTotal * TAX;
        const taxText = await checkoutOverviewPage.tax.textContent();

        const expectedTotal = expectedSubTotal + expectedTax;
        const totalText = await checkoutOverviewPage.total.textContent();

        if (!subtotalText) throw new Error('Sous-total introuvable');
        if (!taxText) throw new Error('Taxe introuvable');
        if (!totalText) throw new Error('Total introuvable');

        expect(extractAmount(subtotalText)).toBeCloseTo(expectedSubTotal, 2);
        expect(extractAmount(taxText)).toBeCloseTo(expectedTax, 2);
        expect(extractAmount(totalText)).toBeCloseTo(expectedTotal, 2);
    })
})

test.describe('Résumé de la commande - Comportements spécifiques (manipulation de LocalStorage)', () => {
    test('item dupliqué affiche quantité > 1', async ({page}) => {
        const duplicatedProduct = products[4];
        await setupOverviewCart(page, standardUser, [duplicatedProduct.id, duplicatedProduct.id]);

        const checkoutOverviewPage = new CheckoutOverviewPage(page);
        const card = checkoutOverviewPage.getItemCard(duplicatedProduct.name);

        await expect(card).toHaveCount(1);

        const cardQuantity = checkoutOverviewPage.getItemQuantity(card.first());

        await expect(cardQuantity).toHaveText('2');
    })
})

test.describe('Résumé de la commande - Exactitude du calcul sur sélection aléatoire', () => {
    test('sous-total, taxe et total corrects avec sélection aléatoire', async ({page}) => {
        const count = getRandomNumber(1, products.length);
        const selectedProducts = getRandomPick(products, count);

        await setupOverviewCart(page, standardUser, selectedProducts.map(p => p.id));

        const checkoutOverviewPage = new CheckoutOverviewPage(page);

        const expectedSubTotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
        const subtotalText = await checkoutOverviewPage.subtotal.textContent();

        const expectedTax = expectedSubTotal * TAX;
        const taxText = await checkoutOverviewPage.tax.textContent();

        const expectedTotal = expectedSubTotal + expectedTax;
        const totalText = await checkoutOverviewPage.total.textContent();

        if (!subtotalText) throw new Error('Sous-total introuvable');
        if (!taxText) throw new Error('Taxe introuvable');
        if (!totalText) throw new Error('Total introuvable');

        expect(extractAmount(subtotalText)).toBeCloseTo(expectedSubTotal, 2);
        expect(extractAmount(taxText)).toBeCloseTo(expectedTax, 2);
        expect(extractAmount(totalText)).toBeCloseTo(expectedTotal, 2);
    })
})

test.describe('Résumé de commande - Navigation (Annuler / Confirmer)', () => {
    test('Annuler redirige vers Inventory sans vider le panier', async ({page}) => {
        const selectedProducts = [products[0], products[3], products[5]];
        await setupOverviewCart(page, standardUser, selectedProducts.map(p => p.id));

        const checkoutOverviewPage = new CheckoutOverviewPage(page);

        const cartBeforeCancel = await page.evaluate(() => localStorage.getItem('cart-contents'));

        await checkoutOverviewPage.cancelCheckout();
        await expect(page).toHaveURL(/inventory/);

        const cartAfterCancel = await page.evaluate(() => localStorage.getItem('cart-contents'));

        expect(cartAfterCancel).toBe(cartBeforeCancel);
    });

    for (const account of accounts_to_test_overview) {
        test(`${account.username} - 'Finish' redirige vers CheckoutComplete`, async ({page}) => {
            const selectedProducts = [products[0], products[3], products[5]];
            await setupOverviewCart(page, account, selectedProducts.map(p => p.id));

            const checkoutOverviewPage = new CheckoutOverviewPage(page);
            await checkoutOverviewPage.finishCheckout();

            await expect(page).toHaveURL(/checkout-complete/);
        })
    }
})

// ${selectedProducts.filter(item => item === product).length}
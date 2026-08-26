import {test, expect} from "@playwright/test";
import {CheckoutCompletePage} from "../pages/CheckoutCompletePage";
import {setupCompleteCart} from "../fixtures/checkout";
import {performanceGlitchUser, standardUser, visualUser} from "../fixtures/accounts";
import {products, TAX} from "../fixtures/products";
import {LoginPage} from "../pages/LoginPage";

test.describe('Finalisation d\'achat - Affichage de la confirmation', () => {
    test('le message de confirmation est affiché', async ({page}) => {
        await setupCompleteCart(page, standardUser);
        const checkoutCompletePage = new CheckoutCompletePage(page);

        await expect(checkoutCompletePage.completeHeader).toContainText("Thank you for your order");
        await expect(checkoutCompletePage.completeText).toContainText("Your order has been dispatched");
    });
});

test.describe('Finalisation d\'achat - Retour à l\'inventaire', () => {
    for (const account of [standardUser, performanceGlitchUser, visualUser]) {

        test(`${account.username} > le panier est vidé automatiquement`, async ({page}) => {
            await setupCompleteCart(page, account);
            const cartContents = await page.evaluate(() => localStorage.getItem("cart-contents"));

            expect(cartContents === null || cartContents === '[]').toBe(true);
        });

        test(`${account.username} > le retour à l\'inventaire se fait correctement`, async ({page}) => {
            await setupCompleteCart(page, account);
            const checkoutCompletePage = new CheckoutCompletePage(page);

            await checkoutCompletePage.backToProducts();

            await expect(page).toHaveURL(/inventory/);
        });
    }
});

test.describe('Finalisation d\'achat - Contenu de la facture (.pdf)', () => {
    test('le PDF contient les bonnes informations', async ({page}) => {
        const selectedProducts = [products[0], products[4]];
        const firstName = 'Abel';
        const lastName = 'Laroussi';
        const zipCode = '69140';

        await setupCompleteCart(page, standardUser, selectedProducts.map(p => p.id), firstName, lastName, zipCode);

        const checkoutCompletePage = new CheckoutCompletePage(page);
        const invoice = await checkoutCompletePage.downloadAndReadInvoice();

        expect(invoice.fullName).toBe(`${firstName} ${lastName}`);
        expect(invoice.zipCode).toBe(zipCode);

        const now = new Date();
        const diffMinutes = Math.abs(now.getTime() - invoice.orderDate.getTime()) / 60000;
        expect(diffMinutes).toBeLessThan(5);

        expect(invoice.items).toHaveLength(selectedProducts.length);
        for (const product of selectedProducts) {
            const item = invoice.items.find(i => i.name === product.name);
            expect(item).toBeDefined();
            expect(item?.price).toBeCloseTo(product.price, 2);
        }

        const expectedSubtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
        const expectedTax = expectedSubtotal * TAX;
        const expectedTotal = expectedSubtotal + expectedTax;

        expect(invoice.subtotal).toBeCloseTo(expectedSubtotal, 2);
        expect(invoice.tax).toBeCloseTo(expectedTax, 2);
        expect(invoice.total).toBeCloseTo(expectedTotal, 2);
    })
})

test.describe('Finalisation d\'achat - Accès à la page sans suivre le parcours', () => {
    test('L\'utilisateur ne peut pas télécharger une facture vide', async ({page}) => {
        await page.goto('/');
        const loginPage = new LoginPage(page);
        await loginPage.login(standardUser.username, standardUser.password);
        await page.goto('/checkout-complete.html');

        const checkoutCompletePage = new CheckoutCompletePage(page);
        await expect(checkoutCompletePage.generatePDFButton).not.toBeAttached();
    })
})
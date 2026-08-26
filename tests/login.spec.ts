import {test, expect} from "@playwright/test";
import {LoginPage} from "../pages/LoginPage";
import {accounts, lockedOutUser} from "../fixtures/accounts";

const unlockedAccounts = accounts.filter(acc => acc.id != 'lockedOut');

test.describe('Authentification - Réussie', () => {
    for (const account of unlockedAccounts) {
        test(`Connexion avec le compte ${account.id}`, async ({page}) => {
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(account.username, account.password);

            const cookies = await page.context().cookies();
            const authCookie = cookies.find(c => c.name === 'session-username');

            expect(authCookie).toBeDefined();
            expect(authCookie?.value).toBe(account.username);
        });
    }
});

test.describe('Authentification - Échouée (compte bloqué)', () => {
    test(`Connexion avec le compte ${lockedOutUser.id}`, async ({page}) => {
        test.info().annotations.push({
            type: 'note',
            description: 'BUG connu : le cookie session-username est créé malgré le blocage du compte'
        })
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(lockedOutUser.username, lockedOutUser.password);

        const errorMessage = await loginPage.getErrorMessage();

        const cookies = await page.context().cookies();
        const authCookie = cookies.find(c => c.name === 'session-username');

        expect(authCookie).toBeUndefined();
        expect(errorMessage).toMatch('this user has been locked out')
    });
});
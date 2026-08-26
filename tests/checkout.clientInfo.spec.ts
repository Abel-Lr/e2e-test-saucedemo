import {test, expect} from "@playwright/test";
import {CheckoutClientInfoPage} from "../pages/CheckoutClientInfoPage";
import {accounts_to_test, setupCheckoutCart} from "../fixtures/checkout";
import {standardUser} from "../fixtures/accounts";

type ValidationCase = {
    firstName: string,
    lastName: string,
    zipCode: string,
    expectedErrorKey: 'firstNameRequired' | 'lastNameRequired' | 'postalCodeRequired',
}

const fieldValidationCase: ValidationCase[] = [
    {firstName: '', lastName: '', zipCode: '', expectedErrorKey: 'firstNameRequired',},
    {firstName: '', lastName: '', zipCode: '69140', expectedErrorKey: 'firstNameRequired',},
    {firstName: '', lastName: 'Laroussi', zipCode: '', expectedErrorKey: 'firstNameRequired',},
    {firstName: '', lastName: 'Laroussi', zipCode: '69140', expectedErrorKey: 'firstNameRequired',},
    {firstName: 'Abel', lastName: '', zipCode: '', expectedErrorKey: 'lastNameRequired',},
    {firstName: 'Abel', lastName: '', zipCode: '69140', expectedErrorKey: 'lastNameRequired',},
    {firstName: 'Abel', lastName: 'Laroussi', zipCode: '', expectedErrorKey: 'postalCodeRequired',},
]

const errorMessages = {
    firstNameRequired: 'Error: First Name is required',
    lastNameRequired: 'Error: Last Name is required',
    postalCodeRequired: 'Error: Postal Code is required',
}

test.describe('Remplissage des informations client - Validation avec un ou des champs vides (standard_user)', () => {
    for (const testCase of fieldValidationCase) {
        test(`${testCase.expectedErrorKey} avec firstName${
                testCase.firstName.length > 0 ? "=\"" + testCase.firstName + "\"" : " vide"
            }, lastName${
                testCase.lastName.length > 0 ? "=\"" + testCase.lastName + "\"" : " vide"
            } et zipCode${
                testCase.zipCode.length > 0 ? "=\"" + testCase.zipCode + "\"" : " vide"
            }`,
            async ({page}) => {
                await setupCheckoutCart(page, standardUser);
                const checkoutClientInfoPage = new CheckoutClientInfoPage(page);

                await checkoutClientInfoPage.fillClientInfo(testCase.firstName, testCase.lastName, testCase.zipCode);
                await checkoutClientInfoPage.confirmClientInfo();

                const errorMessage = await checkoutClientInfoPage.getErrorMessage();
                expect(errorMessage).toBe(errorMessages[testCase.expectedErrorKey]);
            })
    }
})

test.describe('Remplissage des informations client - Validation croisée (tous comptes)', () => {
    const firstName = 'Abel';
    const lastName = 'Laroussi';
    const zipCode = '69140';
    for (const account of accounts_to_test) {
        test(`${account.username} - saisie et validation du formulaire opérationnelle`, async ({page}) => {
            await setupCheckoutCart(page, account);
            const checkoutClientInfoPage = new CheckoutClientInfoPage(page);

            await checkoutClientInfoPage.fillClientInfo(firstName, lastName, zipCode);

            await expect(checkoutClientInfoPage.firstName).toHaveValue(firstName);
            await expect(checkoutClientInfoPage.lastName).toHaveValue(lastName);
            await expect(checkoutClientInfoPage.zipCode).toHaveValue(zipCode);

            await checkoutClientInfoPage.confirmClientInfo();
            await expect(page).toHaveURL(/checkout-step-two/);
        })
    }
})

test.describe('Remplissage du code postal - Caractères numériques uniquement (standard_user)', () => {
    const firstName = 'Abel';
    const lastName = 'Laroussi';
    const invalidZipCodeCases = [
        {label: 'espaces', value: '  '},
        {label: 'caractères spéciaux', value: '@!*'},
        {label: 'lettres', value: 'azerty'}
    ]
    for (const testCase of invalidZipCodeCases) {
        test(`Rejet des ${testCase.label}`, async ({page}) => {
            await setupCheckoutCart(page, standardUser);
            const checkoutClientInfoPage = new CheckoutClientInfoPage(page);

            await checkoutClientInfoPage.fillClientInfo(firstName, lastName, testCase.value);
            await checkoutClientInfoPage.confirmClientInfo();

            await expect(page).not.toHaveURL(/checkout-step-two/);
        })
    }

    test('chiffres acceptés', async ({page}) => {
        await setupCheckoutCart(page, standardUser);
        const checkoutClientInfoPage = new CheckoutClientInfoPage(page);

        await checkoutClientInfoPage.fillClientInfo(firstName, lastName, '69140');
        await checkoutClientInfoPage.confirmClientInfo();

        await expect(page).toHaveURL(/checkout-step-two/);
    })
})
import {type Locator, type Page} from '@playwright/test';

import {PDFParse} from 'pdf-parse';
import {parsePdfInvoice} from "../utils/parsing";
import {PDFInvoiceContent} from "../fixtures/checkout";

export class CheckoutCompletePage {
    readonly page: Page;
    readonly completeHeader: Locator;
    readonly completeText: Locator;
    readonly backHomeButton: Locator;
    readonly generatePDFButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.completeHeader = page.locator('[data-test="complete-header"]');
        this.completeText = page.locator('[data-test="complete-text"]');
        this.backHomeButton = page.locator('#back-to-products');
        this.generatePDFButton = page.locator('#generate-pdf-order');
    }

    async backToProducts(): Promise<void> {
        await this.backHomeButton.click();
    }

    async downloadAndReadInvoice(): Promise<PDFInvoiceContent> {
        const downloadPromise = this.page.waitForEvent('download');
        await this.generatePDFButton.click();
        const download = await downloadPromise;

        const path = await download.path();
        if (!path) throw new Error('Le fichier PDF n\'a pas pu être téléchargé');

        const fs = await import('fs');
        const buffer = fs.readFileSync(path);

        const parser = new PDFParse({data: buffer});
        const result = await parser.getText();

        return parsePdfInvoice(result.text);
    }
}
// tests/pages/ImportPage.ts
import { type Locator, type Page, expect } from '@playwright/test';
import * as path from 'path';

export class ImportPage {
    readonly page: Page;

    // --- Locators ---
    readonly importMenuButton: Locator;
    readonly importContactsOption: Locator;
    readonly importOrganizationsOption: Locator;
    readonly visibleDragDropArea: Locator;
    readonly fileInput: Locator; // The actual <input type="file">
    readonly configureButton: Locator;
    readonly importSubmitButton: Locator;

    // Status/Feedback Locators
    readonly successStatusLocator: Locator; // Specific for success
    readonly errorStatusLocator_UploadFailed: Locator; // Specific for "Upload failed" error
    // Add other error locators if needed

    constructor(page: Page) {
        this.page = page;

        // --- Initialize Locators ---
        this.importMenuButton = page.getByRole('button', { name: 'Import' });
        this.importContactsOption = page.getByRole('menuitem', { name: 'Import Contacts' });
        this.importOrganizationsOption = page.getByRole('menuitem', { name: 'Import Organizations' });
        this.visibleDragDropArea = page.locator('div').filter({ hasText: /^Drag & drop your CSV file hereor click to select a file$/ }).first();
        this.fileInput = page.locator('input[type="file"]');
        this.configureButton = page.getByRole('button', { name: 'Configure' });
        this.importSubmitButton = page.getByRole('button', { name: 'Import CSV' });

        // Initialize Status Locators
        // Locator for success message (adjust regex if needed based on actual success text)
        this.successStatusLocator = page.locator("//div[@role='status']");

        // Specific locator based on previous error logs
        this.errorStatusLocator_UploadFailed = page.locator("//div[@role='status']");
    }

    // --- Actions ---

    /**
     * Navigates to the 'Import Contacts' page.
     */
    async gotoImportContacts(): Promise<void> {
        await this.importMenuButton.click();
        await this.importContactsOption.click();
        await expect(this.visibleDragDropArea, 'Visible drag & drop area should be loaded').toBeVisible({ timeout: 10000 });
    }

    /**
     * Navigates to the 'Import Organizations' page.
     */
    async gotoImportOrganizations(): Promise<void> {
        await this.importMenuButton.click();
        await this.importOrganizationsOption.click();
        await expect(this.visibleDragDropArea, 'Visible drag & drop area should be loaded').toBeVisible({ timeout: 10000 });
    }

    /**
     * Selects a file using the hidden input element and clicks Configure.
     * @param relativeFilePath - Path to the file relative to the 'tests/files' directory.
     */
    async selectFileAndConfigureContacts(relativeFilePath: string): Promise<void> {
        const absoluteFilePath = path.join(__dirname, '..', 'files', relativeFilePath);
        await this.fileInput.setInputFiles(absoluteFilePath);
        await this.page.waitForTimeout(1500);
        await this.configureButton.click({ timeout: 20000 });
        await expect(
            this.importSubmitButton,
            'Import CSV button should be visible after configuring'
        ).toBeVisible({ timeout: 20000 });
        // Selectează target list doar pentru contacte
        const targetListCombo = this.page.getByRole('combobox').filter({ hasText: 'Choose an option' });
        await targetListCombo.click();
        await this.page.getByText('Create New List').click();
    }

    async selectFileAndConfigureOrganizations(relativeFilePath: string): Promise<void> {
        const absoluteFilePath = path.join(__dirname, '..', 'files', relativeFilePath);
        await this.fileInput.setInputFiles(absoluteFilePath);
        await this.page.waitForTimeout(1500);
        await this.configureButton.click({ timeout: 20000 });
        await expect(
            this.importSubmitButton,
            'Import CSV button should be visible after configuring'
        ).toBeVisible({ timeout: 20000 });
        // Nu selecta target list pentru organizații
    }

    async submitImport(): Promise<void> {
        await this.importSubmitButton.click();
    }

    async selectRequiredColumnsForContacts(fields: string | string[]): Promise<void> {
        const fieldList = Array.isArray(fields) ? fields : [fields];
        for (const field of fieldList) {
            const locator = this.page.getByText(field).nth(2);
            if (await locator.isVisible()) {
                await locator.click();
            }
        }
    }

    async selectRequiredColumnsForOrganizations(fields: string | string[]): Promise<void> {
        const fieldList = Array.isArray(fields) ? fields : [fields];
        for (const field of fieldList) {
            const locator = this.page.getByText(field).nth(1);
            if (await locator.isVisible()) {
                await locator.click();
            }
        }
    }



    /**
     * Navigates to the 'Contacts' page.
     */
    async gotoContactsPage() {
        await this.page.goto('/en/crm/contacts');
        await expect(this.page.getByRole('heading', { name: /Contacts/i })).toBeVisible();
    }

    /**
     * Gets the count of contacts from the UI.
     */
    async getContactsCount(): Promise<number> {
        // Selector for the count at the bottom: "0 of 268 row(s) selected"
        const countText = await this.page.locator('.flex-1.text-muted-foreground.text-sm').innerText();
        // Extract the total number using regex (e.g., "0 of 268 row(s) selected")
        const match = countText.match(/of\s+(\d+)\s+row/);
        if (!match) throw new Error('Could not extract contacts count from: ' + countText);
        return parseInt(match[1], 10);
    }

    // Optionally, if you have a status or notification for import completion:
    /**
     * Waits for the import process to finish, checking for a completion message.
     */
    async waitForImportToFinish() {
        await expect(this.page.getByText(/Import completed|Contacts imported/i)).toBeVisible({ timeout: 60000 });
    }

    // --- Verifications ---

    /**
     * Checks if the SPECIFIC SUCCESS status message contains the expected text.
     * @param expectedTextFragment - A part of the text expected ONLY in the success message.
     */
    async expectSuccessStatusMessageContains(expectedTextFragment: string): Promise<void> {
        await expect(this.successStatusLocator, `Specific success message should be visible and contain "${expectedTextFragment}"`)
            .toContainText(expectedTextFragment, { timeout: 20000 }); // Generous timeout for processing
    }

    /**
     * Checks if the specific "Upload failed" error message is visible.
     */
    async expectUploadFailedErrorVisible(): Promise<void> {
        await expect(this.errorStatusLocator_UploadFailed, 'Error message "Upload failed" should be visible')
            .toBeVisible({ timeout: 10000 }); // Timeout for error message appearance
    }
    /**
     * Generic: Selects a file and clicks Configure (fără target list, pentru negative tests sau fallback)
     */
    async selectFileAndConfigure(relativeFilePath: string): Promise<void> {
        const absoluteFilePath = path.join(__dirname, '..', 'files', relativeFilePath);
        await this.fileInput.setInputFiles(absoluteFilePath);
        await this.page.waitForTimeout(1500);
        await this.configureButton.click({ timeout: 20000 });
        await expect(
            this.importSubmitButton,
            'Import CSV button should be visible after configuring'
        ).toBeVisible({ timeout: 20000 });
    }

    /**
     * Generic: Selects required columns by name (uses .getByText(field) and clicks first visible)
     */
    async selectRequiredColumns(fields: string | string[]): Promise<void> {
        const fieldList = Array.isArray(fields) ? fields : [fields];
        for (const field of fieldList) {
            const locator = this.page.getByText(field).first();
            if (await locator.isVisible()) {
                await locator.click();
            }
        }
    }
}

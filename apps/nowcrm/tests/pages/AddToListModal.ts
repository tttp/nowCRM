// contactsapp/tests/pages/AddToListModal.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class AddToListModal {
    readonly page: Page;
    // --- Locators ---
    readonly dialog: Locator;
    readonly createNewTab: Locator;
    readonly selectListTab: Locator;
    readonly listNameInput: Locator; // In Create New Tab
    readonly createListButton: Locator; // In Create New Tab
    readonly searchInput: Locator; // Corrected Placeholder
    readonly addToListButton: Locator; // Common

    constructor(page: Page) {
        this.page = page;
        this.dialog = page.getByRole('dialog', { name: 'Add contacts to list' }); // EXACT NAME
        this.createNewTab = this.dialog.getByRole('tab', { name: 'Create New' });
        this.selectListTab = this.dialog.getByRole('tab', { name: 'Select List' });
        // Create New
        this.listNameInput = this.dialog.getByRole('textbox', { name: 'List Name' });
        this.createListButton = this.dialog.getByRole('button', { name: 'Create List' });
        // Select List - Use exact placeholder from screenshot, scoped to dialog
        this.searchInput = this.dialog.getByPlaceholder('Search list...'); // <<< CORRECTED PLACEHOLDER
        // Common
        this.addToListButton = this.dialog.getByRole('button', { name: 'Add to list' });
    }

    // --- Methods ---
     async waitForDialogVisible() {
        await expect(this.dialog, '"Add contacts to list" dialog should appear').toBeVisible({ timeout: 10000 });
    }

    async createNewList(listName: string) {
        await this.createNewTab.click();
        await expect(this.listNameInput).toBeVisible();
        await this.listNameInput.fill(listName);
        await this.createListButton.click();
        await this.page.waitForTimeout(500); // Keep small delay
    }

    /** Corrected selectExistingList with correct placeholder and direct wait */
    async selectExistingList(listName: string) {
        await this.selectListTab.click();

        // Wait directly for the corrected search input locator to be visible AND enabled
        await expect(this.searchInput, 'Search input should be visible in Select List tab').toBeVisible({ timeout: 15000 });
        await expect(this.searchInput, 'Search input should be enabled in Select List tab').toBeEnabled({ timeout: 5000 });

        await this.searchInput.fill(listName);
        // Options are likely outside the dialog context, use page scope
        const listOption = this.page.getByRole('option', { name: listName });
        await expect(listOption, `List option "${listName}" should appear`).toBeVisible({ timeout: 10000 });
        await listOption.click();
    }

     async clickAddToList() {
        await this.addToListButton.click();
    }

     async expectAddToListStatusMessage(timeout: number = 20000) {
    const messageLocator = this.page.getByText(/The process of adding contacts to the list/i, { exact: false });
    await expect(messageLocator, '"Added to list" success message should appear').toBeVisible({ timeout });
}
}

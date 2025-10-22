// contactsapp/tests/pages/ListsPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object Model for the CRM Lists page, including list creation, filtering, editing, and deletion.
 * All actions and assertions are encapsulated here for clarity and maintainability.
 */
export class ListsPage {
    readonly page: Page;

    // --- Main Page Locators ---
    readonly createButton: Locator;
    readonly listsTable: Locator;
    readonly filterInput: Locator;

    // --- Create Dialog Locators ---
    readonly createDialog: Locator;
    readonly listNameInput: Locator;
    readonly dialogCreateListButton: Locator;

    // --- List Detail Page Locators ---
    readonly editTitleButton: Locator;
    readonly nameInputOnDetail: Locator;
    readonly saveButtonOnDetail: Locator;

    constructor(page: Page) {
        this.page = page;

        // Main Lists Page
        this.createButton = page.getByRole('button', { name: 'Create', exact: true });
        this.listsTable = page.locator('table');
        this.filterInput = page.getByRole('textbox', { name: 'Search List...' });

        // Create List Dialog
        this.createDialog = page.getByRole('dialog', { name: 'Create list' });
        this.listNameInput = this.createDialog.getByPlaceholder('Enter list name...');
        this.dialogCreateListButton = this.createDialog.getByRole('button', { name: 'Create List' });

        // List Detail Page (for editing)
        this.editTitleButton = page.getByRole('button', { name: 'Edit title' });
        this.nameInputOnDetail = page.locator('#name');
        this.saveButtonOnDetail = page.getByRole('button', { name: 'Save' });
    }

    /**
     * Navigates to the Lists page and waits for the page to be ready.
     */
    async goto() {
        await this.page.goto('/en/crm/lists');
        await expect(this.createButton, 'Create button should be visible on Lists page').toBeVisible({ timeout: 15000 });
    }

    /**
     * Opens the Create List dialog and waits for it to be ready.
     */
    async openCreateDialog() {
        await this.createButton.click();
        await expect(this.createDialog, 'Create List dialog should appear').toBeVisible({ timeout: 15000 });
        await expect(this.listNameInput, 'List Name input should be visible in dialog').toBeVisible();
    }

    /**
     * Fills in the list name and submits the Create List dialog.
     * @param listName The name of the list to create.
     */
    async fillAndSubmitCreateDialog(listName: string) {
        await this.listNameInput.fill(listName);
        await this.dialogCreateListButton.click();
    }

    /**
     * Filters the lists table by the given search term.
     * @param searchTerm The term to filter lists by.
     */
    async filterLists(searchTerm: string) {
        await expect(this.filterInput).toBeVisible();
        await this.filterInput.fill(searchTerm);
        await this.page.waitForTimeout(300); // Small delay for filter UI to update
    }

    /**
     * Navigates to the detail page for a specific list row.
     * @param rowLocator The locator for the list row.
     * @param listName The name of the list (for assertion).
     */
    async gotoDetailPageForRow(rowLocator: Locator, listName: string) {
        await expect(rowLocator, `Row for list "${listName}" should be visible`).toBeVisible();
        const linkLocator = rowLocator.getByRole('link', { name: listName });
        await expect(linkLocator, `Link "${listName}" should be visible in row`).toBeVisible({ timeout: 5000 });
        await linkLocator.click();
        await expect(this.page.getByRole('heading', { name: listName }), `Heading "${listName}" should be visible on detail page`)
            .toBeVisible({ timeout: 15000 });
    }

    /**
     * Clicks the Edit Title button on the detail page and waits for the input to appear.
     */
    async clickEditTitleAndWaitForInput() {
        await expect(this.editTitleButton).toBeVisible({ timeout: 5000 });
        await this.editTitleButton.click();
        await expect(this.nameInputOnDetail).toBeVisible({ timeout: 5000 });
    }

    /**
     * Fills in the new list name and saves the edit on the detail page.
     * @param updatedListName The new name for the list.
     */
    async fillAndSaveNameEdit(updatedListName: string) {
        await this.nameInputOnDetail.fill(updatedListName);
        await this.saveButtonOnDetail.click();
    }

    /**
     * Deletes a list using the delete button in the given row.
     * @param rowLocator The locator for the list row to delete.
     */
    async deleteListFromRow(rowLocator: Locator) {

        const menuButton = await rowLocator.locator('button[id^="radix-"]').first();
        await expect(menuButton, 'Menu button should be visible').toBeVisible();
        await menuButton.click();

        const deleteMenuItem = this.page.getByRole('menuitem', { name: 'Delete' });
        await expect(deleteMenuItem, 'Delete menu item should be visible').toBeVisible({ timeout: 5000 });
        await deleteMenuItem.click();

        const confirmMenuItem = this.page.getByRole('menuitem', { name: 'Confirm' });
        if (await confirmMenuItem.isVisible({ timeout: 2000 }).catch(() => false)) {
            await confirmMenuItem.click();
        }
    }

    /**
     * Asserts that a status message with the given text or RegExp is visible.
     * @param textOrRegExp The text or RegExp to match the status message.
     * @param timeout Optional timeout in ms (default: 30000).
     */
    async expectStatusMessage(textOrRegExp: string | RegExp, timeout: number = 30000) {
        const specificMessageLocator = this.page.getByText(textOrRegExp, { exact: textOrRegExp instanceof RegExp ? undefined : true });
        await expect(specificMessageLocator, `Status message "${textOrRegExp}" should be visible`)
            .toBeVisible({ timeout });
    }

    /**
     * Returns the locator for a row in the lists table by list name.
     * @param listName The name of the list.
     */
    getRowLocator(listName: string): Locator {
        return this.listsTable.locator('tbody tr').filter({ hasText: listName });
    }

    /**
     * Returns the locator for the delete button in a given row.
     * @param rowLocator The locator for the list row.
     */
    getDeleteButtonForRow(rowLocator: Locator): Locator {
        // Using nth(1) based on UI structure; adjust if button order changes.
        return rowLocator.getByRole('button').nth(1);
    }
}
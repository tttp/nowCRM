// contactsapp/tests/pages/ListCreateModal.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class ListCreateModal {
    readonly page: Page;

    // Locators
    readonly dialog: Locator;
    readonly listNameInput: Locator;
    readonly createListButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dialog = page.getByRole('dialog', { name: 'Create list' }); // From previous fix
        // Using accessible name from original failing test context
        this.listNameInput = this.dialog.getByRole('textbox', { name: 'Enter list name...' });
        this.createListButton = this.dialog.getByRole('button', { name: 'Create List' });
    }

    async waitForDialogVisible() {
        await expect(this.dialog, 'Create List dialog should appear').toBeVisible({ timeout: 15000 });
        // Wait specifically for the name input that caused the original failure
        await expect(this.listNameInput, 'List Name input should be visible in dialog').toBeVisible({ timeout: 10000 });
    }

    async fillAndSubmit(listName: string) {
        await this.listNameInput.fill(listName);
        await this.createListButton.click();
    }

     async expectCreationStatusMessage(listName: string, timeout: number = 20000) {
        const expectedMessage = `List ${listName} created`;
        const messageLocator = this.page.getByText(expectedMessage, { exact: true });
        await expect(messageLocator, `Status message "${expectedMessage}" should be visible`).toBeVisible({ timeout });
    }
}

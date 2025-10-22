// contactsapp/tests/pages/OrganizationCreateModal.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class OrganizationCreateModal {
    readonly page: Page;

    // Locators
    readonly dialog: Locator;
    readonly nameInput: Locator;
    readonly emailInput: Locator;
    readonly addressInput: Locator;
    readonly createButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Note: Adjust name if needed
        this.dialog = page.getByRole('dialog', { name: /Create organization/i });
        // Using name="name" from original failing test context
        this.nameInput = this.dialog.locator('input[name="name"]');
        this.emailInput = this.dialog.getByRole('textbox', { name: 'Email' });
        this.addressInput = this.dialog.getByRole('textbox', { name: 'Address Line' });
        this.createButton = this.dialog.getByRole('button', { name: 'Create' });
    }

    async waitForDialogVisible() {
        await expect(this.dialog, 'Create Organization dialog should appear').toBeVisible({ timeout: 15000 });
        // Wait specifically for the name input that caused the original failure
        await expect(this.nameInput, 'Organization Name input should be visible in dialog').toBeVisible({ timeout: 10000 });
    }

    async fillAndSubmit(data: { name: string, email: string, address: string }) {
        await this.nameInput.fill(data.name);
        await this.emailInput.fill(data.email);
        await this.addressInput.fill(data.address);
        await this.createButton.click();
    }

    async expectCreationStatusMessage(orgName: string, timeout: number = 20000) {
        const expectedMessage = `Organization ${orgName} created`;
        const messageLocator = this.page.getByText(expectedMessage, { exact: true });
        await expect(messageLocator, `Status message "${expectedMessage}" should be visible`).toBeVisible({ timeout });
    }
}

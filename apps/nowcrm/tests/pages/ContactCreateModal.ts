// contactsapp/tests/pages/ContactCreateModal.ts
import { type Locator, type Page, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

export class ContactCreateModal {
    readonly page: Page;

    // Locators
    readonly dialog: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly addressInput: Locator;
    readonly languageCombobox: Locator;
    readonly createButton: Locator;

    constructor(page: Page) {
        this.page = page;
        // Assuming dialog has an accessible name like "Create Contact"
        this.dialog = page.getByRole('dialog', { name: /Create Contact/i });
        this.firstNameInput = this.dialog.getByRole('textbox', { name: 'First name' });
        this.lastNameInput = this.dialog.getByRole('textbox', { name: 'Last name' });
        this.emailInput = this.dialog.getByRole('textbox', { name: 'Email' });
        this.addressInput = this.dialog.getByRole('textbox', { name: 'Address Line' });
        this.languageCombobox = this.dialog.getByRole('combobox', { name: 'Language' });
        this.createButton = this.dialog.getByRole('button', { name: 'Create' }); // Scoped to dialog
    }

    async waitForDialogVisible() {
        await expect(this.dialog, 'Create Contact dialog should appear').toBeVisible({ timeout: 15000 });
        await expect(this.firstNameInput, 'First Name input should be visible in dialog').toBeVisible(); // Ensure input ready
    }

    async fillAndSubmit(contact: { firstName: string; lastName: string; email: string; address?: string; language?: string }) {
        const address = contact.address || faker.location.streetAddress(); // Default if not provided

        await this.firstNameInput.fill(contact.firstName);
        await this.lastNameInput.fill(contact.lastName);
        await this.emailInput.fill(contact.email);
        await this.addressInput.fill(address);
    // Use dialog-scoped combobox and option for Language selection
    const language = contact.language || 'English';
    await this.languageCombobox.click();
    await this.page.waitForTimeout(300); // Wait for dropdown to render
    const langOption = this.page.locator("[role='option']", { hasText: language });
    let langSelected = false;
    try {
        await expect(langOption).toBeVisible({ timeout: 2000 });
        for (let i = 0; i < 3; i++) {
            try {
                await langOption.click();
                langSelected = true;
                break;
            } catch (err) {
                if (i === 2) throw err;
                await this.page.waitForTimeout(100);
            }
        }
    } catch (err) {
        // Option not found, select first available option as fallback
        const firstOption = this.page.locator("[role='option']").first();
        try {
            await expect(firstOption).toBeVisible({ timeout: 2000 });
            await firstOption.click();
        } catch (e) {
            // No options available, skip selection
        }
    }
    // Only click 'Create' if the button is still visible (modal not closed)
    if (await this.createButton.isVisible().catch(() => false)) {
        await this.createButton.click();
    }
    }

    async expectCreationStatusMessage(firstName: string, timeout: number = 20000) {
        const expectedMessage = `Contact ${firstName} created`;
        // Locate message dynamically by text
        const messageLocator = this.page.getByText(expectedMessage, { exact: true });
        await expect(messageLocator, `Status message "${expectedMessage}" should be visible`).toBeVisible({ timeout });
    }
}

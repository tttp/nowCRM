import { Page, expect } from '@playwright/test';

export class ContactsMassActionsPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Selects contacts by their full name in the contacts table.
     */
    async selectContacts(contactNames: string[]) {
        for (const name of contactNames) {
            await this.page.getByRole('row', { name: `Select row ${name}` }).getByLabel('Select row').click();
        }
    }

    /**
     * Subscribes selected contacts to the Email channel via mass action.
     */
    async subscribeContactsToEmail(contactNames: string[]) {
        await this.selectContacts(contactNames);
        await this.page.getByRole('button', { name: /^Mass Actions/ }).click();
        await this.page.getByRole('menuitem', { name: 'Update subscription' }).click();
        await this.page.getByRole('option', { name: 'Email' }).click();
        await this.page.getByRole('button', { name: 'Select Action' }).click();
        await this.page.getByRole('menuitem', { name: 'Subscribe', exact: true }).click();
        await this.page.getByRole('button', { name: 'Update subscription' }).click();
    }

    /**
     * Unsubscribes selected contacts from the Email channel via mass action.
     */
    async unsubscribeContactsFromEmail(contactNames: string[]) {
        await this.selectContacts(contactNames);
        await this.page.getByRole('button', { name: /^Mass Actions/ }).click();
        await this.page.getByRole('menuitem', { name: 'Update subscription' }).click();
        await this.page.getByRole('option', { name: 'Email' }).click();
        await this.page.getByRole('button', { name: 'Select Action' }).click();
        await this.page.getByRole('menuitem', { name: 'Unsubscribe', exact: true }).click();
        await this.page.getByRole('button', { name: 'Update subscription' }).click();
    }

    /**
     * Adds selected contacts to an existing list via mass action.
     * The list must already exist.
     * @param contactNames Array of contact full names.
     * @param listName Name of the existing list.
     */
    async addContactsToList(contactNames: string[], listName: string) {
        await this.selectContacts(contactNames);
        await this.page.getByRole('button', { name: /^Mass Actions/ }).click();
        await this.page.getByRole('menuitem', { name: 'Add to list' }).click();
        await this.page.getByRole('tab', { name: /Select List|Existing/i }).click();
        await this.page.getByPlaceholder('Search list...').fill(listName);
        await this.page.getByRole('option', { name: listName }).click();
        await this.page.getByRole('button', { name: 'Add to list' }).click();
        await expect(this.page.getByRole('status')).toContainText('The process of adding contacts to the list has started.');
    }

    /**
     * Deletes selected contacts via mass action.
     */
    async deleteContacts(contactNames: string[]) {
        await this.selectContacts(contactNames);
        await this.page.getByRole('button', { name: /^Mass Actions/ }).click();
        await this.page.getByRole('menuitem', { name: 'Delete' }).click();
        await this.page.getByRole('button', { name: 'Delete' }).click();
        await expect(this.page.getByText('The deletion process has started')).toBeVisible({ timeout: 10000 });
    }

    /**
     * Sends a composition to selected contacts via a specific channel.
     */
    async sendCompositionToContacts(
        contactNames: string[],
        channel: string,
        compositionName: string,
        identityName: string,
        shouldClickSend: boolean = true
    ) {
        await this.selectContacts(contactNames);
        await this.page.getByRole('button', { name: /^Mass Actions/ }).click();
        await this.page.getByRole('menuitem', { name: 'Send composition' }).click();
        await this.page.getByRole('option', { name: channel }).click();
        await this.page.getByPlaceholder('Search composition...').click();
        await this.page.getByPlaceholder('Search composition...').fill(compositionName);
        await this.page.getByRole('option', { name: compositionName }).click();
        await this.page.getByPlaceholder('Search identity...').click();
        await this.page.getByPlaceholder('Search identity...').fill(identityName);
        await this.page.getByRole('option', { name: identityName }).click();
        await this.page.getByRole('button', { name: 'Approve' }).click();
        if (shouldClickSend) {
            const sendButton = this.page.getByRole('button', { name: 'Send composition' });
            await expect(sendButton).toBeEnabled({ timeout: 5000 });
            await sendButton.click();
        }
    }

    /**
     * Anonymizes selected contacts via mass action.
     */
    async anonymizeContacts(contactNames: string[]) {
        await this.selectContacts(contactNames);
        await this.page.getByRole('button', { name: /^Mass Actions/ }).click();
        await this.page.getByRole('menuitem', { name: 'Anonymize' }).click();
        await this.page.getByRole('button', { name: 'Anonymize' }).click();
        await expect(this.page.getByRole('status')).toContainText(/anonym/i, { timeout: 15000 });
    }

    /**
     * Exports selected contacts and confirms export in dialog.
     */
    async exportContacts(contactNames: string[]) {
        await this.selectContacts(contactNames);
        await this.page.getByRole('button', { name: /^Mass Actions/ }).click();
        await this.page.getByRole('menuitem', { name: 'Export' }).click();
        await this.page.getByRole('button', { name: 'Export' }).click();
    }

    /**
     * Asserts that the email subscription toggle is active for a contact.
     */
    async assertEmailSubscriptionActive(contactFirstName: string) {
        await this.page.getByRole('link', { name: contactFirstName }).click();
        await this.page.getByRole('link', { name: 'Subscriptions', exact: true }).click();
        const toggle = this.page.getByRole('switch');
        await expect(toggle).toHaveAttribute('aria-checked', 'true');
    }

    /**
     * Asserts that the email subscription is inactive (no results) for a contact.
     */
    async assertEmailSubscriptionInactive(contactFirstName: string) {
        await this.page.getByRole('link', { name: contactFirstName }).click();
        await this.page.getByRole('link', { name: 'Subscriptions', exact: true }).click();
        await expect(this.page.getByRole('cell', { name: 'no results' })).toBeVisible();
    }

    /**
     * Updates a contact field for selected contacts via mass action.
     * @param contactNames Array of contact full names.
     * @param fieldName The field to update (e.g. 'First Name').
     * @param newValue The new value to set.
     */
    async updateContactsField(contactNames: string[], fieldName: string, newValue: string) {
        for (const name of contactNames) {
            await this.page.getByRole('row', { name: `Select row ${name}` }).getByLabel('Select row').click();
        }
        await this.page.getByRole('button', { name: /Mass Actions/ }).click();
        await this.page.getByRole('menuitem', { name: 'Update', exact: true }).click();
        await this.page.getByRole('combobox', { name: 'Field to Update' }).click();
        const option = this.page.getByRole('option', { name: fieldName, exact: true });
        await option.scrollIntoViewIfNeeded();
        await option.click();
            // Special handling for dropdowns: Language, Gender, Salutation
            if (["Language", "Gender", "Salutation"].includes(fieldName)) {
                await this.page.getByRole('combobox').filter({ hasText: 'Select value' }).click();
                const option = this.page.getByRole('option', { name: newValue, exact: true });
                await option.scrollIntoViewIfNeeded();
                await option.click();
                // Wait for Update button and status after update
                const updateBtn = this.page.getByRole('button', { name: 'Update' });
                await expect(updateBtn).toBeVisible({ timeout: 10000 });
                await updateBtn.click();
                // Wait for status or modal to close
                await this.page.waitForTimeout(500); // Small wait for UI update
                await expect(this.page.locator('tbody')).toBeVisible({ timeout: 10000 });
            } else if (fieldName === 'Birth Date') {
                // Match actual UI: click 'Pick a date', then 'Today', then 'Update'
                await this.page.getByRole('button', { name: 'Pick a date' }).click();
                await this.page.getByRole('button', { name: /Today/ }).click();
                await this.page.getByRole('button', { name: 'Update' }).click();
            } else {
                await this.page.getByRole('textbox', { name: 'New Value' }).click();
                await this.page.getByRole('textbox', { name: 'New Value' }).fill(newValue);
                await this.page.getByRole('button', { name: 'Update' }).click();
            }
    }
}
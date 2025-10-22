// contactsapp/tests/pages/FormsPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object Model for the CRM Forms list page and creation modal.
 * Encapsulates all actions and assertions for maintainable E2E tests.
 */
export class FormsPage {
    readonly page: Page;

    // --- Main Page Locators ---
    readonly createButton: Locator;
    readonly formsTable: Locator;
    readonly filterInput: Locator;

    // --- Create Form Dialog Locators ---
    readonly createDialog: Locator;
    readonly formNameInput: Locator;
    readonly createFormButton: Locator;

    // --- Mass Actions Locators ---
    readonly selectAllCheckbox: Locator;
    readonly massActionsButton: Locator;
    readonly deleteMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;

        // Main page
        this.createButton = page.getByRole('button', { name: 'Create', exact: true });
        this.formsTable = page.locator('table');
        this.filterInput = page.getByPlaceholder('Filter Forms...');

        // Create dialog
        this.createDialog = page.getByRole('dialog', { name: 'Create new Form' });
        this.formNameInput = this.createDialog.getByPlaceholder('Enter form name...');
        this.createFormButton = this.createDialog.getByRole('button', { name: 'Create Form' });

        // Mass actions
        this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' });
        this.massActionsButton = page.getByRole('button', { name: 'Mass Actions' });
        this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
    }

    /**
     * Navigates to the Forms page and waits for it to be ready.
     */
    async goto() {
        await this.page.goto('/en/crm/forms');
        await expect(this.createButton, 'Create button should be visible on Forms page').toBeVisible({ timeout: 15000 });
    }

    /**
     * Opens the Create Form dialog and waits for it to be ready.
     */
    async openCreateFormDialog() {
        await this.createButton.click();
        await expect(this.createDialog, 'Create Form dialog should appear').toBeVisible({ timeout: 10000 });
        await expect(this.formNameInput, 'Form Name input should be visible in dialog').toBeVisible();
    }

    /**
     * Fills in the form name and submits the Create Form dialog.
     * @param formName The name of the form to create.
     */
    async fillAndSubmitCreateForm(formName: string) {
        await this.formNameInput.fill(formName);
        await this.createFormButton.click();
    }

    /**
     * Filters the forms table by the given search term.
     * @param searchTerm The term to filter forms by.
     */
    async filterForms(searchTerm: string) {
        await expect(this.filterInput).toBeVisible();
        await this.filterInput.fill(searchTerm);
        await this.page.waitForTimeout(300); // Small delay for filter
    }

    /**
     * Selects all forms in the table using the select all checkbox.
     */
    async selectAllForms() {
        await expect(this.selectAllCheckbox, 'Select all checkbox should be visible').toBeVisible();
        await this.selectAllCheckbox.check();
    }

    /**
     * Performs a mass delete action using the mass actions menu.
     * Handles the delete menu item and confirmation if needed.
     */
    async performMassDeleteAction() {
        await this.massActionsButton.click();
        await expect(this.deleteMenuItem, 'Delete option should appear in Mass Actions menu').toBeVisible({ timeout: 5000 });
        await this.deleteMenuItem.click();
        // Add confirmation handling if needed
    }

    /**
     * Deletes a form using the delete button in the given row.
     * @param rowLocator The locator for the form row to delete.
     */
    async deleteFormFromRow(rowLocator: Locator) {
        const deleteButton = this.getDeleteButtonForRow(rowLocator);
        await expect(deleteButton, 'Delete button should be visible').toBeVisible();
        await deleteButton.click();
        const confirmMenuItem = this.page.getByRole('menuitem', { name: 'Confirm' });
        await expect(confirmMenuItem, 'Confirm delete menu item should appear').toBeVisible({ timeout: 5000 });
        await confirmMenuItem.click();
    }

    /**
     * Toggles the activation state of a form using the switch in the given row.
     * @param rowLocator The locator for the form row.
     */
    async toggleFormActivation(rowLocator: Locator) {
        const toggleSwitch = this.getSwitchForRow(rowLocator);
        await expect(toggleSwitch, 'Toggle switch should be visible').toBeVisible();
        await toggleSwitch.click();
    }

    /**
     * Asserts that a status message with the given text or RegExp is visible.
     * @param textOrRegExp The text or RegExp to match the status message.
     * @param timeout Optional timeout in ms (default: 10000).
     */
    async expectStatusMessage(textOrRegExp: string | RegExp, timeout: number = 10000) {
        const specificMessageLocator = this.page.getByText(textOrRegExp, { exact: textOrRegExp instanceof RegExp ? undefined : true });
        await expect(specificMessageLocator, `Status message "${textOrRegExp}" should be visible`)
            .toBeVisible({ timeout });
    }

    /**
     * Returns the locator for a row in the forms table by form name.
     * @param formName The name of the form.
     */
    getRowLocator(formName: string): Locator {
        return this.formsTable.locator('tbody tr').filter({ hasText: formName });
    }

    /**
     * Returns the locator for the delete button in a given row.
     * @param rowLocator The locator for the form row.
     */
    getDeleteButtonForRow(rowLocator: Locator): Locator {
        // Target the last button within the row's cells. Adjust if UI changes.
        return rowLocator.locator('td button').last();
    }

    /**
     * Returns the locator for the activation switch in a given row.
     * @param rowLocator The locator for the form row.
     */
    getSwitchForRow(rowLocator: Locator): Locator {
        return rowLocator.getByRole('switch');
    }

    /**
     * Opens a form for editing by clicking on its name in the forms list.
     * @param formName The exact name of the form to open.
     */
    async openFormByName(formName: string) {
        await this.page.locator(`//a[normalize-space()="${formName}"]`).click();
    }

    /**
     * Adds a field to the form by clicking on the field type in the left panel.
     * @param fieldLabel The visible label of the field type (e.g., "Text Area", "Checkbox").
     */
    async addFieldByLabel(fieldLabel: string) {
        await this.page.getByText(fieldLabel, { exact: true }).click();
    }

    /**
     * Checks if a field with the given label exists in the Form Fields area.
     * @param fieldLabel The label of the field to check.
     */
    getFormFieldByLabel(fieldLabel: string, type?: string): Locator {
        const name = type
            ? `Field: ${fieldLabel}, Type: ${type}`
            : `Field: ${fieldLabel}`;
        return this.page.getByRole('button', { name });
    }

    /**
     * Clicks the Save Form button.
     */
    async saveForm() {
        await this.page.getByRole('button', { name: 'Save Form' }).click();
    }

    /**
     * Adds a preset field to the form by clicking the button with a specific title.
     * @param fieldTitle The field title, e.g. "First Name", "Email"
     */
    async addPresetField(fieldTitle: string) {
        await this.page.locator(`//button[@title='Add ${fieldTitle} field']`).click();
    }

    /**
     * Enables the form view by toggling the "Enable Form View" checkbox.
     */
    async enableFormView() {
        await this.page.getByLabel('Enable Form View').check();
    }

    /**
     * Activates the form by toggling the "Active" switch.
     */
    async activateForm() {
        await this.page.getByRole('switch', { name: 'Active' }).check();
    }

    /**
     * Clicks the Save Form button.
     */
    async clickSaveForm() {
        await this.page.getByRole('button', { name: 'Save Form' }).click();
    }

    /**
     * Opens the preview of the form.
     */
    async openPreviewForm() {
        await this.page.getByRole('button', { name: 'Preview Form' }).click();
    }

    /**
     * Gets the public URL of the form after opening the preview.
     * Assumes that the preview opens in a new tab.
     */
    async getPublicFormUrl() {
        // Assumes preview opens a new tab, return its URL
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.openPreviewForm(),
        ]);
        await newPage.waitForLoadState();
        return newPage.url();
    }

    /**
     * Clicks a field in the Form Fields area to open its settings.
     * @param fieldLabel The label of the field (e.g., "First Name").
     * @param type Optional type of the field (e.g., "Text").
     */
    async clickOnFormField(fieldLabel: string, type: string = 'Text') {
        await this.page.getByRole('button', { name: `Field: ${fieldLabel}, Type: ${type}` }).click();
    }

    /**
     * Sets the label of the field in the field settings panel.
     * @param newLabel The new label to set.
     */
    async setFieldLabel(newLabel: string) {
        await this.page.getByLabel('Label').fill(newLabel);
    }

    /**
     * Sets the required property of the field in the field settings panel.
     * @param required Whether the field should be required.
     */
    async setFieldRequired(required: boolean = true) {
        const requiredCheckbox = this.page.getByLabel('Required');
        if (required) {
            await requiredCheckbox.check();
        } else {
            await requiredCheckbox.uncheck();
        }
    }

    /**
     * Clicks the "Field Settings" tab in the field settings panel.
     */
    async openFieldSettingsTab() {
        await this.page.getByRole('tab', { name: 'Field Settings' }).click();
    }

    /**
     * Duplicates a form using the duplicate button in the given row.
     * @param rowLocator The locator for the form row to duplicate.
     */
    async duplicateFormFromRow(rowLocator: Locator) {
        // Click the second button in the row (More actions)
        await rowLocator.getByRole('button').nth(1).click();
        await this.page.getByRole('menuitem', { name: 'Duplicate' }).click();
        await this.expectStatusMessage('Form duplicated');
    }
}

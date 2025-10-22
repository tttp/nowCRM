// contactsapp/tests/pages/OrganizationsPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object for the CRM Organizations list page, detail page, and modals.
 */
export class OrganizationsPage {
    readonly page: Page;

    // --- List Page Locators ---
    readonly createButton: Locator;
    readonly organizationsTable: Locator;
    readonly filterInput: Locator;

    // --- Create/Edit Dialog Locators ---
    readonly createDialog: Locator; // For creation
    readonly editDialog: Locator;   // For editing
    readonly nameInput: Locator;    // Generic name input within either dialog
    readonly emailInput: Locator;
    readonly addressInput: Locator;
    readonly contactPersonInput: Locator; // Specific to Edit dialog
    readonly tagInput: Locator;           // Specific to Edit dialog
    readonly descriptionInput: Locator;   // Specific to Edit dialog
    readonly dialogCreateButton: Locator; // Create button inside create dialog
    readonly dialogSaveChangesButton: Locator; // Save button inside edit dialog

    constructor(page: Page) {
        this.page = page;

        // List Page
        this.createButton = page.getByRole('button', { name: 'Create' });
        this.organizationsTable = page.locator('table'); // Adjust if needed
        this.filterInput = page.getByRole('textbox', { name: 'Search Organizations...' });

        // Dialogs
        // Note: Using RegExp to catch slight variations if needed, adjust if titles are exact
        this.createDialog = page.getByRole('dialog', { name: /Organization/i }).filter({ hasNotText: /Edit/i });
        this.editDialog = page.getByRole('dialog', { name: /Edit Organization Information/i });

        // Inputs (scoped to be safe, assuming name is common)
        // Note: If 'Name' differs between Create/Edit, create separate locators
        this.nameInput = page.getByRole('textbox', { name: 'Name' }); // Assumes visible dialog context
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.addressInput = page.getByRole('textbox', { name: 'Address Line' });
        this.contactPersonInput = page.getByRole('textbox', { name: 'Contact Person' });
        this.tagInput = page.getByRole('textbox', { name: 'Tag' });
        this.descriptionInput = page.getByRole('textbox', { name: 'Description' });

        // Dialog Buttons (scoped for safety)
        this.dialogCreateButton = this.createDialog.getByRole('button', { name: 'Create' });
        this.dialogSaveChangesButton = this.editDialog.getByRole('button', { name: 'Save changes' });
    }

    // --- Actions ---

    /**
     * Navigates directly to the CRM Organizations page.
     */
    async goto() {
        await this.page.goto('/en/crm/organizations');
        // Wait for the organizations table/list to appear
        await this.page.waitForSelector('table, .organization-row', { timeout: 15000 });
    }

    async createOrganization(name: string, city: string) {
        // Click 'Create' button to open modal
        await this.page.getByRole('button', { name: /^Create$/ }).click();
        // Wait for modal to appear
        await this.page.waitForSelector('text=Create Organization', { timeout: 5000 });
        // Generate unique email
        const uniqueEmail = `${name.toLowerCase()}_${Date.now()}@example.com`;
        // Fill all fields
        await this.page.getByLabel(/Name/i).fill(name);
        await this.page.getByLabel(/Email/i).fill(uniqueEmail);
        if (await this.page.getByLabel(/Address Line 1/i).isVisible()) {
            await this.page.getByLabel(/Address Line 1/i).fill('123 Main St');
        }
        if (await this.page.getByLabel(/Contact Person/i).isVisible()) {
            await this.page.getByLabel(/Contact Person/i).fill('John Doe');
        }
        if (await this.page.getByLabel(/Location/i).isVisible()) {
            await this.page.getByLabel(/Location/i).fill(city);
        }
        // Submit form
        await this.page.getByRole('button', { name: /^Create$/ }).click();
        // Wait for organization to appear in list
        await this.page.waitForSelector(`text=${name}`, { timeout: 10000 });
    }

        async openAdvancedFilters() {
            await this.page.getByRole('button', { name: 'Advanced Filters' }).click();
        }

        async resultsContain(text: string): Promise<boolean> {
            // Adjust selector as needed for your UI
            return await this.page.locator('.organization-row', { hasText: text }).count() > 0;
        }

        async isShowingAllResults(): Promise<boolean> {
            // Adjust logic for your UI
            const filterBadge = await this.page.locator('.filter-badge').count();
            return filterBadge === 0;
        }
    /**
     * Opens the Create Organization dialog and waits for it.
     */
    async openCreateDialog() {
        await this.createButton.click();
        await expect(this.createDialog, 'Create Organization dialog should appear').toBeVisible({ timeout: 15000 });
        await expect(this.nameInput.locator('visible=true'), 'Name input should be visible in create dialog').toBeVisible(); // Ensure input is ready
    }

    /**
     * Fills the create organization dialog and submits.
     */
    async fillAndSubmitCreateDialog(orgData: { name: string, email: string, address: string }) {
        await this.nameInput.fill(orgData.name);
        await this.emailInput.fill(orgData.email);
        await this.addressInput.fill(orgData.address);
        await this.dialogCreateButton.click();
    }

    /**
     * Navigates to the detail page for a specific organization row.
     */
    async gotoDetailPageForRow(rowLocator: Locator, orgName: string) {
        await expect(rowLocator, `Row for organization "${orgName}" should be visible`).toBeVisible();
        await rowLocator.getByRole('link', { name: orgName }).click();
        // Wait for heading on detail page
        await expect(this.page.getByRole('heading', { name: orgName }), `Heading "${orgName}" should be visible on detail page`).toBeVisible({ timeout: 15000 });
    }

    /**
     * Opens the Edit Organization dialog from the detail page.
     */
    async openEditDialogFromDetail() {
        // Locator based on original test file's logic
        await this.page.locator('div').filter({ hasText: /^Organization InformationEdit$/ }).getByRole('button', { name: 'Edit' }).click();
        await expect(this.editDialog, 'Edit Organization dialog should appear').toBeVisible({ timeout: 15000 });
        await expect(this.nameInput.locator('visible=true'), 'Name input should be visible in edit dialog').toBeVisible(); // Ensure input is ready
    }

    /**
     * Fills the edit organization dialog and submits.
     */
    async fillAndSubmitEditDialog(editData: { name: string, email: string, contactPerson: string, tag: string, description: string }) {
        await this.nameInput.fill(editData.name);
        await this.emailInput.fill(editData.email);
        await this.contactPersonInput.fill(editData.contactPerson);
        await this.tagInput.fill(editData.tag);
        await this.descriptionInput.fill(editData.description);
        await this.dialogSaveChangesButton.click();
    }

    /**
     * Filters the organizations list.
     */
    async filterOrganizations(searchTerm: string) {
        await expect(this.filterInput).toBeVisible();
        await this.filterInput.fill(searchTerm);
        await this.filterInput.press('Enter'); // Use Enter press as in original test
        await this.page.waitForTimeout(300); // Small delay for filter results
    }

    /**
     * Clicks the delete button for a specific row and confirms.
     */
    async deleteOrganizationFromRow(rowLocator: Locator) {

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

    // --- Assertion Helpers ---

    /**
     * Waits for and asserts that a status message with specific text is visible.
     */
    async expectStatusMessage(textOrRegExp: string | RegExp, timeout: number = 20000) {
        const specificMessageLocator = this.page.getByText(textOrRegExp, { exact: textOrRegExp instanceof RegExp ? undefined : true });
        await expect(specificMessageLocator, `Status message "${textOrRegExp}" should be visible`)
            .toBeVisible({ timeout });
    }

    // --- Row/Detail Helpers ---

    /**
     * Gets the locator for a specific organization row based on unique text (name or email).
     */
    getRowLocator(uniqueText: string): Locator {
        return this.organizationsTable.locator('tbody tr').filter({ hasText: uniqueText });
    }

    /**
     * Gets the delete button locator for a specific row.
     * Note: Using nth(1) based on original working test. This is fragile.
     */
    getDeleteButtonForRow(rowLocator: Locator): Locator {
        // Using nth(1) based on original test file - VERIFY THIS INDEX!
        return rowLocator.getByRole('button').nth(1); // <<<<< CHECK THIS INDEX/LOGIC!
    }

    /**
     * Verifies details are present on the main detail page area.
     */
    async expectDetailContainsText(text: string) {
        await expect(this.page.locator("(//div[@class='p-6 pt-0 space-y-4'])[1]")).toContainText(text);
    }
}

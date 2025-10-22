// contactsapp/tests/pages/JourneysPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object Model for the CRM Journeys page and creation modal.
 * Encapsulates all actions and assertions for maintainable E2E tests.
 */
export class JourneysPage {
    readonly page: Page;

    // --- Main Page Locators ---
    readonly createButton: Locator;
    readonly journeysTable: Locator;
    readonly filterInput: Locator;

    // --- Create Journey Dialog Locators ---
    readonly createDialog: Locator;
    readonly journeyNameInput: Locator;
    readonly createJourneyButton: Locator;

    // --- Mass Actions Locators ---
    readonly selectAllCheckbox: Locator;
    readonly massActionsButton: Locator;
    readonly deleteMenuItem: Locator;

    constructor(page: Page) {
        this.page = page;

        // Main page
        this.createButton = page.getByRole('button', { name: 'Create', exact: true });
        this.journeysTable = page.locator('table');
        this.filterInput = page.getByRole('textbox', { name: 'Search Journeys...' });

        // Create dialog
        this.createDialog = page.getByRole('dialog', { name: 'Create new Journey' });
        this.journeyNameInput = this.createDialog.getByPlaceholder('Enter journeys name...');
        this.createJourneyButton = this.createDialog.getByRole('button', { name: 'Create Journey' });

        // Mass actions
        this.selectAllCheckbox = page.getByRole('checkbox', { name: 'Select all' });
        this.massActionsButton = page.getByRole('button', { name: 'Mass Actions' });
        this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
    }

    /**
     * Navigates to the Journeys page and waits for it to be ready.
     */
    async goto() {
        await this.page.goto('/en/crm/journeys');
        await expect(this.createButton, 'Create button should be visible on Journeys page').toBeVisible({ timeout: 15000 });
    }

    /**
     * Opens the Create Journey dialog and waits for it to be ready.
     */
    async openCreateJourneyDialog() {
        await this.createButton.click();
        await expect(this.createDialog, 'Create Journey dialog should appear').toBeVisible({ timeout: 10000 });
        await expect(this.journeyNameInput, 'Journey Name input should be visible in dialog').toBeVisible();
    }

    /**
     * Fills in the journey name and submits the Create Journey dialog.
     * @param journeyName The name of the journey to create.
     */
    async fillAndSubmitCreateJourney(journeyName: string) {
        await this.journeyNameInput.fill(journeyName);
        await this.createJourneyButton.click();
    }

    /**
     * Filters the journeys table by the given search term.
     * @param searchTerm The term to filter journeys by.
     */
    async filterJourneys(searchTerm: string) {
        await expect(this.filterInput).toBeVisible();
        await this.filterInput.fill(searchTerm);
        await this.page.waitForTimeout(300); // Small delay for filter
    }

    /**
     * Selects all journeys in the table using the select all checkbox.
     */
    async selectAllJourneys() {
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
     * Deletes a journey using the delete button in the given row.
     * @param rowLocator The locator for the journey row to delete.
     */
    async deleteJourneyFromRow(rowLocator: Locator) {
    // Click the row's menu (kebab) button
    const menuButton = this.getDeleteButtonForRow(rowLocator);
    await expect(menuButton, 'Row menu button should be visible').toBeVisible();
    await menuButton.click();
    // Click the 'Delete' menu item
    const deleteMenuItem = this.page.getByRole('menuitem', { name: 'Delete' });
    await expect(deleteMenuItem, 'Delete menu item should appear').toBeVisible({ timeout: 5000 });
    await deleteMenuItem.click();
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
     * Returns the locator for a row in the journeys table by journey name.
     * @param journeyName The name of the journey.
     */
    getRowLocator(journeyName: string): Locator {
        return this.journeysTable.locator('tbody tr').filter({ hasText: journeyName });
    }

    /**
     * Returns the locator for the delete button in a given row.
     * @param rowLocator The locator for the journey row.
     */
    getDeleteButtonForRow(rowLocator: Locator): Locator {
    // Return the row's menu (kebab) button. Adjust selector if needed.
    // If only one button per row, use nth(0). If more, adjust as needed.
    return rowLocator.getByRole('button').first();
    }

    /**
     * Opens a journey by its name (clicks the row to navigate to its detail/canvas page).
     */
    async openJourneyByName(journeyName: string) {
        const row = this.getRowLocator(journeyName);
        await expect(row, 'Journey row should be visible').toBeVisible({ timeout: 10000 });
        // Click the journey name link inside the row
        const nameLink = row.getByRole('link', { name: journeyName });
        await expect(nameLink, 'Journey name link should be visible').toBeVisible({ timeout: 10000 });
        await nameLink.click();
        // Wait for the canvas/configure step to appear
        await expect(this.page.getByText('Select Node Type')).toBeVisible({ timeout: 10000 });
    }

    /**
     * Performs drag-and-drop from the Start connector to a target position to create a new step.
     */
    async dragFromStartConnector(offsetX: number = 200, offsetY: number = 0) {
        // Use the XPath you provided for the connector handle
        const startConnector = this.page.locator("//div[@class='react-flow__handle react-flow__handle-right nodrag nopan !h-3 !w-3 !bg-muted-foreground source connectable connectablestart connectableend connectionindicator']");
        await expect(startConnector).toBeVisible({ timeout: 5000 });
        const box = await startConnector.boundingBox();
        if (box) {
            await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
            await this.page.mouse.down();
            await this.page.mouse.move(box.x + offsetX, box.y + offsetY);
            await this.page.mouse.up();
        } else {
            throw new Error('Start connector bounding box not found');
        }
    }

    /**
     * Configures a step with the Email channel, composition, contact, and identity.
     * @param page The page object.
     * @param stepName The name of the step to configure.
     * @param uniqueTitle The unique title for the email composition.
     * @param testRecipient The test recipient email address.
     * @param identityName The identity to select for the step.
     */
    async configureStepWithEmail(page: Page, stepName: string, uniqueTitle: string, testRecipient: string, identityName: string) {
        await page.getByText(stepName).click();
        await page.getByPlaceholder('Search channel...').click();
        await page.getByRole('option', { name: 'Email' }).click();
        await page.getByPlaceholder('Search composition...').click();
        await page.getByPlaceholder('Search composition...').fill(uniqueTitle);
        await page.getByRole('option', { name: uniqueTitle }).click();
        await page.getByRole('button', { name: 'View contacts on the step' }).click();
        await page.getByRole('button', { name: 'Add contacts to step' }).click();
        await page.getByRole('tab', { name: 'Contact' }).click();
        await page.getByPlaceholder('Search contact...').click();
        await page.getByPlaceholder('Search contact...').fill(testRecipient);

        // Wait for the contact option to appear before clicking
        const contactOption = page.getByRole('option', { name: testRecipient });
        await expect(contactOption).toBeVisible({ timeout: 10000 });
        await contactOption.click();

        await page.getByRole('button', { name: 'Add contact to step' }).click();
        await expect(page.getByRole('heading', { name: 'Manage contacts on this step' })).toBeVisible({ timeout: 5000 });
        await page.getByRole('button', { name: 'Close' }).click();
        await expect(page.getByRole('heading', { name: 'Manage contacts on this step' })).not.toBeVisible({ timeout: 5000 });
        await page.getByText(stepName).click();
        await page.getByPlaceholder('Search identity...').click();
        await page.getByPlaceholder('Search identity...').fill(identityName);
        await page.getByRole('option', { name: identityName }).click();
    }

    /**
     * Adds a connection rule to the journey.
     * @param page The page object.
     * @param journeyName The name of the journey.
     */
    async addConnectionRule(page, journeyName: string) {
        await page.getByText('No conditions (click to configure)').click();
        await page.getByText('No conditions (click to configure)').click();
        await page.getByRole('button', { name: 'Add Rule' }).click();
        await page.getByRole('combobox').filter({ hasText: 'Form Completed' }).click();
        await page.getByRole('option', { name: 'Journey Finished' }).click();
        await page.getByRole('combobox').filter({ hasText: 'Equals' }).click();
        await page.getByRole('option', { name: 'Equals' }).click();
        await page.getByPlaceholder('Search select journey...').click();
        await page.getByPlaceholder('Search select journey...').fill(journeyName);
        await page.getByRole('option', { name: journeyName }).click();
        await page.getByRole('button', { name: 'Save Rules' }).click();
    }
}

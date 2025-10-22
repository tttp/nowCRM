import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object Model for the Composer page.
 * Provides methods and locators for all main composer actions and verifications.
 */
export class ComposerPage {

    readonly page: Page;
    readonly composerNavLink: Locator;
    readonly createNewButton: Locator;
    readonly composerTable: Locator;
    readonly composerTableBody: Locator;
    readonly nameLinkInRow: (identifier: string) => Locator;
    readonly rowMenuButtonInRow: (identifier: string) => Locator;
    readonly deleteMenuItem: Locator;
    readonly confirmDeleteButton: Locator;
    readonly step1Title: Locator;
    readonly generateButton: Locator;
    readonly step2Container: Locator;
    readonly generatingText: Locator;
    readonly nextChannelButton: Locator;
    readonly step3Heading: Locator;
    readonly smsChannelDiv: Locator;
    readonly smsTextarea: Locator;
    readonly nextButtonFromChannels: Locator;
    readonly step4FinalizeTitle: Locator;
    readonly step4Paragraph: Locator;
    readonly submitButton: Locator;
    readonly submittedMessage: Locator;
    readonly createNewAfterSubmitButton: Locator;
    readonly viewPageTitle: Locator;
    readonly editButton: Locator;
    readonly backButton: Locator;
    readonly viewTitleDisplay: Locator;
    readonly viewLanguageDisplay: Locator;
    readonly viewModelDisplay: Locator;
    readonly viewCategoryDisplay: Locator;
    readonly viewUnsubscribeDisplay: Locator;
    readonly subjectInputEdit: Locator;
    readonly titleInputEdit: Locator;
    readonly categoryInput: Locator;
    readonly languageDropdown: Locator;
    readonly personaInput: Locator;
    readonly unsubscribeCheckbox: Locator;
    readonly saveButton: Locator;
    readonly updateSuccessStatus: Locator;
    readonly deleteSuccessStatus: Locator;
    readonly createFromScratchButton: Locator;
    readonly modelDropdown: Locator;
    readonly modelOption: (modelName: string) => Locator;
    readonly searchInput: Locator;
    readonly referencePromptInput: Locator;
    readonly referenceResultInput: Locator;
    readonly addChannelButton: Locator;
    readonly addChannelModalEmailButton: Locator;
    readonly addChannelSuccessStatus: Locator;
    readonly emailChannelSidebarLink: Locator;
    readonly sendEmailButton: Locator;
    readonly emailRecipientInput: Locator;
    readonly sendEmailSuccessStatus: Locator;
    readonly sendEmailDialogButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.composerNavLink = page.getByRole('link', { name: 'Composer' });
        this.createNewButton = page.getByRole('link', { name: 'Create new' });
        this.composerTable = page.locator('table');
        this.composerTableBody = this.composerTable.locator('tbody');
        this.nameLinkInRow = (identifier: string) =>
            this.composerTableBody.locator('tr')
                .filter({ hasText: identifier })
                .first()
                .getByRole('link').filter({ hasText: identifier });
        this.rowMenuButtonInRow = (identifier: string) =>
            this.composerTableBody.locator('tr')
                .filter({ hasText: identifier })
                .first()
                .locator('button[id^="radix-"]');
        this.deleteMenuItem = page.getByRole('menuitem', { name: 'Delete' });
        this.confirmDeleteButton = page.getByRole('menuitem', { name: 'Confirm' });
        this.step1Title = page.locator('h2', { hasText: 'Step 1: Initial Data' });
        this.generateButton = page.getByRole('button', { name: 'Generate composition' });
        this.step2Container = page.getByRole('heading', { name: 'Step 2: Edit Generated Content' });
        this.generatingText = page.getByText('Generating your content...');
        this.nextChannelButton = page.getByRole('button', { name: 'Next: Channel Customizations' });
        this.step3Heading = page.getByRole('heading', { name: 'Step 3: Channel Customizations (Optional)' });
        this.smsChannelDiv = page.getByText('SMS');
        this.smsTextarea = page.locator('.flex.min-h-\\[80px\\].w-full.rounded-md.border.border-input.bg-background').first();
        this.nextButtonFromChannels = page.locator("//button[normalize-space()='Next: Finalize Composition']");
        this.step4FinalizeTitle = page.getByRole('heading', { name: 'Step 4: Finalize Composition' });
        this.step4Paragraph = page.getByRole('paragraph', { name: 'Your composition is ready to be processed.' });
        this.submitButton = page.getByRole('button', { name: 'Submit Composition' });
        this.submittedMessage = page.locator('h3', { hasText: 'Composition Submitted!' });
        this.createNewAfterSubmitButton = page.getByRole('button', { name: 'Create New Composition' });
        this.viewPageTitle = page.locator('h1');
        this.editButton = page.getByRole('button', { name: 'Edit' });
        this.backButton = page.getByRole('button', { name: 'Back' });
        this.viewTitleDisplay = page.locator('dt:has-text("Title") + dd');
        this.viewLanguageDisplay = page.locator('dt:has-text("Language") + dd');
        this.viewModelDisplay = page.locator('dt:has-text("Model") + dd');
        this.viewCategoryDisplay = page.locator('dt:has-text("Category") + dd');
        this.viewUnsubscribeDisplay = page.locator('dt:has-text(/^Add unsubscribe$/i) + dd');
        this.titleInputEdit = page.getByRole('textbox', { name: 'Title' });
        this.subjectInputEdit = page.getByRole('textbox', { name: 'Subject' });
        this.categoryInput = page.getByRole('textbox', { name: 'Category' });
        this.languageDropdown = page.getByRole('combobox').filter({ hasText: 'English' });
        this.personaInput = page.getByRole('textbox', { name: 'Persona' });
        this.unsubscribeCheckbox = page.locator('#unsubscribe');
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.updateSuccessStatus = page.getByRole('status');
        this.deleteSuccessStatus = page.getByRole('status');
        this.createFromScratchButton = page.getByRole('button', { name: 'Create from scratch' });
        this.modelDropdown = page.getByRole('combobox').filter({ hasText: 'Select Model' });
        this.modelOption = (modelName: string) => page.getByRole('option', { name: modelName });
        this.searchInput = page.getByRole('textbox', { name: 'Search Composer...' });
        this.referencePromptInput = page.getByRole('textbox', { name: 'Reference Prompt' });
        this.referenceResultInput = page.locator("//textarea[@id='reference_prompt']");
        this.addChannelButton = page.getByRole('button', { name: 'Add Channel', exact: true });
        this.addChannelModalEmailButton = page.getByRole('button', { name: 'Email', exact: true });
        this.addChannelSuccessStatus = page.getByText('Email channel added successfully');
        this.emailChannelSidebarLink = page.getByRole('link', { name: 'Email Not published' });
        this.sendEmailButton = page.getByRole('button', { name: 'Send email', exact: true });
        this.emailRecipientInput = page.getByPlaceholder('Enter contact email...');
        this.sendEmailSuccessStatus = page.getByText(/Messages sent successfully/i);
        this.sendEmailDialogButton = page.getByRole('button', { name: 'Send - Email', exact: true });
    }

    /**
     * Navigates to the Composer page and waits for the table to be visible.
     */
    async goto(): Promise<void> {
        await expect(this.composerNavLink).toBeVisible({ timeout: 20000 });
        await this.composerNavLink.click();
        await this.page.waitForURL(/\/crm\/composer$/, { timeout: 15000 });
        await expect(this.createNewButton).toBeVisible({ timeout: 15000 });
        await expect(this.composerTable).toBeVisible({ timeout: 15000 });
    }

    /**
     * Clicks the "Create new" button and waits for the initial step to be visible.
     */
    async clickCreateNew(): Promise<void> {
        await this.createNewButton.click();
        // Wait for navigation to the create page
        await this.page.waitForURL(/\/crm\/composer\/create$/, { timeout: 10000 });
        await expect(this.createFromScratchButton).toBeVisible({ timeout: 20000 });
    }

    /**
     * Selects a category by its name.
     */
    async selectCategory(categoryName: string): Promise<void> {
        const btn = this.page.getByText(categoryName, { exact: true });
        await expect(btn).toBeVisible({ timeout: 10000 });
        await btn.click();
        await expect(this.page.getByText('Product Launch')).toBeVisible({timeout: 5000});
    }

    /**
     * Selects a template by its name.
     */
    async selectTemplate(templateName: string): Promise<void> {
        const btn = this.page.getByText(templateName, { exact: true });
        await expect(btn).toBeVisible({ timeout: 10000 });
        await btn.click();
        await expect(this.titleInputEdit).toBeVisible({ timeout: 15000 });
    }

    /**
     * Clicks the "Generate composition" button.
     */
    async clickGenerate(): Promise<void> {
        await this.generateButton.click();
    }

    /**
     * Waits for the content generation to complete.
     */
    async waitForGenerationToComplete(): Promise<void> {
        await expect(this.generatingText).toBeVisible({ timeout: 10000 });
        await expect(this.generatingText).not.toBeVisible({ timeout: 120000 });
        await expect(this.step2Container).toContainText('Step 2: Edit Generated Content', { timeout: 10000 });
    }

    /**
     * Goes to the channel customizations step.
     */
    async goToChannelCustomizations(): Promise<void> {
        await this.nextChannelButton.click();
        await expect(this.step3Heading).toBeVisible({ timeout: 10000 });
    }

    /**
     * Selects the SMS channel and fills the prompt.
     */
    async selectSMSChannel(prompt: string): Promise<void> {
        await this.smsChannelDiv.click();
        await this.smsTextarea.click();
        await this.smsTextarea.fill(prompt);
    }

    /**
     * Goes to the finalize step.
     */
    async goToFinalizeStep(): Promise<void> {
        await this.nextButtonFromChannels.click();
        await expect(this.step4FinalizeTitle).toBeVisible({ timeout: 10000 });
    }

    /**
     * Submits the composition.
     */
    async submitComposition(): Promise<void> {
        await expect(this.submitButton).toBeVisible({ timeout: 10000 });
        await expect(this.submitButton).toBeEnabled({ timeout: 5000 });
        await this.submitButton.click();
        await expect(this.submittedMessage).toBeVisible({ timeout: 15000 });
    }

    /**
     * Opens the view page for a composition by its name.
     */
    async goToViewPageByName(identifier: string): Promise<void> {
        const nameLink = this.nameLinkInRow(identifier);
        await expect(this.composerTableBody.locator('tr').first()).toBeVisible({ timeout: 15000 });
        await expect(nameLink).toBeVisible({ timeout: 15000 });
        await nameLink.click();
        await expect(this.editButton).toBeVisible({ timeout: 10000 });
    }

    /**
     * Clicks the "Edit" button.
     */
    async clickEdit(): Promise<void> {
        await this.page.locator("//button[normalize-space()='Edit']").click();
    }

    /**
     * Clicks the "Save" button.
     */
    async clickSave(): Promise<void> {
        await this.page.getByRole('button', { name: 'Save' }).click();
    }

    /**
     * Edits the basic info fields of a composition.
     */
    async editBasicInfo(details: {
        title?: string; category?: string; language?: string;
        persona?: string; model?: string; referencePrompt?: string; referenceResult?: string; unsubscribe?: boolean;
    }): Promise<void> {
        if (details.title !== undefined) {
            await this.setTitleAndSubject(details.title); // fills both title and subject
        }
        if (details.category !== undefined) {
            await this.categoryInput.fill(details.category);
        }
        if (details.language !== undefined) {
            await this.languageDropdown.click();
            const optionLocator = this.page.getByRole('option', { name: details.language });
            await expect(optionLocator).toBeVisible({ timeout: 5000 });
            await optionLocator.click();
        }
        if (details.persona !== undefined) {
            await this.personaInput.fill(details.persona);
        }
        if (details.model !== undefined) {
            await this.modelDropdown.click();
            const modelOptionLocator = this.modelOption(details.model);
            await expect(modelOptionLocator).toBeVisible({ timeout: 5000 });
            await modelOptionLocator.click();
        }
        if (details.referencePrompt !== undefined) {
            await this.referencePromptInput.click();
            await this.referencePromptInput.fill(details.referencePrompt);
        }
        if (details.referenceResult !== undefined) {
            await this.referenceResultInput.click();
            await this.referenceResultInput.fill(details.referenceResult);
        }
        if (details.unsubscribe !== undefined) {
            await this.unsubscribeCheckbox.setChecked(details.unsubscribe);
        }
    }

    /**
     * Deletes a composition by its identifier.
     */
    async deleteComposition(identifier: string): Promise<void> {
        await this.page.reload({ waitUntil: 'networkidle', timeout: 10000 });
        const row = this.composerTableBody.locator('tr', { hasText: identifier }).first();
        const rowExists = await row.isVisible({ timeout: 5000 }).catch(() => false);
        if (!rowExists) {
            console.warn(`Row for "${identifier}" not found, skipping delete.`);
            return;
        }
        // Click the row menu button (kebab/menu)
        const menuButton = this.rowMenuButtonInRow(identifier);
        await expect(menuButton).toBeVisible({ timeout: 15000 });
        await menuButton.click();
        // Click the Delete menu item
        await expect(this.deleteMenuItem).toBeVisible({ timeout: 5000 });
        await this.deleteMenuItem.click();
        // Confirm delete if confirmation appears
        if (await this.confirmDeleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
            await this.confirmDeleteButton.click();
        }
    }

    /**
     * Expects the create success message to be visible.
     */
    async expectCreateSuccessMessageVisible(): Promise<void> {
         await expect(this.submittedMessage).toBeVisible({ timeout: 15000 });
    }

    /**
     * Expects the update success message to be visible.
     */
    async expectUpdateSuccessMessageVisible(): Promise<void> {
        await expect(this.updateSuccessStatus.first()).toBeVisible({ timeout: 10000 });
        await expect(this.updateSuccessStatus.first()).toContainText('Composition updated successfully');
    }

    /**
     * Expects the delete success message to be visible.
     */
    async expectDeleteSuccessMessageVisible(): Promise<void> {
        await expect(this.deleteSuccessStatus.first()).toBeVisible({ timeout: 10000 });
        await expect(this.deleteSuccessStatus.first()).toContainText('Composition deleted');
    }

    /**
     * Polls for a composition to appear in the list by its identifier.
     */
    async expectCompositionInList(compositionIdentifier: string): Promise<void> {
        const pollTimeout = 90000;
        const interval = 5000;
        console.log(`Polling for composition "${compositionIdentifier}" in list (timeout: ${pollTimeout}ms)`);
        await expect.poll(async () => {
            console.log(`Polling... reloading list page (networkidle).`);
            try {
                 await this.page.reload({ waitUntil: 'networkidle', timeout: interval - 500 });
            } catch (e) {
                 console.warn(`Reload inside poll failed or timed out, continuing check... Error: ${e}`);
            }
            await expect(this.composerTable).toBeVisible({timeout: 10000});
            const rowCount = await this.composerTableBody.locator('tr', { hasText: compositionIdentifier }).count();
            console.log(`Polling... found ${rowCount} rows for "${compositionIdentifier}"`);
            return rowCount > 0;
        }, {
            message: `Row containing "${compositionIdentifier}" did not appear in list within ${pollTimeout}ms`,
            timeout: pollTimeout,
            intervals: [interval, interval, interval*2, interval*2, interval*3]
        }).toBe(true);
        console.log(`Polling successful: Composition "${compositionIdentifier}" found in list.`);
        const rowLocator = this.composerTableBody.locator('tr', { hasText: compositionIdentifier }).first();
        await expect(rowLocator).toBeVisible({timeout: 1000});
    }

    /**
     * Gets the value of a detail field from the view page.
     */
    async getDetailFieldValue(fieldName: 'Title' | 'Language' | 'Model' | 'Category' | 'Unsubscribe'): Promise<string> {
        let value: string | null = '';
        let locator: Locator | null = null;
        try {
            switch (fieldName) {
                case 'Title': locator = this.viewTitleDisplay; break;
                case 'Language': locator = this.viewLanguageDisplay; break;
                case 'Model': locator = this.viewModelDisplay; break;
                case 'Category': locator = this.viewCategoryDisplay; break;
                case 'Unsubscribe': locator = this.viewUnsubscribeDisplay; break;
                default: throw new Error(`Unknown field name: ${fieldName}`);
            }
            if (!locator) { throw new Error(`Locator null for ${fieldName}`); }
            await expect(locator).toBeVisible({ timeout: 10000 });
            value = await locator.textContent();
        } catch (error) {
            console.error(`Error getting field ${fieldName}: ${error}`); value = null;
        }
        return (value ?? '').trim();
    }

    /**
     * Clicks the "Create from scratch" button and waits for the edit button to be visible.
     */
    async clickCreateFromScratch(): Promise<void> {
        await expect(this.createFromScratchButton).toBeVisible({ timeout: 10000 });
        await this.createFromScratchButton.click();
        await expect(this.editButton).toBeVisible({ timeout: 15000 });
    }

    /**
     * Fills all scratch composition details in the edit form.
     */
    async fillScratchDetails(details: {
        title: string; category: string; language: string; persona: string;
        model: string; referencePrompt: string; referenceResult: string;
        unsubscribe?: boolean;
    }): Promise<void> {
        await this.setTitleAndSubject(details.title); // fills both title and subject

        await this.categoryInput.fill(details.category);

        await this.languageDropdown.click();
        const optionLocator = this.page.getByRole('option', { name: details.language });
        await expect(optionLocator).toBeVisible({ timeout: 5000 });
        await optionLocator.click();

        await this.personaInput.fill(details.persona);

        await this.modelDropdown.click();
        const modelOptionLocator = this.modelOption(details.model);
        await expect(modelOptionLocator).toBeVisible({timeout: 5000});
        await modelOptionLocator.click();

        await this.referencePromptInput.click();
        await this.referencePromptInput.fill(details.referencePrompt);

        await this.referenceResultInput.click();
        await this.referenceResultInput.fill(details.referenceResult);

        if (details.unsubscribe !== undefined) {
            await this.unsubscribeCheckbox.setChecked(details.unsubscribe);
        }
    }

    /**
     * Searches for a composition using the search input.
     */
    async searchForComposition(searchTerm: string): Promise<void> {
        await expect(this.searchInput).toBeVisible({ timeout: 10000 });
        await this.searchInput.clear();
        await this.searchInput.fill(searchTerm);
        await this.page.waitForTimeout(500);
    }

    /**
     * Adds the Email channel to the composition.
     */
    async addEmailChannel(): Promise<void> {
        await expect(this.addChannelButton).toBeVisible({ timeout: 10000 });
        await this.addChannelButton.click();
        await expect(this.addChannelModalEmailButton).toBeVisible({ timeout: 5000 });
        await this.addChannelModalEmailButton.click();
    }

    /**
     * Expects the Email channel success message to be visible.
     */
    async expectAddChannelSuccessMessageVisible(): Promise<void> {
        await expect(this.addChannelSuccessStatus).toBeVisible({ timeout: 10000 });
    }

    /**
     * Expects the Email channel to appear in the sidebar.
     */
    async expectEmailChannelInSidebar(): Promise<void> {
        await expect(this.emailChannelSidebarLink).toBeVisible({ timeout: 10000 });
    }

    get useDefaultIdentityCheckbox() {
        // Select the checkbox for "Use default value" regardless of checked state
        return this.page.locator("//label[contains(., 'Use default value')]/preceding-sibling::button[@role='checkbox']");
    }

    /**
     * Fills the recipient and subject fields in the send email dialog.
     */
    async fillEmailRecipient(email: string, subject?: string): Promise<void> {
    await expect(this.emailRecipientInput).toBeVisible({ timeout: 10000 });
    await this.emailRecipientInput.fill(email);

    // Select the first identity option that starts with 'Test User <user-identity-' and ends with '@example.com>'
    await this.page.getByPlaceholder('Search identity...').click();
    const identityOption = this.page.getByRole('option', { name: /^Test User <user-identity-.*@example\.com>$/ });
    await identityOption.first().click();
    }

    /**
     * Clicks the "Send email" button.
     */
    async sendEmail(): Promise<void> {
        await expect(this.sendEmailButton).toBeVisible({ timeout: 10000 });
        await this.sendEmailButton.click();
    }

    /**
     * Expects the send email success message to be visible.
     */
    async expectSendEmailSuccessMessageVisible(): Promise<void> {
        await expect(this.sendEmailSuccessStatus).toBeVisible({ timeout: 15000 });
    }

    /**
     * Opens the send email dialog.
     */
    async openSendEmailDialog(): Promise<void> {
        await expect(this.sendEmailDialogButton).toBeVisible({ timeout: 10000 });
        await this.sendEmailDialogButton.click();
    }

    /**
     * Fills the result field in the email channel editor.
     */
    async fillResultField(resultText: string) {
        const resultBox = this.page.getByRole('textbox').filter({ hasText: '-' });
        await expect(resultBox).toBeVisible({ timeout: 10000 });
        await resultBox.click();
        await resultBox.fill(resultText);
    }

    /**
     * Opens the edit dialog for the Email channel (clicks the orange Edit button).
     */
    async editEmailChannel(): Promise<void> {
        const editButton = this.page.locator("//button[normalize-space()='Edit']");
        await editButton.waitFor({ state: 'visible', timeout: 10000 });
        await editButton.click();

        // Try multiple selectors for the editor textbox
        const textbox = this.page.locator("div[role='textbox']");
        const textarea = this.page.locator("textarea");
        try {
            await Promise.any([
                textbox.waitFor({ state: 'visible', timeout: 10000 }),
                textarea.waitFor({ state: 'visible', timeout: 10000 })
            ]);
        } catch (e) {
            console.error('Email channel editor did not appear after clicking Edit.', e);
            throw e;
        }
    }

    /**
     * Expects the "Contact has no subscription" error message to be visible.
     */
    async expectNoSubscriptionError(): Promise<void> {
        const errorMsg = this.page.getByText('Contact has no subscription', { exact: true });
        await expect(errorMsg).toBeVisible({ timeout: 25000 });
    }

    /**
     * Closes the  popup.
     */
    async closePopup(): Promise<void> {
        await this.page.getByRole('button', { name: 'Close' }).click();
    }

    /**
     * Clicks the "View Composition" button.
     */
    async clickViewComposition(): Promise<void> {
        await expect(this.page.getByRole('button', { name: 'View Composition' })).toBeVisible({ timeout: 10000 });
        await this.page.getByRole('button', { name: 'View Composition' }).click();
    }

    /**
     * Sets both the composition title and subject fields to the provided value.
     */
    async setTitleAndSubject(value: string) {
        const titleBox = this.page.getByRole('textbox', { name: 'Enter composition name...' });
        await titleBox.click();
        await titleBox.press('ControlOrMeta+a');
        await titleBox.fill(value);

        const subjectBox = this.page.getByRole('textbox', { name: 'Subject' });
        await subjectBox.click();
        await subjectBox.press('ControlOrMeta+a');
        await subjectBox.fill(value);
    }
}

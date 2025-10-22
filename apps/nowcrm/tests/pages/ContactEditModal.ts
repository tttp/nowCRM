// contactsapp/tests/pages/ContactEditModal.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class ContactEditModal {
    readonly page: Page;
    // --- Locators (Keep as defined previously) ---
    readonly dialog: Locator;
    readonly saveChangesButton: Locator;
    readonly salutationCombobox: Locator;
    readonly genderCombobox: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly phoneInput: Locator;
    readonly mobileInput: Locator;
    readonly languageCombobox: Locator;
    readonly address1Input: Locator;
    readonly address2Input: Locator;
    readonly locationInput: Locator;
    readonly cantonInput: Locator;
    readonly plzInput: Locator;
    readonly zipInput: Locator;
    readonly countryInput: Locator;
    readonly functionInput: Locator;
    readonly organizationSearchInput: Locator;
    readonly departmentSearchInput: Locator;
    readonly industrySearchInput: Locator;
    readonly websiteInput: Locator;
    readonly linkedInInput: Locator;
    readonly facebookInput: Locator;
    readonly twitterInput: Locator;
    readonly descriptionInput: Locator;


    constructor(page: Page) {
        this.page = page;
        this.dialog = page.getByRole('dialog');
        this.saveChangesButton = this.dialog.getByRole('button', { name: 'Save' });
        // Initialize other locators...
        this.salutationCombobox = this.dialog.getByRole('combobox', { name: 'Salutation' });
        this.genderCombobox = this.dialog.getByRole('combobox', { name: 'Gender' });
        this.firstNameInput = this.dialog.getByRole('textbox', { name: 'First Name' });
        this.lastNameInput = this.dialog.getByRole('textbox', { name: 'Last Name' });
        this.emailInput = this.dialog.getByRole('textbox', { name: 'Email' });
        this.phoneInput = this.dialog.getByRole('textbox', { name: 'Phone', exact: true });
        this.mobileInput = this.dialog.getByRole('textbox', { name: 'Mobile Phone' });
        this.languageCombobox = this.dialog.getByRole('combobox', { name: 'Language' });
        this.address1Input = this.dialog.getByRole('textbox', { name: 'Address line 1' });
        this.address2Input = this.dialog.getByRole('textbox', { name: 'Address line 2' });
        this.locationInput = this.dialog.getByRole('textbox', { name: 'Location' });
        this.cantonInput = this.dialog.getByRole('textbox', { name: 'Canton' });
        this.plzInput = this.dialog.getByRole('textbox', { name: 'PLZ' });
        this.zipInput = this.dialog.getByRole('textbox', { name: 'ZIP' });
        this.countryInput = this.dialog.getByRole('textbox', { name: 'Country' });
        this.functionInput = this.dialog.getByRole('textbox', { name: 'Function' });
        this.organizationSearchInput = this.dialog.getByPlaceholder('Search organization...');
        this.departmentSearchInput = this.dialog.getByPlaceholder('Search department...');
        this.industrySearchInput = this.dialog.getByPlaceholder('Search industry...');
        this.websiteInput = this.dialog.getByRole('textbox', { name: 'Website URL' });
        this.linkedInInput = this.dialog.getByRole('textbox', { name: 'LinkedIn URL' });
        this.facebookInput = this.dialog.getByRole('textbox', { name: 'Facebook URL' });
        this.twitterInput = this.dialog.getByRole('textbox', { name: 'Twitter (X) URL' });
        this.descriptionInput = this.dialog.getByRole('textbox', { name: 'Description' });
    }

    async waitForDialogVisible(expectedTitlePart: string | RegExp = /Edit/, timeout: number = 15000) {
        const dialog = this.page.getByRole('dialog');
        await expect(dialog, `Edit dialog should appear`).toBeVisible({ timeout });

        await expect(
            this.firstNameInput.or(this.address1Input).or(this.functionInput),
            'An input field should be visible in edit dialog'
        ).toBeVisible({ timeout: 10000 });
    }

    async fillPersonalSection(data: { salutation: string, genderLabel: string, firstName: string, lastName: string, email: string, phone: string, mobile: string, languageLabel: string }) {
        await this.salutationCombobox.click();
        await this.page.getByRole('option', { name: data.salutation, exact: true }).click();
        await this.genderCombobox.click();
        const genderOption = this.page.getByRole('option', { name: data.genderLabel, exact: true });
        await genderOption.focus();
        await genderOption.click();
        await this.firstNameInput.fill(data.firstName);
        await this.lastNameInput.fill(data.lastName);
        await this.emailInput.fill(data.email);
        await this.phoneInput.fill(data.phone);
        await this.mobileInput.fill(data.mobile);
        await this.languageCombobox.click();
        await this.page.getByRole('option', { name: data.languageLabel }).click();
    }


    async fillAddressSection(data: { address1?: string; address2?: string; location?: string; canton?: string; zip?: string; country?: string }) {
        const dialog = this.page.getByRole('dialog');
        if (data.address1) await dialog.getByRole('textbox', { name: 'Address Line 1' }).fill(data.address1);
        if (data.address2) await dialog.getByRole('textbox', { name: 'Address Line 2' }).fill(data.address2);
        if (data.location) await dialog.getByRole('textbox', { name: 'Location' }).fill(data.location);
        // Only try to fill canton if the combobox is enabled and not disabled
        if (data.canton) {
            const cantonCombo = dialog.getByText('Enter canton');
            if (!(await cantonCombo.isDisabled())) {
                await cantonCombo.fill(data.canton);
            }
        }
        if (data.zip) await dialog.getByRole('textbox', { name: 'ZIP' }).fill(data.zip);
        if (data.country) await dialog.getByRole('combobox', { name: 'Country' }).fill(data.country);
    }

    async fillProfessionalSection(data: { jobFunction: string, organizationName: string, department: string, industry: string, website: string, linkedIn: string, facebook: string, twitter: string, description: string }) {
        await this.functionInput.fill(data.jobFunction);
        // Org
        await expect(this.organizationSearchInput).toBeVisible({ timeout: 10000 });
        await expect(this.organizationSearchInput).toBeEnabled({ timeout: 5000 });
        await this.organizationSearchInput.fill(data.organizationName);
        const orgOption = this.page.getByRole('option', { name: data.organizationName });
        await expect(orgOption).toBeVisible({ timeout: 10000 });
        await orgOption.click();
        // Dept
        await this.departmentSearchInput.click();
        await expect(this.departmentSearchInput).toBeEnabled({ timeout: 5000 });
        await this.departmentSearchInput.fill(data.department);
        await this.page.waitForTimeout(500);
        const deptOption = this.page.getByRole('option', { name: data.department });
        await expect(deptOption).toBeVisible({ timeout: 15000 });
        await deptOption.click();
        // Industry
        await this.industrySearchInput.click();
        await expect(this.industrySearchInput).toBeEnabled({ timeout: 5000 });
        await this.industrySearchInput.fill(data.industry);
        await this.page.waitForTimeout(500);
        const industryOption = this.page.getByRole('option', { name: data.industry });
        await expect(industryOption).toBeVisible({ timeout: 20000 });
        await industryOption.click();
        // Others
        await this.websiteInput.fill(data.website);
        await this.linkedInInput.fill(data.linkedIn);
        await this.facebookInput.fill(data.facebook);
        await this.twitterInput.fill(data.twitter);
        await this.descriptionInput.fill(data.description);
    }

    async clickSaveChanges() {
        await this.saveChangesButton.click();
        await this.page.waitForTimeout(300); // Keep small delay
    }

    // --- Assertions ---
    /** Uses expect.poll to robustly check the LAST status message */
    async expectUpdateStatusMessage(timeout: number = 30000) {
        // Target the last element with role=status
        const lastStatusMessage = this.page.getByRole('status').last();

        // Use expect.poll to check for visibility and correct text content
        await expect.poll(async () => {
            const isVisible = await lastStatusMessage.isVisible();
            if (!isVisible) return 'not visible';
            const text = await lastStatusMessage.textContent();
            // Check if the text matches either the exact or the regex pattern
            return text === 'Contact updated' || /Contact .* updated/i.test(text || '');
        }, {
            message: 'The last status message should be visible and contain "...updated"',
            timeout: timeout,
            intervals: [500, 1000, 2000] // Retry intervals
        }).toBeTruthy(); // Check if the condition returned true
    }

     async expectAddressUpdateStatusMessage(timeout: number = 20000) {
         // Target the last element with role=status
        const lastStatusMessage = this.page.getByRole('status').last();

        await expect.poll(async () => {
            const isVisible = await lastStatusMessage.isVisible();
            if (!isVisible) return 'not visible';
            const text = await lastStatusMessage.textContent();
            // Check for the exact address update text
            return text === 'Contact address updated';
        }, {
            message: 'The last status message should be visible and read "Contact address updated"',
            timeout: timeout,
            intervals: [500, 1000, 2000]
        }).toBeTruthy();
    }
}

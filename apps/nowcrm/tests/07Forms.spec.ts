// contactsapp/tests/07Forms.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { FormsPage } from './pages/FormsPage';
import { loginUser } from './utils/authHelper';

/**
 * E2E tests for Forms Management using the FormsPage Page Object Model.
 * All actions and assertions are routed through the POM for clarity and maintainability.
 */
test.describe('Forms Management', () => {
    let formsPage: FormsPage;
    let uniqueFormName: string;

    test.beforeEach(async ({ page }) => {
        formsPage = new FormsPage(page);
        uniqueFormName = `TestForm_${faker.string.alphanumeric(8)}`;
        await loginUser(page);
        await formsPage.goto();
    });

    test('User can create a new form', async () => {
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        await expect(formsPage.getRowLocator(uniqueFormName), 'Newly created form row should be visible')
            .toBeVisible({ timeout: 10000 });
    });

    test('User can delete a form using row action', async () => {
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        const formRow = formsPage.getRowLocator(uniqueFormName);
        await expect(formRow, 'Form row to delete should be visible').toBeVisible();

        // Use the POM method for row deletion
        await formsPage.deleteFormFromRow(formRow);

        await formsPage.expectStatusMessage('Form deleted');
        await expect(formRow, 'Deleted form row should no longer be visible')
            .not.toBeVisible({ timeout: 10000 });
    });

    test('User can activate and deactivate a form', async () => {
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        const formRow = formsPage.getRowLocator(uniqueFormName);
        await expect(formRow, 'Form row to toggle should be visible').toBeVisible();

        // Use the POM method for toggling activation
        await formsPage.toggleFormActivation(formRow);
        await formsPage.expectStatusMessage('Form activated');

        await formsPage.toggleFormActivation(formRow);
        await formsPage.expectStatusMessage('Form deactivated');
    });

    test('User can delete forms using mass action', async () => {
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        const formRow = formsPage.getRowLocator(uniqueFormName);
        await expect(formRow, 'Form row to mass delete should be visible').toBeVisible();

        // Use the POM method for selecting all forms
        await formsPage.selectAllForms();
        await formsPage.performMassDeleteAction();

        await formsPage.expectStatusMessage('Forms deleted');
        await expect(formRow, 'Mass deleted form row should no longer be visible')
            .not.toBeVisible({ timeout: 10000 });
    });

    test('User can add multiple fields to a new form and save', async () => {
        const uniqueFormName = `TestForm_${Date.now()}`;

        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);

        const formRow = formsPage.getRowLocator(uniqueFormName);
        await expect(formRow).toBeVisible({ timeout: 10000 });

        await formsPage.openFormByName(uniqueFormName);

        // Add preset fields to the form
        await formsPage.addPresetField('First Name');
        await formsPage.addPresetField('Last Name');
        await formsPage.addPresetField('Email');
        await formsPage.addPresetField('Phone');
        await formsPage.addPresetField('Mobile Number');
        await formsPage.addPresetField('Organization');
        await formsPage.addPresetField('Function');
        await formsPage.addPresetField('Age');
        await formsPage.addPresetField('Website');
        await formsPage.addPresetField('Address Line 1');
        await formsPage.addPresetField('Location');
        await formsPage.addPresetField('ZIP');
        await formsPage.addPresetField('Short Bio');
        await formsPage.addPresetField('Subscribe to Newsletter');
        await formsPage.addPresetField('Gender');
        await formsPage.addPresetField('Language');
        await formsPage.addPresetField('Country');
        await formsPage.addPresetField('Preferred Contact Date');
        await formsPage.addPresetField('File');
        await formsPage.addPresetField('Resume');
        await formsPage.addPresetField('Text');
        await formsPage.addPresetField('Number');
        await formsPage.addPresetField('Text Area');
        await formsPage.addPresetField('Checkbox');
        await formsPage.addPresetField('Dropdown');
        await formsPage.addPresetField('Date');

        await formsPage.saveForm();
        await formsPage.expectStatusMessage('Form saved!');

        // Verify the fields are present in the Form Fields area
        await expect(formsPage.getFormFieldByLabel('First Name', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Last Name', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Email', 'Email')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Phone', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Mobile Number', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Organization', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Function', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Age', 'Number')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Website', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Address Line 1', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Location', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('ZIP', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Short Bio', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Subscribe to', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Gender', 'Radio')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Language', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Country', 'Dropdown')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Preferred Contact Date')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('File', 'File')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Resume', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Text', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Number', 'Number')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Text Area', 'Text')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Checkbox', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Dropdown', '')).toBeVisible();
        await expect(formsPage.getFormFieldByLabel('Date', 'Date')).toBeVisible();
    });

    test('User can submit a public form and data is saved', async ({ page, context }) => {
        const formsPage = new FormsPage(page);
        const uniqueFormName = `TestForm_${Date.now()}`;

        // Create a new form
        await formsPage.openCreateFormDialog();
        await formsPage.fillAndSubmitCreateForm(uniqueFormName);
        await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
        await formsPage.openFormByName(uniqueFormName);

        // Add fields
        await formsPage.addPresetField('First Name');
        await formsPage.addPresetField('Email');

        // Enable vertical view and activate the form
        await formsPage.enableFormView();
        await formsPage.activateForm();

        // Save the form
        await formsPage.clickSaveForm();
        await formsPage.expectStatusMessage('Form saved!');

        // Open public form in a new tab
        const [publicFormPage] = await Promise.all([
            context.waitForEvent('page'),
            formsPage.openPreviewForm(),
        ]);
        await publicFormPage.waitForLoadState();

        // Fill and submit the public form
        await publicFormPage.getByLabel('First Name').fill('John');
        await publicFormPage.getByLabel('Email').fill('john@example.com');
        await publicFormPage.getByRole('button', { name: 'Submit' }).click();


        await expect(publicFormPage.getByText('Success!')).toBeVisible();
    });

    test('User cannot submit a public form with required fields empty', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;

    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    await formsPage.addPresetField('First Name');
    await formsPage.clickOnFormField('First Name');
    await formsPage.openFieldSettingsTab();
    await formsPage.setFieldLabel('Your First Name');
    await formsPage.setFieldRequired(true);
    await formsPage.activateForm();
    await formsPage.saveForm();
    await formsPage.expectStatusMessage('Form saved!');

    await expect(formsPage.getFormFieldByLabel('Your First Name', 'Text')).toBeVisible();

    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    // Do not fill the required field, just click "Review"
    await publicFormPage.getByRole('button', { name: 'Review' }).click();

    // Assert that the required validation message is visible
    await expect(publicFormPage.getByText('Required')).toBeVisible();
});

test('User can submit all fields in a public form and data is saved', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;

    // Create a new form
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    // Add a variety of fields
    await formsPage.addPresetField('First Name');
    await formsPage.addPresetField('Last Name');
    await formsPage.addPresetField('Email');
    await formsPage.addPresetField('Phone');
    await formsPage.addPresetField('Age');
    await formsPage.addPresetField('Gender');
    await formsPage.addPresetField('Country');

    // Enable form view, activate, and save
    await formsPage.enableFormView();
    await formsPage.activateForm();
    await formsPage.saveForm();
    await formsPage.expectStatusMessage('Form saved!');

    // Open public form in a new tab
    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    // Fill all fields
    // Fill text/number fields
    await publicFormPage.getByLabel('First Name').fill('Alice');
    await publicFormPage.getByLabel('Last Name').fill('Smith');
    await publicFormPage.getByLabel('Email').fill('alice@example.com');
    await publicFormPage.getByLabel('Phone').fill('1234567890');
    await publicFormPage.getByLabel('Age').fill('30');

    // Select Gender (radio)
    await publicFormPage.getByText('Gender').click();
    await publicFormPage.getByRole('radio', { name: 'Option 1' }).click();

    // Select Country (dropdown)
    await publicFormPage.getByText('Country').click();
    await publicFormPage.getByRole('option', { name: 'Option 1' }).click();

    // Submit
    await publicFormPage.getByRole('button', { name: 'Submit' }).click();

    // Assert success
    await expect(publicFormPage.getByText('Success!')).toBeVisible();
});

test('User can edit a field in a form and see changes in public form', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    await formsPage.addPresetField('First Name');
    await formsPage.clickOnFormField('First Name');
    await formsPage.openFieldSettingsTab();
    await formsPage.setFieldLabel('Given Name');
    await formsPage.activateForm(); // <-- Add this line
    await formsPage.saveForm();
    await formsPage.expectStatusMessage('Form saved!');

    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    await expect(publicFormPage.getByRole('heading', { name: 'Given Name' })).toBeVisible();
});

test('User can delete a field from a form and it is not visible in the public form', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;

    // Create and open form
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    // Add fields
    await formsPage.addPresetField('First Name');
    await formsPage.addPresetField('Email');

    // Delete "Email" field
    await formsPage.clickOnFormField('Email', 'Email');
    await page.getByRole('button', { name: 'Delete field Email' }).click();

    // Save and activate
    await formsPage.activateForm();
    await formsPage.saveForm();
    await formsPage.expectStatusMessage('Form saved!');

    // Preview public form
    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    // Assert "First Name" is visible, "Email" is not
    await expect(publicFormPage.getByRole('heading', { name: 'First Name' })).toBeVisible();
    await expect(publicFormPage.getByLabel('Email')).toHaveCount(0);
});

test('User can duplicate a form and all fields are copied', async ({ page }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;

    // Create and open form
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    // Add fields
    await formsPage.addPresetField('First Name');
    await formsPage.addPresetField('Email');
    await formsPage.saveForm();
    await formsPage.expectStatusMessage('Form saved!');

    // Duplicate the form
    await formsPage.goto();
    const formRow = formsPage.getRowLocator(uniqueFormName);
    await formsPage.duplicateFormFromRow(formRow);

    // Use the correct duplicated form name
    const duplicatedFormName = `${uniqueFormName} (Copy)`;
    const duplicatedFormRow = formsPage.getRowLocator(duplicatedFormName);
    await expect(duplicatedFormRow).toBeVisible({ timeout: 10000 });

    // Open the duplicated form and check fields
    await formsPage.openFormByName(duplicatedFormName);
    await expect(formsPage.getFormFieldByLabel('First Name', 'Text')).toBeVisible();
    await expect(formsPage.getFormFieldByLabel('Email', 'Email')).toBeVisible();
});

test('User can set a custom submit success message and see it after submitting the public form', async ({ page, context }) => {
    const formsPage = new FormsPage(page);
    const uniqueFormName = `TestForm_${Date.now()}`;
    const customSuccessMessage = 'Thank you for your submission! This is a custom success message.';

    // 1. Create the form and add a few fields
    await formsPage.openCreateFormDialog();
    await formsPage.fillAndSubmitCreateForm(uniqueFormName);
    await formsPage.expectStatusMessage(`Form ${uniqueFormName} created`);
    await formsPage.openFormByName(uniqueFormName);

    await formsPage.addPresetField('First Name');
    await formsPage.addPresetField('Email');

    // 2. Set the custom submit success message
    await page.getByRole('textbox', { name: 'Message displayed after form' }).fill(customSuccessMessage);

    // 3. Activate and save the form
    await formsPage.enableFormView();
    await formsPage.activateForm();
    await formsPage.saveForm();
    await formsPage.expectStatusMessage('Form saved!');

    // 4. Open the public form and submit valid data
    const [publicFormPage] = await Promise.all([
        context.waitForEvent('page'),
        formsPage.openPreviewForm(),
    ]);
    await publicFormPage.waitForLoadState();

    await publicFormPage.getByLabel('First Name').fill('Test');
    await publicFormPage.getByLabel('Email').fill('test@example.com');
    await publicFormPage.getByRole('button', { name: 'Submit' }).click();

    // 5. Assert that the custom success message is visible on the success page
    await expect(publicFormPage.getByText(customSuccessMessage)).toBeVisible();
});
});



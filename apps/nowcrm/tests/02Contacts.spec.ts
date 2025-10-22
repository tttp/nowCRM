// contactsapp/tests/02Contacts.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

// Import ALL necessary POMs
import { ContactsListPage } from './pages/ContactsListPage';
import { ContactCreateModal } from './pages/ContactCreateModal';
import { ContactDetailPage } from './pages/ContactDetailPage';
import { ContactEditModal } from './pages/ContactEditModal';
import { OrganizationCreateModal } from './pages/OrganizationCreateModal';
import { ListCreateModal } from './pages/ListCreateModal';
import { AddToListModal } from './pages/AddToListModal';
import { ListsPage } from './pages/ListsPage';

import { loginUser } from './utils/authHelper';

test.describe('Contact Management', () => {
    let contactsListPage: ContactsListPage;
    let contactCreateModal: ContactCreateModal;
    let contactDetailPage: ContactDetailPage;
    let contactEditModal: ContactEditModal;
    let organizationCreateModal: OrganizationCreateModal;
    let listCreateModal: ListCreateModal;
    let addToListModal: AddToListModal;

    // Helper function remains the same
    async function createContactViaUI(data: { firstName: string; lastName: string; email: string; address?: string; language?: string }) {
        await contactsListPage.clickCreateButton();
        await contactCreateModal.waitForDialogVisible();
        await contactCreateModal.fillAndSubmit(data);
        await contactCreateModal.expectCreationStatusMessage(data.firstName);
        if (!contactsListPage.page.url().includes('/crm/contacts')) {
             console.log('Navigating back to contacts list after creation...');
             await contactsListPage.goto();
        }
        await expect(contactsListPage.getRowLocator(data.email), 'Contact row should appear in list after creation')
             .toBeVisible({timeout: 10000});
    }

    test.beforeEach(async ({ page }) => {
        // Initialization remains the same
        contactsListPage = new ContactsListPage(page);
        contactCreateModal = new ContactCreateModal(page);
        contactDetailPage = new ContactDetailPage(page);
        contactEditModal = new ContactEditModal(page);
        addToListModal = new AddToListModal(page);
        await loginUser(page);
        await contactsListPage.goto();
    });

    // --- All tests remain the same as the previous version ---
     test('User can create a new contact', async () => {
        const contact = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `create.${faker.string.alphanumeric(5)}.test.pw` }), address: faker.location.streetAddress(), language: 'English' };
        await createContactViaUI(contact);
        const contactRow = contactsListPage.getRowLocator(contact.email);
        await expect(contactRow, 'Contact row should contain correct email').toContainText(contact.email);
        await expect(contactRow, 'Contact row should contain correct first name').toContainText(contact.firstName);
    });
    test('User can edit basic contact details (personal information)', async () => {
        const original = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `edit-pers.${faker.string.alphanumeric(5)}.test.pw` }) };
        await createContactViaUI(original);
        const updated = { firstName: `${original.firstName}_edited`, lastName: `${original.lastName}_edited`, email: `edited.${original.email}`, phone: faker.phone.number('##########'), mobile: faker.phone.number('##########'), languageLabel: 'Italian', salutation: 'Mr', genderLabel: 'Male', };
        const updatedFullName = `${updated.firstName} ${updated.lastName}`;
        const originalRow = contactsListPage.getRowLocator(original.email);
        await contactsListPage.getLinkForRow(originalRow, original.firstName).click();
        await contactDetailPage.expectHeadingVisible(`${original.firstName} ${original.lastName}`);
        await contactDetailPage.clickEditButton('Personal Information');
        await contactEditModal.waitForDialogVisible(/Edit Personal Information/i);
        await contactEditModal.fillPersonalSection(updated);
        await contactEditModal.clickSaveChanges(); // Includes delay now
        await contactEditModal.expectUpdateStatusMessage(); // Uses corrected POM method
        await contactDetailPage.expectDetailContainsText(`${updated.salutation} ${updatedFullName}`);
        await contactDetailPage.expectDetailContainsText(updated.email);
    });


    test('User can edit contact address information without canton', async () => {
        const original = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `edit-addr.${faker.string.alphanumeric(5)}.test.pw` }) };
        await createContactViaUI(original);

        const countryDictionary = {
            'Germany': 'DE',
            'France': 'FR',
            'Italy': 'IT',
            'Austria': 'AT'
        };
        const countryName = faker.helpers.arrayElement(Object.keys(countryDictionary));
        const updated = { 
            address1: faker.location.streetAddress(), 
            address2: faker.location.secondaryAddress(), 
            location: faker.location.city(), 
            canton: faker.location.state({ abbreviated: true }), 
            zip: faker.location.zipCode('#####'), 
            country: countryName 
        };
        const originalRow = contactsListPage.getRowLocator(original.email);
        await contactsListPage.getLinkForRow(originalRow, original.firstName).click();
        await contactDetailPage.expectHeadingVisible(`${original.firstName} ${original.lastName}`);
        await contactDetailPage.clickEditButton('Address Information');
        await contactEditModal.waitForDialogVisible(/Edit Address Information/i);

        // Interact with the country select using the placeholder
        const countrySelect = contactEditModal.page.locator("//button[normalize-space()='Enter country']");
        const countryInput = contactEditModal.page.getByPlaceholder('Search enter country...');
        await countrySelect.click();
        await countryInput.click();
        await countryInput.fill(countryName);
        await contactEditModal.page.getByText(countryName, { exact: true }).click();

        // Fill the rest of the address fields
        await contactEditModal.fillAddressSection({ ...updated, country: undefined }); // Don't overwrite country again

        await contactEditModal.clickSaveChanges();
        await contactEditModal.expectAddressUpdateStatusMessage();
        await contactDetailPage.expectDetailContainsText(updated.address1);
        await contactDetailPage.expectDetailContainsText(updated.location);
        await contactDetailPage.expectDetailContainsText(countryName);
    });


    test('User can edit contact address information with canton', async () => {
        // This test ensures the canton select uses the correct placeholder for searching
        // and that the canton can be selected via the search input.
        const original = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `edit-addr.${faker.string.alphanumeric(5)}.test.pw` }) };
        await createContactViaUI(original);

        const countryDictionary = {
            'Switzerland': 'CH',
        };
        const cantonDictionary = {
            'Bern': 'BE',
            'Fribourg': 'FR',
            'Geneva': 'GE',
            'Glarus': 'GL',
        };
        const countryName = 'Switzerland';
        const cantonName = faker.helpers.arrayElement(Object.keys(cantonDictionary));
        const updated = { 
            address1: faker.location.streetAddress(), 
            address2: faker.location.secondaryAddress(), 
            location: faker.location.city(), 
            canton: cantonName, 
            zip: faker.location.zipCode('#####'), 
            country: countryName 
        };
        const originalRow = contactsListPage.getRowLocator(original.email);
        await contactsListPage.getLinkForRow(originalRow, original.firstName).click();
        await contactDetailPage.expectHeadingVisible(`${original.firstName} ${original.lastName}`);
        await contactDetailPage.clickEditButton('Address Information');
        await contactEditModal.waitForDialogVisible(/Edit Address Information/i);

        // Interact with the country select using the placeholder
        const countrySelect = contactEditModal.page.locator("//button[normalize-space()='Enter country']");
        const countryInput = contactEditModal.page.getByPlaceholder('Search enter country...');
        await countrySelect.click();
        await countryInput.click();
        await countryInput.fill(countryName);
        await contactEditModal.page.getByText(countryName, { exact: true }).click();

        // Interact with the canton select using the placeholder
        const cantonSelect = contactEditModal.page.locator("//button[normalize-space()='Enter canton']");
        const cantonInput = contactEditModal.page.getByPlaceholder('Search enter canton...');
        await cantonSelect.click();
        await cantonInput.click();
        await cantonInput.fill(cantonName);
        await contactEditModal.page.getByText(cantonName, { exact: true }).click();

        // Fill the rest of the address fields
        await contactEditModal.fillAddressSection({ ...updated, country: undefined, canton: undefined }); // Don't overwrite country/canton again

        await contactEditModal.clickSaveChanges();
        await contactEditModal.expectAddressUpdateStatusMessage();
        await contactDetailPage.expectDetailContainsText(updated.address1);
        await contactDetailPage.expectDetailContainsText(updated.location);
        await contactDetailPage.expectDetailContainsText(countryName);
        await contactDetailPage.expectDetailContainsText(cantonName);
    });

    test('User can edit contact work and social media details', async ({ page }) => {
        organizationCreateModal = new OrganizationCreateModal(page);
        const orgData = { name: `Org_${faker.string.alphanumeric(6)}`, email: faker.internet.email({ provider: `org.${faker.string.alphanumeric(5)}.test.pw` }), address: faker.location.streetAddress() };
        await page.goto('/en/crm/organizations');
        await expect(page.getByRole('button', { name: 'Create' })).toBeVisible({ timeout: 15000 });
        await page.getByRole('button', { name: 'Create' }).click();
        await organizationCreateModal.waitForDialogVisible();
        await organizationCreateModal.fillAndSubmit(orgData);
        await organizationCreateModal.expectCreationStatusMessage(orgData.name);
        await contactsListPage.goto();
        const original = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `edit-prof.${faker.string.alphanumeric(5)}.test.pw` }) };
        await createContactViaUI(original);
        const knownDepartment = 'Tecnology';
        const knownIndustry = 'Accounting';
        const updated = { jobFunction: faker.person.jobTitle(), department: knownDepartment, industry: knownIndustry, website: faker.internet.url(), linkedIn: `https://linkedin.com/in/${faker.string.alphanumeric(10)}`, facebook: `https://facebook.com/${faker.string.alphanumeric(10)}`, twitter: `https://x.com/${faker.string.alphanumeric(10)}`, description: faker.lorem.sentence(), organizationName: orgData.name };
        const originalRow = contactsListPage.getRowLocator(original.email);
        await contactsListPage.getLinkForRow(originalRow, original.firstName).click();
        await contactDetailPage.expectHeadingVisible(`${original.firstName} ${original.lastName}`);
        await contactDetailPage.clickEditButton('Professional Information');
        await contactEditModal.waitForDialogVisible(/Edit Professional Information/i);
        await contactEditModal.fillProfessionalSection(updated);
        await contactEditModal.clickSaveChanges(); // Includes delay now
        await contactEditModal.expectUpdateStatusMessage(); // Uses corrected POM method
        await contactDetailPage.expectDetailContainsText(`Role: ${updated.jobFunction}`);
        await contactDetailPage.expectDetailContainsText(`Organization: ${updated.organizationName}`);
        await contactDetailPage.expectDetailContainsText(`Department: ${updated.department}`);
        await contactDetailPage.expectDetailContainsText(`Industry: ${updated.industry}`);
    });
     test('User can search for a contact', async () => {
        const contact = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `search.${faker.string.alphanumeric(5)}.test.pw` }) };
        await createContactViaUI(contact);
        await contactsListPage.filterContacts(contact.email);
        const contactRow = contactsListPage.getRowLocator(contact.email);
        await expect(contactRow, 'Filtered contact row should be visible').toBeVisible({ timeout: 10000 });
        await expect(contactsListPage.contactsTable.locator('tbody tr')).toHaveCount(1, { timeout: 5000 });
    });
    test('User can add contact to a new list', async ({ page }) => {
        const contact = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `addnewlist.${faker.string.alphanumeric(5)}.test.pw` }) };
        await createContactViaUI(contact);
        const uniqueListName = `List_${faker.string.alphanumeric(6)}`;
        const contactRow = contactsListPage.getRowLocator(contact.email);
        await contactsListPage.getCheckboxForRow(contactRow).check();
        await contactsListPage.openMassActionsMenu();
        await contactsListPage.clickAddToListMassAction();
        await addToListModal.waitForDialogVisible();
        await addToListModal.createNewList(uniqueListName);
        await addToListModal.clickAddToList();
        await addToListModal.expectAddToListStatusMessage();
        const listsPage = new ListsPage(page);
        await listsPage.goto();
        const listRow = listsPage.getRowLocator(uniqueListName);
        await expect(listRow, 'Newly created list row should be visible').toBeVisible({ timeout: 10000 });
        await expect(listRow.locator('td').nth(4), 'New list count should be 1').toHaveText('1', { timeout: 15000 });
    });
    test('User can add contact to an existing list', async ({ page }) => {
        listCreateModal = new ListCreateModal(page);
        const listName = `ExistingList_${faker.string.alphanumeric(6)}`;
        await page.goto('/en/crm/lists');
        await expect(page.getByRole('button', { name: 'Create', exact: true })).toBeVisible({ timeout: 15000 });
        await page.getByRole('button', { name: 'Create', exact: true }).click();
        await listCreateModal.waitForDialogVisible();
        await listCreateModal.fillAndSubmit(listName);
        await listCreateModal.expectCreationStatusMessage(listName);
        await contactsListPage.goto();
        const contact = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `addexisting.${faker.string.alphanumeric(5)}.test.pw` }) };
        await createContactViaUI(contact);
        const contactRow = contactsListPage.getRowLocator(contact.email);
        await contactsListPage.getCheckboxForRow(contactRow).check();
        await contactsListPage.openMassActionsMenu();
        await contactsListPage.clickAddToListMassAction();
        await addToListModal.waitForDialogVisible();
        await addToListModal.selectExistingList(listName);
        await addToListModal.clickAddToList();
        await addToListModal.expectAddToListStatusMessage();
        const listsPage = new ListsPage(page);
        await listsPage.goto();
        const listRow = listsPage.getRowLocator(listName);
        await expect(listRow, 'Existing list row should be visible').toBeVisible({ timeout: 10000 });
        await expect(listRow.locator('td').nth(4), 'Existing list count should be 1').toHaveText('1', { timeout: 15000 });
    });
    test('User can delete contact', async ({ page }) => {
        const contact = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `rowdel.${faker.string.alphanumeric(5)}.test.pw` }) };
        await createContactViaUI(contact);
        const contactRow = contactsListPage.getRowLocator(contact.email);
        const deleteButton = contactsListPage.getDeleteButtonForRow(contactRow);
        await expect(deleteButton, 'Delete button in row should be visible').toBeVisible();
        await deleteButton.click();
        await page.getByRole('menuitem', { name: 'Delete' }).click();
        const messageLocator = page.getByText('Contact Deleted!', { exact: true });
        await expect(messageLocator, 'Delete success message').toBeVisible({ timeout: 10000 });
        await expect(contactRow, 'Deleted contact row should no longer be visible').not.toBeVisible({ timeout: 10000 });
    });
    test('User can delete contacts from mass action', async ({ page }) => {
        const contact = { firstName: faker.person.firstName(), lastName: faker.person.lastName(), email: faker.internet.email({ provider: `massdel.${faker.string.alphanumeric(5)}.test.pw` }) };
        await createContactViaUI(contact);
        const contactRow = contactsListPage.getRowLocator(contact.email);
        await contactsListPage.getCheckboxForRow(contactRow).check();
        await contactsListPage.openMassActionsMenu();
        await contactsListPage.clickDeleteMassAction();
        await contactsListPage.clickDeleteConfirmMassAction();
        const messageLocator = page.getByText('The deletion process has started', { exact: false });
        await expect(messageLocator, 'Delete started message').toBeVisible({ timeout: 10000 });
        await expect(contactRow, 'Mass deleted contact row should no longer be visible').not.toBeVisible({ timeout: 10000 });
    });

}); // End of describe block

import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { ContactCreateModal } from './pages/ContactCreateModal';
import { ContactsListPage } from './pages/ContactsListPage';
import { AdvancedFiltersPage } from './pages/AdvancedFiltersPage';
import { loginUser } from './utils/authHelper';


let contact: { firstName: string; lastName: string; email: string };

test.describe.configure({ mode: 'serial' });
test.describe('Contacts Search – Advanced Filters', () => {
    test.beforeEach(async ({ page }) => {
        await loginUser(page);
        contact = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email({ provider: 'test.example.com' })
        };
        const contactsListPage = new ContactsListPage(page);
        const contactCreateModal = new ContactCreateModal(page);

        await contactsListPage.clickCreateButton();
        await contactCreateModal.waitForDialogVisible();
        await Promise.all([
            page.waitForNavigation({ waitUntil: 'networkidle', timeout: 15000 }).catch(() => {}),
            contactCreateModal.fillAndSubmit(contact)
        ]);
        await page.goto('en/crm/contacts');
        await expect(page.locator('tbody')).toBeVisible({ timeout: 10000 });
    });

    test('Filter by first name', async ({ page }) => {
        const advancedFiltersPage = new AdvancedFiltersPage(page);
        await advancedFiltersPage.openAdvancedFilters();
        await advancedFiltersPage.openPersonalInformationSection();
        await advancedFiltersPage.filterByFirstName(contact.firstName);
        await advancedFiltersPage.applyFilters();
        await advancedFiltersPage.expectContactVisible(contact.firstName, contact.lastName);
    });

    test('Filter by last name', async ({ page }) => {
        const advancedFiltersPage = new AdvancedFiltersPage(page);
        await advancedFiltersPage.openAdvancedFilters();
        await advancedFiltersPage.openPersonalInformationSection();
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill(contact.lastName);
        await advancedFiltersPage.applyFilters();
        await advancedFiltersPage.expectContactVisible(contact.firstName, contact.lastName);
    });

    test('Filter by first and last name', async ({ page }) => {
        const advancedFiltersPage = new AdvancedFiltersPage(page);
        await advancedFiltersPage.openAdvancedFilters();
        await advancedFiltersPage.openPersonalInformationSection();
        await advancedFiltersPage.filterByFirstName(contact.firstName);
        await page.getByRole('textbox', { name: 'Last Name' }).click();
        await page.getByRole('textbox', { name: 'Last Name' }).fill(contact.lastName);
        await advancedFiltersPage.applyFilters();
        await advancedFiltersPage.expectContactVisible(contact.firstName, contact.lastName);
    });

    test('Filter by email', async ({ page }) => {
        const advancedFiltersPage = new AdvancedFiltersPage(page);
        await advancedFiltersPage.openAdvancedFilters();
        await advancedFiltersPage.openPersonalInformationSection();
        await page.getByRole('textbox', { name: 'Email' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill(contact.email);
        await advancedFiltersPage.applyFilters();
        await advancedFiltersPage.expectContactVisible(contact.firstName, contact.lastName);
    });

    test('Filter by first name and email', async ({ page }) => {
        const advancedFiltersPage = new AdvancedFiltersPage(page);
        await advancedFiltersPage.openAdvancedFilters();
        await advancedFiltersPage.openPersonalInformationSection();
        await advancedFiltersPage.filterByFirstName(contact.firstName);
        await page.getByRole('textbox', { name: 'Email' }).click();
        await page.getByRole('textbox', { name: 'Email' }).fill(contact.email);
        await advancedFiltersPage.applyFilters();
        await advancedFiltersPage.expectContactVisible(contact.firstName, contact.lastName);
    });

    test('Filter with no match (negative scenario)', async ({ page }) => {
        const advancedFiltersPage = new AdvancedFiltersPage(page);
        await advancedFiltersPage.openAdvancedFilters();
        await advancedFiltersPage.openPersonalInformationSection();
        await advancedFiltersPage.filterByFirstName('NonexistentName');
        await advancedFiltersPage.applyFilters();
        await expect(page.locator('tbody')).not.toContainText('NonexistentName');
    });
});

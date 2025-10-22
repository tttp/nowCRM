// contactsapp/tests/04Organization.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { OrganizationsPage } from './pages/OrganizationsPage'; // Import the new POM
import { loginUser } from './utils/authHelper';

test.describe('Organization Management', () => {
    let organizationsPage: OrganizationsPage;
    let orgData: { name: string; email: string; address: string }; // For sharing data within tests if needed

    test.beforeEach(async ({ page }) => {
        organizationsPage = new OrganizationsPage(page);
        // Generate default org data for creation tests
        orgData = {
            name: `Org_${faker.string.alphanumeric(8)}`,
            email: faker.internet.email({ provider: `org-test-${faker.string.alphanumeric(3)}.test.pw` }),
            address: faker.location.streetAddress() + ", TestCity"
        };

        // Login and navigate
        await loginUser(page);
        await organizationsPage.goto();
    });

    test('User can create an organization', async () => {
        await organizationsPage.openCreateDialog();
        await organizationsPage.fillAndSubmitCreateDialog(orgData);

        await organizationsPage.expectStatusMessage(`Organization ${orgData.name} created`);

        const orgRow = organizationsPage.getRowLocator(orgData.name);
        await expect(orgRow, 'Created organization row should be visible').toBeVisible({ timeout: 10000 });
        await expect(orgRow).toContainText(orgData.email);
    });

    test('User can search for an organization', async () => {
        // Arrange: Create org first using POM method
        await organizationsPage.openCreateDialog();
        await organizationsPage.fillAndSubmitCreateDialog(orgData);
        await organizationsPage.expectStatusMessage(`Organization ${orgData.name} created`); // Wait for creation

        // Act: Filter using POM method
        await organizationsPage.filterOrganizations(orgData.name);

        // Assert
        const orgRow = organizationsPage.getRowLocator(orgData.name);
        await expect(orgRow, 'Filtered organization row should be visible').toBeVisible({ timeout: 10000 });
        await expect(orgRow).toContainText(orgData.email);
        // Optional: Assert only one row is visible
        await expect(organizationsPage.organizationsTable.locator('tbody tr')).toHaveCount(1, { timeout: 2000 });
    });

    test('User can edit an organization', async () => {
        // Arrange: Create org
        await organizationsPage.openCreateDialog();
        await organizationsPage.fillAndSubmitCreateDialog(orgData);
        await organizationsPage.expectStatusMessage(`Organization ${orgData.name} created`);

        const updatedData = {
            name: `${orgData.name}-MODIFIED`,
            email: `modified.${orgData.email}`,
            contactPerson: faker.person.fullName(),
            tag: faker.lorem.word(),
            description: faker.lorem.sentence(4)
        };
        const originalOrgRow = organizationsPage.getRowLocator(orgData.name);

        // Act: Navigate to detail, open edit modal, fill, save
        await organizationsPage.gotoDetailPageForRow(originalOrgRow, orgData.name);
        await organizationsPage.openEditDialogFromDetail();
        // Optional: Verify original data is pre-filled
        await expect(organizationsPage.nameInput).toHaveValue(orgData.name, { timeout: 10000 });
        await organizationsPage.fillAndSubmitEditDialog(updatedData);

        // Assert: Check status and updated details on detail page
        await organizationsPage.expectStatusMessage('Organization updated');
        // Wait briefly for potential UI refresh after save
        await organizationsPage.page.waitForTimeout(500);
        await expect(organizationsPage.page.getByRole('heading', { name: updatedData.name }), 'Updated heading should be visible')
            .toBeVisible({ timeout: 10000 });
        await organizationsPage.expectDetailContainsText(updatedData.email);
        await organizationsPage.expectDetailContainsText(updatedData.contactPerson);
        await organizationsPage.expectDetailContainsText(updatedData.tag);
        await organizationsPage.expectDetailContainsText(updatedData.description);
    });

    test('User can delete an organization', async () => {
        // Arrange: Create org
        await organizationsPage.openCreateDialog();
        await organizationsPage.fillAndSubmitCreateDialog(orgData);
        await organizationsPage.expectStatusMessage(`Organization ${orgData.name} created`);
        const orgRow = organizationsPage.getRowLocator(orgData.name);
        await expect(orgRow, 'Organization row to delete should be visible').toBeVisible();

        // Act: Delete using POM method
        await organizationsPage.deleteOrganizationFromRow(orgRow);

        // Assert
        await organizationsPage.expectStatusMessage('Organization deleted');
        await expect(orgRow, 'Deleted organization row should no longer be visible')
            .not.toBeVisible({ timeout: 10000 });
    });
});

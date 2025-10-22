// contactsapp/tests/03Lists.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { ListsPage } from './pages/ListsPage';
import { loginUser } from './utils/authHelper';

/**
 * E2E tests for List Management using the ListsPage Page Object Model.
 * All actions and assertions are routed through the POM for clarity and maintainability.
 */
test.describe('List Management', () => {
    let listsPage: ListsPage;

    test.beforeEach(async ({ page }) => {
        listsPage = new ListsPage(page);
        await loginUser(page);
        await listsPage.goto();
    });

    test('User can create a list', async () => {
        const listName = `CreateList_${faker.word.verb()}_${faker.string.alphanumeric(6)}`;
        await listsPage.openCreateDialog();
        await listsPage.fillAndSubmitCreateDialog(listName);
        await listsPage.expectStatusMessage(`List ${listName} created`);
        // Assert that the new list row is visible in the table
        await expect(listsPage.getRowLocator(listName), 'Created list row should be visible')
            .toBeVisible({ timeout: 10000 });
    });

    test('User can search for a list', async () => {
        const listName = `SearchList_${faker.commerce.productName()}_${faker.string.alphanumeric(6)}`;
        await listsPage.openCreateDialog();
        await listsPage.fillAndSubmitCreateDialog(listName);
        await listsPage.expectStatusMessage(`List ${listName} created`);
        // Filter the lists table by the new list name
        await listsPage.filterLists(listName);
        const listRow = listsPage.getRowLocator(listName);
        await expect(listRow, 'Filtered list row should be visible').toBeVisible({ timeout: 10000 });
        // Assert that only one row is visible after filtering
        await expect(listsPage.listsTable.locator('tbody tr'), 'Only one row should be visible after filtering')
            .toHaveCount(1, { timeout: 5000 });
    });

    // This test is marked as expected to fail due to a known application bug.
    // See bug tracker for details.
    test.fail('User can edit a list name (expected failure due to edit bug)', async () => {
        const originalListName = `EditList_${faker.hacker.noun()}_${faker.string.alphanumeric(6)}`;
        await listsPage.openCreateDialog();
        await listsPage.fillAndSubmitCreateDialog(originalListName);
        await listsPage.expectStatusMessage(`List ${originalListName} created`);

        const updatedListName = `${originalListName}-UPDATED`;
        const originalListRow = listsPage.getRowLocator(originalListName);

        // Navigate to the detail page, edit the name, and save
        await listsPage.gotoDetailPageForRow(originalListRow, originalListName);
        await listsPage.clickEditTitleAndWaitForInput();
        await expect(listsPage.nameInputOnDetail).toHaveValue(originalListName);
        await listsPage.fillAndSaveNameEdit(updatedListName);

        // Assert that the status message appears
        await listsPage.expectStatusMessage('List title updated');

        // Go back to the list page, reload, and verify the changes
        await listsPage.goto();
        await listsPage.page.reload();
        await expect(listsPage.createButton, 'Create button should be visible after reload').toBeVisible({ timeout: 15000 });

        // Assert that the updated name is visible
        await expect(listsPage.getRowLocator(updatedListName), 'Updated list row should be visible after reload')
            .toBeVisible({ timeout: 15000 });

        // Assert that the old name is NOT visible (expected to fail due to bug)
        await expect(listsPage.getRowLocator(originalListName), `Count of rows matching original name "${originalListName}" should be zero`)
            .toHaveCount(0, { timeout: 15000 });
    });

    test('User can delete a list', async () => {
        const listNameToDelete = `DeleteList_${faker.animal.type()}_${faker.string.alphanumeric(6)}`;
        await listsPage.openCreateDialog();
        await listsPage.fillAndSubmitCreateDialog(listNameToDelete);
        await listsPage.expectStatusMessage(`List ${listNameToDelete} created`);

        const listRow = listsPage.getRowLocator(listNameToDelete);
        await expect(listRow, 'List row to delete should be visible').toBeVisible();

        // Delete the list using the row's delete button
        await listsPage.deleteListFromRow(listRow);

        await listsPage.expectStatusMessage('List deleted');
        // Assert that the deleted list row is no longer visible
        await expect(listRow, 'Deleted list row should no longer be visible')
            .not.toBeVisible({ timeout: 10000 });
    });
});

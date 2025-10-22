import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { ComposerPage } from './pages/ComposerPage';
import { loginUser } from './utils/authHelper';
import { ContactsListPage } from './pages/ContactsListPage';
import { ContactCreateModal } from './pages/ContactCreateModal';
import { ContactDetailPage } from './pages/ContactDetailPage';
import { ProfilePage } from './pages/ProfilePage';

test.describe('Composer Management - Independent Tests', () => {

    let composerPage: ComposerPage;
    let uniqueDataSuffix: string;

    test.beforeEach(async ({ page }) => {
        composerPage = new ComposerPage(page);
        uniqueDataSuffix = faker.string.alphanumeric(8);
        await loginUser(page);
        await expect(composerPage.composerNavLink).toBeVisible({ timeout: 20000 });
        await composerPage.goto();
    });


    test.skip('should send a composition by email and verify delivery in Mailpit', async ({ page, request }) => {
        // Generate unique data for the test
        const emailSuffix = faker.string.alphanumeric(7);
        const uniqueTitle = `Email Template ${emailSuffix}`;
        const expectedEmailBody = `Ref Result Email ${emailSuffix} content.`;
        const scratchDetails = {
            title: uniqueTitle,
            category: `EmailCat_${emailSuffix}`,
            language: 'English',
            persona: `Email Persona ${emailSuffix}`,
            model: 'gpt-4o-mini',
            referencePrompt: `Ref Prompt Email ${emailSuffix}`,
            referenceResult: expectedEmailBody
        };
        const testRecipient = `test-email-${emailSuffix}@example.com`;

        // Page objects for contact management
        const contactsListPage = new ContactsListPage(page);
        const contactCreateModal = new ContactCreateModal(page);
        const contactDetailPage = new ContactDetailPage(page);

        // 1. Create a contact and activate email subscription
        await contactsListPage.goto();
        await contactsListPage.clickCreateButton();
        await contactCreateModal.fillAndSubmit({
            email: testRecipient,
            firstName: 'Test',
            lastName: 'Recipient'
        });
        await contactsListPage.openContactByEmail(testRecipient);
        await contactDetailPage.expectHeadingVisible('Test Recipient');
        await contactDetailPage.gotoSubscriptionsTab();
        await contactDetailPage.addEmailSubscription();
        await contactDetailPage.activateEmailSubscription();
        await page.waitForTimeout(500);

        // Ensure composer navigation is available
        await expect(composerPage.composerNavLink).toBeVisible({ timeout: 10000 });
        await expect(composerPage.composerNavLink).toBeEnabled({ timeout: 10000 });

        await composerPage.goto();

        // 2. Create a new composition
        await composerPage.goto();
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails(scratchDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();

        // 3. Add Email channel
        await composerPage.addEmailChannel();
        await composerPage.expectAddChannelSuccessMessageVisible();

        // 4. Edit Email channel and fill result
        await composerPage.editEmailChannel();
        await composerPage.fillResultField(expectedEmailBody);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();

        // 5. Send the email
        await composerPage.openSendEmailDialog();
        await composerPage.fillEmailRecipient(testRecipient, uniqueTitle); // <-- use uniqueTitle
        await composerPage.sendEmail();
        await composerPage.expectSendEmailSuccessMessageVisible();

        // 6. Poll Mailpit for the email (max 10s)
        let foundEmail;
        for (let i = 0; i < 10; i++) {
            const mailpitResponse = await request.get('http://localhost:8025/api/v1/messages');
            expect(mailpitResponse.ok()).toBeTruthy();
            const emails = (await mailpitResponse.json()).messages;
            foundEmail = emails.find((email: any) =>
                email.To.some((recipient: any) => recipient.Address === testRecipient) &&
                email.Subject === uniqueTitle
            );
            if (foundEmail) break;
            await new Promise(res => setTimeout(res, 1000));
        }
        expect(foundEmail).toBeDefined();

        // 7. Verify email subject and body content
        const messageId = foundEmail.ID;
        const fullMessageResponse = await request.get(`http://localhost:8025/api/v1/message/${messageId}`);
        expect(fullMessageResponse.ok()).toBeTruthy();
        const fullMessage = await fullMessageResponse.json();
        expect(fullMessage.Subject).toBe(uniqueTitle);

        const bodyText = (fullMessage.Text || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const bodyHtml = (fullMessage.HTML || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const bodyRaw = (fullMessage.Body || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const bodySnippet = (fullMessage.Snippet || '').replace(/\s+/g, ' ').trim().toLowerCase();
        const expectedNormalized = expectedEmailBody.replace(/\s+/g, ' ').trim().toLowerCase();

        console.log('Mailpit bodyText:', bodyText);
        console.log('Mailpit bodyHtml:', bodyHtml);
        console.log('Mailpit bodyRaw:', bodyRaw);
        console.log('Mailpit bodySnippet:', bodySnippet);
        console.log('Expected:', expectedNormalized);

        // Assertion: use includes with normalized values
        expect(
            bodyText.includes(expectedNormalized) ||
            bodyHtml.includes(expectedNormalized) ||
            bodyRaw.includes(expectedNormalized) ||
            bodySnippet.includes(expectedNormalized)
        ).toBeTruthy();

        // 8. Cleanup: Try to delete the email, fallback to delete all if needed
        try {
            const deleteResponse = await request.delete(`http://localhost:8025/api/v1/message/${messageId}`);
            const status = deleteResponse.status();
            const body = await deleteResponse.text();
            if (status !== 200 && status !== 204) {
                console.warn(`Mailpit DELETE failed: status=${status}, body=${body}`);
                // Fallback: Delete all messages if individual delete fails
                const deleteAllResp = await request.delete('http://localhost:8025/api/v1/messages');
                console.warn(`Mailpit DELETE ALL status=${deleteAllResp.status()}`);
            } else {
                // Confirm deletion by polling messages again
                let stillExists = false;
                for (let i = 0; i < 5; i++) {
                    const checkResp = await request.get('http://localhost:8025/api/v1/messages');
                    const emails = (await checkResp.json()).messages;
                    stillExists = emails.some((email: any) => email.ID === messageId);
                    if (!stillExists) break;
                    await new Promise(res => setTimeout(res, 500));
                }
                if (stillExists) {
                    console.warn(`Mailpit message ${messageId} still exists after DELETE.`);
                }
            }
        } catch (error) {
            console.warn(`Failed to delete email from Mailpit: ${error}`);
        }
        // Cleanup: Delete the created composition
        await composerPage.goto();
        await composerPage.expectCompositionInList(uniqueTitle);
        try {
            await composerPage.deleteComposition(uniqueTitle);
            await composerPage.expectDeleteSuccessMessageVisible();
            await composerPage.goto();
            await expect(composerPage.composerTableBody.locator('tr', { hasText: uniqueTitle }).first()).not.toBeVisible({ timeout: 20000 });
        } catch (error) {
            console.warn(`Cleanup failed for "${uniqueTitle}". Error: ${error}`);
        }
    });
    
    test('should create a composition using a predefined template and verify it appears in the list', async ({ page }) => {
        const templateName = 'Product Launch';
        const categoryName = 'Marketing';
        const uniqueTelegramPrompt = `QA Template Create Test - ${uniqueDataSuffix}`;
        let createdItemIdentifier = templateName;

        // Create composition via template
        await composerPage.clickCreateNew();
        await composerPage.selectCategory(categoryName);
        await composerPage.selectTemplate(templateName);
        await composerPage.clickGenerate();
        await composerPage.waitForGenerationToComplete();
        await composerPage.goToChannelCustomizations();
        await composerPage.selectSMSChannel(uniqueTelegramPrompt);
        await composerPage.goToFinalizeStep();
        await composerPage.submitComposition();
        await composerPage.expectCreateSuccessMessageVisible();
        await composerPage.goto();
        await composerPage.expectCompositionInList(createdItemIdentifier);

        // Cleanup: Delete created composition
        try {
            await composerPage.deleteComposition(createdItemIdentifier);
            await composerPage.expectDeleteSuccessMessageVisible();
            await composerPage.goto();
            await expect(composerPage.composerTableBody.locator('tr', { hasText: createdItemIdentifier }).first()).not.toBeVisible({ timeout: 10000 });
        } catch (error) {
            console.warn(`Cleanup failed for "${createdItemIdentifier}". Error: ${error}`);
        }
    });

    test('should create a composition from scratch and verify its details in the list', async ({ page }) => {
        const scratchUniqueSuffix = faker.string.alphanumeric(7);
        const uniqueTitle = `Scratch Create ${scratchUniqueSuffix}`;
        const scratchDetails = {
            title: uniqueTitle,
            category: `ScratchCat_${scratchUniqueSuffix}`,
            language: 'English',
            persona: `Scratch Persona ${scratchUniqueSuffix}`,
            model: 'gpt-4o-mini',
            referencePrompt: `Ref Prompt Create ${scratchUniqueSuffix}`,
            referenceResult: `Ref Result Create ${scratchUniqueSuffix} details.`
        };
        const languageCode = 'en';
        const expectedStatus = 'Finished';

        // Create composition from scratch
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails(scratchDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();
        await composerPage.goto();
        await composerPage.expectCompositionInList(uniqueTitle);

        // Verify composition details in list
        const targetRow = composerPage.composerTableBody.locator('tr', { hasText: uniqueTitle });
        await expect(targetRow).toContainText(scratchDetails.category);
        await expect(targetRow).toContainText(languageCode);
        await expect(targetRow).toContainText(expectedStatus);

        // Cleanup: Delete created composition
        try {
            await composerPage.deleteComposition(uniqueTitle);
            await composerPage.expectDeleteSuccessMessageVisible();
            await composerPage.goto();
            await expect(composerPage.composerTableBody.locator('tr', { hasText: uniqueTitle }).first()).not.toBeVisible({ timeout: 20000 });
        } catch (error) {
            console.warn(`Cleanup failed for "${uniqueTitle}". Error: ${error}`);
        }
    });

    test('should edit an existing composition and verify updated details in the list', async ({ page }) => {
        const editUniqueSuffix = faker.string.alphanumeric(7);
        const originalTitle = `Edit Original ${editUniqueSuffix}`;
        const editedTitle = `Edit Updated ${editUniqueSuffix}`;
        const originalDetails = {
            title: originalTitle,
            category: `EditOrigCat_${editUniqueSuffix}`,
            language: 'English',
            persona: `EditOrig Persona ${editUniqueSuffix}`,
            model: 'gpt-4o-mini',
            referencePrompt: `Ref Prompt Edit Orig ${editUniqueSuffix}`,
            referenceResult: `Ref Result Edit Orig ${editUniqueSuffix} details.`
        };
        const editedDetails = {
            title: editedTitle,
            category: `EditUpdatedCat_${editUniqueSuffix}`,
            language: 'German',
            unsubscribe: true
        };

        // Setup: Create composition to edit
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails(originalDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();
        await composerPage.goto();
        await composerPage.expectCompositionInList(originalTitle);

        // Edit composition
        await composerPage.goToViewPageByName(originalTitle);
        await composerPage.clickEdit();
        await composerPage.editBasicInfo(editedDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();
        await composerPage.goto();
        await composerPage.expectCompositionInList(editedTitle);
        await expect(composerPage.composerTableBody.locator('tr', { hasText: originalTitle }).first()).not.toBeVisible({ timeout: 5000 });
        const editedRow = composerPage.composerTableBody.locator('tr', { hasText: editedTitle });
        await expect(editedRow).toContainText(editedDetails.category);
        await expect(editedRow).toContainText('de');

        // Cleanup: Delete edited composition
        try {
            await composerPage.deleteComposition(editedTitle);
            await composerPage.expectDeleteSuccessMessageVisible();
            await composerPage.goto();
            await expect(composerPage.composerTableBody.locator('tr', { hasText: editedTitle }).first()).not.toBeVisible({ timeout: 20000 });
        } catch (error) {
            console.warn(`Cleanup failed for "${editedTitle}". Error: ${error}`);
        }
    });

    test('should delete a composition and verify it is removed from the list', async ({ page }) => {
        const deleteUniqueSuffix = faker.string.alphanumeric(7);
        const uniqueTitleToDelete = `Delete Scratch ${deleteUniqueSuffix}`;
        const deleteDetails = {
            title: uniqueTitleToDelete,
            category: `DeleteCat_${deleteUniqueSuffix}`,
            language: 'English',
            persona: `Delete Persona ${deleteUniqueSuffix}`,
            model: 'gpt-4o-mini',
            referencePrompt: `Ref Prompt Delete ${deleteUniqueSuffix}`,
            referenceResult: `Ref Result Delete ${deleteUniqueSuffix} content.`
        };

        // Setup: Create composition to delete
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails(deleteDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();
        await composerPage.goto();
        await composerPage.expectCompositionInList(uniqueTitleToDelete);

        // Delete composition
        await composerPage.deleteComposition(uniqueTitleToDelete);
        await composerPage.expectDeleteSuccessMessageVisible();
        await composerPage.goto();
        await expect(composerPage.composerTableBody.locator('tr', { hasText: uniqueTitleToDelete }).first()).not.toBeVisible({ timeout: 20000 });
    });

    test('should search for a composition and verify correct filtering in the list', async ({ page }) => {
        const searchUniqueSuffix = faker.string.alphanumeric(6);
        const uniqueTitle = `Search Scratch ${searchUniqueSuffix}`;
        const searchDetails = {
            title: uniqueTitle,
            category: `SearchCat_${searchUniqueSuffix}`,
            language: 'German',
            persona: `Search Persona ${searchUniqueSuffix}`,
            model: 'gpt-4o-mini',
            referencePrompt: `Ref Prompt Search ${searchUniqueSuffix}`,
            referenceResult: `Ref Result Search ${searchUniqueSuffix} content.`
        };
        const languageCode = 'de';
        const expectedStatus = 'Finished';

        // Setup: Create composition to search
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails(searchDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();
        await composerPage.goto();
        await composerPage.expectCompositionInList(uniqueTitle);

        // Search for composition
        await composerPage.searchForComposition(uniqueTitle);
        const targetRow = composerPage.composerTableBody.locator('tr', { hasText: uniqueTitle });
        await expect(targetRow).toBeVisible({ timeout: 10000 });
        await expect(composerPage.composerTableBody.locator('tr')).toHaveCount(1);
        await expect(targetRow).toContainText(searchDetails.category);
        await expect(targetRow).toContainText(languageCode);
        await expect(targetRow).toContainText(expectedStatus);

        // Cleanup: Delete created composition
        try {
            await composerPage.deleteComposition(uniqueTitle);
            await composerPage.expectDeleteSuccessMessageVisible();
            await composerPage.goto();
            await expect(composerPage.composerTableBody.locator('tr', { hasText: uniqueTitle }).first()).not.toBeVisible({ timeout: 20000 });
        } catch (error) {
            console.warn(`Cleanup failed for "${uniqueTitle}". Error: ${error}`);
        }
    });

    test('should add an Email channel to a scratch composition and verify success', async ({ page }) => {
        const addChanUniqueSuffix = faker.string.alphanumeric(7);
        const uniqueTitle = `AddChan Scratch ${addChanUniqueSuffix}`;
        const scratchDetails = {
            title: uniqueTitle,
            category: `AddChanCat_${addChanUniqueSuffix}`,
            language: 'Francais',
            persona: `AddChan Persona ${addChanUniqueSuffix}`,
            model: 'gpt-4o-mini',
            referencePrompt: `Ref Prompt AddChan ${addChanUniqueSuffix}`,
            referenceResult: `Ref Result AddChan ${addChanUniqueSuffix} content.`
        };

        // Setup: Create scratch composition
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails(scratchDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();
        await expect(composerPage.editButton).toBeVisible();

        // Add Email channel
        await composerPage.addEmailChannel();
        await composerPage.expectAddChannelSuccessMessageVisible();

        // Cleanup: Delete created composition
        await composerPage.goto();
        await composerPage.expectCompositionInList(uniqueTitle);
        try {
            await composerPage.deleteComposition(uniqueTitle);
            await composerPage.expectDeleteSuccessMessageVisible();
            await composerPage.goto();
            await expect(composerPage.composerTableBody.locator('tr', { hasText: uniqueTitle }).first()).not.toBeVisible({ timeout: 20000 });
        } catch (error) {
            console.warn(`Cleanup failed for "${uniqueTitle}". Error: ${error}`);
        }
    });

    test('should show error when sending email to unsubscribed contact', async ({ page }) => {
        const emailSuffix = faker.string.alphanumeric(7);
        const uniqueTitle = `EmailSend Scratch ${emailSuffix}`;
        const expectedEmailBody = `Ref Result Email ${emailSuffix} content.`;
        const scratchDetails = {
            title: uniqueTitle,
            category: `EmailCat_${emailSuffix}`,
            language: 'English',
            persona: `Email Persona ${emailSuffix}`,
            model: 'gpt-4o-mini',
            referencePrompt: `Ref Prompt Email ${emailSuffix}`,
            referenceResult: expectedEmailBody
        };
        const testRecipient = `unsubscribed-${emailSuffix}@example.com`;

        // 1. Create contact WITHOUT activating email subscription
        const contactsListPage = new ContactsListPage(page);
        const contactCreateModal = new ContactCreateModal(page);
        const contactDetailPage = new ContactDetailPage(page);

        await contactsListPage.goto();
        await contactsListPage.clickCreateButton();
        await contactCreateModal.fillAndSubmit({
            email: testRecipient,
            firstName: 'Test',
            lastName: 'Unsubscribed'
        });
        await contactsListPage.openContactByEmail(testRecipient);
        await contactDetailPage.expectHeadingVisible('Test Unsubscribed');
        // Do NOT add or activate email subscription

        // 2. Create identity via UI (like in Journeys)
        const identityEmail = `user-identity-${emailSuffix}@example.com`;
        const identityDisplayName = `Test User`;
        const identityName = `${identityDisplayName} <${identityEmail}>`;
        const profilePage = new ProfilePage(page);
        await profilePage.gotoIdentities();
        await profilePage.createIdentity(identityName);

        // Ensure composer navigation is available
        await expect(composerPage.composerNavLink).toBeVisible({ timeout: 10000 });
        await expect(composerPage.composerNavLink).toBeEnabled({ timeout: 10000 });

        await composerPage.goto();

        // 3. Create a new composition
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails(scratchDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();

        // 4. Add Email channel
        await composerPage.addEmailChannel();
        await composerPage.expectAddChannelSuccessMessageVisible();

        // 5. Edit Email channel and fill result
        await composerPage.editEmailChannel();
        await composerPage.fillResultField(expectedEmailBody);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();

        // 6. Try to send the email to the unsubscribed contact
        await composerPage.openSendEmailDialog();
        // Select the identity in the dialog
        await page.getByPlaceholder('Search identity...').click();
        await page.getByRole('option', { name: identityName }).click();
        await composerPage.fillEmailRecipient(testRecipient, 'qa test');
        await composerPage.sendEmail();

        // 7. Assert error message is shown
        await composerPage.expectNoSubscriptionError();

        // Close the error popup so navigation can continue
        await composerPage.closePopup();

        // Cleanup: Delete the created composition
        await composerPage.goto();
        await composerPage.expectCompositionInList(uniqueTitle).catch(() => {
            console.warn(`Composition "${uniqueTitle}" not found in list, skipping delete.`);
        });
        try {
            await composerPage.deleteComposition(uniqueTitle);
            await composerPage.expectDeleteSuccessMessageVisible();
            await composerPage.goto();
            await expect(composerPage.composerTableBody.locator('tr', { hasText: uniqueTitle }).first()).not.toBeVisible({ timeout: 20000 });
        } catch (error) {
            console.warn(`Cleanup failed for "${uniqueTitle}". Error: ${error}`);
        }
    });

});

// contactsapp/tests/06Journeys.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { ContactsListPage } from './pages/ContactsListPage';
import { ContactCreateModal } from './pages/ContactCreateModal';
import { ContactDetailPage } from './pages/ContactDetailPage';
import { ComposerPage } from './pages/ComposerPage';
import { JourneysPage } from './pages/JourneysPage';
import { ProfilePage } from './pages/ProfilePage';
import { loginUser } from './utils/authHelper';
import { MailpitHelper } from './pages/MailpitHelper';

/**
 * E2E tests for Journeys Management using the JourneysPage Page Object Model.
 * All actions and assertions are routed through the POM for clarity and maintainability.
 */
test.describe('Journeys Management', () => {
    let journeysPage: JourneysPage;
    let journeyName: string;

    test.beforeEach(async ({ page }) => {
        journeysPage = new JourneysPage(page);
        journeyName = `TestJourney_${faker.string.alphanumeric(8)}`;
        await loginUser(page);
        await journeysPage.goto();
    });

    test('should allow creating a new journey', async () => {
        // Create a new journey and verify it appears in the table
        await journeysPage.openCreateJourneyDialog();
        await journeysPage.fillAndSubmitCreateJourney(journeyName);
        await journeysPage.expectStatusMessage(`Journey ${journeyName} created`);
        await expect(journeysPage.getRowLocator(journeyName), 'Newly created journey row should be visible')
            .toBeVisible({ timeout: 10000 });
    });

    test('should allow searching for a journey', async () => {
        // Create and then search for a journey
        await journeysPage.openCreateJourneyDialog();
        await journeysPage.fillAndSubmitCreateJourney(journeyName);
        await journeysPage.expectStatusMessage(`Journey ${journeyName} created`);
        await journeysPage.filterJourneys(journeyName);

        const journeyRow = journeysPage.getRowLocator(journeyName);
        await expect(journeyRow, 'Filtered journey row should be visible')
            .toBeVisible({ timeout: 5000 });
        await expect(journeysPage.journeysTable.locator('tbody tr'), 'Only one row should be visible after filtering')
            .toHaveCount(1, { timeout: 2000 });
    });

    test('should allow deleting a journey using row action', async () => {
        // Create and then delete a journey using the row's delete button
        await journeysPage.openCreateJourneyDialog();
        await journeysPage.fillAndSubmitCreateJourney(journeyName);
        await journeysPage.expectStatusMessage(`Journey ${journeyName} created`);
        const journeyRow = journeysPage.getRowLocator(journeyName);
        await expect(journeyRow, 'Journey row to delete should be visible').toBeVisible();

        // Use POM method for row deletion
        await journeysPage.deleteJourneyFromRow(journeyRow);

        await journeysPage.expectStatusMessage('Journey deleted');
        await expect(journeyRow, 'Deleted journey row should no longer be visible')
            .not.toBeVisible({ timeout: 10000 });
    });

    test('should allow deleting journeys using mass action', async () => {
        // Create and then delete a journey using mass actions
        await journeysPage.openCreateJourneyDialog();
        await journeysPage.fillAndSubmitCreateJourney(journeyName);
        await journeysPage.expectStatusMessage(`Journey ${journeyName} created`);
        const journeyRow = journeysPage.getRowLocator(journeyName);
        await expect(journeyRow, 'Journey row to mass delete should be visible').toBeVisible();

        await journeysPage.selectAllJourneys();
        await journeysPage.performMassDeleteAction();

        await journeysPage.expectStatusMessage('Journeys deleted');
        await expect(journeyRow, 'Mass deleted journey row should no longer be visible')
            .not.toBeVisible({ timeout: 10000 });
    });

    test.skip('should allow creating a journey and branching with drag-and-drop', async () => {
        // Create a new journey
        await journeysPage.openCreateJourneyDialog();
        await journeysPage.fillAndSubmitCreateJourney(journeyName);
        await journeysPage.expectStatusMessage(`Journey ${journeyName} created`);
        await expect(journeysPage.getRowLocator(journeyName), 'Newly created journey row should be visible')
            .toBeVisible({ timeout: 10000 });

        // Access the journey (open its detail/canvas page)
        await journeysPage.openJourneyByName(journeyName);

        // Click the Start step before drag-and-drop
        await journeysPage.page.getByText('Start').click();

        // Perform drag-and-drop from the Start connector to create a new step
        await journeysPage.dragFromStartConnector(200, 0);

        // Assert that a new step/card appears (adjust selector as needed)
        const newStep = journeysPage.page.getByText('New Step 1');
        await expect(newStep, 'New step should be visible after drag-and-drop').toBeVisible({ timeout: 5000 });
    });

    test.skip('should allow configuring journey step with email channel, contact and composition', async ({ page }) => {
        // 1. Create contact with email subscription activated
        const emailSuffix = faker.string.alphanumeric(7);
        const testRecipient = `journey-test-${emailSuffix}@example.com`;

        const contactsListPage = new ContactsListPage(page);
        const contactCreateModal = new ContactCreateModal(page);
        const contactDetailPage = new ContactDetailPage(page);

        await contactsListPage.goto();
        await contactsListPage.clickCreateButton();
        await contactCreateModal.fillAndSubmit({
            email: testRecipient,
            firstName: 'Journey',
            lastName: 'Recipient'
        });
        await contactsListPage.openContactByEmail(testRecipient);
        await contactDetailPage.expectHeadingVisible('Journey Recipient');
        await contactDetailPage.gotoSubscriptionsTab();
        await contactDetailPage.addEmailSubscription();
        await contactDetailPage.activateEmailSubscription();
        await page.waitForTimeout(500);

        // 2. Create identity in Admin Panel
        const identityName = `Journey User <journey-identity-${emailSuffix}@example.com>`;
        const profilePage = new ProfilePage(page);
        await profilePage.gotoIdentities();
        await profilePage.createIdentity(identityName);

        // 3. Create a composition with Email channel
        const composerPage = new ComposerPage(page);
        const uniqueTitle = `JourneyComp_${emailSuffix}`;
        const expectedEmailBody = `Journey Email Content ${emailSuffix}`;
        const scratchDetails = {
            title: uniqueTitle,
            category: `JourneyCat_${emailSuffix}`,
            language: 'English',
            persona: `Journey Persona ${emailSuffix}`,
            model: 'gpt-4o-mini',
            referencePrompt: `Journey Prompt ${emailSuffix}`,
            referenceResult: expectedEmailBody
        };

        await composerPage.goto();
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails(scratchDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();
        await composerPage.addEmailChannel();
        await composerPage.expectAddChannelSuccessMessageVisible();

        // 4. Create a journey and configure steps using the created identity
        const journeysPage = new JourneysPage(page);
        const journeyName = `Journey_${emailSuffix}`;
        await journeysPage.goto();
        await journeysPage.openCreateJourneyDialog();
        await journeysPage.fillAndSubmitCreateJourney(journeyName);
        await journeysPage.expectStatusMessage(`Journey ${journeyName} created`);
        await expect(journeysPage.getRowLocator(journeyName)).toBeVisible({ timeout: 10000 });

        // Open journey canvas
        await journeysPage.openJourneyByName(journeyName);

        // Configure Start step with identity
        await journeysPage.configureStepWithEmail(page, 'Start', uniqueTitle, testRecipient, identityName);

        // Perform drag-and-drop to create a new step
        await journeysPage.page.getByText('Start').click();
        await journeysPage.dragFromStartConnector(200, 0);

        // Configure New Step 1 with identity
        await journeysPage.configureStepWithEmail(page, 'New Step 1', uniqueTitle, testRecipient, identityName);

        // Add connection rule
        await journeysPage.addConnectionRule(page, journeyName);

        // Activate journey
        await page.getByRole('button', { name: 'Activate' }).click();
        await expect(page.getByText('Journey activated successfully')).toBeVisible({ timeout: 10000 });
    });


    test.skip('should deliver email from Start step without rule and verify receipt in Mailpit', async ({ page, request }) => {
        // 1. Create contact with email subscription activated
        const emailSuffix = faker.string.alphanumeric(7);
        const testRecipient = `journey-test-${emailSuffix}@example.com`;

        const contactsListPage = new ContactsListPage(page);
        const contactCreateModal = new ContactCreateModal(page);
        const contactDetailPage = new ContactDetailPage(page);

        await contactsListPage.goto();
        await contactsListPage.clickCreateButton();
        await contactCreateModal.fillAndSubmit({
            email: testRecipient,
            firstName: 'Journey',
            lastName: 'Recipient'
        });
        await contactsListPage.openContactByEmail(testRecipient);
        await contactDetailPage.expectHeadingVisible('Journey Recipient');
        await contactDetailPage.gotoSubscriptionsTab();
        await contactDetailPage.addEmailSubscription();
        await contactDetailPage.activateEmailSubscription();
        await page.waitForTimeout(500);

        // 2. Create identity in Admin Panel
        const identityName = `Journey User <journey-identity-${emailSuffix}@example.com>`;
        const profilePage = new ProfilePage(page);
        await profilePage.gotoIdentities();
        await profilePage.createIdentity(identityName);

        // 3. Create a composition with Email channel
        const composerPage = new ComposerPage(page);
        const uniqueTitle = `JourneyComp_${emailSuffix}`;
        const expectedEmailBody = `Journey Email Content ${emailSuffix}`;
        const scratchDetails = {
            title: uniqueTitle,
            category: `JourneyCat_${emailSuffix}`,
            language: 'English',
            persona: `Journey Persona ${emailSuffix}`,
            model: 'gpt-4o-mini',
            referencePrompt: `Journey Prompt ${emailSuffix}`,
            referenceResult: expectedEmailBody
        };

        await composerPage.goto();
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails(scratchDetails);
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();
        await composerPage.addEmailChannel();
        await composerPage.expectAddChannelSuccessMessageVisible();

        // 4. Create a journey and configure steps using the created identity
        const journeysPage = new JourneysPage(page);
        const journeyName = `Journey_${emailSuffix}`;
        await journeysPage.goto();
        await journeysPage.openCreateJourneyDialog();
        await journeysPage.fillAndSubmitCreateJourney(journeyName);
        await journeysPage.expectStatusMessage(`Journey ${journeyName} created`);
        await expect(journeysPage.getRowLocator(journeyName)).toBeVisible({ timeout: 10000 });

        // Open journey canvas
        await journeysPage.openJourneyByName(journeyName);

        // Configure Start step with identity
        await journeysPage.configureStepWithEmail(page, 'Start', uniqueTitle, testRecipient, identityName);

        // Perform drag-and-drop to create a new step
        await journeysPage.page.getByText('Start').click();
        await journeysPage.dragFromStartConnector(200, 0);

        // Configure New Step 1 with identity
        await journeysPage.configureStepWithEmail(page, 'New Step 1', uniqueTitle, testRecipient, identityName);


        // Activate journey
        await page.getByRole('button', { name: 'Activate' }).click();
        await expect(page.getByText('Journey activated successfully')).toBeVisible({ timeout: 10000 });

        const mailpit = new MailpitHelper(request);

        // Use the actual subject/title used in the composition
        // If uniqueTitle is the correct subject, use it:
        const expectedSubject = uniqueTitle;

        // If the subject is generated differently, fetch it from the composition or Mailpit response

        // Wait for 2 emails to arrive for the recipient with the expected subject
        const mailpitResponse = await request.get('http://localhost:8025/api/v1/messages');
        const emails = (await mailpitResponse.json()).messages;
        console.log('Subjects found:', emails.map(e => e.Subject));
        await mailpit.assertEmailsContent(emails, expectedSubject, expectedEmailBody);
    });

});

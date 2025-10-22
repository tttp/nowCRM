import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { ContactsListPage } from './pages/ContactsListPage';
import { ContactCreateModal } from './pages/ContactCreateModal';
import { ContactsMassActionsPage } from './pages/ContactsMassActionsPage';
import { ComposerPage } from './pages/ComposerPage';
import { ProfilePage } from './pages/ProfilePage';
import { ListsPage } from './pages/ListsPage';
import { loginUser } from './utils/authHelper';
import { MailpitHelper } from './pages/MailpitHelper';

let contact1: { firstName: string; lastName: string; email: string };
let contact2: { firstName: string; lastName: string; email: string };

test.describe('Contacts Mass Actions', () => {
    test.beforeEach(async ({ page }) => {
        await loginUser(page);

        contact1 = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email({ provider: 'subtest1.example.com' })
        };
        contact2 = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email({ provider: 'subtest2.example.com' })
        };

        const contactsListPage = new ContactsListPage(page);
        const contactCreateModal = new ContactCreateModal(page);

        await contactsListPage.clickCreateButton();
        await contactCreateModal.waitForDialogVisible();
        await contactCreateModal.fillAndSubmit(contact1);
        await contactCreateModal.expectCreationStatusMessage(contact1.firstName);

        await contactsListPage.clickCreateButton();
        await contactCreateModal.waitForDialogVisible();
        await contactCreateModal.fillAndSubmit(contact2);
        await contactCreateModal.expectCreationStatusMessage(contact2.firstName);
    });

    test('should subscribe contacts to Email channel and verify subscription is active', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);

        await massActionsPage.subscribeContactsToEmail([
            `${contact1.firstName} ${contact1.lastName}`,
            `${contact2.firstName} ${contact2.lastName}`
        ]);
        await expect(page.getByRole('status')).toContainText('The process of updating subscriptions to contacts has started.');
        await massActionsPage.assertEmailSubscriptionActive(contact1.firstName);
        await page.goto('/en/crm/contacts');
        await massActionsPage.assertEmailSubscriptionActive(contact2.firstName);
    });

    test('should unsubscribe contacts from Email channel and verify subscription is inactive', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);

        await massActionsPage.unsubscribeContactsFromEmail([
            `${contact1.firstName} ${contact1.lastName}`,
            `${contact2.firstName} ${contact2.lastName}`
        ]);
        await expect(page.getByRole('status')).toContainText('The process of updating subscriptions to contacts has started.');
        await massActionsPage.assertEmailSubscriptionInactive(contact1.firstName);
        await page.goto('/en/crm/contacts');
        await massActionsPage.assertEmailSubscriptionInactive(contact2.firstName);
    });

    test('should add selected contacts to a list via mass action', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const listsPage = new ListsPage(page);

        const uniqueListName = `List_${faker.string.alphanumeric(6)}`;
        await listsPage.goto();
        await listsPage.openCreateDialog();
        await listsPage.fillAndSubmitCreateDialog(uniqueListName);
        await listsPage.expectStatusMessage(`List ${uniqueListName} created`);
        await expect(listsPage.getRowLocator(uniqueListName)).toBeVisible({ timeout: 10000 });

        await page.goto('/en/crm/contacts');
        await massActionsPage.addContactsToList(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            uniqueListName,
        );

        await listsPage.goto();
        const listRow = listsPage.getRowLocator(uniqueListName);
        await expect(listRow).toBeVisible({ timeout: 10000 });
    });

    test('should delete selected contacts via mass action', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);

        await page.goto('/en/crm/contacts');
        await massActionsPage.deleteContacts([
            `${contact1.firstName} ${contact1.lastName}`,
            `${contact2.firstName} ${contact2.lastName}`
        ]);

        await expect(page.getByText(`${contact1.firstName} ${contact1.lastName}`)).not.toBeVisible({ timeout: 10000 });
        await expect(page.getByText(`${contact2.firstName} ${contact2.lastName}`)).not.toBeVisible({ timeout: 10000 });
    });

    test.skip('should send composition via mass action and verify email delivery', async ({ page, request }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const composerPage = new ComposerPage(page);
        const profilePage = new ProfilePage(page);

        await massActionsPage.subscribeContactsToEmail([
            `${contact1.firstName} ${contact1.lastName}`,
            `${contact2.firstName} ${contact2.lastName}`
        ]);
        await expect(page.getByRole('status')).toContainText('The process of updating subscriptions to contacts has started.');
        await massActionsPage.assertEmailSubscriptionActive(contact1.firstName);
        await page.goto('/en/crm/contacts');
        await massActionsPage.assertEmailSubscriptionActive(contact2.firstName);

        const compositionName = `Email Template ${faker.string.alphanumeric(6)}`;
        await composerPage.goto();
        await composerPage.clickCreateNew();
        await composerPage.clickCreateFromScratch();
        await composerPage.clickEdit();
        await composerPage.fillScratchDetails({
            title: compositionName,
            category: 'TestCategory',
            language: 'English',
            persona: 'Test Persona',
            model: 'gpt-4o-mini',
            referencePrompt: 'Test prompt',
            referenceResult: 'Test result'
        });
        await composerPage.clickSave();
        await composerPage.expectUpdateSuccessMessageVisible();
        await composerPage.addEmailChannel();
        await composerPage.expectAddChannelSuccessMessageVisible();

        const identityName = `Test User <user-identity-${faker.string.alphanumeric(6)}@example.com>`;
        await profilePage.gotoIdentities();
        await profilePage.createIdentity(identityName);

        await page.goto('/en/crm/contacts');
        await massActionsPage.sendCompositionToContacts(
            [`${contact1.firstName} ${contact1.lastName}`, `${contact2.firstName} ${contact2.lastName}`],
            'Email',
            compositionName,
            identityName,
            true
        );

        await expect(page.getByText('The sending process has started.')).toBeVisible();

        const mailpit = new MailpitHelper(request);
        const recipients = [contact1.email, contact2.email];
        for (const recipient of recipients) {
            await mailpit.waitForEmails(recipient, compositionName, 1, 90000);
        }
    });

    test('should anonymize contacts via mass action and verify anonymization', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        await page.goto('/en/crm/contacts');
        await massActionsPage.anonymizeContacts([
            `${contact1.firstName} ${contact1.lastName}`,
            `${contact2.firstName} ${contact2.lastName}`
        ]);

        await contactsListPage.expectContactRowAnonymized();
        await contactsListPage.expectContactRowAnonymized();
    });

    test('should export selected contacts via mass action and verify CSV download', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);

        await page.goto('/en/crm/contacts');
        await massActionsPage.exportContacts([
            `${contact1.firstName} ${contact1.lastName}`,
            `${contact2.firstName} ${contact2.lastName}`
        ]);

        const download = await page.waitForEvent('download', { timeout: 15000 });
        const suggestedFilename = download.suggestedFilename();
        expect(suggestedFilename).toMatch(/\.csv$/);
    });

    test('should update first name for selected contacts via mass action', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);

        // Update the first name for both contacts created in beforeEach
        const updatedFirstName = 'QATEST';
        const updatedContactNames = [
            `${updatedFirstName} ${contact1.lastName}`,
            `${updatedFirstName} ${contact2.lastName}`
        ];

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'First Name',
            updatedFirstName
        );

        // Assert the new value is present in the table
        await expect(page.locator('tbody')).toContainText(updatedFirstName);

        // Assert both updated rows are visible and selectable
        for (const name of updatedContactNames) {
            await expect(
                page.getByRole('row', { name: `Select row ${name}` }).getByLabel('Select row')
            ).toBeVisible();
        }
    });

        test('should update last name for selected contacts via mass action', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);

            // Update the last name for both contacts created in beforeEach
            const updatedLastName = 'QALAST';
            const updatedContactNames = [
                `${contact1.firstName} ${updatedLastName}`,
                `${contact2.firstName} ${updatedLastName}`
            ];

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Last Name',
                updatedLastName
            );

            // Assert the new value is present in the table
            await expect(page.locator('tbody')).toContainText(updatedLastName);

            // Assert both updated rows are visible and selectable
            for (const name of updatedContactNames) {
                await expect(
                    page.getByRole('row', { name: `Select row ${name}` }).getByLabel('Select row')
                ).toBeVisible();
            }
        });
        
    test('should update Address Line 1 for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedAddressLine1 = 'QA Address Line 1';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Address Line1',
            updatedAddressLine1
        );

    await contactsListPage.openContactByEmail(contact1.email);
    await expect(page.getByText(updatedAddressLine1)).toBeVisible();
    });

    test('should update Address Line 2 for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedAddressLine2 = 'QA Address Line 2';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Address Line2',
            updatedAddressLine2
        );

    await contactsListPage.openContactByEmail(contact1.email);
    await expect(page.getByText(updatedAddressLine2)).toBeVisible();
    });

    test('should update Zip for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedZip = '12345';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Zip',
            updatedZip
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedZip)).toBeVisible();
    });

    test('should update Location for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedLocation = 'QA Location';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Location',
            updatedLocation
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedLocation)).toBeVisible();
    });

    test('should update Canton for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedCanton = 'QA Canton';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Canton',
            updatedCanton
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedCanton)).toBeVisible();
    });

    test('should update Country for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedCountry = 'QA Country';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Country',
            updatedCountry
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedCountry)).toBeVisible();
    });

    test('should update Language for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        // Use a real language from the dropdown: English, Deutsch, Italiano, Français
        const updatedLanguage = 'English';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Language',
            updatedLanguage
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedLanguage)).toBeVisible();
    });

    test('should update Function for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedFunction = 'QA Function';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Function',
            updatedFunction
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedFunction)).toBeVisible();
    });

        test('should update Phone for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            const updatedPhone = '+1234567890';

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Phone',
                updatedPhone
            );

            await contactsListPage.openContactByEmail(contact1.email);
            await expect(page.getByText(updatedPhone)).toBeVisible();
        });

        test('should update Mobile Phone for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            const updatedMobilePhone = '+1987654321';

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Mobile Phone',
                updatedMobilePhone
            );

            await contactsListPage.openContactByEmail(contact1.email);
            await expect(page.getByText(updatedMobilePhone)).toBeVisible();
        });

        test('should update Salutation for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            // Use a real value from the dropdown: Mr, Mrs, Ms, Dr, Custom...
            const updatedSalutation = 'Dr';

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Salutation',
                updatedSalutation
            );

            await contactsListPage.openContactByEmail(contact1.email);
            const expectedFullName = `${updatedSalutation} ${contact1.firstName} ${contact1.lastName}`;
            await expect(page.getByText(new RegExp(`^${expectedFullName}`))).toBeVisible();
        });

        test('should update Gender for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            // Use a real gender value from the dropdown: Male, Female, other
            const updatedGender = 'Male';

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Gender',
                updatedGender
            );

            await contactsListPage.openContactByEmail(contact1.email);
            await expect(page.getByText(updatedGender)).toBeVisible();
        });

        test('should update Website Url for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            const updatedWebsiteUrl = 'https://example.com';

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Website Url',
                updatedWebsiteUrl
            );

            await contactsListPage.openContactByEmail(contact1.email);
            // Assert the Website link is visible and has the correct href
            const websiteLink = page.getByRole('link', { name: 'Website' });
            await expect(websiteLink).toBeVisible();
            await expect(websiteLink).toHaveAttribute('href', updatedWebsiteUrl);
        });

        test('should update Linkedin Url for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            const updatedLinkedinUrl = 'https://linkedin.com/in/qatest';

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Linkedin Url',
                updatedLinkedinUrl
            );

            await contactsListPage.openContactByEmail(contact1.email);
            // Assert the LinkedIn link is visible and has the correct href
            const linkedinLink = page.getByRole('link', { name: 'LinkedIn' });
            await expect(linkedinLink).toBeVisible();
            await expect(linkedinLink).toHaveAttribute('href', updatedLinkedinUrl);
        });

        test('should update Facebook Url for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            const updatedFacebookUrl = 'https://facebook.com/qatest';

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Facebook Url',
                updatedFacebookUrl
            );

            await contactsListPage.openContactByEmail(contact1.email);
            // Assert the Facebook link is visible and has the correct href
            const facebookLink = page.getByRole('link', { name: 'Facebook' });
            await expect(facebookLink).toBeVisible();
            await expect(facebookLink).toHaveAttribute('href', updatedFacebookUrl);
        });

        test('should update Twitter Url for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            const updatedTwitterUrl = 'https://twitter.com/qatest';

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Twitter Url',
                updatedTwitterUrl
            );

            await contactsListPage.openContactByEmail(contact1.email);
            // Assert the Twitter link is visible and has the correct href
            const twitterLink = page.getByRole('link', { name: 'Twitter' });
            await expect(twitterLink).toBeVisible();
            await expect(twitterLink).toHaveAttribute('href', updatedTwitterUrl);
        });

        test('should update Birth Date for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            // Use current date for robust test
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const updatedBirthDate = `${year}-${month}-${day}`;

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Birth Date',
                updatedBirthDate
            );

            await contactsListPage.openContactByEmail(contact1.email);
            // Convert to display format 'Birth Date DD/MM/YYYY'
            const displayBirthDate = `Birth Date ${day}/${month}/${year}`;
            await expect(page.getByText(displayBirthDate)).toBeVisible();
        });

        test('should update Organization for selected contacts via mass action and verify in details page', async ({ page }) => {
            const massActionsPage = new ContactsMassActionsPage(page);
            const contactsListPage = new ContactsListPage(page);

            const updatedOrganization = 'QA Organization';

            await massActionsPage.updateContactsField(
                [
                    `${contact1.firstName} ${contact1.lastName}`,
                    `${contact2.firstName} ${contact2.lastName}`
                ],
                'Organization',
                updatedOrganization
            );

            await contactsListPage.openContactByEmail(contact1.email);
            await expect(page.getByText(updatedOrganization)).toBeVisible();
        });







    test('should update Department for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedDepartment = 'QA Department';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Department',
            updatedDepartment
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedDepartment)).toBeVisible();
    });

    test('should update Description for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedDescription = 'QA Description';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Description',
            updatedDescription
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedDescription)).toBeVisible();
    });

    test.skip('should update Contact Interests for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedContactInterests = 'QA Interests';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Contact Interests',
            updatedContactInterests
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedContactInterests)).toBeVisible();
    });

    test.skip('should update Priority for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedPriority = 'High';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Priority',
            updatedPriority
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedPriority)).toBeVisible();
    });

    test.skip('should update Status for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedStatus = 'Active';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Status',
            updatedStatus
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedStatus)).toBeVisible();
    });

    test.skip('should update Tag for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedTag = 'QA Tag';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Tag',
            updatedTag
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedTag)).toBeVisible();
    });

    test.skip('should update Keywords for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedKeywords = 'QA,Test,Keywords';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Keywords',
            updatedKeywords
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedKeywords)).toBeVisible();
    });

    test.skip('should update Last Access for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedLastAccess = '2025-08-22';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Last Access',
            updatedLastAccess
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedLastAccess)).toBeVisible();
    });

    test.skip('should update Account Created At for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedAccountCreatedAt = '2025-08-22';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Account Created At',
            updatedAccountCreatedAt
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedAccountCreatedAt)).toBeVisible();
    });

    test.skip('should update Ranks for selected contacts via mass action and verify in details page', async ({ page }) => {
        const massActionsPage = new ContactsMassActionsPage(page);
        const contactsListPage = new ContactsListPage(page);

        const updatedRanks = 'QA Rank';

        await massActionsPage.updateContactsField(
            [
                `${contact1.firstName} ${contact1.lastName}`,
                `${contact2.firstName} ${contact2.lastName}`
            ],
            'Ranks',
            updatedRanks
        );

        await contactsListPage.openContactByEmail(contact1.email);
        await expect(page.getByText(updatedRanks)).toBeVisible();
    });


});
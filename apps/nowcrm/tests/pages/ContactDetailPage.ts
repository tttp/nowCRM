// contactsapp/tests/pages/ContactDetailPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

type ContactSection = 'Personal Information' | 'Address Information' | 'Professional Information';

// Ensure 'export' is present before 'class'
export class ContactDetailPage {
    readonly page: Page;
    readonly subscriptionsTab: Locator;
    readonly addSubscriptionButton: Locator;
    readonly channelSearchInput: Locator;
    readonly emailChannelOption: Locator;
    readonly addSubscriptionModalButton: Locator;
    readonly activeEmailSubscription: Locator;

    constructor(page: Page) {
        this.page = page;
        this.subscriptionsTab = this.page.getByRole('link', { name: 'Subscriptions', exact: true });
        this.addSubscriptionButton = this.page.getByRole('button', { name: 'Add subscription' });
        this.channelSearchInput = this.page.getByPlaceholder('Search channel...');
        this.emailChannelOption = this.page.getByText('Email', { exact: true });
        this.addSubscriptionModalButton = this.page.getByRole('button', { name: 'Add subscription' });
        this.activeEmailSubscription = this.page.getByText('Email', { exact: true });
    }

    async expectHeadingVisible(fullName: string) {
        await expect(this.page.getByRole('heading', { name: fullName }), `Heading "${fullName}" should be visible on detail page`)
            .toBeVisible({ timeout: 15000 });
    }

    /**
     * Uses the text-based filter approach to find the Edit button within a section.
     */
    getEditButtonForSection(sectionName: ContactSection): Locator {
        return this.page.locator('div')
                   .filter({ hasText: new RegExp(`^${sectionName}Edit$`) })
                   .getByRole('button', { name: 'Edit' });
    }

    async clickEditButton(sectionName: ContactSection) {
        if (sectionName === 'Personal Information') {
            const button = this.page.getByRole('button', { name: 'Edit' }).first();
            await expect(button, `Edit button for ${sectionName} should be visible`).toBeVisible({ timeout: 10000 });
            await button.click();
            return;
        }
        if (sectionName === 'Address Information') {
            await this.page.locator('div').filter({ hasText: /^Address InformationEdit$/ }).getByRole('button').click();
            return;
        }
        if (sectionName === 'Professional Information') {
            await this.page.locator('div').filter({ hasText: /^Professional InformationEdit$/ }).getByRole('button').click();
            return;
        }
    }

    async expectDetailContainsText(text: string, timeout: number = 10000) {
        // Refine the locator to ensure it targets a unique <main> element
        const mainContent = this.page.locator('main.grow.overflow-auto').first(); // Ensure we target the first matching <main> element
        await expect(mainContent, `Detail page main content should contain "${text}"`).toContainText(text, { timeout });
    }

    async gotoSubscriptionsTab(): Promise<void> {
        await this.subscriptionsTab.click();
        await expect(this.addSubscriptionButton).toBeVisible({ timeout: 5000 });
    }

    async addEmailSubscription(): Promise<void> {
        await this.addSubscriptionButton.click();
        await expect(this.channelSearchInput).toBeVisible({ timeout: 5000 });
        await this.channelSearchInput.fill('Email');
        await this.emailChannelOption.click();
        await this.addSubscriptionModalButton.click();
        const successToast = this.page.getByText('Subscription on channel Email added', { exact: true });
        await expect(successToast).toBeVisible({ timeout: 5000 });
        await expect(successToast).not.toBeVisible({ timeout: 10000 });
        await expect(this.activeEmailSubscription).toBeVisible({ timeout: 20000 });
    }

     async activateEmailSubscription(): Promise<void> {
        await this.page.getByRole('switch').click();
        await expect(this.page.getByText('Subscription activated')).toBeVisible({ timeout: 10000 });
    }
}

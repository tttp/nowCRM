// contactsapp/tests/pages/CommonPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class CommonPage {
    readonly page: Page;

    // Locators
    readonly userMenuTrigger: Locator;
    readonly userMenuDropdown: Locator;
    readonly logoutButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // *** Reverted to locator from original 01Authentication.spec.ts ***
        // WARNING: This locator is likely very fragile and might break easily.
        // Consider adding a test-id or a more specific attribute if possible.
        this.userMenuTrigger = page.locator('.flex.content-center');

        // Assuming the dropdown menu appears with role='menu'
        this.userMenuDropdown = page.getByRole('menu');

        // *** Reverted to locator from original 01Authentication.spec.ts ***
        // Scoped within the menu dropdown for better reliability.
        // WARNING: This locator is also fragile (depends on CSS class and structure).
        this.logoutButton = this.userMenuDropdown.locator('button.w-full');
        // Recommended Alternative: this.page.getByRole('menuitem', { name: /logout|sign out/i });
    }

    // Actions
    /** Opens the user menu using the locator from the original spec file */
    async openUserMenu() {
        await expect(this.userMenuTrigger, 'User menu trigger should be visible').toBeVisible({ timeout: 15000 });
        await this.userMenuTrigger.click();
        await expect(this.userMenuDropdown, 'User menu dropdown should appear').toBeVisible({ timeout: 5000 });
    }

    async clickLogout() {
        // Wait for the logout button (located within the menu) to be visible
        await expect(this.logoutButton, 'Logout button should be visible in menu').toBeVisible();
        await this.logoutButton.click();
    }

    /** Convenience method for logging out */
    async logout() {
        await this.openUserMenu();
        await this.clickLogout();
    }

    // Assertions
    async expectUserEmailVisibleInMenu(email: string, timeout: number = 5000) {
        // Scope the email check within the visible dropdown menu
        await expect(this.userMenuDropdown.getByText(email), `User email "${email}" should be visible in menu`).toBeVisible({ timeout });
    }

     async expectDashboardVisible(timeout: number = 10000) {
        // Assumes the URL includes '/crm' after successful login
        await expect(this.page, 'URL should indicate CRM dashboard').toHaveURL(/\/crm$/, { timeout });
     }
}

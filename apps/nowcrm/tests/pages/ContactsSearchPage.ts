import { Page, expect } from '@playwright/test';

export class ContactsSearchPage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    async openAdvancedFilters() {
        const button = this.page.getByRole('button', { name: 'Advanced Filters' });
        await button.waitFor({ state: 'visible', timeout: 5000 });
        await expect(button).toBeEnabled({ timeout: 5000 });

        // Wait for overlays/spinners to disappear (if any)
        try {
            await this.page.waitForSelector('.overlay, .spinner', { state: 'hidden', timeout: 2000 });
        } catch { /* ignore if not present */ }

        // Retry click if intercepted, use force as last resort
        for (let i = 0; i < 3; i++) {
            try {
                await button.click();
                return;
            } catch (err) {
                if (i === 2) {
                    // Last attempt: force click
                    if (!this.page.isClosed()) {
                        await button.click({ force: true });
                    }
                    return;
                }
                if (this.page.isClosed()) {
                    // Page is closed, exit early
                    return;
                }
                await this.page.waitForTimeout(500);
            }
        }
    }

    async openPersonalInformationSection() {
        await this.page.getByText(/Personal Information/).click();
    }

    async filterByFirstName(firstName: string) {
        await this.page.getByRole('textbox', { name: 'First Name' }).click();
        await this.page.getByRole('textbox', { name: 'First Name' }).fill(firstName);
    }

    async applyFilters() {
        await this.page.getByRole('button', { name: 'Apply Filters' }).click();
    }

    async expectContactVisible(firstName: string, lastName: string) {
        await expect(this.page.locator('tbody')).toContainText(firstName);
        await expect(this.page.locator('tbody')).toContainText(lastName);
    }
}

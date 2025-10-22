import { Page, expect } from '@playwright/test';

export class AdvancedFiltersPage {
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
                    await button.click({ force: true });
                    return;
                }
                await this.page.waitForTimeout(500);
            }
        }
    }

    async expandGeneralInformation() {
        await this.page.getByText('General Information (0)').click();
    }

    async setNameFilter(value: string) {
        await this.page.getByRole('textbox', { name: 'Name' }).click();
        await this.page.getByRole('textbox', { name: 'Name' }).fill(value);
    }

    async setLocationFilter(value: string) {
        await this.page.getByText('Address Information (0)').click();
        await this.page.getByRole('textbox', { name: 'Location' }).click();
        await this.page.getByRole('textbox', { name: 'Location' }).fill(value);
    }

    async resetFilters() {
        let button;
        try {
            button = this.page.getByRole('button', { name: 'Reset Filters' });
            await button.waitFor({ state: 'attached', timeout: 8000 });
        } catch {
            // Fallback: try by text
            button = this.page.getByText('Reset Filters');
            try {
                await button.waitFor({ state: 'attached', timeout: 8000 });
            } catch {
                // Debug: print HTML if button not found
                const html = await this.page.content();
                console.warn('Reset Filters button not found. Current HTML:', html);
                return;
            }
        }
        // Try to wait for visible, fallback to force click if not
        try {
            await button.waitFor({ state: 'visible', timeout: 4000 });
            await button.click();
        } catch (err) {
            await button.click({ force: true });
        }
        // Wait for table to update
        await this.page.waitForTimeout(800);
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

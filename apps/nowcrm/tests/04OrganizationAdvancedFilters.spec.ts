import { test, expect } from '@playwright/test';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { AdvancedFiltersPage } from './pages/AdvancedFiltersPage';

// If authentication is required, add login steps here or use a helper

// Playwright test suite for Organizations Advanced Filters

test.describe('Organizations - Advanced Filters', () => {
  let organizationName: string;
  test.beforeEach(async ({ page }) => {
  // Login using robust locators for form fields
  await page.goto('/en/auth');
  await page.locator('form input[name="email"]').fill('testuser@example.com');
  await page.locator('form input[name="password"]').fill('StrongPassword123!');
  await page.locator('form button[type="submit"]').click();
  await page.waitForURL(/\/crm/);
    // Go to organizations page
    const organizationsPage = new OrganizationsPage(page);
    await organizationsPage.goto();
    // Create a unique test organization
    organizationName = `TestOrg_${Date.now()}`;
    await organizationsPage.createOrganization(organizationName, 'London');
  });

  test('displays all advanced filter categories', async ({ page }) => {
    const organizationsPage = new OrganizationsPage(page);
    await organizationsPage.openAdvancedFilters();
    await expect(page.getByText('General Information (0)')).toBeVisible();
    await expect(page.getByText('Address Information (0)')).toBeVisible();
    await expect(page.getByText('Social Media (0)')).toBeVisible();
    await expect(page.getByText('Organization and Contacts (0)')).toBeVisible();
    await expect(page.getByText('Preferences / Other (0)')).toBeVisible();
  });

  test('applies a filter and shows filtered results', async ({ page }) => {
    const organizationsPage = new OrganizationsPage(page);
    const filtersPage = new AdvancedFiltersPage(page);
    await filtersPage.openAdvancedFilters();
    await filtersPage.expandGeneralInformation();
    await filtersPage.setNameFilter(organizationName);
    await filtersPage.applyFilters();
    await page.waitForTimeout(500);
    await expect(page.locator('tbody')).toContainText(organizationName);
  });

  test('resets filters and shows all organizations with generic prefix', async ({ page }) => {
    const organizationsPage = new OrganizationsPage(page);
    await organizationsPage.openAdvancedFilters();
    const filtersPage = new AdvancedFiltersPage(page);
    await filtersPage.expandGeneralInformation();
    await filtersPage.setNameFilter(organizationName);
    await filtersPage.applyFilters();
    await page.waitForTimeout(500);
    await filtersPage.resetFilters();
    await page.waitForTimeout(500);
    // Check that the table contains at least one organization with the generic prefix after reset
    await expect(page.locator('tbody')).toContainText(/^TestOrg/);
  });

  test('handles empty filter values gracefully', async ({ page }) => {
    const organizationsPage = new OrganizationsPage(page);
    await organizationsPage.openAdvancedFilters();
    const filtersPage = new AdvancedFiltersPage(page);
    await filtersPage.expandGeneralInformation();
    await filtersPage.setNameFilter('');
    await filtersPage.applyFilters();
    await page.waitForTimeout(500);
    expect(await organizationsPage.isShowingAllResults()).toBeTruthy();
  });

  test('allows multiple filters to be applied', async ({ page }) => {
    const organizationsPage = new OrganizationsPage(page);
    await organizationsPage.openAdvancedFilters();
    const filtersPage = new AdvancedFiltersPage(page);
    await filtersPage.expandGeneralInformation();
    await filtersPage.setNameFilter(organizationName);
    await filtersPage.setLocationFilter('London');
    await filtersPage.applyFilters();
    await page.waitForTimeout(500);
    await expect(page.locator('tbody')).toContainText(organizationName);
  });
});

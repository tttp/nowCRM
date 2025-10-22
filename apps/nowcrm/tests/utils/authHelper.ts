// contactsapp/tests/utils/authHelper.ts
import { Page, expect } from '@playwright/test';
import { testCredentials } from "./data";

/**
 * Performs login using the UI via /en/auth.
 * Relies on baseURL configured in playwright.config.ts.
 * Waits for successful login by verifying the post-login URL pattern.
 *
 * @param page The Playwright Page object.
 * @param postLoginUrlRegex Optional: A RegExp for the expected URL pattern after successful login. Defaults to checking for '/crm' at the end of the path.
 */
export async function loginUser(
  page: Page,
  postLoginUrlRegex: RegExp = /\/crm$/ // Default check for '/crm' at the end of the URL path
): Promise<void> {

  console.log(`Attempting login via UI for user: ${testCredentials.email}`);

  try {
    await page.goto('/en/auth');
    console.log(`Navigated to relative path /en/auth (BaseURL: ${page.context()})`);

    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible({ timeout: 10000 });
    await page.getByRole('textbox', { name: 'Email' }).fill(testCredentials.email);
    await page.getByRole('textbox', { name: 'Password' }).fill(testCredentials.password);
    console.log('Filled credentials');

    await page.getByRole('button', { name: 'Sign in' }).click();
    console.log('Clicked "Sign in" button');

    console.log(`Waiting for URL to match: ${postLoginUrlRegex}`);
    await expect(page).toHaveURL(postLoginUrlRegex, { timeout: 15000 });

    console.log(`Login successful. Current URL: ${page.url()}`);

  } catch (error: any) {
    // Log the original error for easier debugging
    console.error(`UI Login failed for ${testCredentials.email}. Original error: ${error.message}`);
    // Re-throw the error to ensure the test fails clearly at the login step
    throw new Error(`Login failed during UI interaction: ${error.message}`);
  }
}

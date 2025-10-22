// contactsapp/tests/setup/global-setup.ts

import { chromium, FullConfig, expect, Browser, Page, request as playwrightRequest } from '@playwright/test';
import path from 'path';
import fs from 'fs/promises';
import { createTestUser, waitForStrapiReady, adminLoginUrl } from './create-users';

// Define the path for the storage state file
export const STORAGE_STATE_PATH = path.join(__dirname, '../.auth/user.json');

async function globalSetup(config: FullConfig): Promise<void> {
    console.log('Starting global setup...');

    // Get required environment variables
    const baseURL = process.env.CRM_BASE_URL;
    const userEmail = process.env.TEST_USER_EMAIL;
    const userPassword = process.env.TEST_USER_PASSWORD;

    // Basic validation
    if (!baseURL) throw new Error('CRM_BASE_URL environment variable is not set.');
    if (!userEmail || !userPassword) throw new Error('TEST_USER_EMAIL or TEST_USER_PASSWORD environment variable is not set.');

    // Initialize resources
    let browser: Browser | null = null;
    let page: Page | null = null;
    let apiRequestContext = null;

    try {
        // Step 1: Create/Verify Test User via API
        console.log('Ensuring test user exists via API...');
        apiRequestContext = await playwrightRequest.newContext();
        await waitForStrapiReady(adminLoginUrl);
        await createTestUser(apiRequestContext); // Call the imported function
        console.log('Test user creation/check complete.');
        await apiRequestContext.dispose(); // Dispose context after use
        apiRequestContext = null;

        // Step 2: Perform UI Login
        console.log('Launching browser for UI login...');
        browser = await chromium.launch();
        page = await browser.newPage();

        const loginUrl = `${baseURL}/en/auth`;
        console.log(`Navigating to CRM login page: ${loginUrl}`);
        await page.goto(loginUrl);

        console.log(`Attempting CRM UI login for user: ${userEmail}`);
        await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible({ timeout: 10000 });
        await page.getByRole('textbox', { name: 'Email' }).fill(userEmail);
        await page.getByRole('textbox', { name: 'Password' }).fill(userPassword);
        await page.getByRole('button', { name: 'Sign in' }).click();

        // Step 3: Wait for successful UI login confirmation
        const postLoginUrlRegex = /\/crm$/;
        console.log(`Waiting for CRM URL to match: ${postLoginUrlRegex}`);
        await expect(page).toHaveURL(postLoginUrlRegex, { timeout: 15000 });
        console.log(`CRM UI Login successful. Current URL: ${page.url()}`);

        // Step 4: Ensure directory exists and Save storage state
        const authDir = path.dirname(STORAGE_STATE_PATH);
        console.log(`Ensuring directory exists: ${authDir}`);
        await fs.mkdir(authDir, { recursive: true }); // Create directory if needed
        console.log(`Directory ensured. Saving storage state to: ${STORAGE_STATE_PATH}`);
        await page.context().storageState({ path: STORAGE_STATE_PATH });
        console.log('Storage state saved successfully.'); // Should reach here if directory creation works

    } catch (error: any) {
        console.error('Error during global setup:', error);
        // Log details if it's specifically a mkdir error
        if (error.syscall === 'mkdir') {
            console.error(`Filesystem 'mkdir' error details: Code=[${error.code}], Path=[${error.path}]`);
        }
        throw new Error(`Global setup failed: ${error.message}`);
    } finally {
        // Ensure resources are cleaned up
        if (apiRequestContext) {
            await apiRequestContext.dispose(); // Dispose if error occurred before disposal
            console.log('API Request Context disposed (in finally).');
        }
        if (browser) {
            await browser.close();
            console.log('Browser closed.');
        }
    }
    console.log('Global setup finished successfully.');
}

export default globalSetup;

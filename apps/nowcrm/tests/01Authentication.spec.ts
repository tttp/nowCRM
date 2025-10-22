// contactsapp/tests/01Authentication.spec.ts
import { test, expect } from '@playwright/test';

import { loginUser } from './utils/authHelper';
import { testCredentials } from './utils/data';
import { createTestUser } from './setup/create-users';
import { deleteUserFromStrapi } from './setup/delete-users';

// Import Page Object Models (POMs)
import { LoginPage } from './pages/LoginPage';
import { CommonPage } from './pages/CommonPage';

test.describe('Authentication Flow', () => {
    let loginPage: LoginPage;
    let commonPage: CommonPage;

    // Initialize POMs before each test
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        commonPage = new CommonPage(page);
    });

    // Test: User should be able to log in successfully
    test('User should be able to login successfully', async ({ page }) => {
        await loginUser(page); // Uses helper function to log in

        await commonPage.expectDashboardVisible(); // Verify dashboard is visible
        await commonPage.openUserMenu(); // Open user menu
        await commonPage.expectUserEmailVisibleInMenu(testCredentials.email); // Verify user email is displayed
    });

    // Test: User should see an error message with invalid credentials
    test('User should see an error message with invalid credentials', async ({ page }) => {
        await loginPage.login('nonexistentuser@example.com', 'wrongpassword'); // Attempt login with invalid credentials
        await loginPage.expectInvalidCredentialsErrorVisible(); // Verify error message is displayed
        await loginPage.expectToBeOnLoginPage(); // Verify user remains on login page
    });

    // Test: User should see a validation error for invalid email format
    test('User should see a validation error for invalid email format', async ({ page }) => {
        await loginPage.goto(); // Navigate to login page
        await loginPage.fillCredentials('invalid-email-format', testCredentials.password); // Enter invalid email format
        await loginPage.clickSignIn(); // Attempt to sign in

        await loginPage.expectInvalidEmailErrorVisible(); // Verify validation error is displayed
        await loginPage.expectToBeOnLoginPage(); // Verify user remains on login page
    });

    // Test: User should be able to log out successfully
    test('User should be able to logout successfully', async ({ page }) => {
        await loginUser(page); // Log in
        await commonPage.expectDashboardVisible(); // Verify dashboard is visible
        await commonPage.logout(); // Log out
        await loginPage.expectToBeOnLoginPage(); // Verify user is redirected to login page
    });

    // Test: User should be able to request password recovery (forgot password)
    test('User should be able to request password recovery (forgot password)', async ({ page, request }) => {
        // Step 0: Create a unique user for this test
        const uniqueEmail = `recoverytestuser+${Date.now()}@example.com`;
        const username = `recoveryuser${Date.now()}`;
        const password = 'InitialPassword123!';
        const newPassword = 'NewSecurePassword123!';

        await createTestUser(request, {
            email: uniqueEmail,
            username,
            password,
            roleId: 3,
        });

        try {
            // Step 1: Navigate to the login page and access the "Forgot Password" section
            await loginPage.goto();
            await loginPage.gotoForgotPassword();

            // Step 2: Fill in the email and submit the password reset request
            await loginPage.fillForgotPasswordEmail(uniqueEmail);
            await loginPage.submitForgotPassword();
            await loginPage.expectForgotPasswordConfirmation();

            // Step 3: Check the email in Mailpit (get summary)
            const response = await request.get('http://localhost:8025/api/v1/messages');
            expect(response.ok()).toBeTruthy();

            const emails = (await response.json()).messages;
            const resetEmail = emails.find((email: any) =>
                email.To.some((recipient: any) => recipient.Address === uniqueEmail) &&
                email.Subject === 'Reset password'
            );
            expect(resetEmail).toBeDefined();

            // Step 4: Fetch the full email content using the message ID
            const messageId = resetEmail.ID;
            const fullMessageResponse = await request.get(`http://localhost:8025/api/v1/message/${messageId}`);
            expect(fullMessageResponse.ok()).toBeTruthy();
            const fullMessage = await fullMessageResponse.json();

            // Use the 'Text' field
            const emailText = fullMessage.Text;

            // Extract the full reset link from the email text (exclude any trailing HTML tags or whitespace)
            const resetLinkMatch = emailText.match(/http:\/\/localhost:3000\/en\/auth\/reset-password\?code=[a-zA-Z0-9]+/);
            expect(resetLinkMatch).not.toBeNull();
            const resetLink = resetLinkMatch[0];

            // Step 5: Navigate to the password reset link
            await page.goto(resetLink);

            // Step 6: Fill in the form with a new password
            await loginPage.fillResetPasswordForm(newPassword, newPassword);
            await loginPage.submitResetPassword();

            // Step 7: Verify the password reset was successful
            try {
                await loginPage.expectResetPasswordSuccess();
            } catch (error) {
                await loginPage.expectResetPasswordError();
                throw error;
            }

            // Step 8: Log in with the new password to verify functionality
            await loginPage.login(uniqueEmail, newPassword);
            await commonPage.expectDashboardVisible();
        } finally {
            // Cleanup: Delete the test user from Strapi and all emails from Mailpit
            await deleteUserFromStrapi(request, uniqueEmail);
            await request.delete('http://localhost:8025/api/v1/messages');
        }
    });
});

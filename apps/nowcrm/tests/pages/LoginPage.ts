// contactsapp/tests/pages/LoginPage.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    // Locators
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly signInButton: Locator;
    readonly invalidEmailError: Locator;
    readonly invalidCredentialsError: Locator;

    // Forgot password locators
    readonly forgotPasswordLink: Locator;
    readonly forgotPasswordEmailInput: Locator;
    readonly sendResetLinkButton: Locator;
    readonly forgotPasswordConfirmation: Locator;

    // Reset password locators
    readonly newPasswordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly resetPasswordButton: Locator;
    readonly resetPasswordSuccessMessage: Locator;
    readonly resetPasswordErrorMessage: Locator;

    constructor(page: Page) {
        this.page = page;

        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password' });
        this.signInButton = page.getByRole('button', { name: 'Sign in' });
        this.invalidEmailError = page.getByText('Please enter a valid email address');
        this.invalidCredentialsError = page.getByText('Login failed: Invalid email or password');

        // Forgot password selectors
        this.forgotPasswordLink = page.locator('a', { hasText: 'Forgot password?' });
        this.forgotPasswordEmailInput = page.locator('input[type="email"], input[id$="form-item"]');
        this.sendResetLinkButton = page.locator('button', { hasText: 'Send reset link' });
        this.forgotPasswordConfirmation = page.getByText('Please check your email for a password reset link.');

        // Reset password selectors
        this.newPasswordInput = page.getByRole('textbox', { name: 'New Password' }); 
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm Password' });
        this.resetPasswordButton = page.getByRole('button', { name: 'Reset password' });
        this.resetPasswordSuccessMessage = this.page.getByText(/Your password has been reset successfully/i);
        this.resetPasswordErrorMessage = this.page.getByText(/400 - Incorrect code provided/i);
    }

    // Actions
    async goto() {
        await this.page.goto('/en/auth');
        await expect(this.signInButton, 'Sign in button should be visible on login page').toBeVisible({ timeout: 15000 });
    }

    async fillCredentials(email: string, password?: string) {
        await this.emailInput.fill(email);
        if (password) {
            await this.passwordInput.fill(password);
        }
    }

    async clickSignIn() {
        await this.signInButton.click();
    }

    /** Convenience method combining common login steps */
    async login(email: string, password?: string) {
        await this.goto();
        await this.fillCredentials(email, password);
        await this.clickSignIn();
    }

    // Forgot password actions
    async gotoForgotPassword() {
        await this.forgotPasswordLink.click();
        await expect(this.page, 'Should navigate to forgot password page').toHaveURL(/\/auth\/forgot-password/);
    }

    async fillForgotPasswordEmail(email: string) {
        await this.forgotPasswordEmailInput.fill(email);
    }

    async submitForgotPassword() {
        await this.sendResetLinkButton.click();
    }

    async expectForgotPasswordConfirmation(timeout: number = 7000) {
        await expect(this.forgotPasswordConfirmation, 'Forgot password confirmation message should be visible')
            .toBeVisible({ timeout });
    }

    // Reset password actions
    async fillResetPasswordForm(newPassword: string, confirmPassword: string) {
        await this.newPasswordInput.fill(newPassword);
        await this.confirmPasswordInput.fill(confirmPassword);
    }

    async submitResetPassword() {
        await this.resetPasswordButton.click();
    }

    async expectResetPasswordSuccess(timeout: number = 15000) {
        await expect(this.resetPasswordSuccessMessage, 'Reset password success message should be visible')
            .toBeVisible({ timeout });
    }

    async expectResetPasswordError(timeout: number = 7000) {
        await expect(this.resetPasswordErrorMessage, 'Reset password error message should be visible')
            .toBeVisible({ timeout });
    }

    // Assertions
    async expectInvalidEmailErrorVisible(timeout: number = 5000) {
        await expect(this.invalidEmailError, 'Invalid email validation message should be visible').toBeVisible({ timeout });
    }

    async expectInvalidCredentialsErrorVisible(timeout: number = 10000) {
        await expect(this.invalidCredentialsError, 'Login failed: Invalid email or password').toBeVisible({ timeout });
    }

    async expectToBeOnLoginPage(timeout: number = 10000) {
        await expect(this.page, 'URL should be the login page').toHaveURL(/\/auth/, { timeout });
        await expect(this.signInButton, 'Sign in button should be visible').toBeVisible({ timeout: 5000 });
    }
}

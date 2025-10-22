// contactsapp/tests/08Profile.spec.ts
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';
import { ProfilePage } from './pages/ProfilePage';
import { loginUser } from './utils/authHelper';
import path from 'path';

test.describe('User Profile Management', () => {
    let profilePage: ProfilePage;

    test.beforeEach(async ({ page }) => {
        profilePage = new ProfilePage(page);
        await loginUser(page);
        await profilePage.goto();
    });

    test('should display profile information and allow entering edit mode', async () => {
        await expect(profilePage.editProfileBtn).toBeVisible();
        await expect(profilePage.profileHeader).toBeVisible();
        await expect(profilePage.page.locator('//h3[normalize-space()="Username"]')).toBeVisible();
        await expect(profilePage.page.locator('//h3[normalize-space()="Email"]')).toBeVisible();

        await profilePage.editProfileBtn.click();
        await expect(profilePage.usernameInput).toBeVisible();
        await expect(profilePage.emailInput).toBeVisible();
    });

    test('should update username and reflect change on profile page', async () => {
        const newUsername = `testuser_${faker.string.alphanumeric(6)}`;
        await profilePage.updateProfile(newUsername);
        await profilePage.expectProfileHeader(newUsername);
    });

    test('should show validation error for invalid username input', async () => {
        await profilePage.openEditProfile();
        await profilePage.usernameInput.fill('invalid username!');
        await profilePage.saveChangesBtn.click();
        await expect(profilePage.profileHeader).not.toHaveText('invalid username!');
    });

    test('should update profile picture and verify avatar change', async () => {
        const oldSrc = await profilePage.avatarImg.getAttribute('src');
        const imagePath = path.resolve(__dirname, 'files/avatar.jpeg');
        const newUsername = `testuser_${faker.string.alphanumeric(6)}`;
        await profilePage.updateProfile(newUsername, imagePath);
        await profilePage.expectProfileHeader(newUsername);
        await profilePage.expectAvatarChanged(oldSrc);
    });

    test('should display error when uploading non-image file as avatar', async () => {
        await profilePage.openEditProfile();
        const csvPath = path.resolve(__dirname, 'files/example.csv');
        await profilePage.imageInput.setInputFiles(csvPath);
        await expect(profilePage.page.locator('text=Invalid file type. Please upload a JPG or PNG image.')).toBeVisible();
    });
});

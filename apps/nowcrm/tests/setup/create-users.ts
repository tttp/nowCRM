// contactsapp/tests/setup/create-users.ts

import { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

// Load .env file from the root project directory
dotenv.config({ path: path.resolve(__dirname, '../../..', '.env') });

// --- CONSTANTS ---
export const adminLoginUrl = 'http://localhost:1337/admin/login';
export const userCreationUrl = 'http://localhost:1337/content-manager/collection-types/plugin::users-permissions.user';
export const advancedSettingsUrl = 'http://localhost:1337/users-permissions/advanced';

export interface TestUserData {
  email?: string;
  username?: string;
  password?: string;
  roleId?: number;
}

// --- UTILS ---
export async function waitForStrapiReady(url: string, timeoutMs = 60000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
        try {
            const res = await fetch(url);
            if (res.ok) return;
        } catch {}
        await new Promise(r => setTimeout(r, 2000));
    }
    throw new Error(`Strapi not ready at ${url} after ${timeoutMs}ms`);
}

// --- MAIN FUNCTION ---
export const createTestUser = async (
  request: APIRequestContext,
  userData?: TestUserData
): Promise<void> => {
  try {
    // Admin credentials from environment variables
    const ADMIN_CREDENTIALS = {
      email: process.env.STRAPI_TEST_ADMIN_EMAIL || 'strapiadmin@example.com',
      password: process.env.STRAPI_TEST_ADMIN_PASSWORD || 'StrongPassword123!',
    };

    // Default user details
    const DEFAULT_USER = {
      email: process.env.TEST_USER_EMAIL || 'testuser@example.com',
      username: process.env.TEST_USER_USERNAME || 'testuser',
      password: process.env.TEST_USER_PASSWORD || 'StrongPassword123!',
      roleId: 3,
    };

    // Use defaults if userData is not provided (for legacy tests)
    const TEST_USER = {
      ...DEFAULT_USER,
      ...userData,
      roleId: userData?.roleId ?? DEFAULT_USER.roleId,
    };

    // Basic validation
    if (!ADMIN_CREDENTIALS.email || !ADMIN_CREDENTIALS.password) {
        throw new Error('Admin credentials (STRAPI_TEST_ADMIN_EMAIL, STRAPI_TEST_ADMIN_PASSWORD) missing in environment variables.');
    }
    if (!TEST_USER.email || !TEST_USER.username || !TEST_USER.password) {
        throw new Error('Test user details (email, username, password) missing.');
    }

    console.log('\n--- Starting createTestUser ---');

    // 1. Wait for Strapi to be ready
    await waitForStrapiReady(adminLoginUrl);

    // 2. Admin login
    console.log(`Attempting admin login for ${ADMIN_CREDENTIALS.email} at ${adminLoginUrl}`);
    console.log('Admin Login Request Body:', JSON.stringify(ADMIN_CREDENTIALS));

    const loginResponse = await request.post(adminLoginUrl, {
      headers: { 'Content-Type': 'application/json' },
      data: ADMIN_CREDENTIALS,
      failOnStatusCode: false
    });

    const loginResponseBody = await loginResponse.text();
    if (!loginResponse.ok()) {
      console.error(`Admin login failed (${loginResponse.status()}): ${loginResponseBody}`);
      throw new Error(`Admin login failed (${loginResponse.status()}): ${loginResponseBody}`);
    }

    const loginBodyJson = JSON.parse(loginResponseBody);
    const adminJwt = loginBodyJson.data?.token;
    if (!adminJwt) {
      console.error('JWT token missing in admin login response body:', loginResponseBody);
      throw new Error('Admin JWT token missing in login response.');
    }
    console.log('Admin authentication successful.');

    // 3. Set reset password URL in Strapi advanced settings
    const resetPasswordUrl = process.env.RESET_PASSWORD_URL || 'http://localhost:3000/en/auth/reset-password';
    console.log(`Setting Strapi reset password URL: <${resetPasswordUrl}>`);

    const advancedSettingsBody = {
      email_reset_password: resetPasswordUrl,
    };

    const advancedSettingsResponse = await request.put(advancedSettingsUrl, {
      headers: {
        Authorization: `Bearer ${adminJwt}`,
        'Content-Type': 'application/json',
      },
      data: advancedSettingsBody,
      failOnStatusCode: false,
    });

    if (!advancedSettingsResponse.ok()) {
      const body = await advancedSettingsResponse.text();
      console.error(`Failed to set reset password URL (${advancedSettingsResponse.status()}): ${body}`);
      throw new Error(`Failed to set reset password URL (${advancedSettingsResponse.status()}): ${body}`);
    }
    console.log('Reset password URL set successfully.');

    // 4. Create user (always try)
    const createUserRequestBody = {
      confirmed: true,
      blocked: false,
      role: { connect: [{ id: TEST_USER.roleId }] },
      email: TEST_USER.email,
      username: TEST_USER.username,
      password: TEST_USER.password,
    };

    console.log(`Attempting user creation for ${TEST_USER.username} at ${userCreationUrl}`);
    const userResponse = await request.post(userCreationUrl, {
        headers: {
          Authorization: `Bearer ${adminJwt}`,
          'Content-Type': 'application/json',
        },
        data: createUserRequestBody,
        failOnStatusCode: false
      }
    );

    console.log(`User creation response status: ${userResponse.status()}`);
    const userResponseBody = await userResponse.text();
    if (!userResponse.ok()) {
      if (
        userResponse.status() === 500 ||
        (userResponse.status() === 400 && userResponseBody.includes("already taken"))
      ) {
        console.warn(`User creation attempt returned status ${userResponse.status()}. Interpreting as 'User likely already exists'. Body: ${userResponseBody}`);
        console.log('\n--- Finished createTestUser (User likely existed) ---');
        return;
      }
      console.error(`User creation failed (${userResponse.status()}): ${userResponseBody}`);
      throw new Error(`User creation failed (${userResponse.status()}): ${userResponseBody}`);
    }

    const userBodyJson = JSON.parse(userResponseBody);
    const createdUserId = userBodyJson?.id || userBodyJson?.data?.id;
    console.log(`User created successfully! ID: ${createdUserId || 'N/A'}`);
    console.log('\n--- Finished createTestUser successfully ---');

  } catch (error) {
    console.error('\n--- ERROR in createTestUser ---');
    console.error(error instanceof Error ? error.message : 'Unknown error');
    if (error instanceof Error && error.stack) {
        console.error(error.stack);
    }
    throw error;
  }
};
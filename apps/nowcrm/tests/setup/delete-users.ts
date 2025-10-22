import { APIRequestContext } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../..', '.env') });

const adminLoginUrl = 'http://localhost:1337/admin/login';
const usersUrl = 'http://localhost:1337/content-manager/collection-types/plugin::users-permissions.user';

export async function deleteUserFromStrapi(request: APIRequestContext, email: string) {
    // 1. Admin login
    const ADMIN_CREDENTIALS = {
        email: process.env.STRAPI_TEST_ADMIN_EMAIL || 'strapiadmin@example.com',
        password: process.env.STRAPI_TEST_ADMIN_PASSWORD || 'StrongPassword123!',
    };

    const loginResponse = await request.post(adminLoginUrl, {
        headers: { 'Content-Type': 'application/json' },
        data: ADMIN_CREDENTIALS,
        failOnStatusCode: false
    });

    if (!loginResponse.ok()) {
        throw new Error(`Admin login failed: ${await loginResponse.text()}`);
    }

    const loginBody = await loginResponse.json();
    const adminJwt = loginBody.data?.token;
    if (!adminJwt) throw new Error('Admin JWT token missing in login response.');

    // 2. Find user by email
    const usersResponse = await request.get(`${usersUrl}?filters[email][$eq]=${encodeURIComponent(email)}`, {
        headers: { Authorization: `Bearer ${adminJwt}` }
    });

    if (!usersResponse.ok()) {
        throw new Error(`Failed to fetch users: ${await usersResponse.text()}`);
    }

    const usersBody = await usersResponse.json();
    const user = usersBody.results?.[0] || usersBody.data?.[0];
    if (!user || !user.id) {
        console.warn(`User with email ${email} not found, nothing to delete.`);
        return;
    }

    // 3. Delete user by id
    const deleteResponse = await request.delete(`${usersUrl}/${user.id}`, {
        headers: { Authorization: `Bearer ${adminJwt}` }
    });

    if (!deleteResponse.ok()) {
        throw new Error(`Failed to delete user: ${await deleteResponse.text()}`);
    }

    console.log(`User with email ${email} deleted successfully.`);
}
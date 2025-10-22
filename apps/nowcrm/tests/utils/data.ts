// contactsapp/tests/utils/data.ts

// We assume playwright.config.ts has already loaded environment variables
// using dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
// So, process.env should be populated when tests import this file.

export const testCredentials = {
  /**
   * Reads the test username from the TEST_USER_USERNAME environment variable.
   * Provides a fallback if the environment variable is not set.
   */
  username: process.env.TEST_USER_USERNAME || 'testuser@example.com', // Use the variable name from your .env file

  /**
   * Reads the test user email from the TEST_USER_EMAIL environment variable.
   * Provides a fallback if the environment variable is not set.
   */
  email: process.env.TEST_USER_EMAIL || 'StrongPassword123!', // Use the variable name from your .env file

  /**
   * Reads the test user password from the TEST_USER_PASSWORD environment variable.
   * Provides a fallback if the environment variable is not set.
   */
  password: process.env.TEST_USER_PASSWORD || 'testuser', // Use the variable name from your .env file
};

// We remove the hardcoded URL here, as the baseURL from playwright.config.ts should be used.

// You can add other non-sensitive, shared test data constants here if needed.
// export const otherData = { ... };

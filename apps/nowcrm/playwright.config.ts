import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables from the .env file located in the parent directory
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const WORKERS = Number(process.env.PLAYWRIGHT_WORKERS) || 1;
const RETRIES = Number(process.env.PLAYWRIGHT_RETRIES) || 0;
const CI = process.env.CI === 'true';
const CRM_BASE_URL = process.env.CRM_BASE_URL || 'http://localhost:3000';
const TIMEOUT = Number(process.env.PLAYWRIGHT_TIMEOUT) || 30000;
const EXPECT_TIMEOUT = Number(process.env.EXPECT_TIMEOUT) || 5000;

// Ensure output directories exist
const testResultsDir = path.resolve(__dirname, './tests/reports/test-results');
if (!fs.existsSync(testResultsDir)) fs.mkdirSync(testResultsDir, { recursive: true });

export default defineConfig({
  testDir: './tests',
  outputDir: './tests/reports/test-results',
  timeout: TIMEOUT,
  globalSetup: require.resolve('./tests/setup/global-setup'),
  expect: {
    timeout: EXPECT_TIMEOUT,
  },
  fullyParallel: false,
  forbidOnly: !!CI,
  retries: CI ? (Number(process.env.PLAYWRIGHT_RETRIES) || 1) : RETRIES,
  workers: CI ? (Number(process.env.PLAYWRIGHT_WORKERS) || 1) : WORKERS,
  reporter: [
    ['html', { open: 'never', outputFolder: 'tests/reports/html-report' }],
    ['github'],
    ['json', { outputFile: './tests/reports/results.json' }],
    ['junit', { outputFile: './tests/reports/results.xml' }],
    ['blob', { outputDir: './tests/reports/blob-report' }],
    ['list', { printSteps: true }]
  ],
  use: {
    baseURL: CRM_BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    {
      name: 'setup',
      testMatch: /global-setup\.ts/,
    },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
  ],
});
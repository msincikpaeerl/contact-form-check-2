import { defineConfig } from '@playwright/test';

// Runs against the built site served by its own Node server. The port is dedicated to the tests,
// and a server that is already running is never reused, so the test always checks this build.
const port = 4399;

export default defineConfig({
  testDir: './e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: `http://localhost:${port}` },
  webServer: {
    command: 'npm run build && npm run start',
    url: `http://localhost:${port}`,
    env: { HOST: 'localhost', PORT: String(port) },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});

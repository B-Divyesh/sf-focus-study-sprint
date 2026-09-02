import { defineConfig } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  fullyParallel: false,
  use: {
    baseURL: externalBaseURL ?? 'http://127.0.0.1:4173',
    viewport: { width: 390, height: 844 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
    trace: 'retain-on-failure'
  },
  webServer: externalBaseURL ? undefined : {
    command: 'npm run build && npm run preview',
    port: 4173,
    reuseExistingServer: true,
    timeout: 60_000
  },
  reporter: [['list']]
});

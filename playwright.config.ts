import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',

  // Máximo de testes rodando em paralelo
  fullyParallel: true,

  // Falha quando há console.error
  forbidOnly: !!process.env.CI,

  // Retry em CI
  retries: process.env.CI ? 2 : 0,

  // Workers em CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter
  reporter: 'html',

  // Configuração compartilhada para todos os testes
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Web Server
  webServer: {
    command: 'npm run dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },

  // Projetos (navegadores)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});

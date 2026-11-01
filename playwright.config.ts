import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.PORT ?? 4893)
const desktop = { viewport: { width: 1440, height: 900 } }
const mobile = { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }

export default defineConfig({
  testDir: 'e2e',
  fullyParallel: true,
  workers: 4,
  retries: 0,
  reporter: [['list']],
  use: { baseURL: `http://localhost:${port}` },
  webServer: { command: `npm run preview -- --port ${port}`, port, reuseExistingServer: false },
  projects: [
    { name: 'chromium-desktop', use: { ...devices['Desktop Chrome'], ...desktop, launchOptions: { args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] } } },
    { name: 'chromium-mobile', use: { ...devices['Desktop Chrome'], ...mobile, launchOptions: { args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] } } },
    { name: 'webkit-desktop', use: { ...devices['Desktop Safari'], ...desktop } },
    { name: 'webkit-mobile', use: { ...devices['Desktop Safari'], ...mobile } },
  ],
})

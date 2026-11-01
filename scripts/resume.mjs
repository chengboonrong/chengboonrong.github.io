// Prints /resume/ to public/Chris-Cheng-Resume.pdf. Run after `npm run build`, then build again to ship it.
import { chromium } from '@playwright/test'
import { preview } from 'vite'

const server = await preview({ preview: { port: 4911, strictPort: false } })
const browser = await chromium.launch()
const page = await browser.newPage()
await page.goto(`${server.resolvedUrls.local[0]}resume/`)
await page.evaluate(() => document.fonts.ready)
await page.pdf({ path: 'public/Chris-Cheng-Resume.pdf', preferCSSPageSize: true, printBackground: false, tagged: true, outline: true })
await browser.close()
await server.close()

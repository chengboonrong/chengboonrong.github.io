// Writes public/og.png from the real hero, and public/favicon.png from the SVG. Run after `npm run build`.
import { chromium } from '@playwright/test'
import { preview } from 'vite'

const server = await preview({ preview: { port: 4910, strictPort: false } })
const base = server.resolvedUrls.local[0]
const browser = await chromium.launch({ args: ['--use-gl=swiftshader', '--enable-webgl', '--ignore-gpu-blocklist'] })

const hero = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await hero.goto(base)
await hero.waitForSelector('canvas[data-mode]')
await hero.waitForTimeout(2500)
await hero.addStyleTag({ content: '.site-nav{display:none}' })
await hero.screenshot({ path: 'public/og.png' })

const icon = await browser.newPage({ viewport: { width: 192, height: 192 } })
await icon.goto(base)
await icon.setContent(`<style>*{margin:0}</style><img src="${base}favicon.svg" width="192" height="192">`, { waitUntil: 'load' })
await icon.screenshot({ path: 'public/favicon.png' })

await browser.close()
await server.close()

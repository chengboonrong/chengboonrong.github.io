import { expect, test } from '@playwright/test'
import { site } from '../src/content'
import { routes } from '../src/meta'

for (const route of routes) {
  test(`loads with no console errors: ${route}`, async ({ page }) => {
    const problems: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') problems.push(message.text())
    })
    page.on('pageerror', (error) => problems.push(error.message))
    await page.goto(route, { waitUntil: 'load' })
    await page.waitForTimeout(1200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page).toHaveTitle(/Chris Cheng/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', site.url + route)
    expect(problems).toEqual([])
  })
}

test('links work and back restores the page', async ({ page }, info) => {
  const mobile = info.project.name.endsWith('mobile')
  await page.goto('/')
  await page.waitForTimeout(600)
  await page.evaluate(() => {
    const cards = document.querySelectorAll<HTMLElement>('.stack-card')
    window.scrollTo(0, cards[0].parentElement!.offsetTop + innerHeight * 2)
  })
  await page.waitForTimeout(500)
  const y = await page.evaluate(() => scrollY)
  // On desktop this is a real click on the pinned card, so it must be the top layer.
  if (mobile) await page.evaluate(() => document.querySelector<HTMLAnchorElement>('a[href="/work/starlake/"]')!.click())
  else await page.mouse.click(720, 450)
  await expect(page.locator('h1')).toHaveText('Starlake')
  await expect(page).toHaveTitle('Starlake | Chris Cheng')
  await expect(page.locator('h1')).toBeFocused()

  await page.goBack()
  await expect(page.locator('#hero-title')).toBeVisible()
  await expect.poll(() => page.evaluate(() => scrollY)).toBeCloseTo(y, -1)

  if (mobile) {
    await page.locator('summary[aria-label="Menu"]').click()
    await page.locator('nav[aria-label="Main"] details a[href="/resume/"]').click()
  } else {
    await page.locator('nav[aria-label="Main"] > ul a[href="/resume/"]').click()
  }
  await expect(page).toHaveURL(/\/resume\/$/)
  await expect(page.locator('h1')).toContainText('Boon Rong Cheng')
})

for (const width of [320, 1440]) {
  test(`no horizontal overflow at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    for (const route of routes) {
      await page.goto(route)
      await page.waitForTimeout(150)
      const { scroll, client } = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }))
      expect(scroll, route).toBeLessThanOrEqual(client)
    }
  })
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' })

  test('no canvas animation, and text is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('h1')).toBeVisible()
    // One still frame: no fade, no loop.
    const canvas = page.locator('canvas')
    await expect(canvas).toHaveAttribute('data-mode', 'still')
    expect(await canvas.evaluate((node) => getComputedStyle(node).transitionDuration)).toBe('0s')
    await expect(canvas).toHaveCSS('opacity', '1')
    const first = await canvas.screenshot()
    await page.waitForTimeout(500)
    expect((await canvas.screenshot()).equals(first)).toBe(true)
    await expect(page.locator('.pin-spacer')).toHaveCount(0)
  })
})

test('résumé has no phone number', async ({ page }) => {
  await page.goto('/resume/')
  await expect(page.locator('h1')).toHaveText('Chris Cheng (Boon Rong Cheng)')
  const text = await page.locator('main').innerText()
  expect(text).not.toMatch(/(?<![A-Z])\+\d|\b01\d[\s-]?\d{3,4}[\s-]?\d{4}\b|\b\d{3}[\s-]\d{3,4}[\s-]\d{4}\b/)
})

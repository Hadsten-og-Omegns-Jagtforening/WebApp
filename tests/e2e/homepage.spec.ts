import { test, expect } from '@playwright/test'

test('homepage loads with hero', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('.hero')).toBeVisible()
})

test('homepage has news feed section', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h2')).toContainText('Seneste nyheder')
})

test('nav has booking CTA', async ({ page }) => {
  await page.goto('/')
  const cta = page.locator('.nav .btn.primary')
  await expect(cta).toContainText('Book skydebanen')
})

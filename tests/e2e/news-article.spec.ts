import { test, expect } from '@playwright/test'

test('news listing page loads', async ({ page }) => {
  await page.goto('/nyheder')
  await expect(page.locator('h1')).toContainText('Nyheder')
})

test('404 for unknown slug', async ({ page }) => {
  const response = await page.goto('/nyheder/finnes-ikke')
  expect(response?.status()).toBe(404)
})

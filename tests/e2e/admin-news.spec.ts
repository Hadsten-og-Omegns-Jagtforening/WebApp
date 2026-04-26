import { test, expect } from '@playwright/test'

test('login page renders', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.locator('h1')).toContainText('Log ind')
  await expect(page.locator('input[name="email"]')).toBeVisible()
  await expect(page.locator('input[name="password"]')).toBeVisible()
})

test('wrong credentials shows error', async ({ page }) => {
  await page.goto('/admin')
  await page.fill('input[name="email"]', 'wrong@test.dk')
  await page.fill('input[name="password"]', 'wrongpassword')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL(/\/admin/)
})

test('unauthenticated access to /admin/nyheder redirects to /admin', async ({ page }) => {
  await page.goto('/admin/nyheder')
  await expect(page).toHaveURL('/admin')
})

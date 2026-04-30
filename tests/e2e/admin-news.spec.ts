import { test, expect } from '@playwright/test'

test('login page renders', async ({ page }) => {
  await page.goto('/admin')
  await expect(page.locator('h1')).toContainText('Log ind')
  await expect(page.locator('input[name="email"]')).toBeVisible()
  await expect(page.locator('input[name="password"]')).toBeVisible()
  await expect(page.getByRole('link', { name: 'Glemt adgangskode?' })).toBeVisible()
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

test('reset-password page renders', async ({ page }) => {
  await page.goto('/auth/reset-password')
  await expect(page.locator('h1')).toContainText('Glemt adgangskode?')
  await expect(page.locator('input[name="email"]')).toBeVisible()
})

test('update-password page shows invalid-link message without recovery session', async ({ page }) => {
  await page.goto('/auth/update-password')
  await expect(page.locator('h1')).toContainText('Opdater adgangskode')
  await expect(page.getByText(/Linket er ugyldigt eller udloeber/i)).toBeVisible()
})

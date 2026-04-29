import { test, expect } from '@playwright/test'

test('unauthenticated user is redirected from /admin/nyheder to /admin', async ({ page }) => {
  await page.goto('/admin/nyheder')
  await expect(page).toHaveURL('/admin')
})

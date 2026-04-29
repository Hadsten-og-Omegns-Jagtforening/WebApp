import { expect, test } from '@playwright/test'

const publicPages = [
  { path: '/book-skydebanen', heading: 'Reservér banen' },
  { path: '/kalender', heading: 'Kalender' },
  { path: '/bliv-medlem', heading: 'Bliv medlem' },
  { path: '/aktiviteter', heading: 'Aktiviteter' },
  { path: '/aktiviteter/jagt', heading: 'Jagt' },
  { path: '/aktiviteter/hjalp-til-jagtproven', heading: 'Hjælp til jagtprøven' },
  { path: '/aktiviteter/premieskydninger', heading: 'Præmieskydninger' },
  { path: '/praktisk-info', heading: 'Praktisk info' },
  { path: '/praktisk-info/aabningstider-og-skydetider', heading: 'Åbningstider og skydetider' },
  { path: '/praktisk-info/bestyrelsen', heading: 'Bestyrelsen' },
  { path: '/find-os', heading: 'Find os' },
]

test.describe('public utility pages', () => {
  for (const pageInfo of publicPages) {
    test(`${pageInfo.path} loads`, async ({ page }) => {
      await page.goto(pageInfo.path)
      await expect(page.locator('main')).toBeVisible()
      await expect(page.locator('h1')).toContainText(pageInfo.heading)
    })
  }
})

test('nav and footer internal links use implemented routes', async ({ page }) => {
  await page.goto('/')

  const hrefs = await page.locator('header a, footer a').evaluateAll((links) =>
    links
      .map((link) => link.getAttribute('href'))
      .filter((href): href is string => Boolean(href))
      .filter((href) => href.startsWith('/'))
  )

  expect(hrefs).not.toContain('/jagt')
  expect(hrefs).not.toContain('/jagtprove')
  expect(hrefs).not.toContain('/praemieskydninger')
  expect(hrefs).not.toContain('/aabningstider')
  expect(hrefs).not.toContain('/bestyrelsen')
  expect(hrefs).not.toContain('/arkiv')

  for (const href of Array.from(new Set(hrefs))) {
    const response = await page.goto(href)
    expect(response?.status(), href).toBeLessThan(400)
  }
})

test('desktop hamburger is hidden and mobile menu opens', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 })
  await page.goto('/')
  await expect(page.locator('.nav-hamburger')).toBeHidden()

  await page.setViewportSize({ width: 390, height: 900 })
  await page.reload()
  await page.locator('.nav-hamburger').click()
  await expect(page.locator('#primary-navigation')).toBeVisible()

  await page.locator('button.nav-trigger').filter({ hasText: 'Aktiviteter' }).click()
  await expect(page.locator('a[href="/aktiviteter/jagt"]')).toBeVisible()
})

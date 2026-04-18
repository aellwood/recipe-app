import { test, expect } from '@playwright/test'

test.describe('meal planner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/planner')
  })

  test('shows all 7 days and 3 meal rows', async ({ page }) => {
    for (const day of ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']) {
      await expect(page.getByText(day, { exact: true })).toBeVisible()
    }
    for (const meal of ['Breakfast', 'Lunch', 'Dinner']) {
      await expect(page.getByText(meal).first()).toBeVisible()
    }
  })

  test('clicking + opens recipe picker modal', async ({ page }) => {
    await page.locator('button', { hasText: '+' }).first().click()
    await expect(page.getByPlaceholder('Search...')).toBeVisible()
    await expect(page.getByText('Creamy Vegan Pasta')).toBeVisible()
  })

  test('can search in recipe picker', async ({ page }) => {
    await page.locator('button', { hasText: '+' }).first().click()
    await page.getByPlaceholder('Search...').fill('tikka')
    await expect(page.getByText('Chickpea Tikka Masala')).toBeVisible()
    await expect(page.getByText('Creamy Vegan Pasta')).not.toBeVisible()
  })

  test('selecting a recipe closes the picker and shows it in the slot', async ({ page }) => {
    await page.locator('button', { hasText: '+' }).first().click()
    await page.getByText('Creamy Vegan Pasta').click()
    await expect(page.getByPlaceholder('Search...')).not.toBeVisible()
    await expect(page.getByText('Creamy Vegan Pasta')).toBeVisible()
  })

  test('generate shopping list button redirects to shopping page', async ({ page }) => {
    await page.getByRole('button', { name: /generate shopping list/i }).click()
    await expect(page).toHaveURL('/shopping')
  })
})

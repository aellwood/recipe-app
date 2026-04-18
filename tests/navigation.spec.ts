import { test, expect } from '@playwright/test'

test.describe('navigation', () => {
  test('home page loads with hero and quick actions', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /what are you cooking/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /browse recipes/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /ai chef/i }).first()).toBeVisible()
  })

  test('nav links navigate to correct pages', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Recipes', exact: true }).click()
    await expect(page).toHaveURL('/recipes')

    await page.getByRole('link', { name: 'Planner' }).click()
    await expect(page).toHaveURL('/planner')

    await page.getByRole('link', { name: 'Shopping' }).click()
    await expect(page).toHaveURL('/shopping')

    await page.getByRole('link', { name: 'AI Chef' }).click()
    await expect(page).toHaveURL('/ai')
  })

  test('+ Add Recipe button in nav goes to new recipe form', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: '+ Add Recipe' }).click()
    await expect(page).toHaveURL('/recipes/new')
    await expect(page.getByRole('heading', { name: 'New Recipe' })).toBeVisible()
  })
})

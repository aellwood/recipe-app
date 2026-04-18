import { test, expect } from '@playwright/test'

test.describe('shopping list', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shopping')
    await page.evaluate(() => localStorage.setItem('shoppingList', '[]'))
    await page.reload()
  })

  test('shows empty state initially', async ({ page }) => {
    await expect(page.getByText('Your shopping list is empty')).toBeVisible()
  })

  test('adds an item via input and button', async ({ page }) => {
    await page.getByPlaceholder('Add an item...').fill('oat milk')
    await page.getByRole('button', { name: 'Add' }).click()
    await expect(page.getByText('oat milk')).toBeVisible()
  })

  test('adds an item via Enter key', async ({ page }) => {
    await page.getByPlaceholder('Add an item...').fill('tahini')
    await page.getByPlaceholder('Add an item...').press('Enter')
    await expect(page.getByText('tahini')).toBeVisible()
  })

  test('checking an item moves it to the Got It section', async ({ page }) => {
    await page.getByPlaceholder('Add an item...').fill('tempeh')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.locator('li').filter({ hasText: 'tempeh' }).getByRole('button').first().click()
    await expect(page.getByText('Got It')).toBeVisible()
  })

  test('remove button deletes an item', async ({ page }) => {
    await page.getByPlaceholder('Add an item...').fill('tofu')
    await page.getByRole('button', { name: 'Add' }).click()
    await page.locator('li').filter({ hasText: 'tofu' }).getByText('✕').click()
    await expect(page.getByText('tofu')).not.toBeVisible()
  })

  test('clear all removes every item', async ({ page }) => {
    await page.getByPlaceholder('Add an item...').fill('lentils')
    await page.getByRole('button', { name: 'Add' }).click()
    page.once('dialog', d => d.accept())
    await page.getByRole('button', { name: 'Clear all' }).click()
    await expect(page.getByText('Your shopping list is empty')).toBeVisible()
  })
})

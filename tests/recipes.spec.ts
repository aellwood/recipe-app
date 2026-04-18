import { test, expect } from '@playwright/test'

test.describe('recipes page', () => {
  test('shows sample recipes on load', async ({ page }) => {
    await page.goto('/recipes')
    await expect(page.getByText('Creamy Vegan Pasta')).toBeVisible()
    await expect(page.getByText('Chickpea Tikka Masala')).toBeVisible()
    await expect(page.getByText('Black Bean Tacos')).toBeVisible()
  })

  test('search by title filters results', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByPlaceholder('Search recipes...').fill('pasta')
    await expect(page.getByText('Creamy Vegan Pasta')).toBeVisible()
    await expect(page.getByText('Black Bean Tacos')).not.toBeVisible()
  })

  test('search by ingredient filters results', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByPlaceholder('Search by ingredient...').fill('cashew')
    await expect(page.getByText('Creamy Vegan Pasta')).toBeVisible()
    await expect(page.getByText('Black Bean Tacos')).not.toBeVisible()
  })

  test('tag filter shows only matching recipes', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByRole('button', { name: 'Italian' }).click()
    await expect(page.getByText('Creamy Vegan Pasta')).toBeVisible()
    await expect(page.getByText('Black Bean Tacos')).not.toBeVisible()
  })

  test('shows empty state when no results match', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByPlaceholder('Search recipes...').fill('xyzzy-no-match')
    await expect(page.getByText('No recipes found')).toBeVisible()
  })

  test('clicking a recipe card navigates to detail page', async ({ page }) => {
    await page.goto('/recipes')
    await page.getByText('Creamy Vegan Pasta').click()
    await expect(page).toHaveURL(/\/recipes\/\d+/)
    await expect(page.getByRole('heading', { name: 'Creamy Vegan Pasta' })).toBeVisible()
  })
})

test.describe('recipe detail page', () => {
  test('shows ingredients and steps', async ({ page }) => {
    await page.goto('/recipes/1')
    await expect(page.getByRole('heading', { name: 'Ingredients' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Instructions' })).toBeVisible()
    await expect(page.getByText('raw cashews, soaked 2 hrs')).toBeVisible()
  })

  test('shows recipe metadata', async ({ page }) => {
    await page.goto('/recipes/1')
    await expect(page.getByText('Prep Time')).toBeVisible()
    await expect(page.getByText('Cook Time')).toBeVisible()
    await expect(page.getByText('Servings')).toBeVisible()
    await expect(page.getByText('Difficulty')).toBeVisible()
  })

  test('shows 404 state for unknown recipe', async ({ page }) => {
    await page.goto('/recipes/nonexistent-id')
    await expect(page.getByText('Recipe not found')).toBeVisible()
  })

  test('edit button navigates to edit form', async ({ page }) => {
    await page.goto('/recipes/1')
    await page.getByRole('link', { name: 'Edit' }).click()
    await expect(page).toHaveURL('/recipes/1/edit')
    await expect(page.getByRole('heading', { name: 'Edit Recipe' })).toBeVisible()
  })
})

test.describe('add recipe form', () => {
  test('renders all form fields', async ({ page }) => {
    await page.goto('/recipes/new')
    await expect(page.getByPlaceholder('Recipe name')).toBeVisible()
    await expect(page.getByPlaceholder('Brief description')).toBeVisible()
    await expect(page.getByPlaceholder('Italian, Pasta, Quick')).toBeVisible()
  })

  test('creates a recipe and redirects to detail page', async ({ page }) => {
    await page.goto('/recipes/new')
    await page.getByPlaceholder('Recipe name').fill('Test Vegan Soup')
    await page.getByPlaceholder('Brief description').fill('A simple test soup')
    await page.locator('input[placeholder="Amount"]').first().fill('2')
    await page.locator('input[placeholder="Unit"]').first().fill('cups')
    await page.locator('input[placeholder="Ingredient"]').first().fill('vegetable stock')
    await page.locator('textarea[placeholder="Step 1"]').fill('Simmer for 20 minutes')
    await page.getByRole('button', { name: 'Create Recipe' }).click()
    await expect(page).toHaveURL(/\/recipes\/\d+/)
    await expect(page.getByRole('heading', { name: 'Test Vegan Soup' })).toBeVisible()
  })

  test('cancel button returns to previous page', async ({ page }) => {
    await page.goto('/recipes')
    await page.goto('/recipes/new')
    await page.getByRole('button', { name: 'Cancel' }).click()
    await expect(page).toHaveURL('/recipes')
  })
})

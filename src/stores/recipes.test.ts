import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useRecipesStore } from './recipes'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('recipes store – initial state', () => {
  it('loads sample recipes when localStorage is empty', () => {
    const store = useRecipesStore()
    expect(store.recipes.length).toBeGreaterThan(0)
  })

  it('collects all unique tags from sample recipes', () => {
    const store = useRecipesStore()
    expect(store.allTags).toContain('Vegan')
    expect(store.allTags).toEqual([...store.allTags].sort())
  })
})

describe('recipes store – CRUD', () => {
  it('addRecipe prepends a new recipe with generated id', () => {
    const store = useRecipesStore()
    const before = store.recipes.length
    const recipe = store.addRecipe({
      title: 'Test Recipe',
      description: 'desc',
      image: '',
      prepTime: 5,
      cookTime: 10,
      servings: 2,
      difficulty: 'Easy',
      tags: ['Test'],
      ingredients: [{ amount: '1', unit: 'cup', name: 'water' }],
      steps: ['Boil water'],
    })
    expect(store.recipes.length).toBe(before + 1)
    expect(store.recipes[0].id).toBe(recipe.id)
    expect(recipe.isCustom).toBe(true)
    expect(recipe.createdAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('getById returns the correct recipe', () => {
    const store = useRecipesStore()
    const first = store.recipes[0]
    expect(store.getById(first.id)).toEqual(first)
  })

  it('getById returns undefined for unknown id', () => {
    const store = useRecipesStore()
    expect(store.getById('nonexistent')).toBeUndefined()
  })

  it('updateRecipe updates fields on the correct recipe', () => {
    const store = useRecipesStore()
    const id = store.recipes[0].id
    store.updateRecipe(id, { title: 'Updated Title' })
    expect(store.getById(id)?.title).toBe('Updated Title')
  })

  it('updateRecipe does nothing for an unknown id', () => {
    const store = useRecipesStore()
    const before = store.recipes.map(r => r.title)
    store.updateRecipe('ghost', { title: 'Ghost' })
    expect(store.recipes.map(r => r.title)).toEqual(before)
  })

  it('deleteRecipe removes the recipe', () => {
    const store = useRecipesStore()
    const id = store.recipes[0].id
    const before = store.recipes.length
    store.deleteRecipe(id)
    expect(store.recipes.length).toBe(before - 1)
    expect(store.getById(id)).toBeUndefined()
  })

  it('persists recipes to localStorage', () => {
    const store = useRecipesStore()
    store.addRecipe({
      title: 'Persist Me',
      description: '',
      image: '',
      prepTime: 0,
      cookTime: 0,
      servings: 1,
      difficulty: 'Easy',
      tags: [],
      ingredients: [],
      steps: [],
    })
    const saved = JSON.parse(localStorage.getItem('recipes') ?? '[]')
    expect(saved[0].title).toBe('Persist Me')
  })
})

describe('recipes store – search', () => {
  it('returns all recipes with no filters', () => {
    const store = useRecipesStore()
    expect(store.searchRecipes('')).toHaveLength(store.recipes.length)
  })

  it('filters by title query (case-insensitive)', () => {
    const store = useRecipesStore()
    const results = store.searchRecipes('pasta')
    expect(results.every(r => r.title.toLowerCase().includes('pasta') || r.description.toLowerCase().includes('pasta'))).toBe(true)
  })

  it('filters by tag', () => {
    const store = useRecipesStore()
    const results = store.searchRecipes('', ['Vegan'])
    expect(results.every(r => r.tags.includes('Vegan'))).toBe(true)
  })

  it('filters by ingredient', () => {
    const store = useRecipesStore()
    const results = store.searchRecipes('', [], 'cashew')
    expect(results.every(r => r.ingredients.some(i => i.name.toLowerCase().includes('cashew')))).toBe(true)
  })

  it('returns empty array when no recipes match', () => {
    const store = useRecipesStore()
    expect(store.searchRecipes('xyzzy-no-match')).toHaveLength(0)
  })

  it('applies multiple filters together', () => {
    const store = useRecipesStore()
    const results = store.searchRecipes('', ['Vegan'], 'cashew')
    expect(results.every(r => r.tags.includes('Vegan') && r.ingredients.some(i => i.name.toLowerCase().includes('cashew')))).toBe(true)
  })
})

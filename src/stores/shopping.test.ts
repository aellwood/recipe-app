import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useShoppingStore } from './shopping'
import { useRecipesStore } from './recipes'
import { useMealPlanStore } from './mealPlan'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('shopping store – addItem', () => {
  it('adds an item with checked: false', () => {
    const store = useShoppingStore()
    store.addItem('oat milk')
    expect(store.items).toHaveLength(1)
    expect(store.items[0].text).toBe('oat milk')
    expect(store.items[0].checked).toBe(false)
  })

  it('trims whitespace from item text', () => {
    const store = useShoppingStore()
    store.addItem('  almond butter  ')
    expect(store.items[0].text).toBe('almond butter')
  })

  it('ignores blank items', () => {
    const store = useShoppingStore()
    store.addItem('   ')
    expect(store.items).toHaveLength(0)
  })

  it('persists items to localStorage', () => {
    const store = useShoppingStore()
    store.addItem('chickpeas')
    const saved = JSON.parse(localStorage.getItem('shoppingList') ?? '[]')
    expect(saved[0].text).toBe('chickpeas')
  })
})

describe('shopping store – toggleItem', () => {
  it('marks an unchecked item as checked', () => {
    const store = useShoppingStore()
    store.addItem('tahini')
    store.toggleItem(store.items[0].id)
    expect(store.items[0].checked).toBe(true)
  })

  it('toggles a checked item back to unchecked', () => {
    const store = useShoppingStore()
    store.addItem('tahini')
    store.toggleItem(store.items[0].id)
    store.toggleItem(store.items[0].id)
    expect(store.items[0].checked).toBe(false)
  })

  it('does nothing for an unknown id', () => {
    const store = useShoppingStore()
    store.addItem('lentils')
    store.toggleItem('ghost-id')
    expect(store.items[0].checked).toBe(false)
  })
})

describe('shopping store – removeItem', () => {
  it('removes the item by id', () => {
    const store = useShoppingStore()
    store.addItem('miso')
    const id = store.items[0].id
    store.removeItem(id)
    expect(store.items).toHaveLength(0)
  })
})

describe('shopping store – clearChecked / clearAll', () => {
  it('clearChecked removes only checked items', () => {
    const store = useShoppingStore()
    store.addItem('tofu')
    store.addItem('tempeh')
    store.toggleItem(store.items[0].id)
    store.clearChecked()
    expect(store.items).toHaveLength(1)
    expect(store.items[0].text).toBe('tempeh')
  })

  it('clearAll empties the list', () => {
    const store = useShoppingStore()
    store.addItem('tofu')
    store.addItem('tempeh')
    store.clearAll()
    expect(store.items).toHaveLength(0)
  })
})

describe('shopping store – generateFromMealPlan', () => {
  it('adds ingredients from planned recipes', () => {
    const recipesStore = useRecipesStore()
    const mealPlanStore = useMealPlanStore()
    const shoppingStore = useShoppingStore()

    const recipe = recipesStore.recipes[0]
    mealPlanStore.setMeal('Monday', 'Dinner', recipe.id)
    shoppingStore.generateFromMealPlan()

    const texts = shoppingStore.items.map(i => i.text.toLowerCase())
    expect(recipe.ingredients.some(ing => texts.some(t => t.includes(ing.name.toLowerCase())))).toBe(true)
  })

  it('does not add duplicate ingredients', () => {
    const recipesStore = useRecipesStore()
    const mealPlanStore = useMealPlanStore()
    const shoppingStore = useShoppingStore()

    const recipe = recipesStore.recipes[0]
    mealPlanStore.setMeal('Monday', 'Dinner', recipe.id)
    mealPlanStore.setMeal('Tuesday', 'Dinner', recipe.id)
    shoppingStore.generateFromMealPlan()

    const texts = shoppingStore.items.map(i => i.text.toLowerCase())
    const uniqueTexts = new Set(texts)
    expect(texts.length).toBe(uniqueTexts.size)
  })

  it('skips empty meal slots', () => {
    const shoppingStore = useShoppingStore()
    shoppingStore.generateFromMealPlan()
    expect(shoppingStore.items).toHaveLength(0)
  })
})

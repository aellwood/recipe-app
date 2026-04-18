import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMealPlanStore } from './mealPlan'

beforeEach(() => {
  localStorage.clear()
  setActivePinia(createPinia())
})

describe('mealPlan store – initial state', () => {
  it('initialises with all slots null', () => {
    const store = useMealPlanStore()
    store.DAYS.forEach(day => {
      store.MEALS.forEach(meal => {
        expect(store.plan[day][meal]).toBeNull()
      })
    })
  })

  it('exposes DAYS and MEALS constants', () => {
    const store = useMealPlanStore()
    expect(store.DAYS).toHaveLength(7)
    expect(store.MEALS).toHaveLength(3)
  })
})

describe('mealPlan store – setMeal / clearMeal', () => {
  it('sets a recipe on a day/meal slot', () => {
    const store = useMealPlanStore()
    store.setMeal('Monday', 'Breakfast', 'recipe-1')
    expect(store.plan['Monday']['Breakfast']).toBe('recipe-1')
  })

  it('clearMeal sets the slot back to null', () => {
    const store = useMealPlanStore()
    store.setMeal('Tuesday', 'Lunch', 'recipe-2')
    store.clearMeal('Tuesday', 'Lunch')
    expect(store.plan['Tuesday']['Lunch']).toBeNull()
  })

  it('setting one slot does not affect others', () => {
    const store = useMealPlanStore()
    store.setMeal('Wednesday', 'Dinner', 'recipe-3')
    expect(store.plan['Wednesday']['Breakfast']).toBeNull()
    expect(store.plan['Thursday']['Dinner']).toBeNull()
  })

  it('persists meal plan to localStorage', () => {
    const store = useMealPlanStore()
    store.setMeal('Friday', 'Lunch', 'recipe-99')
    const saved = JSON.parse(localStorage.getItem('mealPlan') ?? '{}')
    expect(saved['Friday']['Lunch']).toBe('recipe-99')
  })
})

describe('mealPlan store – clearWeek', () => {
  it('resets all slots to null', () => {
    const store = useMealPlanStore()
    store.setMeal('Monday', 'Breakfast', 'r1')
    store.setMeal('Sunday', 'Dinner', 'r2')
    store.clearWeek()
    store.DAYS.forEach(day => {
      store.MEALS.forEach(meal => {
        expect(store.plan[day][meal]).toBeNull()
      })
    })
  })
})

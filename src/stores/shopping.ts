import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ShoppingItem } from '../types'
import { useRecipesStore } from './recipes'
import { useMealPlanStore } from './mealPlan'

export const useShoppingStore = defineStore('shopping', () => {
  const items = ref<ShoppingItem[]>(JSON.parse(localStorage.getItem('shoppingList') ?? '[]'))

  function save() {
    localStorage.setItem('shoppingList', JSON.stringify(items.value))
  }

  function addItem(text: string): void {
    if (!text.trim()) return
    items.value.push({ id: Date.now().toString(), text: text.trim(), checked: false })
    save()
  }

  function toggleItem(id: string): void {
    const item = items.value.find(i => i.id === id)
    if (item) { item.checked = !item.checked; save() }
  }

  function removeItem(id: string): void {
    items.value = items.value.filter(i => i.id !== id)
    save()
  }

  function clearChecked(): void {
    items.value = items.value.filter(i => !i.checked)
    save()
  }

  function clearAll(): void {
    items.value = []
    save()
  }

  function generateFromMealPlan(): void {
    const recipesStore = useRecipesStore()
    const mealPlanStore = useMealPlanStore()
    const ingredientSet = new Map<string, string>()

    Object.values(mealPlanStore.plan).forEach(dayMeals => {
      Object.values(dayMeals).forEach(recipeId => {
        if (!recipeId) return
        const recipe = recipesStore.getById(recipeId)
        if (!recipe) return
        recipe.ingredients.forEach(ing => {
          const key = ing.name.toLowerCase()
          if (!ingredientSet.has(key)) {
            ingredientSet.set(key, `${ing.amount} ${ing.unit} ${ing.name}`.trim().replace(/\s+/g, ' '))
          }
        })
      })
    })

    ingredientSet.forEach(text => {
      if (!items.value.some(i => i.text.toLowerCase() === text.toLowerCase())) {
        items.value.push({ id: `${Date.now()}${Math.random()}`, text, checked: false })
      }
    })
    save()
  }

  return { items, addItem, toggleItem, removeItem, clearChecked, clearAll, generateFromMealPlan }
})

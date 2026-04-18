import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ShoppingItem } from '../types'
import { supabase } from '../lib/supabase'
import { useRecipesStore } from './recipes'
import { useMealPlanStore } from './mealPlan'

interface DbShoppingItem {
  id: string
  text: string
  checked: boolean
}

export const useShoppingStore = defineStore('shopping', () => {
  const items = ref<ShoppingItem[]>([])
  const loading = ref(false)

  async function init(): Promise<void> {
    loading.value = true
    const { data, error } = await supabase
      .from('shopping_items')
      .select('id, text, checked')
      .order('created_at', { ascending: true })
    if (error) { console.error(error); loading.value = false; return }
    items.value = (data as DbShoppingItem[]).map(r => ({ id: r.id, text: r.text, checked: r.checked }))
    loading.value = false
  }

  function reset(): void {
    items.value = []
  }

  async function addItem(text: string): Promise<void> {
    if (!text.trim()) return
    const trimmed = text.trim()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { data, error } = await supabase
      .from('shopping_items')
      .insert({ user_id: user.id, text: trimmed, checked: false })
      .select('id, text, checked')
      .single()
    if (error || !data) { console.error(error); return }
    items.value.push({ id: (data as DbShoppingItem).id, text: trimmed, checked: false })
  }

  async function toggleItem(id: string): Promise<void> {
    const item = items.value.find(i => i.id === id)
    if (!item) return
    item.checked = !item.checked
    await supabase.from('shopping_items').update({ checked: item.checked }).eq('id', id)
  }

  async function removeItem(id: string): Promise<void> {
    items.value = items.value.filter(i => i.id !== id)
    await supabase.from('shopping_items').delete().eq('id', id)
  }

  async function clearChecked(): Promise<void> {
    const ids = items.value.filter(i => i.checked).map(i => i.id)
    items.value = items.value.filter(i => !i.checked)
    if (ids.length > 0) await supabase.from('shopping_items').delete().in('id', ids)
  }

  async function clearAll(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    items.value = []
    await supabase.from('shopping_items').delete().eq('user_id', user.id)
  }

  async function generateFromMealPlan(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
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
          if (!ingredientSet.has(key))
            ingredientSet.set(key, `${ing.amount} ${ing.unit} ${ing.name}`.trim().replace(/\s+/g, ' '))
        })
      })
    })

    const newTexts: string[] = []
    ingredientSet.forEach(text => {
      if (!items.value.some(i => i.text.toLowerCase() === text.toLowerCase()))
        newTexts.push(text)
    })
    if (newTexts.length === 0) return

    const { data, error } = await supabase
      .from('shopping_items')
      .insert(newTexts.map(text => ({ user_id: user.id, text, checked: false })))
      .select('id, text, checked')
    if (error || !data) { console.error(error); return }
    ;(data as DbShoppingItem[]).forEach(row => items.value.push({ id: row.id, text: row.text, checked: false }))
  }

  return { items, loading, init, reset, addItem, toggleItem, removeItem, clearChecked, clearAll, generateFromMealPlan }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WeekPlan } from '../types'
import { supabase } from '../lib/supabase'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
export const MEALS = ['Breakfast', 'Lunch', 'Dinner'] as const

export type Day = typeof DAYS[number]
export type Meal = typeof MEALS[number]

interface DbMealPlanRow {
  day: string
  meal: string
  recipe_id: string
}

function defaultWeek(): WeekPlan {
  const week: WeekPlan = {}
  DAYS.forEach(day => { week[day] = { Breakfast: null, Lunch: null, Dinner: null } })
  return week
}

export const useMealPlanStore = defineStore('mealPlan', () => {
  const plan = ref<WeekPlan>(defaultWeek())
  const loading = ref(false)

  async function init(): Promise<void> {
    loading.value = true
    plan.value = defaultWeek()
    const { data, error } = await supabase.from('meal_plan').select('day, meal, recipe_id')
    if (error) { console.error(error); loading.value = false; return }
    ;(data as DbMealPlanRow[]).forEach(row => {
      if (plan.value[row.day]) plan.value[row.day][row.meal as Meal] = row.recipe_id
    })
    loading.value = false
  }

  function reset(): void {
    plan.value = defaultWeek()
  }

  async function setMeal(day: string, meal: string, recipeId: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    plan.value[day][meal as Meal] = recipeId
    await supabase.from('meal_plan').upsert(
      { user_id: user.id, day, meal, recipe_id: recipeId },
      { onConflict: 'user_id,day,meal' },
    )
  }

  async function clearMeal(day: string, meal: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    plan.value[day][meal as Meal] = null
    await supabase.from('meal_plan').delete().eq('user_id', user.id).eq('day', day).eq('meal', meal)
  }

  async function clearWeek(): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    plan.value = defaultWeek()
    await supabase.from('meal_plan').delete().eq('user_id', user.id)
  }

  return { plan, loading, init, reset, setMeal, clearMeal, clearWeek, DAYS, MEALS }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { WeekPlan } from '../types'

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const
export const MEALS = ['Breakfast', 'Lunch', 'Dinner'] as const

export type Day = typeof DAYS[number]
export type Meal = typeof MEALS[number]

function defaultWeek(): WeekPlan {
  const week: WeekPlan = {}
  DAYS.forEach(day => {
    week[day] = { Breakfast: null, Lunch: null, Dinner: null }
  })
  return week
}

export const useMealPlanStore = defineStore('mealPlan', () => {
  const plan = ref<WeekPlan>(JSON.parse(localStorage.getItem('mealPlan') ?? 'null') ?? defaultWeek())

  function save() {
    localStorage.setItem('mealPlan', JSON.stringify(plan.value))
  }

  function setMeal(day: string, meal: string, recipeId: string): void {
    plan.value[day][meal as Meal] = recipeId
    save()
  }

  function clearMeal(day: string, meal: string): void {
    plan.value[day][meal as Meal] = null
    save()
  }

  function clearWeek(): void {
    plan.value = defaultWeek()
    save()
  }

  return { plan, setMeal, clearMeal, clearWeek, DAYS, MEALS }
})

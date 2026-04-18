export interface Ingredient {
  amount: string
  unit: string
  name: string
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard'

export interface Recipe {
  id: string
  title: string
  description: string
  image: string
  prepTime: number
  cookTime: number
  servings: number
  difficulty: Difficulty
  tags: string[]
  ingredients: Ingredient[]
  steps: string[]
  createdAt: string
  isCustom: boolean
}

export interface ShoppingItem {
  id: string
  text: string
  checked: boolean
}

export type MealSlot = string | null

export interface DayMeals {
  Breakfast: MealSlot
  Lunch: MealSlot
  Dinner: MealSlot
}

export interface WeekPlan {
  [day: string]: DayMeals
}

export interface AIMessage {
  role: 'user' | 'assistant'
  content: string
}

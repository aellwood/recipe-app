<template>
  <div>
    <!-- Hero -->
    <div class="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-10 mb-10 text-white">
      <h1 class="text-4xl font-bold mb-3">What are you cooking today?</h1>
      <p class="text-amber-100 text-lg mb-6">Discover recipes, plan your week, and get AI-powered cooking help.</p>
      <div class="flex gap-3">
        <router-link to="/recipes" class="bg-white text-amber-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-50 transition-colors">
          Browse Recipes
        </router-link>
        <router-link to="/ai" class="bg-amber-600 bg-opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-opacity-70 transition-colors border border-white border-opacity-30">
          AI Chef ✨
        </router-link>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-3 gap-4 mb-10">
      <div class="bg-white rounded-2xl p-5 text-center shadow-sm">
        <div class="text-3xl font-bold text-amber-600">{{ recipesStore.recipes.length }}</div>
        <div class="text-sm text-gray-500 mt-1">Recipes</div>
      </div>
      <div class="bg-white rounded-2xl p-5 text-center shadow-sm">
        <div class="text-3xl font-bold text-amber-600">{{ plannedCount }}</div>
        <div class="text-sm text-gray-500 mt-1">Meals Planned</div>
      </div>
      <div class="bg-white rounded-2xl p-5 text-center shadow-sm">
        <div class="text-3xl font-bold text-amber-600">{{ shoppingStore.items.length }}</div>
        <div class="text-sm text-gray-500 mt-1">Shopping Items</div>
      </div>
    </div>

    <!-- Recent Recipes -->
    <div class="mb-10">
      <div class="flex items-center justify-between mb-5">
        <h2 class="text-xl font-bold text-gray-900">Recent Recipes</h2>
        <router-link to="/recipes" class="text-amber-600 hover:text-amber-700 text-sm font-medium">View all →</router-link>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <RecipeCard v-for="recipe in recentRecipes" :key="recipe.id" :recipe="recipe" />
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <router-link to="/recipes/new" class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
        <div class="text-3xl">📝</div>
        <div>
          <div class="font-semibold text-gray-900 group-hover:text-amber-700">Add Recipe</div>
          <div class="text-sm text-gray-500">Save your own</div>
        </div>
      </router-link>
      <router-link to="/planner" class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
        <div class="text-3xl">📅</div>
        <div>
          <div class="font-semibold text-gray-900 group-hover:text-amber-700">Meal Planner</div>
          <div class="text-sm text-gray-500">Plan your week</div>
        </div>
      </router-link>
      <router-link to="/shopping" class="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
        <div class="text-3xl">🛒</div>
        <div>
          <div class="font-semibold text-gray-900 group-hover:text-amber-700">Shopping List</div>
          <div class="text-sm text-gray-500">{{ shoppingStore.items.length }} items</div>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRecipesStore } from '../stores/recipes'
import { useMealPlanStore } from '../stores/mealPlan'
import { useShoppingStore } from '../stores/shopping'
import RecipeCard from '../components/RecipeCard.vue'

const recipesStore = useRecipesStore()
const mealPlanStore = useMealPlanStore()
const shoppingStore = useShoppingStore()

const recentRecipes = computed(() => recipesStore.recipes.slice(0, 6))
const plannedCount = computed(() => {
  let count = 0
  Object.values(mealPlanStore.plan).forEach(day => {
    Object.values(day).forEach(meal => { if (meal) count++ })
  })
  return count
})
</script>

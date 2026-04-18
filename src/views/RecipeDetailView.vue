<template>
  <div v-if="recipe">
    <!-- Back -->
    <button @click="$router.back()" class="text-sm text-amber-600 hover:text-amber-700 mb-6 flex items-center gap-1">← Back</button>

    <div class="bg-white rounded-3xl shadow-sm overflow-hidden">
      <!-- Hero Image -->
      <div class="aspect-video bg-amber-100 max-h-80 overflow-hidden">
        <img v-if="recipe.image" :src="recipe.image" :alt="recipe.title" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-8xl">🍽️</div>
      </div>

      <div class="p-8">
        <!-- Header -->
        <div class="flex items-start justify-between gap-4 mb-4">
          <h1 class="text-3xl font-bold text-gray-900">{{ recipe.title }}</h1>
          <div class="flex gap-2 shrink-0">
            <router-link :to="`/recipes/${recipe.id}/edit`" class="px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors">Edit</router-link>
            <button @click="confirmDelete" class="px-3 py-1.5 rounded-lg border border-red-200 text-sm text-red-600 hover:bg-red-50 transition-colors">Delete</button>
          </div>
        </div>
        <p class="text-gray-500 mb-6">{{ recipe.description }}</p>

        <!-- Meta -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div class="bg-amber-50 rounded-xl p-3 text-center">
            <div class="text-xs text-gray-500 mb-1">Prep Time</div>
            <div class="font-semibold text-gray-800">{{ recipe.prepTime }} min</div>
          </div>
          <div class="bg-amber-50 rounded-xl p-3 text-center">
            <div class="text-xs text-gray-500 mb-1">Cook Time</div>
            <div class="font-semibold text-gray-800">{{ recipe.cookTime }} min</div>
          </div>
          <div class="bg-amber-50 rounded-xl p-3 text-center">
            <div class="text-xs text-gray-500 mb-1">Servings</div>
            <div class="font-semibold text-gray-800">{{ recipe.servings }}</div>
          </div>
          <div class="bg-amber-50 rounded-xl p-3 text-center">
            <div class="text-xs text-gray-500 mb-1">Difficulty</div>
            <div class="font-semibold" :class="{ 'text-green-600': recipe.difficulty === 'Easy', 'text-yellow-600': recipe.difficulty === 'Medium', 'text-red-600': recipe.difficulty === 'Hard' }">
              {{ recipe.difficulty }}
            </div>
          </div>
        </div>

        <!-- Tags -->
        <div class="flex flex-wrap gap-2 mb-8">
          <span v-for="tag in recipe.tags" :key="tag" class="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm">{{ tag }}</span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <!-- Ingredients -->
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-4">Ingredients</h2>
            <ul class="space-y-2">
              <li
                v-for="(ing, i) in recipe.ingredients"
                :key="i"
                class="flex items-center gap-3 py-2 border-b border-gray-50"
              >
                <div class="w-2 h-2 bg-amber-400 rounded-full shrink-0"></div>
                <span class="text-gray-700">
                  <span v-if="ing.amount" class="font-medium">{{ ing.amount }} {{ ing.unit }}</span>
                  {{ ing.name }}
                </span>
              </li>
            </ul>
          </div>

          <!-- Instructions -->
          <div>
            <h2 class="text-xl font-bold text-gray-900 mb-4">Instructions</h2>
            <ol class="space-y-4">
              <li v-for="(step, i) in recipe.steps" :key="i" class="flex gap-4">
                <div class="shrink-0 w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center text-sm font-bold">{{ i + 1 }}</div>
                <p class="text-gray-700 pt-0.5">{{ step }}</p>
              </li>
            </ol>
          </div>
        </div>

        <!-- Add to meal plan -->
        <div class="mt-8 pt-8 border-t border-gray-100">
          <h3 class="font-semibold text-gray-900 mb-3">Add to Meal Plan</h3>
          <div class="flex flex-wrap gap-2">
            <select v-model="planDay" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="">Select day...</option>
              <option v-for="day in mealPlanStore.DAYS" :key="day" :value="day">{{ day }}</option>
            </select>
            <select v-model="planMeal" class="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="">Select meal...</option>
              <option v-for="meal in mealPlanStore.MEALS" :key="meal" :value="meal">{{ meal }}</option>
            </select>
            <button
              @click="addToMealPlan"
              :disabled="!planDay || !planMeal"
              class="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >Add to Plan</button>
            <span v-if="addedMessage" class="text-green-600 text-sm flex items-center">✓ Added!</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center py-20 text-gray-400">
    <div class="text-5xl mb-4">😕</div>
    <p>Recipe not found</p>
    <router-link to="/recipes" class="text-amber-600 hover:underline text-sm mt-2 block">Back to recipes</router-link>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useRecipesStore } from '../stores/recipes'
import { useMealPlanStore } from '../stores/mealPlan'

const route = useRoute()
const router = useRouter()
const recipesStore = useRecipesStore()
const mealPlanStore = useMealPlanStore()

const recipe = computed(() => recipesStore.getById(route.params.id))
const planDay = ref('')
const planMeal = ref('')
const addedMessage = ref(false)

async function addToMealPlan() {
  if (!planDay.value || !planMeal.value || !recipe.value) return
  await mealPlanStore.setMeal(planDay.value, planMeal.value, recipe.value.id)
  addedMessage.value = true
  setTimeout(() => { addedMessage.value = false }, 2000)
}

async function confirmDelete() {
  if (!recipe.value) return
  if (confirm(`Delete "${recipe.value.title}"?`)) {
    await recipesStore.deleteRecipe(recipe.value.id)
    router.push('/recipes')
  }
}
</script>

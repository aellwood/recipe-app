<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Meal Planner</h1>
      <div class="flex gap-3">
        <button @click="generateShopping" class="border border-amber-300 text-amber-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-50 transition-colors">
          🛒 Generate Shopping List
        </button>
        <button @click="confirmClear" class="border border-gray-200 text-gray-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Clear Week
        </button>
      </div>
    </div>

    <div v-if="successMessage" class="bg-green-50 border border-green-200 text-green-700 rounded-xl p-3 mb-5 text-sm">
      {{ successMessage }}
    </div>

    <!-- Grid -->
    <div class="overflow-x-auto">
      <div class="min-w-[700px]">
        <!-- Header row -->
        <div class="grid grid-cols-8 gap-2 mb-2">
          <div class="text-xs font-semibold text-gray-400 uppercase px-2 py-2"></div>
          <div
            v-for="day in mealPlanStore.DAYS"
            :key="day"
            class="text-xs font-semibold text-center text-gray-600 uppercase px-2 py-2 bg-white rounded-lg shadow-sm"
          >{{ day.slice(0, 3) }}</div>
        </div>

        <!-- Meal rows -->
        <div v-for="meal in mealPlanStore.MEALS" :key="meal" class="grid grid-cols-8 gap-2 mb-2">
          <div class="flex items-center px-2 text-xs font-semibold text-gray-500 uppercase">{{ meal }}</div>
          <div
            v-for="day in mealPlanStore.DAYS"
            :key="day"
            class="bg-white rounded-xl shadow-sm min-h-[80px] p-2 relative group"
          >
            <div v-if="mealPlanStore.plan[day][meal]">
              <div v-if="getRecipe(mealPlanStore.plan[day][meal])">
                <router-link
                  :to="`/recipes/${mealPlanStore.plan[day][meal]}`"
                  class="text-xs font-medium text-gray-800 hover:text-amber-700 line-clamp-3 block"
                >
                  {{ getRecipe(mealPlanStore.plan[day][meal]).title }}
                </router-link>
                <button
                  @click="mealPlanStore.clearMeal(day, meal)"
                  class="absolute top-1 right-1 text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                >✕</button>
              </div>
            </div>
            <div v-else>
              <button
                @click="openPicker(day, meal)"
                class="w-full h-full min-h-[60px] flex items-center justify-center text-gray-300 hover:text-amber-400 transition-colors text-xl"
              >+</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recipe Picker Modal -->
    <div v-if="picker.open" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div class="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 class="font-semibold">Pick recipe for {{ picker.day }} {{ picker.meal }}</h3>
          <button @click="picker.open = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>
        <div class="p-4">
          <input v-model="pickerSearch" type="text" placeholder="Search..." class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4" />
        </div>
        <div class="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          <button
            v-for="recipe in filteredPickerRecipes"
            :key="recipe.id"
            @click="selectRecipe(recipe.id)"
            class="w-full text-left px-4 py-3 rounded-xl hover:bg-amber-50 transition-colors text-sm"
          >
            <div class="font-medium text-gray-800">{{ recipe.title }}</div>
            <div class="text-xs text-gray-400 mt-0.5">{{ recipe.prepTime + recipe.cookTime }} min · {{ recipe.difficulty }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useMealPlanStore } from '../stores/mealPlan'
import { useRecipesStore } from '../stores/recipes'
import { useShoppingStore } from '../stores/shopping'

const mealPlanStore = useMealPlanStore()
const recipesStore = useRecipesStore()
const shoppingStore = useShoppingStore()
const router = useRouter()

const successMessage = ref('')
const picker = ref({ open: false, day: '', meal: '' })
const pickerSearch = ref('')

function getRecipe(id) { return recipesStore.getById(id) }

function openPicker(day, meal) {
  picker.value = { open: true, day, meal }
  pickerSearch.value = ''
}

const filteredPickerRecipes = computed(() =>
  recipesStore.searchRecipes(pickerSearch.value)
)

function selectRecipe(id) {
  mealPlanStore.setMeal(picker.value.day, picker.value.meal, id)
  picker.value.open = false
}

function generateShopping() {
  shoppingStore.generateFromMealPlan()
  successMessage.value = 'Shopping list updated from your meal plan!'
  setTimeout(() => { successMessage.value = '' }, 3000)
  router.push('/shopping')
}

function confirmClear() {
  if (confirm('Clear the entire week?')) mealPlanStore.clearWeek()
}
</script>

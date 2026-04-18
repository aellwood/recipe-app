<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Recipes</h1>
      <router-link to="/recipes/new" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        + Add Recipe
      </router-link>
    </div>

    <!-- Search & Filter -->
    <div class="bg-white rounded-2xl p-5 shadow-sm mb-6">
      <div class="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          v-model="query"
          type="text"
          placeholder="Search recipes..."
          class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
        <input
          v-model="ingredientSearch"
          type="text"
          placeholder="Search by ingredient..."
          class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        />
      </div>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in recipesStore.allTags"
          :key="tag"
          @click="toggleTag(tag)"
          class="px-3 py-1 rounded-full text-xs font-medium transition-colors"
          :class="selectedTags.includes(tag) ? 'bg-amber-500 text-white' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'"
        >{{ tag }}</button>
      </div>
    </div>

    <p class="text-sm text-gray-500 mb-4">{{ results.length }} recipe{{ results.length !== 1 ? 's' : '' }} found</p>

    <div v-if="results.length" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <RecipeCard v-for="recipe in results" :key="recipe.id" :recipe="recipe" />
    </div>
    <div v-else class="text-center py-20 text-gray-400">
      <div class="text-5xl mb-4">🔍</div>
      <p class="text-lg">No recipes found</p>
      <p class="text-sm mt-1">Try a different search or <router-link to="/recipes/new" class="text-amber-600 hover:underline">add a new recipe</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRecipesStore } from '../stores/recipes'
import RecipeCard from '../components/RecipeCard.vue'

const recipesStore = useRecipesStore()
const query = ref('')
const ingredientSearch = ref('')
const selectedTags = ref([])

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  idx === -1 ? selectedTags.value.push(tag) : selectedTags.value.splice(idx, 1)
}

const results = computed(() => recipesStore.searchRecipes(query.value, selectedTags.value, ingredientSearch.value))
</script>

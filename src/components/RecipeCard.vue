<template>
  <router-link :to="`/recipes/${recipe.id}`" class="block group">
    <div class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-amber-50">
      <div class="aspect-video overflow-hidden bg-amber-100">
        <img
          v-if="recipe.image"
          :src="recipe.image"
          :alt="recipe.title"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-5xl">🍽️</div>
      </div>
      <div class="p-4">
        <div class="flex items-start justify-between gap-2 mb-1">
          <h3 class="font-semibold text-gray-900 group-hover:text-amber-700 transition-colors leading-tight">{{ recipe.title }}</h3>
          <span
            class="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full"
            :class="{
              'bg-green-100 text-green-700': recipe.difficulty === 'Easy',
              'bg-yellow-100 text-yellow-700': recipe.difficulty === 'Medium',
              'bg-red-100 text-red-700': recipe.difficulty === 'Hard',
            }"
          >{{ recipe.difficulty }}</span>
        </div>
        <p class="text-sm text-gray-500 line-clamp-2 mb-3">{{ recipe.description }}</p>
        <div class="flex items-center gap-3 text-xs text-gray-400">
          <span>⏱ {{ recipe.prepTime + recipe.cookTime }} min</span>
          <span>👤 {{ recipe.servings }}</span>
          <div class="flex gap-1 ml-auto flex-wrap justify-end">
            <span
              v-for="tag in recipe.tags.slice(0, 2)"
              :key="tag"
              class="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full"
            >{{ tag }}</span>
          </div>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
defineProps({ recipe: Object })
</script>

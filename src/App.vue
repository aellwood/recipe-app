<template>
  <div class="min-h-screen bg-amber-50">
    <nav class="bg-white shadow-sm border-b border-amber-100 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <router-link to="/" class="flex items-center gap-2 text-xl font-bold text-amber-700">
          <span class="text-2xl">🍴</span> RecipeApp
        </router-link>
        <div class="flex items-center gap-1">
          <NavLink to="/" exact>Home</NavLink>
          <NavLink to="/recipes">Recipes</NavLink>
          <NavLink to="/planner">Planner</NavLink>
          <NavLink to="/shopping">Shopping</NavLink>
          <NavLink to="/ai">AI Chef</NavLink>
        </div>
        <router-link
          to="/recipes/new"
          class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Recipe
        </router-link>
      </div>
    </nav>
    <main class="max-w-6xl mx-auto px-4 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavLink from './components/NavLink.vue'
</script>

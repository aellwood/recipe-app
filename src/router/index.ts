import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/recipes', name: 'recipes', component: () => import('../views/RecipesView.vue') },
    { path: '/recipes/new', name: 'recipe-new', component: () => import('../views/RecipeFormView.vue') },
    { path: '/recipes/:id', name: 'recipe-detail', component: () => import('../views/RecipeDetailView.vue') },
    { path: '/recipes/:id/edit', name: 'recipe-edit', component: () => import('../views/RecipeFormView.vue') },
    { path: '/planner', name: 'planner', component: () => import('../views/MealPlannerView.vue') },
    { path: '/shopping', name: 'shopping', component: () => import('../views/ShoppingListView.vue') },
    { path: '/ai', name: 'ai', component: () => import('../views/AIAssistantView.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})

export default router

<template>
  <div class="min-h-screen bg-amber-50">
    <!-- Authenticated layout -->
    <template v-if="authStore.user">
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
          <div class="flex items-center gap-3">
            <router-link
              to="/recipes/new"
              class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >+ Add Recipe</router-link>
            <div class="relative" ref="userMenuRef">
              <button
                @click="showUserMenu = !showUserMenu"
                class="flex items-center gap-2 pl-3 border-l border-gray-200"
              >
                <div class="w-8 h-8 bg-amber-200 rounded-full flex items-center justify-center text-amber-800 font-semibold text-sm">
                  {{ userInitial }}
                </div>
              </button>
              <div v-if="showUserMenu" class="absolute right-0 top-10 bg-white border border-gray-200 rounded-xl shadow-lg p-1 w-48 z-50">
                <div class="px-3 py-2 text-xs text-gray-400 truncate">{{ authStore.user.email }}</div>
                <hr class="border-gray-100 my-1" />
                <button
                  @click="signOut"
                  class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >Sign out</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main class="max-w-6xl mx-auto px-4 py-8">
        <div v-if="storesLoading" class="flex items-center justify-center py-20">
          <div class="text-gray-400 text-sm">Loading…</div>
        </div>
        <router-view v-else />
      </main>
    </template>

    <!-- Unauthenticated: just show the router-view (AuthView handles its own layout) -->
    <router-view v-else />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import NavLink from './components/NavLink.vue'
import { useAuthStore } from './stores/auth'
import { useRecipesStore } from './stores/recipes'
import { useMealPlanStore } from './stores/mealPlan'
import { useShoppingStore } from './stores/shopping'

const authStore = useAuthStore()
const recipesStore = useRecipesStore()
const mealPlanStore = useMealPlanStore()
const shoppingStore = useShoppingStore()
const router = useRouter()

const showUserMenu = ref(false)
const userMenuRef = ref<HTMLElement | null>(null)

const userInitial = computed(() => authStore.user?.email?.[0].toUpperCase() ?? '?')
const storesLoading = computed(() => recipesStore.loading || mealPlanStore.loading || shoppingStore.loading)

async function initStores() {
  await Promise.all([recipesStore.init(), mealPlanStore.init(), shoppingStore.init()])
}

function resetStores() {
  recipesStore.reset()
  mealPlanStore.reset()
  shoppingStore.reset()
}

watch(() => authStore.user, async (user, prevUser) => {
  if (user && !prevUser) {
    await initStores()
  }
  if (!user && prevUser) {
    resetStores()
    router.push('/auth')
  }
}, { immediate: true })

async function signOut() {
  showUserMenu.value = false
  await authStore.signOut()
}

function handleClickOutside(e: MouseEvent) {
  if (userMenuRef.value && !userMenuRef.value.contains(e.target as Node)) {
    showUserMenu.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', handleClickOutside))
</script>

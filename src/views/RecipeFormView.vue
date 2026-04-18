<template>
  <div class="max-w-2xl mx-auto">
    <button @click="$router.back()" class="text-sm text-amber-600 hover:text-amber-700 mb-6 flex items-center gap-1">← Back</button>
    <div class="bg-white rounded-3xl shadow-sm p-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-8">{{ isEdit ? 'Edit Recipe' : 'New Recipe' }}</h1>

      <form @submit.prevent="submit" class="space-y-6">
        <!-- Basic Info -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input v-model="form.title" required type="text" placeholder="Recipe name" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea v-model="form.description" rows="2" placeholder="Brief description" class="input"></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input v-model="form.image" type="text" placeholder="https://..." class="input" />
          </div>
        </div>

        <!-- Time & Difficulty -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Prep (min)</label>
            <input v-model.number="form.prepTime" type="number" min="0" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Cook (min)</label>
            <input v-model.number="form.cookTime" type="number" min="0" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Servings</label>
            <input v-model.number="form.servings" type="number" min="1" class="input" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select v-model="form.difficulty" class="input">
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input v-model="tagsInput" type="text" placeholder="Italian, Pasta, Quick" class="input" />
        </div>

        <!-- Ingredients -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">Ingredients</label>
            <button type="button" @click="addIngredient" class="text-xs text-amber-600 hover:text-amber-700 font-medium">+ Add</button>
          </div>
          <div class="space-y-2">
            <div v-for="(ing, i) in form.ingredients" :key="i" class="flex gap-2">
              <input v-model="ing.amount" type="text" placeholder="Amount" class="input w-20" />
              <input v-model="ing.unit" type="text" placeholder="Unit" class="input w-20" />
              <input v-model="ing.name" type="text" placeholder="Ingredient" class="input flex-1" />
              <button type="button" @click="removeIngredient(i)" class="text-red-400 hover:text-red-600 px-1">✕</button>
            </div>
          </div>
        </div>

        <!-- Steps -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <label class="block text-sm font-medium text-gray-700">Instructions</label>
            <button type="button" @click="addStep" class="text-xs text-amber-600 hover:text-amber-700 font-medium">+ Add Step</button>
          </div>
          <div class="space-y-2">
            <div v-for="(step, i) in form.steps" :key="i" class="flex gap-2 items-start">
              <div class="shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-bold mt-2">{{ i + 1 }}</div>
              <textarea v-model="form.steps[i]" rows="2" :placeholder="`Step ${i + 1}`" class="input flex-1"></textarea>
              <button type="button" @click="removeStep(i)" class="text-red-400 hover:text-red-600 px-1 mt-2">✕</button>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button type="submit" :disabled="submitting" class="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
            {{ submitting ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Recipe') }}
          </button>
          <button type="button" @click="$router.back()" class="border border-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Difficulty } from '../types'
import { useRecipesStore } from '../stores/recipes'

const route = useRoute()
const router = useRouter()
const recipesStore = useRecipesStore()

const isEdit = computed(() => !!route.params.id)
const submitting = ref(false)

const form = ref({
  title: '',
  description: '',
  image: '',
  prepTime: 15,
  cookTime: 30,
  servings: 4,
  difficulty: 'Medium' as Difficulty,
  tags: [] as string[],
  ingredients: [{ amount: '', unit: '', name: '' }],
  steps: [''],
})

const tagsInput = ref('')

onMounted(() => {
  if (isEdit.value) {
    const recipe = recipesStore.getById(route.params.id)
    if (recipe) {
      form.value = { ...recipe, ingredients: recipe.ingredients.map(i => ({ ...i })), steps: [...recipe.steps] }
      tagsInput.value = recipe.tags.join(', ')
    }
  }
})

function addIngredient() { form.value.ingredients.push({ amount: '', unit: '', name: '' }) }
function removeIngredient(i: number) { form.value.ingredients.splice(i, 1) }
function addStep() { form.value.steps.push('') }
function removeStep(i: number) { form.value.steps.splice(i, 1) }

async function submit() {
  submitting.value = true
  const tags = tagsInput.value.split(',').map(t => t.trim()).filter(Boolean)
  const data = {
    ...form.value,
    tags,
    ingredients: form.value.ingredients.filter(i => i.name),
    steps: form.value.steps.filter(s => s.trim()),
  }
  if (isEdit.value) {
    await recipesStore.updateRecipe(route.params.id as string, data)
    router.push(`/recipes/${route.params.id}`)
  } else {
    const newRecipe = await recipesStore.addRecipe(data)
    if (newRecipe) router.push(`/recipes/${newRecipe.id}`)
  }
  submitting.value = false
}
</script>


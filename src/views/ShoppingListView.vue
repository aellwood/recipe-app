<template>
  <div class="max-w-xl mx-auto">
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Shopping List</h1>
      <div class="flex gap-2">
        <button @click="shoppingStore.clearChecked()" class="border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-colors">
          Remove checked
        </button>
        <button @click="confirmClearAll" class="border border-red-200 text-red-600 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50 transition-colors">
          Clear all
        </button>
      </div>
    </div>

    <!-- Generate from meal plan -->
    <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center justify-between">
      <div>
        <div class="font-medium text-amber-800 text-sm">Generate from Meal Plan</div>
        <div class="text-xs text-amber-600 mt-0.5">Auto-add ingredients from your planned meals</div>
      </div>
      <button @click="generateFromPlan" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
        Generate
      </button>
    </div>

    <!-- Add Item -->
    <div class="flex gap-2 mb-6">
      <input
        v-model="newItem"
        @keydown.enter="addItem"
        type="text"
        placeholder="Add an item..."
        class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
      />
      <button @click="addItem" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">Add</button>
    </div>

    <!-- List -->
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div v-if="shoppingStore.items.length === 0" class="text-center py-16 text-gray-400">
        <div class="text-4xl mb-3">🛒</div>
        <p>Your shopping list is empty</p>
      </div>
      <div v-else>
        <!-- Unchecked -->
        <div v-if="unchecked.length">
          <div class="px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase">To Buy ({{ unchecked.length }})</div>
          <ul class="divide-y divide-gray-50">
            <li v-for="item in unchecked" :key="item.id" class="flex items-center gap-3 px-5 py-3">
              <button @click="shoppingStore.toggleItem(item.id)" class="w-5 h-5 rounded border-2 border-gray-300 hover:border-amber-400 transition-colors shrink-0"></button>
              <span class="flex-1 text-sm text-gray-800">{{ item.text }}</span>
              <button @click="shoppingStore.removeItem(item.id)" class="text-gray-300 hover:text-red-400 transition-colors text-sm">✕</button>
            </li>
          </ul>
        </div>
        <!-- Checked -->
        <div v-if="checked.length">
          <div class="px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-400 uppercase">Got It ({{ checked.length }})</div>
          <ul class="divide-y divide-gray-50">
            <li v-for="item in checked" :key="item.id" class="flex items-center gap-3 px-5 py-3 opacity-50">
              <button @click="shoppingStore.toggleItem(item.id)" class="w-5 h-5 rounded border-2 border-amber-400 bg-amber-400 transition-colors shrink-0 flex items-center justify-center">
                <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>
              </button>
              <span class="flex-1 text-sm text-gray-500 line-through">{{ item.text }}</span>
              <button @click="shoppingStore.removeItem(item.id)" class="text-gray-300 hover:text-red-400 transition-colors text-sm">✕</button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useShoppingStore } from '../stores/shopping'

const shoppingStore = useShoppingStore()
const newItem = ref('')

const unchecked = computed(() => shoppingStore.items.filter(i => !i.checked))
const checked = computed(() => shoppingStore.items.filter(i => i.checked))

function addItem() {
  shoppingStore.addItem(newItem.value)
  newItem.value = ''
}

function generateFromPlan() {
  shoppingStore.generateFromMealPlan()
}

function confirmClearAll() {
  if (confirm('Clear the entire shopping list?')) shoppingStore.clearAll()
}
</script>

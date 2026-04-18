<template>
  <div class="max-w-3xl mx-auto">
    <div class="flex items-center gap-3 mb-6">
      <div class="text-3xl">✨</div>
      <div>
        <h1 class="text-2xl font-bold text-gray-900">AI Chef</h1>
        <p class="text-sm text-gray-500">Powered by Claude</p>
      </div>
    </div>

    <!-- API Key Setup -->
    <div v-if="!hasApiKey" class="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
      <h3 class="font-semibold text-amber-800 mb-2">Set up your Anthropic API Key</h3>
      <p class="text-sm text-amber-700 mb-4">To use the AI features, you need an Anthropic API key. Your key is stored locally in your browser.</p>
      <div class="flex gap-2">
        <input v-model="apiKeyInput" type="password" placeholder="sk-ant-..." class="flex-1 border border-amber-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white" />
        <button @click="saveApiKey" class="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors">Save Key</button>
      </div>
    </div>
    <div v-else class="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-6">
      <span class="text-sm text-green-700 font-medium">✓ API key configured</span>
      <button @click="removeApiKey" class="text-xs text-green-600 hover:text-green-800 underline">Remove</button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        class="px-4 py-2.5 text-sm font-medium border-b-2 transition-colors"
        :class="activeTab === tab.id ? 'border-amber-500 text-amber-700' : 'border-transparent text-gray-500 hover:text-gray-700'"
      >{{ tab.label }}</button>
    </div>

    <!-- Chat Tab -->
    <div v-if="activeTab === 'chat'">
      <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        <div ref="chatContainer" class="h-96 overflow-y-auto p-5 space-y-4">
          <div v-if="chatMessages.length === 0" class="text-center py-12 text-gray-400">
            <div class="text-4xl mb-3">👨‍🍳</div>
            <p class="text-sm">Ask me anything about cooking, recipes, or food!</p>
          </div>
          <div v-for="(msg, i) in chatMessages" :key="i" class="flex" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
            <div
              class="max-w-[80%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap"
              :class="msg.role === 'user' ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-800'"
            >{{ msg.content }}</div>
          </div>
          <div v-if="ai.loading.value" class="flex justify-start">
            <div class="bg-gray-100 rounded-2xl px-4 py-3">
              <div class="flex gap-1">
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.15s"></div>
                <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay:0.3s"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="flex gap-2">
        <input
          v-model="chatInput"
          @keydown.enter.prevent="sendChat"
          type="text"
          placeholder="Ask the AI Chef..."
          class="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
          :disabled="ai.loading.value"
        />
        <button @click="sendChat" :disabled="ai.loading.value || !chatInput.trim()" class="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors">
          Send
        </button>
      </div>
    </div>

    <!-- Suggest from Ingredients Tab -->
    <div v-if="activeTab === 'suggest'" class="space-y-4">
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">What ingredients do you have?</label>
        <textarea
          v-model="ingredients"
          rows="3"
          placeholder="e.g. chicken, garlic, tomatoes, pasta, olive oil..."
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
        ></textarea>
        <button @click="suggestRecipes" :disabled="ai.loading.value || !ingredients.trim()" class="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          {{ ai.loading.value ? 'Thinking...' : 'Suggest Recipes ✨' }}
        </button>
      </div>
      <AIResult :result="suggestResult" :error="ai.error.value" />
    </div>

    <!-- Substitution Tab -->
    <div v-if="activeTab === 'sub'" class="space-y-4">
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ingredient to substitute</label>
            <input v-model="subIngredient" type="text" placeholder="e.g. buttermilk" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Context (optional)</label>
            <input v-model="subContext" type="text" placeholder="e.g. chocolate cake" class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
        </div>
        <button @click="getSubstitution" :disabled="ai.loading.value || !subIngredient.trim()" class="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          {{ ai.loading.value ? 'Thinking...' : 'Find Substitutes ✨' }}
        </button>
      </div>
      <AIResult :result="subResult" :error="ai.error.value" />
    </div>

    <!-- Generate Recipe Tab -->
    <div v-if="activeTab === 'generate'" class="space-y-4">
      <div class="bg-white rounded-2xl shadow-sm p-6">
        <label class="block text-sm font-medium text-gray-700 mb-2">Describe the recipe you want</label>
        <textarea
          v-model="recipeDesc"
          rows="3"
          placeholder="e.g. A hearty vegetarian curry with chickpeas and coconut milk, mild spice level..."
          class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mb-4"
        ></textarea>
        <button @click="generateRecipe" :disabled="ai.loading.value || !recipeDesc.trim()" class="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-colors">
          {{ ai.loading.value ? 'Creating recipe...' : 'Generate Recipe ✨' }}
        </button>
      </div>
      <AIResult :result="generateResult" :error="ai.error.value" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useAI } from '../composables/useAI'
import AIResult from '../components/AIResult.vue'

const ai = useAI()

const hasApiKey = ref(!!localStorage.getItem('anthropicApiKey'))
const apiKeyInput = ref('')

function saveApiKey() {
  if (!apiKeyInput.value.trim()) return
  localStorage.setItem('anthropicApiKey', apiKeyInput.value.trim())
  hasApiKey.value = true
  apiKeyInput.value = ''
}
function removeApiKey() {
  localStorage.removeItem('anthropicApiKey')
  hasApiKey.value = false
}

const tabs = [
  { id: 'chat', label: '💬 Chat' },
  { id: 'suggest', label: '🥦 Recipe from Ingredients' },
  { id: 'sub', label: '🔄 Substitutions' },
  { id: 'generate', label: '✍️ Generate Recipe' },
]
const activeTab = ref('chat')

// Chat
const chatMessages = ref([])
const chatInput = ref('')
const chatContainer = ref(null)

async function sendChat() {
  if (!chatInput.value.trim() || ai.loading.value) return
  const userMsg = chatInput.value.trim()
  chatInput.value = ''
  chatMessages.value.push({ role: 'user', content: userMsg })
  await nextTick()
  chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' })

  const history = chatMessages.value.map(m => ({ role: m.role, content: m.content }))
  const reply = await ai.chat(history)
  if (reply) chatMessages.value.push({ role: 'assistant', content: reply })
  await nextTick()
  chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' })
}

// Suggest
const ingredients = ref('')
const suggestResult = ref('')
async function suggestRecipes() {
  suggestResult.value = ''
  suggestResult.value = await ai.suggestRecipes(ingredients.value)
}

// Substitution
const subIngredient = ref('')
const subContext = ref('')
const subResult = ref('')
async function getSubstitution() {
  subResult.value = ''
  subResult.value = await ai.getSubstitution(subIngredient.value, subContext.value)
}

// Generate
const recipeDesc = ref('')
const generateResult = ref('')
async function generateRecipe() {
  generateResult.value = ''
  generateResult.value = await ai.generateRecipe(recipeDesc.value)
}
</script>

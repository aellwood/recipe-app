import { ref } from 'vue'
import type { Ref } from 'vue'
import type { AIMessage } from '../types'

interface UseAI {
  loading: Ref<boolean>
  error: Ref<string | null>
  suggestRecipes: (ingredients: string) => Promise<string | null>
  getSubstitution: (ingredient: string, context?: string) => Promise<string | null>
  generateRecipe: (description: string) => Promise<string | null>
  chat: (messages: AIMessage[]) => Promise<string | null>
}

export function useAI(): UseAI {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function callAI(systemPrompt: string, userMessage: string): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      const apiKey = localStorage.getItem('anthropicApiKey')
      if (!apiKey) throw new Error('No API key set. Please add your Anthropic API key in the AI Assistant settings.')

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: systemPrompt,
          messages: [{ role: 'user', content: userMessage }],
        }),
      })

      if (!response.ok) {
        const err = await response.json() as { error?: { message?: string } }
        throw new Error(err.error?.message ?? 'API request failed')
      }

      const data = await response.json() as { content: Array<{ text: string }> }
      return data.content[0].text
    } catch (e) {
      error.value = (e as Error).message
      return null
    } finally {
      loading.value = false
    }
  }

  async function suggestRecipes(ingredients: string): Promise<string | null> {
    return callAI(
      'You are a helpful cooking assistant. Suggest 3 recipes based on the ingredients provided. Format each recipe with: Title, Brief description, Ingredients needed (mark which ones the user already has), and Steps. Be practical and appetising.',
      `I have these ingredients: ${ingredients}. What recipes can I make?`
    )
  }

  async function getSubstitution(ingredient: string, context?: string): Promise<string | null> {
    return callAI(
      'You are a helpful cooking assistant specialising in ingredient substitutions. Provide practical, specific substitution advice.',
      `What can I substitute for "${ingredient}"${context ? ` in ${context}` : ''}? Give me 2-3 options with ratios and any notes.`
    )
  }

  async function generateRecipe(description: string): Promise<string | null> {
    return callAI(
      'You are a professional chef and recipe writer. Generate a complete, well-structured recipe. Include: title, description, prep time, cook time, servings, difficulty (Easy/Medium/Hard), tags, a full ingredients list with amounts, and numbered step-by-step instructions.',
      `Create a recipe for: ${description}`
    )
  }

  async function chat(messages: AIMessage[]): Promise<string | null> {
    loading.value = true
    error.value = null
    try {
      const apiKey = localStorage.getItem('anthropicApiKey')
      if (!apiKey) throw new Error('No API key set. Please add your Anthropic API key in the AI Assistant settings.')

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 2048,
          system: 'You are a knowledgeable and friendly cooking assistant. Help users with recipes, cooking techniques, ingredient substitutions, meal planning, and food questions. Be concise but thorough.',
          messages,
        }),
      })

      if (!response.ok) {
        const err = await response.json() as { error?: { message?: string } }
        throw new Error(err.error?.message ?? 'API request failed')
      }

      const data = await response.json() as { content: Array<{ text: string }> }
      return data.content[0].text
    } catch (e) {
      error.value = (e as Error).message
      return null
    } finally {
      loading.value = false
    }
  }

  return { loading, error, suggestRecipes, getSubstitution, generateRecipe, chat }
}

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useAI } from './useAI'

const mockResponse = (text: string) =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ content: [{ text }] }),
  } as Response)

const errorResponse = (message: string, status = 400) =>
  Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error: { message } }),
  } as Response)

beforeEach(() => {
  localStorage.clear()
  vi.unstubAllGlobals()
})

describe('useAI – no API key', () => {
  it('returns null and sets error when no key is stored', async () => {
    const { suggestRecipes, error } = useAI()
    const result = await suggestRecipes('tomatoes, pasta')
    expect(result).toBeNull()
    expect(error.value).toMatch(/api key/i)
  })
})

describe('useAI – suggestRecipes', () => {
  it('calls the Anthropic API and returns the text response', async () => {
    localStorage.setItem('anthropicApiKey', 'test-key')
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(mockResponse('Here are 3 recipes...')))

    const { suggestRecipes, loading, error } = useAI()
    const result = await suggestRecipes('cashews, garlic, lemon')

    expect(result).toBe('Here are 3 recipes...')
    expect(error.value).toBeNull()
    expect(loading.value).toBe(false)
  })

  it('sends the ingredients in the user message', async () => {
    localStorage.setItem('anthropicApiKey', 'test-key')
    const fetchMock = vi.fn().mockReturnValue(mockResponse('recipes'))
    vi.stubGlobal('fetch', fetchMock)

    const { suggestRecipes } = useAI()
    await suggestRecipes('tofu, ginger')

    const body = JSON.parse((fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string)
    expect(body.messages[0].content).toContain('tofu, ginger')
  })
})

describe('useAI – getSubstitution', () => {
  it('returns substitution advice', async () => {
    localStorage.setItem('anthropicApiKey', 'test-key')
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(mockResponse('Use flax egg instead.')))

    const { getSubstitution } = useAI()
    const result = await getSubstitution('egg', 'banana bread')
    expect(result).toBe('Use flax egg instead.')
  })

  it('includes context in the message when provided', async () => {
    localStorage.setItem('anthropicApiKey', 'test-key')
    const fetchMock = vi.fn().mockReturnValue(mockResponse('ok'))
    vi.stubGlobal('fetch', fetchMock)

    const { getSubstitution } = useAI()
    await getSubstitution('butter', 'shortbread')

    const body = JSON.parse((fetchMock.mock.calls[0] as [string, RequestInit])[1].body as string)
    expect(body.messages[0].content).toContain('shortbread')
  })
})

describe('useAI – generateRecipe', () => {
  it('returns a generated recipe string', async () => {
    localStorage.setItem('anthropicApiKey', 'test-key')
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(mockResponse('# Vegan Chilli\n...')))

    const { generateRecipe } = useAI()
    const result = await generateRecipe('spicy vegan chilli')
    expect(result).toContain('Vegan Chilli')
  })
})

describe('useAI – chat', () => {
  it('sends conversation history and returns assistant reply', async () => {
    localStorage.setItem('anthropicApiKey', 'test-key')
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(mockResponse('Try adding more spice.')))

    const { chat } = useAI()
    const result = await chat([
      { role: 'user', content: 'My curry tastes bland.' },
    ])
    expect(result).toBe('Try adding more spice.')
  })
})

describe('useAI – error handling', () => {
  it('sets error and returns null on API failure', async () => {
    localStorage.setItem('anthropicApiKey', 'test-key')
    vi.stubGlobal('fetch', vi.fn().mockReturnValue(errorResponse('Invalid API key', 401)))

    const { suggestRecipes, error } = useAI()
    const result = await suggestRecipes('anything')

    expect(result).toBeNull()
    expect(error.value).toBe('Invalid API key')
  })

  it('sets error and returns null on network failure', async () => {
    localStorage.setItem('anthropicApiKey', 'test-key')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const { generateRecipe, error } = useAI()
    const result = await generateRecipe('pasta')

    expect(result).toBeNull()
    expect(error.value).toBe('Network error')
  })

  it('resets loading to false after an error', async () => {
    localStorage.setItem('anthropicApiKey', 'test-key')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('fail')))

    const { suggestRecipes, loading } = useAI()
    await suggestRecipes('anything')
    expect(loading.value).toBe(false)
  })
})

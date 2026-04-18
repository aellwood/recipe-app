import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  async function init() {
    const { data: { session } } = await supabase.auth.getSession()
    user.value = session?.user ?? null
    loading.value = false

    supabase.auth.onAuthStateChange((_, session) => {
      user.value = session?.user ?? null
    })
  }

  async function signInWithEmail(email: string, password: string): Promise<boolean> {
    error.value = null
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { error.value = err.message; return false }
    return true
  }

  async function signUpWithEmail(email: string, password: string): Promise<boolean> {
    error.value = null
    const { error: err } = await supabase.auth.signUp({ email, password })
    if (err) { error.value = err.message; return false }
    return true
  }

  async function signInWithGoogle(): Promise<void> {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signInWithGitHub(): Promise<void> {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    })
  }

  async function signOut(): Promise<void> {
    await supabase.auth.signOut()
  }

  return { user, loading, error, init, signInWithEmail, signUpWithEmail, signInWithGoogle, signInWithGitHub, signOut }
})

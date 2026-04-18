<template>
  <div class="min-h-screen bg-amber-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="text-5xl mb-3">🍴</div>
        <h1 class="text-2xl font-bold text-amber-700">RecipeApp</h1>
        <p class="text-gray-500 text-sm mt-1">Your personal vegan recipe collection</p>
      </div>

      <div class="bg-white rounded-3xl shadow-sm p-8">
        <!-- Success message (after sign up) -->
        <div v-if="signedUp" class="text-center py-4">
          <div class="text-4xl mb-3">📬</div>
          <h2 class="font-semibold text-gray-900 mb-2">Check your email</h2>
          <p class="text-sm text-gray-500">We sent a confirmation link to <strong>{{ confirmedEmail }}</strong>. Click it to activate your account.</p>
          <button @click="signedUp = false" class="mt-4 text-sm text-amber-600 hover:underline">Back to sign in</button>
        </div>

        <template v-else>
          <!-- Tabs -->
          <div class="flex rounded-xl bg-gray-100 p-1 mb-6">
            <button
              v-for="tab in ['Sign in', 'Sign up']"
              :key="tab"
              @click="activeTab = tab"
              class="flex-1 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="activeTab === tab ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'"
            >{{ tab }}</button>
          </div>

          <!-- Error -->
          <div v-if="authStore.error" class="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm mb-4">
            {{ authStore.error }}
          </div>

          <!-- Form -->
          <form @submit.prevent="submit" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input v-model="email" type="email" required placeholder="you@example.com"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input v-model="password" type="password" required placeholder="••••••••" minlength="6"
                class="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
            </div>
            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white py-2.5 rounded-xl font-medium text-sm transition-colors"
            >{{ submitting ? 'Please wait…' : activeTab }}</button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-3 my-5">
            <div class="flex-1 h-px bg-gray-200"></div>
            <span class="text-xs text-gray-400">or continue with</span>
            <div class="flex-1 h-px bg-gray-200"></div>
          </div>

          <!-- Social buttons -->
          <div class="grid grid-cols-2 gap-3">
            <button @click="authStore.signInWithGoogle()"
              class="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg viewBox="0 0 24 24" class="w-4 h-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button @click="authStore.signInWithGitHub()"
              class="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              <svg viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
              </svg>
              GitHub
            </button>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref('Sign in')
const email = ref('')
const password = ref('')
const submitting = ref(false)
const signedUp = ref(false)
const confirmedEmail = ref('')

async function submit() {
  submitting.value = true
  if (activeTab.value === 'Sign in') {
    const ok = await authStore.signInWithEmail(email.value, password.value)
    if (ok) router.push('/')
  } else {
    const ok = await authStore.signUpWithEmail(email.value, password.value)
    if (ok) {
      confirmedEmail.value = email.value
      signedUp.value = true
    }
  }
  submitting.value = false
}
</script>

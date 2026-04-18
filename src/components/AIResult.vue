<template>
  <div v-if="error" class="bg-red-50 border border-red-200 rounded-2xl p-5 text-sm text-red-700">
    {{ error }}
  </div>
  <div v-else-if="result" class="bg-white rounded-2xl shadow-sm p-6">
    <pre class="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{{ result }}</pre>
  </div>
</template>

<script setup lang="ts">
defineProps({ result: String, error: String })
</script>

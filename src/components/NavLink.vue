<template>
  <router-link
    :to="to"
    class="px-3 py-2 rounded-lg text-sm font-medium transition-colors"
    :class="isActive ? 'bg-amber-100 text-amber-800' : 'text-gray-600 hover:bg-gray-100'"
  >
    <slot />
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({ to: String, exact: Boolean })
const route = useRoute()
const isActive = computed(() =>
  props.exact ? route.path === props.to : route.path.startsWith(props.to)
)
</script>

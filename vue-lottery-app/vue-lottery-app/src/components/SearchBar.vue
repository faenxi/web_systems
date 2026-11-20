<script setup lang="ts">
import { ref, watch } from 'vue'

const DEBOUNCE_MS = 300

const emit = defineEmits<{
  'filter-by-name': [query: string]
}>()

const query = ref('')

// Debounce 300 мс: попередній таймер скасовується при кожній новій зміні
watch(query, (value, _oldValue, onCleanup) => {
  const timerId = setTimeout(() => emit('filter-by-name', value.trim()), DEBOUNCE_MS)
  onCleanup(() => clearTimeout(timerId))
})
</script>

<template>
  <div class="input-group">
    <span class="input-group-text"><i class="bi bi-search" /></span>
    <input v-model="query" type="search" class="form-control" placeholder="Search by name" aria-label="Search by name" />
  </div>
</template>

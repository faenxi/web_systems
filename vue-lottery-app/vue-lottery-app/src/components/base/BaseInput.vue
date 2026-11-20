<script setup lang="ts">
import { useId } from 'vue'
import type { FieldStatus } from '../../types/participant'

defineOptions({ inheritAttrs: false })

const {
  label,
  type = 'text',
  status = 'none',
  error = '',
} = defineProps<{
  label: string
  type?: string
  status?: FieldStatus
  error?: string
}>()

const model = defineModel<string>({ required: true })
const emit = defineEmits<{
  blur: []
  input: []
}>()

const id = useId()

function onInput(event: Event): void {
  model.value = (event.target as HTMLInputElement).value
  emit('input')
}
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold mb-1">{{ label }}</label>
    <input
      v-bind="$attrs"
      :id="id"
      :value="model"
      :type="type"
      class="form-control"
      :class="{ 'is-valid': status === 'valid', 'is-invalid': status === 'invalid' }"
      @input="onInput"
      @blur="emit('blur')"
    />
    <div v-if="error" class="invalid-feedback">{{ error }}</div>
  </div>
</template>

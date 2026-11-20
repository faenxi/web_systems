<script setup lang="ts">
import { ref } from 'vue'
import type { Participant, ParticipantInput } from '../types/participant'
import ParticipantForm from './ParticipantForm.vue'

defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  register: [values: ParticipantInput]
}>()

const formRef = ref<InstanceType<typeof ParticipantForm> | null>(null)

function handleSubmit(values: ParticipantInput): void {
  emit('register', values)
  formRef.value?.reset()
}
</script>

<template>
  <section class="card mb-3">
    <div class="card-body">
      <h2 class="h6 text-uppercase fw-bold mb-0">Register form</h2>
      <p class="text-body-secondary mb-4">Please fill in all the fields.</p>
      <ParticipantForm ref="formRef" :participants="participants" @submit="handleSubmit" />
    </div>
  </section>
</template>

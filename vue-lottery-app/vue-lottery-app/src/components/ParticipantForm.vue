<script setup lang="ts">
import { reactive } from 'vue'
import type { FieldStatus, Participant, ParticipantInput } from '../types/participant'
import {
  getTodayIso,
  isEmailTaken,
  validateBirthDate,
  validateEmail,
  validateName,
  validatePhone,
} from '../utils/validation'
import BaseButton from './base/BaseButton.vue'
import BaseInput from './base/BaseInput.vue'

type FieldName = keyof ParticipantInput

const {
  participants,
  submitLabel = 'Save',
  initialValues,
  editingId,
} = defineProps<{
  participants: Participant[]
  submitLabel?: string
  initialValues?: ParticipantInput
  editingId?: string
}>()

const emit = defineEmits<{
  submit: [values: ParticipantInput]
}>()

const FIELDS: FieldName[] = ['name', 'birthDate', 'email', 'phone']
const today = getTodayIso()

const values = reactive<ParticipantInput>({
  name: initialValues?.name ?? '',
  birthDate: initialValues?.birthDate ?? '',
  email: initialValues?.email ?? '',
  phone: initialValues?.phone ?? '',
})
const errors = reactive<Record<FieldName, string>>({ name: '', birthDate: '', email: '', phone: '' })
const touched = reactive<Record<FieldName, boolean>>({
  name: false,
  birthDate: false,
  email: false,
  phone: false,
})

function validateField(field: FieldName): string {
  switch (field) {
    case 'name':
      return validateName(values.name)
    case 'birthDate':
      return validateBirthDate(values.birthDate)
    case 'phone':
      return validatePhone(values.phone)
    case 'email':
      if (validateEmail(values.email)) return validateEmail(values.email)
      return isEmailTaken(values.email, participants, editingId)
        ? 'Participant with this email already exists.'
        : ''
  }
}

// Валідація запускається подіями (blur / input / submit), а не watcher-ом,
// тому очищення форми не викликає помилок.
function check(field: FieldName): void {
  touched[field] = true
  errors[field] = validateField(field)
}

function onInput(field: FieldName): void {
  if (touched[field]) errors[field] = validateField(field)
}

function status(field: FieldName): FieldStatus {
  if (!touched[field]) return 'none'
  return errors[field] ? 'invalid' : 'valid'
}

function onSubmit(): void {
  FIELDS.forEach(check)
  if (FIELDS.some((field) => errors[field])) return
  emit('submit', {
    name: values.name.trim(),
    birthDate: values.birthDate,
    email: values.email.trim(),
    phone: values.phone.trim(),
  })
}

function reset(): void {
  // Знімаємо фокус до очищення, щоб blur не запустив перевірку порожнього поля
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
  values.name = ''
  values.birthDate = ''
  values.email = ''
  values.phone = ''
  FIELDS.forEach((field) => {
    errors[field] = ''
    touched[field] = false
  })
}

defineExpose({ reset })
</script>

<template>
  <form novalidate @submit.prevent @keydown.enter.prevent="onSubmit">
    <BaseInput
      v-model="values.name"
      label="Name"
      placeholder="Enter user name"
      :status="status('name'6)"
      :error="errors.name"
      @blur="check('name')"
      @input="onInput('name')"
    />
    <BaseInput
      v-model="values.birthDate"
      label="Date of Birth"
      type="date"
      :max="today"
      :status="status('birthDate')"
      :error="errors.birthDate"
      @blur="check('birthDate')"
      @input="onInput('birthDate')"
    />
    <BaseInput
      v-model="values.email"
      label="Email"
      placeholder="Enter email"
      :status="status('email')"
      :error="errors.email"
      @blur="check('email')"
      @input="onInput('email')"
    />
    <BaseInput
      v-model="values.phone"
      label="Phone number"
      placeholder="+380XXXXXXXXX"
      :status="status('phone')"
      :error="errors.phone"
      @blur="check('phone')"
      @input="onInput('phone')"
    />
    <div class="d-flex justify-content-end mt-4">
      <BaseButton @click="onSubmit">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>

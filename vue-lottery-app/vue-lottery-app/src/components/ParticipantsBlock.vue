<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Participant, ParticipantInput, SortDirection, SortKey } from '../types/participant'
import { formatDate } from '../utils/format'
import BaseButton from './base/BaseButton.vue'
import BaseModal from './base/BaseModal.vue'
import ParticipantForm from './ParticipantForm.vue'
import SearchBar from './SearchBar.vue'

const { participants } = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  'update-participant': [id: string, values: ParticipantInput]
  'remove-participant': [id: string]
}>()

const filterName = ref('')
const sortKey = ref<SortKey | null>(null)
const sortDirection = ref<SortDirection>('asc')

const editingParticipant = ref<Participant | null>(null)
const isEditModalOpen = ref(false)
const deletingParticipant = ref<Participant | null>(null)
const isDeleteModalOpen = ref(false)

// Спочатку фільтрація, потім сортування; вихідний масив не змінюється
const visibleParticipants = computed<Participant[]>(() => {
  const query = filterName.value.trim().toLowerCase()
  const result = participants.filter((p) => p.name.toLowerCase().includes(query))
  const key = sortKey.value
  if (!key) return result
  const direction = sortDirection.value === 'asc' ? 1 : -1
  return result.sort((a, b) => a[key].localeCompare(b[key]) * direction)
})

const editingValues = computed<ParticipantInput | undefined>(() => {
  const p = editingParticipant.value
  return p ? { name: p.name, birthDate: p.birthDate, email: p.email, phone: p.phone } : undefined
})

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortDirection.value = 'asc'
  }
}

function sortIcon(key: SortKey): string {
  const isDesc = sortKey.value === key && sortDirection.value === 'desc'
  const base = key === 'name' ? 'bi-sort-alpha' : 'bi-sort'
  return `${base}-${isDesc ? 'up' : 'down'}`
}

function openEdit(participant: Participant): void {
  editingParticipant.value = participant
  isEditModalOpen.value = true
}

function submitEdit(values: ParticipantInput): void {
  if (editingParticipant.value) emit('update-participant', editingParticipant.value.id, values)
  isEditModalOpen.value = false
}

function openDelete(participant: Participant): void {
  deletingParticipant.value = participant
  isDeleteModalOpen.value = true
}

function confirmDelete(): void {
  if (deletingParticipant.value) emit('remove-participant', deletingParticipant.value.id)
  isDeleteModalOpen.value = false
}
</script>

<template>
  <section class="card mb-3">
    <div class="card-body">
      <SearchBar class="mb-3" @filter-by-name="filterName = $event" />

      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th scope="col" class="text-body-secondary">#</th>
              <th scope="col">
                Name
                <button type="button" class="sort-btn" aria-label="Sort by name" @click="toggleSort('name')">
                  <i class="bi" :class="[sortIcon('name'), { 'text-primary': sortKey === 'name' }]" />
                </button>
              </th>
              <th scope="col">
                Date of Birth
                <button type="button" class="sort-btn" aria-label="Sort by date of birth" @click="toggleSort('birthDate')">
                  <i class="bi" :class="[sortIcon('birthDate'), { 'text-primary': sortKey === 'birthDate' }]" />
                </button>
              </th>
              <th scope="col">Email</th>
              <th scope="col">Phone number</th>
              <th scope="col" />
              <th scope="col" />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(participant, index) in visibleParticipants" :key="participant.id">
              <th scope="row" class="fw-normal text-body-secondary">{{ index + 1 }}</th>
              <td>{{ participant.name }}</td>
              <td>{{ formatDate(participant.birthDate) }}</td>
              <td>{{ participant.email }}</td>
              <td>{{ participant.phone }}</td>
              <td class="text-nowrap">
                <BaseButton variant="outline-primary" class="btn-sm" @click="openEdit(participant)">
                  Редагувати дані
                </BaseButton>
              </td>
              <td class="text-nowrap">
                <BaseButton variant="outline-danger" class="btn-sm" @click="openDelete(participant)">
                  Видалити учасника
                </BaseButton>
              </td>
            </tr>
            <tr v-if="participants.length > 0 && visibleParticipants.length === 0">
              <td colspan="7" class="text-center text-body-secondary">No participants found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <BaseModal v-model="isEditModalOpen" title="Редагувати дані">
      <ParticipantForm
        v-if="editingParticipant"
        :participants="participants"
        :editing-id="editingParticipant.id"
        :initial-values="editingValues"
        submit-label="Оновити дані"
        @submit="submitEdit"
      />
    </BaseModal>

    <BaseModal v-model="isDeleteModalOpen">
      <template #header>Видалити учасника</template>
      <p v-if="deletingParticipant" class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ deletingParticipant.name }}", "{{ deletingParticipant.email }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="isDeleteModalOpen = false">Ні</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>

<style scoped lang="scss">
.sort-btn {
  padding: 0 0.2rem;
  color: inherit;
  cursor: pointer;
  background: none;
  border: 0;
}
</style>

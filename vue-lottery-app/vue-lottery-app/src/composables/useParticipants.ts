import { ref, watch } from 'vue'
import type { Participant, ParticipantInput } from '../types/participant'

const STORAGE_KEY = 'vue-lottery-participants'

function loadParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as Participant[]) : []
  } catch {
    return []
  }
}

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function useParticipants() {
  // Відновлення зі сховища при завантаженні застосунку
  const participants = ref<Participant[]>(loadParticipants())

  // Збереження через watcher з опцією deep
  watch(
    participants,
    (value) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    },
    { deep: true },
  )

  function addParticipant(values: ParticipantInput): void {
    participants.value.push({ id: createId(), ...values })
  }

  function updateParticipant(id: string, values: ParticipantInput): void {
    const participant = participants.value.find((p) => p.id === id)
    if (participant) Object.assign(participant, values)
  }

  function removeParticipant(id: string): void {
    participants.value = participants.value.filter((p) => p.id !== id)
  }

  return { participants, addParticipant, updateParticipant, removeParticipant }
}

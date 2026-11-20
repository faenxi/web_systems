import { computed, ref, type Ref } from 'vue'
import type { Participant } from '../types/participant'

export const MAX_WINNERS = 3

export function useWinners(participants: Ref<Participant[]>) {
  const winnerIds = ref<string[]>([])

  const winners = computed<Participant[]>(() =>
    winnerIds.value
      .map((id) => participants.value.find((p) => p.id === id))
      .filter((p): p is Participant => p !== undefined),
  )

  const candidates = computed(() => participants.value.filter((p) => !winnerIds.value.includes(p.id)))

  // Неактивна: вже 3 переможці, список порожній або всі вже переможці
  const isDrawDisabled = computed(
    () => winners.value.length >= MAX_WINNERS || candidates.value.length === 0,
  )

  function drawWinner(): void {
    if (isDrawDisabled.value) return
    const winner = candidates.value[Math.floor(Math.random() * candidates.value.length)]
    if (winner) winnerIds.value.push(winner.id)
  }

  function removeWinner(id: string): void {
    winnerIds.value = winnerIds.value.filter((winnerId) => winnerId !== id)
  }

  return { winners, isDrawDisabled, drawWinner, removeWinner }
}

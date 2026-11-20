<script setup lang="ts">
import ParticipantsBlock from './components/ParticipantsBlock.vue'
import RegistrationBlock from './components/RegistrationBlock.vue'
import WinnersBlock from './components/WinnersBlock.vue'
import { useParticipants } from './composables/useParticipants'
import { useWinners } from './composables/useWinners'

const { participants, addParticipant, updateParticipant, removeParticipant } = useParticipants()
const { winners, isDrawDisabled, drawWinner, removeWinner } = useWinners(participants)

// Видалений учасник зникає і з блоку переможців
function handleRemoveParticipant(id: string): void {
  removeWinner(id)
  removeParticipant(id)
}
</script>

<template>
  <main class="app">
    <WinnersBlock
      :winners="winners"
      :is-draw-disabled="isDrawDisabled"
      @draw="drawWinner"
      @remove-winner="removeWinner"
    />
    <RegistrationBlock :participants="participants" @register="addParticipant" />
    <ParticipantsBlock
      :participants="participants"
      @update-participant="updateParticipant"
      @remove-participant="handleRemoveParticipant"
    />
  </main>
</template>

<style scoped lang="scss">
.app {
  max-width: 800px;
  padding: 0 1rem;
  margin: 6rem auto;
}
</style>

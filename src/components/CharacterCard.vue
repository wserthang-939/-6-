<script setup>
import { ArrowUpRight } from 'lucide-vue-next'
defineProps({ character: { type: Object, required: true } })
</script>

<template>
  <RouterLink
    :to="`/character/${character.id}`"
    class="character-card"
    :data-character="character.id"
    :style="{ '--character-color': character.color }"
  >
    <div class="character-card-top">
      <span class="mono">FIGHTER / {{ character.number }}</span
      ><span class="difficulty">{{ character.difficulty }}</span>
    </div>
    <span class="character-watermark" aria-hidden="true">{{ character.englishName }}</span>
    <img
      class="character-art"
      :src="character.image"
      :alt="character.name"
      width="500"
      height="500"
    />
    <div class="character-info">
      <p class="character-english">{{ character.englishName }}</p>
      <h2>{{ character.name }}<small v-if="character.alias === '阿鬼'">阿鬼</small></h2>
      <p>{{ character.subtitle }}</p>
      <div class="character-bottom">
        <span>{{ character.type }}</span
        ><ArrowUpRight :size="21" />
      </div>
    </div>
  </RouterLink>
</template>

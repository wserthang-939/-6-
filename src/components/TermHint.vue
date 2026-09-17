<script setup>
import { computed } from 'vue'
import { glossary } from '../data/glossary.js'
const props = defineProps({ term: { type: String, required: true } })
const entry = computed(() => glossary.find((item) => item.term === props.term))
</script>
<template>
  <details v-if="entry" class="term-hint">
    <summary>{{ term }}是什么意思？</summary>
    <p>{{ entry.description }}</p>
    <RouterLink to="/glossary" class="text-link">查看全部术语 ↗</RouterLink>
  </details>
</template>

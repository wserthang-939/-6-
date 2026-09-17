<script setup>
import { computed, ref } from 'vue'
import { glossary } from '../data/glossary.js'
const query = ref('')
const filtered = computed(() =>
  glossary.filter((entry) =>
    `${entry.term} ${entry.english} ${entry.description}`
      .toLowerCase()
      .includes(query.value.trim().toLowerCase()),
  ),
)
</script>
<template>
  <main class="page glossary-page">
    <RouterLink to="/" class="text-link">← 角色研习</RouterLink>
    <div class="page-heading">
      <div>
        <h1>术语与帧数速查</h1>
        <p class="page-description">先看成立条件，再把术语用进训练；中文用法可能因社区而异。</p>
      </div>
    </div>
    <label class="search-field"
      ><input v-model="query" aria-label="搜索术语" placeholder="搜索：安全跳、差合、帧数…"
    /></label>
    <div class="lesson-list">
      <section v-for="entry in filtered" :key="entry.term" class="lesson-card">
        <h2>
          {{ entry.term }} <small>{{ entry.english }}</small>
        </h2>
        <p>{{ entry.description }}</p>
        <a :href="entry.sourceUrl" class="text-link" target="_blank" rel="noopener noreferrer"
          >术语资料 ↗</a
        >
      </section>
      <p v-if="!filtered.length" role="status">没有找到该术语，请换个关键词。</p>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Search, ArrowUpRight, Gamepad2, Sparkles } from 'lucide-vue-next'
import { characters } from '../data/characters.js'
import CharacterCard from '../components/CharacterCard.vue'
const query = ref('')
const searchInput = ref(null)
function focusSearch(event) {
  if (
    event.key === '/' &&
    !event.ctrlKey &&
    !event.metaKey &&
    !['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) &&
    !event.target.isContentEditable
  ) {
    event.preventDefault()
    searchInput.value?.focus()
  }
}
onMounted(() => window.addEventListener('keydown', focusSearch))
onUnmounted(() => window.removeEventListener('keydown', focusSearch))
function resetFilters() {
  query.value = ''
}
const filtered = computed(() =>
  characters.filter((c) =>
    `${c.name} ${c.englishName} ${c.alias} ${c.tags.join(' ')}`
      .toLowerCase()
      .includes(query.value.trim().toLowerCase()),
  ),
)
</script>

<template>
  <main class="page home-page">
    <div class="page-heading">
      <div>
        <h1>角色研习</h1>
        <p class="page-description">选择角色，学习拳脚、连段与实战套路。</p>
      </div>
      <div class="edition">
        <Gamepad2 :size="24" />
        <div><strong>6 位格斗家</strong><span>招式 · 连段 · 套路 · 实战</span></div>
      </div>
    </div>
    <div class="filter-row">
      <label class="search-field"
        ><Search :size="17" /><input
          ref="searchInput"
          v-model="query"
          aria-label="搜索角色"
          placeholder="搜索角色 / 关键词"
        /><kbd>/</kbd></label
      >
    </div>
    <div v-if="filtered.length" class="character-grid">
      <CharacterCard v-for="character in filtered" :key="character.id" :character="character" />
    </div>
    <div v-else class="empty-state">
      <Search :size="32" />
      <h2>没有找到这位格斗家</h2>
      <p>试试角色中文名、英文名或关键词。</p>
      <button class="button" @click="resetFilters">重置筛选</button>
    </div>
    <div class="home-bottom">
      <div class="practice-note">
        <span class="note-icon"><Sparkles :size="23" /></span>
        <div>
          <p class="eyebrow">TRAINING NOTE / 训练便笺</p>
          <h3>先练稳定，再追求高伤害。</h3>
          <p>从一套基础确反开始，在左右两侧各练习十次，再带进实战。</p>
        </div>
      </div>
      <RouterLink to="/about" class="notation-note linked-note"
        ><span class="mono">INPUT GUIDE</span>
        <h3>看懂指令，练习更轻松 <ArrowUpRight :size="18" /></h3>
        <p>
          <kbd>↓</kbd><kbd>↘</kbd><kbd>→</kbd><span> = 236</span><i></i
          ><span>LP / MP / HP = 轻 / 中 / 重拳</span>
        </p></RouterLink
      >
    </div>
  </main>
</template>

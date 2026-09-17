<script setup>
import { computed, ref } from 'vue'
import { Search, Swords } from 'lucide-vue-next'
import { characters } from '../data/characters.js'
import { matches } from '../data/videos.js'
import { searchItems } from '../data/catalog.js'
import VideoCard from '../components/VideoCard.vue'
import EmptyState from '../components/EmptyState.vue'
const query = ref(''),
  characterId = ref('all'),
  playerType = ref('all'),
  matchType = ref('all')
const filtered = computed(() =>
  searchItems(matches, {
    query: query.value,
    characterId: characterId.value,
    playerType: playerType.value,
    matchType: matchType.value,
  }),
)
function reset() {
  query.value = ''
  characterId.value = 'all'
  playerType.value = 'all'
  matchType.value = 'all'
}
</script>
<template>
  <main class="page">
    <div class="page-heading">
      <div>
        <p class="eyebrow"><span></span> WATCH & LEARN / MATCH STUDY</p>
        <h1>看懂高手的<span>下一步。</span></h1>
        <p class="page-description">带着一个问题看对局，把观察到的选择带回训练场。</p>
      </div>
      <Swords class="heading-icon" :size="40" />
    </div>
    <div class="match-character-filter">
      <button
        :class="{ active: characterId === 'all' }"
        :aria-pressed="characterId === 'all'"
        @click="characterId = 'all'"
      >
        全部角色 <span>{{ matches.length }}</span></button
      ><button
        v-for="c in characters"
        :key="c.id"
        :class="{ active: characterId === c.id }"
        :aria-pressed="characterId === c.id"
        @click="characterId = c.id"
      >
        {{ c.name }} <span>{{ matches.filter((m) => m.characterId === c.id).length }}</span>
      </button>
    </div>
    <div class="control-fields match-controls">
      <label class="search-field"
        ><Search :size="17" /><input
          v-model="query"
          aria-label="搜索对局"
          placeholder="搜索选手、对手或标题" /></label
      ><select v-model="playerType" aria-label="筛选玩家类型">
        <option value="all">全部玩家</option>
        <option>职业选手</option>
        <option>高分玩家</option></select
      ><select v-model="matchType" aria-label="筛选对局类型">
        <option value="all">全部对局类型</option>
        <option v-for="type in ['赛事', '排位', '练习赛', '对局集锦']" :key="type">
          {{ type }}
        </option>
      </select>
    </div>
    <div class="results-heading">
      <span aria-live="polite"
        >精选 <strong>{{ filtered.length }}</strong> 条对局资料</span
      ><span>视频在 B站新标签页打开</span>
    </div>
    <div v-if="filtered.length" class="video-grid">
      <VideoCard v-for="item in filtered" :key="item.id" :item="item" />
    </div>
    <EmptyState v-else @reset="reset" />
    <p class="page-footnote">
      选手分类用于学习导航，不代表当前排名。观看重点是本站提供的观察问题，不是视频逐段转录。
    </p>
  </main>
</template>

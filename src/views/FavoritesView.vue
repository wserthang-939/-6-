<script setup>
import { computed, ref } from 'vue'
import { Bookmark, Search } from 'lucide-vue-next'
import { useFavoritesStore } from '../stores/favorites.js'
import { kindLabels, searchItems } from '../data/catalog.js'
import LessonCard from '../components/LessonCard.vue'
import VideoCard from '../components/VideoCard.vue'
import EmptyState from '../components/EmptyState.vue'
const favorites = useFavoritesStore()
const kind = ref('all'),
  query = ref('')
function resetFilters() {
  kind.value = 'all'
  query.value = ''
}
const filtered = computed(() =>
  searchItems(favorites.items, { kind: kind.value, query: query.value }),
)
const savedLessons = computed(() =>
  filtered.value.filter((i) => !['video', 'match'].includes(i.kind)),
)
const savedVideos = computed(() =>
  filtered.value.filter((i) => ['video', 'match'].includes(i.kind)),
)
</script>
<template>
  <main class="page">
    <div class="page-heading">
      <div>
        <p class="eyebrow"><span></span> YOUR COLLECTION / PERSONAL NOTES</p>
        <h1>下一次练习，<span>接着这里。</span></h1>
        <p class="page-description">
          收藏想练的招式、连段和想回看的视频。保存在当前浏览器，无需登录。
        </p>
      </div>
      <div class="collection-count">
        <Bookmark :size="24" /><strong>{{ favorites.items.length }}</strong
        ><span>条收藏</span>
      </div>
    </div>
    <p v-if="favorites.storageWarning" class="storage-warning" role="status">
      {{ favorites.storageWarning }}
    </p>
    <template v-if="favorites.items.length"
      ><div class="filter-row">
        <div class="filter-tabs">
          <button
            :class="{ active: kind === 'all' }"
            :aria-pressed="kind === 'all'"
            @click="kind = 'all'"
          >
            全部收藏</button
          ><button
            v-for="(name, id) in kindLabels"
            :key="id"
            :class="{ active: kind === id }"
            :aria-pressed="kind === id"
            @click="kind = id"
          >
            {{ name }}
          </button>
        </div>
        <label class="search-field"
          ><Search :size="17" /><input
            v-model="query"
            aria-label="搜索收藏"
            placeholder="在收藏中搜索"
        /></label>
      </div>
      <div v-if="savedLessons.length" class="lesson-grid">
        <LessonCard
          v-for="(item, index) in savedLessons"
          :key="item.id"
          :item="item"
          :index="index"
          show-character
        />
      </div>
      <div v-if="savedVideos.length" class="video-grid favorites-videos">
        <VideoCard v-for="item in savedVideos" :key="item.id" :item="item" />
      </div>
      <EmptyState v-if="!filtered.length" @reset="resetFilters" /></template
    ><EmptyState
      v-else
      title="你的训练清单，等你写下第一招。"
      description="点击内容右上角的书签，就能在这里随时回看。"
      favorites
    />
    <p class="page-footnote">清除浏览器站点数据会移除收藏；不同浏览器或设备之间不会自动同步。</p>
  </main>
</template>

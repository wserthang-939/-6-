<script setup>
import { Bookmark, BookmarkCheck } from 'lucide-vue-next'
import { useFavoritesStore } from '../stores/favorites.js'
import { useNotice } from '../composables/useNotice.js'
const props = defineProps({ item: { type: Object, required: true } })
const favorites = useFavoritesStore()
const { notify } = useNotice()
function toggle() {
  const saved = favorites.toggle(props.item.id)
  notify(favorites.storageWarning || (saved ? '已加入我的收藏' : '已取消收藏'))
}
</script>
<template>
  <button
    class="icon-button favorite-button"
    :class="{ saved: favorites.has(item.id) }"
    :aria-label="`${favorites.has(item.id) ? '取消收藏' : '收藏'}：${item.title}`"
    :title="favorites.has(item.id) ? '取消收藏' : '加入收藏'"
    :aria-pressed="favorites.has(item.id)"
    @click="toggle"
  >
    <BookmarkCheck v-if="favorites.has(item.id)" :size="19" /><Bookmark v-else :size="19" />
  </button>
</template>

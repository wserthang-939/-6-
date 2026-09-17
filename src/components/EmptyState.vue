<script setup>
import { Search, Bookmark } from 'lucide-vue-next'
defineProps({
  title: { type: String, default: '没有找到相关内容' },
  description: { type: String, default: '换一个关键词，或清除筛选条件再试试。' },
  favorites: Boolean,
})
defineEmits(['reset'])
</script>
<template>
  <div class="empty-state">
    <Bookmark v-if="favorites" :size="32" /><Search v-else :size="32" />
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
    <RouterLink v-if="favorites" class="button primary" to="/">去挑选一位角色</RouterLink
    ><button v-else class="button" @click="$emit('reset')">清除筛选</button>
  </div>
</template>

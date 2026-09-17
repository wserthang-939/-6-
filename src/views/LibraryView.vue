<script setup>
import { computed, ref } from 'vue'
import { Search, Layers } from 'lucide-vue-next'
import { characters } from '../data/characters.js'
import { lessons, trapCategories } from '../data/lessons.js'
import { searchItems } from '../data/catalog.js'
import { createComboFilters, filterCombos } from '../data/comboMetadata.js'
import LessonCard from '../components/LessonCard.vue'
import ComboFilterPanel from '../components/ComboFilterPanel.vue'
import EmptyState from '../components/EmptyState.vue'
import FrameGuide from '../components/FrameGuide.vue'
const moveGroup = ref('all')
const query = ref(''),
  characterId = ref('all'),
  kind = ref('combo'),
  trapCategory = ref('all')
const comboFilters = ref(createComboFilters())
const comboItems = computed(() => lessons.filter((item) => item.kind === 'combo'))
const filtered = computed(() => {
  const result = searchItems(lessons, {
    query: query.value,
    characterId: kind.value === 'combo' ? 'all' : characterId.value,
    kind: kind.value,
    trapCategory: kind.value === 'trap' ? trapCategory.value : 'all',
    moveGroup: kind.value === 'move' ? moveGroup.value : 'all',
  })
  return kind.value === 'combo' ? filterCombos(result, comboFilters.value) : result
})
function reset() {
  query.value = ''
  characterId.value = 'all'
  trapCategory.value = 'all'
  moveGroup.value = 'all'
  comboFilters.value = createComboFilters()
}
</script>
<template>
  <main class="page">
    <div class="page-heading">
      <div>
        <h1>学习资料</h1>
        <p class="page-description">先看指令，展开了解用途、帧数与风险。</p>
      </div>
      <Layers class="heading-icon" :size="40" />
    </div>
    <div class="library-controls">
      <div class="filter-tabs">
        <button
          v-for="t in [
            { id: 'combo', name: '实用连段' },
            { id: 'trap', name: '套路与设置' },
            { id: 'move', name: '拳脚介绍' },
          ]"
          :key="t.id"
          :class="{ active: kind === t.id }"
          :aria-pressed="kind === t.id"
          @click="kind = t.id"
        >
          {{ t.name }}
        </button>
      </div>
      <div class="control-fields">
        <label class="search-field"
          ><Search :size="17" /><input
            v-model="query"
            aria-label="搜索学习内容"
            placeholder="搜索连段、指令或关键词" /></label
        ><ComboFilterPanel
          v-if="kind === 'combo'"
          v-model:filters="comboFilters"
          :items="comboItems"
          :result-count="filtered.length"
          show-character
        /><select v-else v-model="characterId" aria-label="筛选角色">
          <option value="all">全部角色</option>
          <option v-for="c in characters" :key="c.id" :value="c.id">{{ c.name }}</option></select
        ><select v-if="kind === 'trap'" v-model="trapCategory" aria-label="筛选陷阱分类">
          <option value="all">全部陷阱分类</option>
          <option v-for="category in trapCategories" :key="category">{{ category }}</option></select
        ><select v-else-if="kind === 'move'" v-model="moveGroup" aria-label="筛选招式类型">
          <option value="all">全部招式</option>
          <option>拳脚 / 目标连段</option>
          <option>必杀 / 特殊动作</option>
        </select>
      </div>
    </div>
    <FrameGuide />
    <p v-if="kind === 'move'" class="frame-caveat">
      精选常用动作，非完整出招表；展开查看轻中重差异、适用状态与资料来源。
    </p>
    <div class="results-heading">
      <span aria-live="polite"
        >找到 <strong>{{ filtered.length }}</strong> 条学习内容</span
      ><span>经典操作 · 朝右记谱</span>
    </div>
    <div v-if="filtered.length" class="lesson-list">
      <LessonCard
        v-for="(item, index) in filtered"
        :key="item.id"
        :item="item"
        :index="index"
        show-character
      />
    </div>
    <EmptyState v-else @reset="reset" />
  </main>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  ArrowUpRight,
  Search,
  BookOpen,
  Layers,
  Lightbulb,
  Play,
  Swords,
  Info,
} from 'lucide-vue-next'
import { characters, getCharacter } from '../data/characters.js'
import { catalog, searchItems } from '../data/catalog.js'
import { trapCategories } from '../data/lessons.js'
import { createComboFilters, filterCombos } from '../data/comboMetadata.js'
import LessonCard from '../components/LessonCard.vue'
import ComboFilterPanel from '../components/ComboFilterPanel.vue'
import VideoCard from '../components/VideoCard.vue'
import NotationGuide from '../components/NotationGuide.vue'
import FrameGuide from '../components/FrameGuide.vue'
import EmptyState from '../components/EmptyState.vue'
const route = useRoute()
const router = useRouter()
const character = computed(() => getCharacter(route.params.id))
const query = ref('')
const trapCategory = ref('all')
const moveGroup = ref('all')
const comboFilters = ref(createComboFilters())
const tabs = [
  { id: 'combo', label: '实用连段', icon: Layers },
  { id: 'move', label: '拳脚介绍', icon: BookOpen },
  { id: 'trap', label: '套路与设置', icon: Lightbulb },
  { id: 'video', label: '视频教学', icon: Play },
  { id: 'match', label: '高手对局', icon: Swords },
]
const tab = computed(() => (tabs.some((t) => t.id === route.query.tab) ? route.query.tab : 'combo'))
const items = computed(() => catalog.filter((item) => item.characterId === character.value?.id))
const comboItems = computed(() => items.value.filter((item) => item.kind === 'combo'))
const filtered = computed(() => {
  const result = searchItems(items.value, {
    kind: tab.value,
    query: query.value,
    trapCategory: tab.value === 'trap' ? trapCategory.value : 'all',
    moveGroup: tab.value === 'move' ? moveGroup.value : 'all',
  })
  return tab.value === 'combo' ? filterCombos(result, comboFilters.value) : result
})
const isVideoTab = computed(() => ['video', 'match'].includes(tab.value))
function reset() {
  query.value = ''
  trapCategory.value = 'all'
  moveGroup.value = 'all'
  comboFilters.value = createComboFilters()
}
function selectTab(id) {
  reset()
  router.replace({ query: { tab: id } })
}
watch(() => route.params.id, reset)
watch(() => route.query.tab, reset)
</script>

<template>
  <main
    v-if="character"
    class="page character-page"
    :style="{ '--character-color': character.color }"
  >
    <div class="detail-breadcrumb">
      <RouterLink to="/"><ArrowLeft :size="16" /> 全部角色</RouterLink><span>/</span
      ><span>{{ character.name }}</span>
      <div class="quick-character-switch">
        <RouterLink
          v-for="c in characters"
          :key="c.id"
          :class="{ selected: c.id === character.id }"
          :to="{ path: `/character/${c.id}`, query: { tab } }"
          >{{ c.name }}</RouterLink
        >
      </div>
    </div>
    <section class="character-hero" :data-character="character.id">
      <div class="character-hero-copy">
        <p class="eyebrow">FIGHTER {{ character.number }} / {{ character.englishName }}</p>
        <h1>{{ character.name }}<span v-if="character.alias === '阿鬼'">阿鬼</span></h1>
        <p class="hero-description">{{ character.description }}</p>
        <div class="hero-tags">
          <span>{{ character.type }}</span
          ><span>{{ character.difficulty }}</span
          ><span v-for="tag in character.tags" :key="tag">{{ tag }}</span>
        </div>
      </div>
      <span class="hero-watermark" aria-hidden="true">{{ character.englishName }}</span
      ><img
        :src="character.image"
        :alt="character.name"
        class="hero-art"
        width="500"
        height="550"
      />
    </section>
    <nav class="detail-tabs" aria-label="角色学习分类">
      <button
        v-for="t in tabs"
        :key="t.id"
        :aria-pressed="tab === t.id"
        :class="{ active: tab === t.id }"
        @click="selectTab(t.id)"
      >
        <component :is="t.icon" :size="17" /><span>{{ t.label }}</span
        ><small>{{ items.filter((i) => i.kind === t.id).length }}</small>
      </button>
    </nav>
    <div class="detail-layout">
      <section class="detail-main">
        <div class="content-toolbar">
          <div>
            <RouterLink to="/glossary" class="text-link">术语与帧数速查 ↗</RouterLink>
            <p>
              {{
                isVideoTab
                  ? '跳转至原作者视频，在实战与演示中学习。'
                  : tab === 'trap'
                    ? '理解成立条件，也理解对手的应对。'
                    : tab === 'move'
                      ? '精选常用拳脚与特殊动作，非完整出招表。'
                      : '先看指令，展开了解用途和后续选择。'
              }}
            </p>
          </div>
          <span class="result-count" aria-live="polite">{{ filtered.length }} 条内容</span>
        </div>
        <div class="detail-filter">
          <label class="search-field"
            ><Search :size="16" /><input
              v-model="query"
              aria-label="搜索当前角色内容"
              placeholder="搜索名称、指令或关键词" /></label
          ><ComboFilterPanel
            v-if="tab === 'combo'"
            v-model:filters="comboFilters"
            :items="comboItems"
            :result-count="filtered.length"
          /><select v-if="tab === 'trap'" v-model="trapCategory" aria-label="筛选陷阱分类">
            <option value="all">全部陷阱分类</option>
            <option v-for="category in trapCategories" :key="category">
              {{ category }}
            </option></select
          ><select v-else-if="tab === 'move'" v-model="moveGroup" aria-label="筛选招式类型">
            <option value="all">全部招式</option>
            <option>拳脚 / 目标连段</option>
            <option>必杀 / 特殊动作</option>
          </select>
        </div>
        <div
          v-if="filtered.length"
          :class="isVideoTab ? 'video-grid detail-video-grid' : 'lesson-list'"
        >
          <template v-for="(item, index) in filtered" :key="item.id"
            ><VideoCard v-if="isVideoTab" :item="item" /><LessonCard
              v-else
              :item="item"
              :index="index"
          /></template>
        </div>
        <EmptyState v-else @reset="reset" />
      </section>
      <aside class="detail-aside">
        <FrameGuide />
        <NotationGuide />
        <section class="aside-note">
          <p class="eyebrow">PRACTICE ROUTINE</p>
          <h3>一次，只练一件事。</h3>
          <ol>
            <li>读清成立条件和指令。</li>
            <li>在训练模式拆开练习。</li>
            <li>随机防御，练习命中确认。</li>
            <li>看一场对局，寻找使用场景。</li>
          </ol>
        </section>
        <section class="version-note">
          <Info :size="17" />
          <p>
            资料为入门参考，未逐条进行当前补丁实机复测。视频年份不等于游戏版本；训练前请核对游戏内结果。
          </p>
        </section>
        <RouterLink to="/favorites" class="aside-link"
          >回看我的收藏 <ArrowUpRight :size="16"
        /></RouterLink>
      </aside>
    </div>
  </main>
  <main v-else class="page">
    <EmptyState
      title="没有收录这位角色"
      description="目前收录 JP、A.K.I.、隆、肯、杰米和不知火舞。"
      favorites
    />
  </main>
</template>

<script setup>
import { computed, ref } from 'vue'
import { Filter, RotateCcw, X } from 'lucide-vue-next'
import { characters, getCharacter } from '../data/characters.js'
import { comboFilterFields, createComboFilters } from '../data/comboMetadata.js'

const props = defineProps({
  filters: { type: Object, required: true },
  items: { type: Array, required: true },
  resultCount: { type: Number, required: true },
  showCharacter: Boolean,
})
const emit = defineEmits(['update:filters'])
const open = ref(false)

const fieldNames = {
  characterIds: '角色',
  difficulties: '难度',
  starterTypes: '起手',
  starterMoves: '招式',
  driveCosts: '斗气',
  superCosts: 'SA',
  otherResources: '其他资源',
  positions: '位置',
  endPositions: '结束位置',
  driveRushTypes: '绿冲',
  pressureTypes: '压制',
  advantageGroups: '有利帧',
  specialConditions: '条件',
}

const activeCount = computed(() =>
  comboFilterFields.reduce((count, field) => count + (props.filters[field]?.length || 0), 0),
)

const starterMoveOptions = computed(() => {
  const selectedCharacters = props.filters.characterIds || []
  const pool = selectedCharacters.length
    ? props.items.filter((item) => selectedCharacters.includes(item.characterId))
    : props.items
  const options = new Map()
  for (const item of pool) {
    const character = getCharacter(item.characterId)
    options.set(item.starterMove, {
      value: item.starterMove,
      label: `${props.showCharacter ? character.name + ' · ' : ''}${item.starterCommand} · ${item.starterTerm}`,
    })
  }
  return [...options.values()].sort((a, b) => a.label.localeCompare(b.label, 'zh-CN'))
})

const groups = computed(() => {
  const list = []
  if (props.showCharacter)
    list.push({
      field: 'characterIds',
      title: '角色',
      options: characters.map((item) => ({ value: item.id, label: item.name })),
    })
  return [
    ...list,
    {
      field: 'difficulties',
      title: '连段难度',
      options: ['简单', '中等', '困难', '高难度'],
    },
    {
      field: 'starterTypes',
      title: '起手类型',
      options: [
        '轻攻击',
        '中攻击',
        '重攻击',
        '必杀技',
        '斗气迸放',
        '确反',
        '反击确认',
        '惩罚反击',
        '其他起手',
      ],
    },
    { field: 'starterMoves', title: '起手招式', options: starterMoveOptions.value },
    {
      field: 'driveCosts',
      title: '斗气槽',
      options: ['0', '1', '2', '3'].map((value) => ({ value, label: `${value} 格` })),
    },
    {
      field: 'superCosts',
      title: '必杀技槽',
      options: ['0', '1', '2', '3'].map((value) => ({ value, label: `${value} 格 SA` })),
    },
    {
      field: 'otherResources',
      title: '其他资源',
      options: ['无角色资源', '酒量', '中毒状态', '烈火槽', '电刃'],
    },
    { field: 'positions', title: '场景位置', options: ['版中', '版边'] },
    {
      field: 'endPositions',
      title: '结束位置',
      options: ['留在版中', '留在版边', '送入版边', '换边', '待验证'],
    },
    {
      field: 'driveRushTypes',
      title: '绿冲类型',
      options: ['无绿冲', '绿冲起手', '连段中绿冲'],
    },
    {
      field: 'pressureTypes',
      title: '压制情况',
      options: ['可继续压制', '可继续牵制', '无明确压制'],
    },
    {
      field: 'advantageGroups',
      title: '压制与有利帧',
      options: ['+42F', '+44F', '其他有利帧', '待验证'],
    },
    {
      field: 'specialConditions',
      title: '特殊条件',
      options: [
        '无特殊条件',
        '反击',
        '惩罚反击',
        '特定距离',
        '版边限定',
        '站蹲姿限定',
        '角色状态',
        '斗气迸放命中',
      ],
    },
  ]
})

const optionLabels = computed(() => {
  const labels = new Map()
  for (const group of groups.value) {
    for (const option of group.options) {
      const normalized = typeof option === 'string' ? { value: option, label: option } : option
      labels.set(`${group.field}:${normalized.value}`, normalized.label)
    }
  }
  return labels
})

const activeTags = computed(() =>
  comboFilterFields.flatMap((field) =>
    (props.filters[field] || []).map((value) => ({
      field,
      value,
      label: `${fieldNames[field]}：${optionLabels.value.get(`${field}:${value}`) || value}`,
    })),
  ),
)

function normalizedOption(option) {
  return typeof option === 'string' ? { value: option, label: option } : option
}

function toggle(field, value) {
  const current = props.filters[field] || []
  const next = current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value]
  emit('update:filters', { ...props.filters, [field]: next })
}

function clearAll() {
  emit('update:filters', createComboFilters())
}
</script>

<template>
  <div class="combo-filter-shell" :class="{ open }">
    <button
      class="combo-filter-trigger"
      :class="{ active: activeCount }"
      :aria-expanded="open"
      aria-controls="combo-filter-panel"
      @click="open = !open"
    >
      <Filter :size="16" />连段筛选<span v-if="activeCount">{{ activeCount }}</span>
    </button>
    <div v-if="open" class="combo-filter-backdrop" aria-hidden="true" @click="open = false" />
    <section
      v-if="open"
      id="combo-filter-panel"
      class="combo-filter-panel"
      role="dialog"
      aria-label="连段筛选"
      @click.stop
    >
      <header class="combo-filter-header">
        <div>
          <strong>连段筛选</strong>
          <span>当前找到 {{ resultCount }} 条</span>
        </div>
        <button class="icon-button" aria-label="关闭连段筛选" @click="open = false">
          <X :size="18" />
        </button>
      </header>
      <div class="combo-filter-groups">
        <fieldset v-for="group in groups" :key="group.field" class="combo-filter-group">
          <legend>{{ group.title }}</legend>
          <div class="combo-filter-options">
            <button
              v-for="rawOption in group.options"
              :key="normalizedOption(rawOption).value"
              :class="{
                selected: filters[group.field]?.includes(normalizedOption(rawOption).value),
                'drive-option': group.field === 'driveRushTypes',
              }"
              :aria-pressed="filters[group.field]?.includes(normalizedOption(rawOption).value)"
              @click="toggle(group.field, normalizedOption(rawOption).value)"
            >
              {{ normalizedOption(rawOption).label }}
            </button>
          </div>
        </fieldset>
      </div>
      <footer class="combo-filter-footer">
        <span>{{ activeCount ? `已启用 ${activeCount} 项条件` : '尚未启用筛选' }}</span>
        <button :disabled="!activeCount" @click="clearAll"><RotateCcw :size="14" />清除全部</button>
      </footer>
    </section>
    <div v-if="activeTags.length" class="active-filter-tags" aria-label="已启用的连段筛选">
      <button
        v-for="tag in activeTags"
        :key="`${tag.field}:${tag.value}`"
        @click="toggle(tag.field, tag.value)"
      >
        {{ tag.label }}<X :size="12" />
      </button>
      <button class="clear-filter-tag" @click="clearAll">清除全部</button>
    </div>
  </div>
</template>

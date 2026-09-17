<script setup>
import { computed, ref, watch } from 'vue'
import { Copy, ExternalLink, ChevronDown, CircleAlert } from 'lucide-vue-next'
import { getCharacter } from '../data/characters.js'
import { kindLabels, relatedLessons } from '../data/catalog.js'
import { comboBlockFollowUp } from '../data/comboFollowUps.js'
import { useNotice } from '../composables/useNotice.js'
import CommandSequence from './CommandSequence.vue'
import FavoriteButton from './FavoriteButton.vue'
import FrameFacts from './FrameFacts.vue'
import TermHint from './TermHint.vue'
const props = defineProps({
  item: { type: Object, required: true },
  index: { type: Number, default: 0 },
  showCharacter: Boolean,
  embedded: Boolean,
})
const character = computed(() => getCharacter(props.item.characterId))
const related = computed(() => relatedLessons(props.item))
const selected = ref(null)
watch(
  () => props.item.id,
  () => {
    selected.value = null
  },
)
const { notify } = useNotice()
async function copyCommand() {
  try {
    await navigator.clipboard.writeText(props.item.command)
    notify('指令已复制')
  } catch {
    notify('无法自动复制，请选中指令手动复制')
  }
}
</script>

<template>
  <article
    class="lesson-card compact-lesson"
    :id="embedded ? undefined : item.id"
    :style="{ '--character-color': character.color }"
  >
    <div class="lesson-topline">
      <div class="lesson-meta">
        <span class="mono lesson-number">{{ String(index + 1).padStart(2, '0') }}</span
        ><RouterLink
          v-if="showCharacter"
          :to="`/character/${character.id}`"
          class="character-label"
          >{{ character.name }}</RouterLink
        ><span class="tiny-tag">{{ kindLabels[item.kind] }}</span
        ><span v-if="item.kind !== 'combo'" class="level-tag">{{
          item.kind === 'trap' ? item.trapCategory : item.moveGroup
        }}</span>
      </div>
      <FavoriteButton :item="item" />
    </div>
    <h3>{{ item.title }}</h3>
    <div v-if="item.command" class="command-box">
      <CommandSequence
        :command="item.command"
        :character-id="item.characterId"
        :show-terms="item.kind === 'combo'"
      /><button
        class="icon-button copy-button"
        :aria-label="`复制${item.title}的指令`"
        title="复制指令"
        @click="copyCommand"
      >
        <Copy :size="15" />
      </button>
    </div>
    <dl v-if="item.kind === 'combo'" class="combo-key-facts">
      <div>
        <dt>难度</dt>
        <dd>{{ item.comboDifficulty }}</dd>
      </div>
      <div>
        <dt>起手</dt>
        <dd>{{ item.starterTypes.join(' · ') }}</dd>
      </div>
      <div>
        <dt>消耗</dt>
        <dd>{{ item.cost }}</dd>
      </div>
      <div>
        <dt>场景</dt>
        <dd>{{ item.startPosition }}</dd>
      </div>
      <div>
        <dt>结束</dt>
        <dd>{{ item.endPosition }}</dd>
      </div>
      <div>
        <dt>压制</dt>
        <dd>{{ item.pressureType }} · {{ item.pressureFrames }}</dd>
      </div>
      <div>
        <dt>伤害</dt>
        <dd>{{ item.damage }}</dd>
      </div>
    </dl>
    <p v-if="item.conditions" class="conditions"><strong>成立条件</strong>{{ item.conditions }}</p>
    <p v-if="item.cost && item.kind !== 'combo'" class="compact-cost">消耗：{{ item.cost }}</p>
    <div v-if="item.goal" class="lesson-meta purpose-tags">
      <span class="tiny-tag">{{ item.position }}</span
      ><span class="tiny-tag">{{ item.goal }}</span>
    </div>
    <div v-if="item.purposeTags" class="lesson-meta purpose-tags">
      <span v-for="tag in item.purposeTags" :key="tag" class="tiny-tag">{{ tag }}</span>
    </div>
    <details
      class="lesson-details"
      :name="embedded ? undefined : 'learning-lessons'"
      :open="embedded"
    >
      <summary>
        <span>{{
          item.kind === 'trap'
            ? '设置方法、风险与应对'
            : item.kind === 'move'
              ? '用途、帧数与风险'
              : '用途、帧数与后续选择'
        }}</span
        ><ChevronDown :size="16" />
      </summary>
      <div class="lesson-details-body">
        <p class="lesson-description">{{ item.description }}</p>
        <p v-if="item.kind === 'combo'" class="combo-data-status">
          {{ item.dataVersion }} · 查询 {{ item.dataCheckedAt }} · {{ item.verificationStatus }}
        </p>
        <div class="lesson-meta">
          <span class="tiny-tag">{{
            item.kind === 'trap' ? '条件推导 · 练习方案' : '资料帧数 · 非实机测量'
          }}</span
          ><span class="tiny-tag">版本敏感</span>
        </div>
        <div class="lesson-facts">
          <span v-if="item.category">{{ item.category }}</span>
          <span v-if="item.difficulty">{{ item.difficulty }}</span
          ><span>经典操作</span>
        </div>
        <FrameFacts v-if="item.frames" :frames="item.frames" :combo="item.kind === 'combo'" />
        <TermHint :term="item.kind === 'trap' ? item.trapCategory : '有利帧'" />
        <div v-if="item.hitAdvice" class="study-outcomes">
          <h4>打中后</h4>
          <p>{{ item.hitAdvice }}</p>
          <h4>被防后</h4>
          <p>{{ item.blockAdvice }}</p>
          <h4>挥空时</h4>
          <p>{{ item.whiffRisk }}</p>
        </div>
        <div v-if="item.actionAdvice" class="study-outcomes">
          <h4>状态、后续与风险</h4>
          <p>{{ item.actionAdvice }}</p>
        </div>
        <div v-if="item.kind === 'combo'" class="study-outcomes">
          <h4>打完后</h4>
          <p>{{ item.followUp || '无' }}</p>
          <h4>起手被防</h4>
          <p>{{ comboBlockFollowUp(item.id) }}</p>
        </div>
        <div v-if="item.kind === 'trap'" class="trap-steps">
          <div v-for="(step, i) in item.steps" :key="step">
            <span>{{ i + 1 }}</span>
            <p>{{ step }}</p>
          </div>
        </div>
        <p v-if="item.risk" class="risk">
          <CircleAlert :size="17" /><span>{{ item.risk }}</span>
        </p>
        <ul v-if="item.kind !== 'combo' && item.tips?.length">
          <li v-for="tip in item.tips" :key="tip">{{ tip }}</li>
        </ul>
        <section
          v-if="!embedded && related.length"
          class="related-lessons"
          aria-label="关联连段与设置"
        >
          <h4>{{ item.kind === 'combo' ? '相关套路' : '对应连段' }}</h4>
          <button
            v-for="entry in related"
            :key="entry.id"
            class="related-button"
            :aria-expanded="selected === entry.id"
            @click="selected = selected === entry.id ? null : entry.id"
          >
            {{ entry.relationLabel ? entry.relationLabel + ' · ' : '' }}{{ entry.title }}
            {{ selected === entry.id ? '−' : '+' }}
          </button>
          <LessonCard
            v-if="selected"
            :item="related.find((entry) => entry.id === selected)"
            embedded
          />
        </section>
        <a :href="item.sourceUrl" target="_blank" rel="noopener noreferrer" class="text-link muted"
          >查看资料参考 <ExternalLink :size="13"
        /></a>
        <a
          v-if="item.kind === 'combo' && item.dataSourceUrl !== item.sourceUrl"
          :href="item.dataSourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link muted combo-current-source"
          >当前版本对照 <ExternalLink :size="13"
        /></a>
      </div>
    </details>
  </article>
</template>

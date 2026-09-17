<script setup>
import { formatFrames } from '../data/frameStudy.js'
defineProps({ frames: { type: Object, required: true }, combo: Boolean })
function activeText(row) {
  if (row.active === '-' && /Hadoken|Kachousen|Nightshade Pulse/.test(row.name)) return '投射物判定'
  return row.active === '-' || row.active === '*' ? formatFrames(row.active) : row.active + 'F'
}
</script>
<template>
  <section class="frame-section" aria-label="帧数资料">
    <dl v-if="combo" class="frame-facts">
      <div>
        <dt>收尾单招命中参考</dt>
        <dd>{{ formatFrames(frames.variants[0].onHit, true) }}</dd>
      </div>
      <div>
        <dt>收尾单招优势参考</dt>
        <dd>{{ frames.enderAdvantage }}</dd>
      </div>
      <div>
        <dt>收尾这招被防</dt>
        <dd>{{ formatFrames(frames.variants[0].onBlock, true) }}</dd>
      </div>
    </dl>
    <div v-else class="frame-brief">
      <p v-for="row in frames.variants" :key="row.name">
        <strong>{{ row.label }}</strong> · 发生 {{ formatFrames(row.startup) }} · 命中
        {{ formatFrames(row.onHit, true) }} · 被防 {{ formatFrames(row.onBlock, true) }}
      </p>
    </div>
    <p v-if="combo" class="frame-caveat">
      这里列的是最后一招的资料帧数，不是整套连段的实测结果。打完还能不能继续压，要看实际剩多少帧、离对手多远。
    </p>
    <details class="frame-full">
      <summary>完整帧数与来源</summary>
      <p class="frame-scope">{{ frames.scope }}</p>
      <div class="frame-table-scroll" tabindex="0" aria-label="招式帧数表，可横向滚动">
        <table class="frame-table">
          <caption class="sr-only">
            各版本招式帧数
          </caption>
          <thead>
            <tr>
              <th scope="col">版本</th>
              <th scope="col">发生</th>
              <th scope="col">{{ frames.activeMode === 'duration' ? '持续帧数' : '判定区间' }}</th>
              <th scope="col">收招 / 全程</th>
              <th scope="col">命中</th>
              <th scope="col">被防</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in frames.variants" :key="row.name">
              <th scope="row" :title="row.name">{{ row.label }}</th>
              <td>{{ formatFrames(row.startup) }}</td>
              <td>{{ activeText(row) }}</td>
              <td>{{ formatFrames(row.recovery) }}</td>
              <td>{{ formatFrames(row.onHit, true) }}</td>
              <td>{{ formatFrames(row.onBlock, true) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="frame-caveat" v-if="combo">
        {{ frames.enderSourceNote }} 下方时间减法是条件分析，不等于已验证的压起身方案。
      </p>
      <p class="frame-caveat" v-else-if="frames.activeMode !== 'duration'">
        判定区间从动作第 1F
        起算，不是持续时长；“全程”不等于纯收招。数值以所列状态和基准接触为准，飞行距离、晚段接触与强化状态可能改变结果。
      </p>
      <p class="frame-caveat">
        基础表：{{ frames.version }} · 查询 {{ frames.checkedAt }}。来源对照整理，非本站实机测量。
      </p>
      <div class="frame-source-links">
        <a :href="frames.sourceUrl" target="_blank" rel="noopener noreferrer" class="text-link"
          >基础帧数来源 ↗</a
        >
        <a
          v-if="frames.enderSourceUrl"
          :href="frames.enderSourceUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link"
          >收尾参考来源 ↗</a
        >
        <a
          v-else
          :href="frames.comparisonUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="text-link"
          >{{ frames.comparisonLabel || 'UFD 对照 ↗' }}</a
        >
      </div>
    </details>
  </section>
</template>

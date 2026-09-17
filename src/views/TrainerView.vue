<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { Activity, Keyboard, RotateCcw, Play, Square, Trophy, TimerReset } from 'lucide-vue-next'
import {
  attackKeyHints,
  inputLabels,
  inputTerms,
  trainingMotions,
} from '../data/trainingMotions.js'
import {
  ATTACK_KEY_MAP,
  attackChordToken,
  directionFromKeys,
  framesBetween,
  parseSequence,
} from '../utils/inputTrainer.js'
import { SF6_INPUT_RULESET } from '../trainer/inputConfig.js'
import {
  createInputTimeline,
  advanceTimeline,
  latestFrame,
  relativeDirection,
} from '../trainer/inputTimeline.js'
import { recognizeMove } from '../trainer/motionMatcher.js'
import { advanceComboFlow, createComboFlow } from '../trainer/comboFlow.js'
import { summarizeCompletedAttempts } from '../trainer/attemptStats.js'
import { ruleFromNotation } from '../trainer/moveRules.js'

const STORAGE_KEY = 'combo-lab-training-attempts-v1'
const ATTEMPT_TIMEOUT_MS = SF6_INPUT_RULESET.browserCapture.attemptTimeoutMs
const ATTACK_CHORD_MS = SF6_INPUT_RULESET.browserCapture.attackChordMs
const DIRECTION_CHORD_MS = SF6_INPUT_RULESET.browserCapture.directionChordMs
const selectedId = ref(trainingMotions[0].id)
const customName = ref('自定义指令')
const customNotation = ref('')
const customSequence = ref([])
const active = ref(false)
const inputs = ref([])
const attemptState = ref('idle')
const resultMessage = ref('')
const attempts = ref(loadAttempts())
const facing = ref('right')
const timeline = ref(createInputTimeline({ facing: facing.value }))
const flow = ref(null)
const physicalAttacks = new Set()
const pressedDirections = new Set()
const pendingAttacks = []
let lastDirection = '5'
let attemptStartedAt = 0
let inactivityTimer
let attackTimer
let directionTimer
let pendingDirection = '5'
let sessionStartedAt = 0

const selected = computed(() => {
  if (selectedId.value === 'custom') {
    return {
      id: 'custom',
      name: customName.value || '自定义指令',
      notation: customNotation.value,
      sequence: customSequence.value,
      rule: ruleFromNotation(customNotation.value, customName.value || '自定义指令'),
    }
  }
  return trainingMotions.find((motion) => motion.id === selectedId.value)
})
const currentInputs = computed(() =>
  inputs.value.slice(-Math.max(targetSteps.value.length + 3, 12)),
)
const targetSteps = computed(() => selected.value.rule?.steps || [])
const progress = computed(() => flow.value?.index || 0)
const chargeStatus = computed(() => latestFrame(timeline.value)?.charge || timeline.value.charge)
const selectedAttempts = computed(() =>
  attempts.value.filter(
    (attempt) =>
      attempt.motion === selected.value.name && attempt.notation === selected.value.notation,
  ),
)
const stats = computed(() => summarizeCompletedAttempts(selectedAttempts.value))
const statusText = computed(
  () =>
    ({
      idle: '训练已暂停',
      waiting: '等待输入',
      'in-progress': '进行中',
      success: '指令输入有效',
      error: '输入错误',
      timeout: '输入超时',
    })[attemptState.value],
)

watch(customNotation, (value) => (customSequence.value = parseSequence(value)))
watch(selectedId, resetWithoutRecord)
watch(facing, () => {
  if (active.value) pushTimeline()
})
watch(attempts, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value.slice(0, 30))), {
  deep: true,
})

function loadAttempts() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(parsed) ? parsed.slice(0, 30) : []
  } catch {
    return []
  }
}

function clearTimers() {
  clearTimeout(inactivityTimer)
  clearTimeout(attackTimer)
  clearTimeout(directionTimer)
  pendingAttacks.length = 0
}

function prepareAttempt() {
  clearTimers()
  inputs.value = []
  physicalAttacks.clear()
  attemptStartedAt = 0
  sessionStartedAt = performance.now()
  timeline.value = createInputTimeline({ facing: facing.value })
  flow.value = selected.value.rule ? createComboFlow(selected.value.rule) : null
  resultMessage.value = ''
  attemptState.value = active.value ? 'waiting' : 'idle'
}

function start() {
  if (!selected.value.rule?.steps.length) return
  active.value = true
  prepareAttempt()
}

function recordAttempt(success, reason, state, now = performance.now()) {
  clearTimeout(inactivityTimer)
  const frames = attemptStartedAt ? framesBetween(attemptStartedAt, now) : 0
  attempts.value.unshift({
    id: `${Date.now()}-${Math.random()}`,
    motion: selected.value.name,
    notation: selected.value.notation,
    frames,
    success,
    completed: true,
    reason,
    at: new Date().toISOString(),
  })
  attemptState.value = state
  resultMessage.value = reason
}

function finishIncomplete(reason = '指令未完成', state = 'error') {
  if (!inputs.value.length || !['waiting', 'in-progress'].includes(attemptState.value)) return
  recordAttempt(false, reason, state)
}

function stop(record = true) {
  if (record) finishIncomplete('主动结束：指令未完成')
  active.value = false
  pressedDirections.clear()
  physicalAttacks.clear()
  lastDirection = '5'
  clearTimers()
  if (!inputs.value.length) attemptState.value = 'idle'
}

function resetWithoutRecord() {
  stop(false)
  inputs.value = []
  resultMessage.value = ''
  attemptState.value = 'idle'
}

function resetSession() {
  if (active.value) finishIncomplete('手动重置：指令未完成')
  prepareAttempt()
}

function clearHistory() {
  attempts.value = []
}

function scheduleTimeout() {
  clearTimeout(inactivityTimer)
  inactivityTimer = setTimeout(
    () => finishIncomplete(`停顿超过 ${ATTEMPT_TIMEOUT_MS / 1000} 秒`, 'timeout'),
    ATTEMPT_TIMEOUT_MS,
  )
}

function timelineFrame(now = performance.now()) {
  return Math.max(0, Math.floor((now - sessionStartedAt) / (1000 / SF6_INPUT_RULESET.frameRate)))
}

function pushTimeline(now = performance.now(), overrides = {}) {
  return advanceTimeline(timeline.value, {
    frame: timelineFrame(now),
    rawDirection: directionFromKeys(pressedDirections),
    attacks: [...physicalAttacks],
    facing: facing.value,
    ...overrides,
  })
}

function beginInput(now) {
  if (['success', 'error', 'timeout'].includes(attemptState.value)) prepareAttempt()
  if (!inputs.value.length) {
    attemptStartedAt = now
    attemptState.value = 'in-progress'
  }
}

function showInput(token, now) {
  beginInput(now)
  inputs.value.push({
    token,
    at: now,
    gapFrames: inputs.value.length ? framesBetween(inputs.value.at(-1).at, now) : 0,
  })
  scheduleTimeout()
}

function checkExpectedStep(triggerFrame, now) {
  const expected = flow.value?.rule.steps[flow.value.index]
  if (!expected) return
  const recognition = recognizeMove(timeline.value, expected, triggerFrame)
  if (recognition.pending) return
  advanceComboFlow(flow.value, recognition, triggerFrame)
  if (flow.value.status === 'failed') {
    recordAttempt(false, flow.value.reason, 'error', now)
    return
  }
  if (flow.value.status === 'input-valid') {
    recordAttempt(true, flow.value.reason, 'success', now)
  }
}

function addInput(token, { rawDirectionInput = false } = {}) {
  if (!active.value || !token) return
  const now = performance.now()
  if (/^[1-9]$/.test(token)) {
    const rawDirection = rawDirectionInput ? token : relativeDirection(token, facing.value)
    showInput(relativeDirection(rawDirection, facing.value), now)
    const snapshot = pushTimeline(now, { rawDirection })
    if (flow.value?.rule.steps[flow.value.index]?.button == null)
      checkExpectedStep(snapshot.frame, now)
    return
  }
  showInput(token, now)
  const buttons = token.split('+')
  const downFrame = timelineFrame(now)
  const snapshot = advanceTimeline(timeline.value, {
    frame: downFrame,
    rawDirection: timeline.value.state.rawDirection,
    attacks: buttons,
    facing: facing.value,
  })
  checkExpectedStep(snapshot.frame, now)
  advanceTimeline(timeline.value, {
    frame: snapshot.frame + 1,
    rawDirection: timeline.value.state.rawDirection,
    attacks: [],
    facing: facing.value,
  })
}

function commitDirection() {
  const next = pendingDirection
  if (next === lastDirection) return
  if (next === '5') pushTimeline(performance.now(), { rawDirection: '5' })
  else addInput(next, { rawDirectionInput: true })
  lastDirection = next
}

function updateDirection() {
  pendingDirection = directionFromKeys(pressedDirections)
  clearTimeout(directionTimer)
  directionTimer = setTimeout(commitDirection, DIRECTION_CHORD_MS)
}

function flushAttacks() {
  clearTimeout(attackTimer)
  const token = attackChordToken(pendingAttacks.splice(0))
  if (!token || !active.value) return
  const now = performance.now()
  showInput(token, now)
  const buttons = token.split('+')
  const matching = timeline.value.buttonEvents.filter((event) => buttons.includes(event.button))
  const triggerFrame = Math.max(...matching.slice(-buttons.length).map((event) => event.downFrame))
  checkExpectedStep(Number.isFinite(triggerFrame) ? triggerFrame : timelineFrame(now), now)
}

function queueAttack(token) {
  if (pendingAttacks.includes(token)) flushAttacks()
  pendingAttacks.push(token)
  clearTimeout(attackTimer)
  attackTimer = setTimeout(flushAttacks, ATTACK_CHORD_MS)
}

function keyDown(event) {
  if (
    !active.value ||
    event.repeat ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)
  )
    return
  const key = event.key.toLowerCase()
  if ('wasd'.includes(key) || key.startsWith('arrow')) {
    event.preventDefault()
    pressedDirections.add(key)
    updateDirection()
    return
  }
  if (ATTACK_KEY_MAP[key]) {
    event.preventDefault()
    const token = ATTACK_KEY_MAP[key]
    beginInput(performance.now())
    physicalAttacks.add(token)
    pushTimeline()
    queueAttack(token)
  }
}

function keyUp(event) {
  const key = event.key.toLowerCase()
  if (pressedDirections.delete(key)) updateDirection()
  const attack = ATTACK_KEY_MAP[key]
  if (attack && physicalAttacks.delete(attack) && active.value) pushTimeline()
}

function virtualPress(token) {
  addInput(token)
}

function stepClass(index) {
  return {
    reached: index < progress.value,
    current:
      active.value &&
      ['waiting', 'in-progress'].includes(attemptState.value) &&
      index === progress.value,
    wrong: ['error', 'timeout'].includes(attemptState.value) && index === progress.value,
  }
}

onMounted(() => {
  window.addEventListener('keydown', keyDown)
  window.addEventListener('keyup', keyUp)
})
onUnmounted(() => {
  clearTimers()
  window.removeEventListener('keydown', keyDown)
  window.removeEventListener('keyup', keyUp)
})
</script>

<template>
  <main class="page trainer-page">
    <header class="trainer-heading">
      <div>
        <p class="eyebrow"><span></span> EXECUTION TRAINING</p>
        <h1>指令训练中心</h1>
        <p>逐帧检查方向、蓄力、按键和换边。这里只判断输入有效，不代表招式已在游戏中发动。</p>
      </div>
      <div class="trainer-device">
        <Keyboard :size="20" /><span
          ><strong>键盘 / 触屏</strong><small>WASD 或方向键 · U I O 拳 · J K L 脚</small></span
        >
      </div>
    </header>

    <section class="trainer-config panel-card">
      <div class="trainer-field">
        <label for="motion">练习指令</label>
        <select id="motion" v-model="selectedId" :disabled="active">
          <option v-for="motion in trainingMotions" :key="motion.id" :value="motion.id">
            {{ motion.name }} · {{ motion.notation }}
          </option>
          <option value="custom">自定义指令</option>
        </select>
      </div>
      <div class="trainer-field facing-field">
        <label for="facing">角色朝向</label>
        <select id="facing" v-model="facing">
          <option value="right">面向右（右是前）</option>
          <option value="left">面向左（左是前）</option>
        </select>
      </div>
      <template v-if="selectedId === 'custom'">
        <div class="trainer-field">
          <label for="custom-name">名称</label
          ><input id="custom-name" v-model="customName" :disabled="active" />
        </div>
        <div class="trainer-field trainer-field-wide">
          <label for="custom-command">数字指令</label
          ><input
            id="custom-command"
            v-model="customNotation"
            :disabled="active"
            placeholder="例如 236LP、HP+HK 或 DR 2MK"
          />
        </div>
      </template>
      <div class="trainer-actions">
        <button
          v-if="!active"
          class="button trainer-start"
          :disabled="!selected.rule?.steps.length"
          @click="start"
        >
          <Play :size="17" />开始训练
        </button>
        <button v-else class="button trainer-stop" @click="stop()">
          <Square :size="15" />结束训练
        </button>
        <button
          class="icon-button"
          aria-label="重置本次尝试"
          title="未完成的输入会记为失败"
          @click="resetSession"
        >
          <RotateCcw :size="18" />
        </button>
      </div>
    </section>

    <section class="trainer-key-help panel-card" aria-label="键盘按键说明">
      <span v-for="item in attackKeyHints" :key="item.key"
        ><kbd>{{ item.key }}</kbd
        ><b>{{ item.token }}</b
        ><small>{{ item.term }}</small></span
      >
      <p>同时按键会按一个组合输入判定，例如 O＋L = HP+HK（斗气迸放）。</p>
    </section>

    <section class="trainer-source-note panel-card">
      <div>
        <strong>{{ SF6_INPUT_RULESET.gameVersion }}</strong>
        <small
          >核对日期 {{ SF6_INPUT_RULESET.checkedAt }} ·
          {{ SF6_INPUT_RULESET.verificationStatus }}</small
        >
      </div>
      <nav aria-label="输入规则资料来源">
        <a
          v-for="source in SF6_INPUT_RULESET.sources"
          :key="source.url"
          :href="source.url"
          target="_blank"
          rel="noreferrer"
          >{{ source.title }}</a
        >
      </nav>
    </section>

    <div class="trainer-grid">
      <section
        class="trainer-stage panel-card"
        :class="[attemptState, { active }]"
        aria-live="polite"
      >
        <div class="stage-topline">
          <span>{{ statusText }}</span
          ><span>{{ SF6_INPUT_RULESET.verificationStatus }}</span>
        </div>
        <div class="motion-title">
          <span>{{ selected.name }}</span
          ><strong>{{ selected.notation || '—' }}</strong>
        </div>
        <div class="trainer-progress">
          <strong>已完成 {{ progress }}/{{ targetSteps.length }} 个步骤</strong>
          <span v-if="resultMessage">{{ resultMessage }}</span>
        </div>
        <div class="target-sequence" aria-label="目标指令">
          <span v-for="(step, index) in targetSteps" :key="step.id" :class="stepClass(index)">
            <b>{{ step.label }}</b
            ><small>{{ step.motion?.type === 'charge' ? '蓄力招式' : '完整招式步骤' }}</small>
          </span>
        </div>
        <div class="charge-monitor">
          <div v-for="item in [chargeStatus.back, chargeStatus.down]" :key="item.direction">
            <span>{{ item.direction === 'back' ? '后蓄力' : '下蓄力' }}</span>
            <strong>{{ item.frames }}/{{ item.requiredFrames }}F</strong>
            <small>
              {{ item.holding ? '蓄力中' : '已离开方向' }} ·
              {{ item.ready ? '已满足' : '未满足' }} · 残留 {{ item.retentionRemaining }}F
              <template v-if="item.invalidReason"> · {{ item.invalidReason }}</template>
            </small>
          </div>
        </div>
        <div class="input-readout">
          <p>INPUT HISTORY / 本次输入</p>
          <div v-if="currentInputs.length" class="input-stream">
            <span v-for="(entry, index) in currentInputs" :key="`${entry.at}-${index}`"
              ><b>{{ inputLabels[entry.token] || entry.token }}</b
              ><em>{{ inputTerms[entry.token] || entry.token }}</em
              ><small>{{ entry.gapFrames }}F</small></span
            >
          </div>
          <div v-else class="input-placeholder">点击“开始训练”，然后输入完整目标指令</div>
        </div>
        <div class="virtual-controller" aria-label="虚拟控制器">
          <div class="virtual-directions">
            <button
              v-for="token in ['7', '8', '9', '4', '5', '6', '1', '2', '3']"
              :key="token"
              :disabled="token === '5' || !active"
              @pointerdown.prevent="virtualPress(token)"
            >
              {{ inputLabels[token] }}<small>{{ inputTerms[token] }}</small>
            </button>
          </div>
          <div class="virtual-attack-wrap">
            <div class="virtual-attacks">
              <button
                v-for="item in attackKeyHints"
                :key="item.key"
                :disabled="!active"
                @pointerdown.prevent="virtualPress(item.token)"
              >
                <kbd>{{ item.key }}</kbd
                ><b>{{ item.token }}</b
                ><small>{{ item.term }}</small>
              </button>
            </div>
            <div class="virtual-chords">
              <button :disabled="!active" @pointerdown.prevent="virtualPress('LP+MP')">
                LP+MP<small>双拳</small></button
              ><button :disabled="!active" @pointerdown.prevent="virtualPress('HP+HK')">
                HP+HK<small>斗气迸放</small>
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside class="trainer-stats">
        <div class="stat-card">
          <Activity :size="19" /><span>已完成尝试成功率</span
          ><strong>{{ stats.total ? `${stats.rate}%` : '—' }}</strong
          ><small>{{ stats.success }} / {{ stats.total }} 次；进行中不计入</small>
        </div>
        <div class="stat-card">
          <Trophy :size="19" /><span>最快网页输入</span
          ><strong>{{ stats.best ?? '—' }}<i v-if="stats.best !== null">F</i></strong
          ><small>仅统计输入有效；不是游戏内部帧数</small>
        </div>
        <div class="stat-card">
          <TimerReset :size="19" /><span>平均网页输入</span
          ><strong>{{ stats.average ?? '—' }}<i v-if="stats.average !== null">F</i></strong
          ><small>按浏览器时间换算为 60 FPS</small>
        </div>
      </aside>
    </div>

    <section class="training-history panel-card">
      <div class="history-heading">
        <div>
          <h2>训练记录</h2>
          <p>只记录已经成功、失败、超时或主动结束的尝试。</p>
        </div>
        <button v-if="attempts.length" @click="clearHistory">清空记录</button>
      </div>
      <div v-if="attempts.length" class="history-list">
        <div v-for="attempt in attempts.slice(0, 10)" :key="attempt.id" class="history-row">
          <span :class="attempt.success ? 'success' : 'miss'">{{
            attempt.success ? '输入有效' : '失败'
          }}</span
          ><strong>{{ attempt.motion }}</strong
          ><code>{{ attempt.reason || (attempt.success ? '完整输入正确' : '超时') }}</code
          ><b>{{ attempt.frames }}F</b
          ><time>{{
            new Date(attempt.at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
          }}</time>
        </div>
      </div>
      <div v-else class="history-empty">完成或结束一次尝试后，这里会显示成绩。</div>
    </section>
  </main>
</template>

import { getChargeRule, SF6_INPUT_RULESET } from './inputConfig.js'

const HORIZONTAL_FLIP = { 1: '3', 3: '1', 4: '6', 6: '4', 7: '9', 9: '7' }
const BACK_DIRECTIONS = new Set(['1', '4', '7'])
const DOWN_DIRECTIONS = new Set(['1', '2', '3'])

export function relativeDirection(rawDirection, facing) {
  const value = String(rawDirection || '5')
  return facing === 'left' ? HORIZONTAL_FLIP[value] || value : value
}

function emptyCharge(direction, ruleset) {
  const rule = getChargeRule(direction, ruleset)
  return {
    direction,
    frames: 0,
    holding: false,
    ready: false,
    retentionRemaining: 0,
    invalidReason: '',
    requiredFrames: rule.requiredFrames,
    verificationStatus: rule.verificationStatus,
  }
}

export function createInputTimeline({ facing = 'right', ruleset = SF6_INPUT_RULESET } = {}) {
  return {
    ruleset,
    frames: [],
    buttonEvents: [],
    directionEvents: [],
    state: { frame: -1, rawDirection: '5', direction: '5', facing, attacks: [] },
    charge: {
      back: emptyCharge('back', ruleset),
      down: emptyCharge('down', ruleset),
    },
  }
}

function updateCharge(previous, holding, frame, rule) {
  if (holding) {
    const canResume = previous.holding || previous.retentionRemaining > 0
    const frames =
      canResume && rule.accumulateAcrossGap
        ? previous.frames + 1
        : previous.holding
          ? previous.frames + 1
          : 1
    return {
      ...previous,
      frames,
      holding: true,
      ready: frames >= rule.requiredFrames,
      retentionRemaining: rule.retentionFrames,
      invalidReason: '',
      lastHeldFrame: frame,
    }
  }

  if (!previous.frames) return { ...previous, holding: false }
  const remaining = previous.holding
    ? rule.retentionFrames
    : Math.max(0, previous.retentionRemaining - 1)
  if (!remaining)
    return {
      ...previous,
      frames: 0,
      holding: false,
      ready: false,
      retentionRemaining: 0,
      invalidReason: '离开蓄力方向超过残留窗口',
    }
  return { ...previous, holding: false, retentionRemaining: remaining }
}

function appendFrame(timeline, frame, rawDirection, attacks, facing) {
  const previous = timeline.state
  const direction = relativeDirection(rawDirection, facing)
  const attackSet = new Set(attacks)
  const previousAttacks = new Set(previous.attacks)
  const pressed = [...attackSet].filter((button) => !previousAttacks.has(button))
  const released = [...previousAttacks].filter((button) => !attackSet.has(button))

  if (direction !== previous.direction)
    timeline.directionEvents.push({ frame, rawDirection, direction, facing })
  for (const button of pressed)
    timeline.buttonEvents.push({ button, downFrame: frame, upFrame: null, durationFrames: null })
  for (const button of released) {
    const event = [...timeline.buttonEvents]
      .reverse()
      .find((item) => item.button === button && item.upFrame === null)
    if (event) {
      event.upFrame = frame
      event.durationFrames = Math.max(1, frame - event.downFrame)
    }
  }

  timeline.charge.back = updateCharge(
    timeline.charge.back,
    BACK_DIRECTIONS.has(direction),
    frame,
    getChargeRule('back', timeline.ruleset),
  )
  timeline.charge.down = updateCharge(
    timeline.charge.down,
    DOWN_DIRECTIONS.has(direction),
    frame,
    getChargeRule('down', timeline.ruleset),
  )

  timeline.state = { frame, rawDirection, direction, facing, attacks: [...attackSet] }
  timeline.frames.push({
    ...timeline.state,
    pressed,
    released,
    charge: {
      back: { ...timeline.charge.back },
      down: { ...timeline.charge.down },
    },
  })
}

export function advanceTimeline(
  timeline,
  { frame, rawDirection, attacks = timeline.state.attacks, facing = timeline.state.facing },
) {
  const targetFrame = Math.max(timeline.state.frame + 1, Math.floor(frame))
  for (let current = timeline.state.frame + 1; current <= targetFrame; current += 1) {
    const isTarget = current === targetFrame
    appendFrame(
      timeline,
      current,
      isTarget ? rawDirection : timeline.state.rawDirection,
      isTarget ? attacks : timeline.state.attacks,
      isTarget ? facing : timeline.state.facing,
    )
  }
  return timeline.frames.at(-1)
}

export const latestFrame = (timeline) => timeline.frames.at(-1) || null

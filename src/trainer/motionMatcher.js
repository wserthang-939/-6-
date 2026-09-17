import { SF6_INPUT_RULESET } from './inputConfig.js'

const LENIENT = {
  2: new Set(['1', '2', '3']),
  4: new Set(['1', '4', '7']),
  6: new Set(['3', '6', '9']),
  8: new Set(['7', '8', '9']),
}

function directionMatches(actual, expected, lenient) {
  return actual === expected || (lenient && LENIENT[expected]?.has(actual))
}

function compressedDirections(timeline, throughFrame) {
  return timeline.directionEvents.filter((event) => event.frame <= throughFrame)
}

function matchPath(events, path, maxGap, { lenient = false, strictNoise = false } = {}) {
  let eventIndex = events.length - 1
  let nextFrame = null
  const matched = []
  for (let pathIndex = path.length - 1; pathIndex >= 0; pathIndex -= 1) {
    let found = false
    while (eventIndex >= 0) {
      const event = events[eventIndex--]
      if (nextFrame !== null && nextFrame - event.frame > maxGap) break
      if (directionMatches(event.direction, path[pathIndex], lenient)) {
        matched.unshift(event)
        nextFrame = event.frame
        found = true
        break
      }
      if (strictNoise) return null
    }
    if (!found) return null
  }
  return matched
}

function pathsFor(type) {
  if (type === 'qcf') return [['2', '3', '6']]
  if (type === 'qcb') return [['2', '1', '4']]
  if (type === 'dp') return [['6', '2', '6']]
  if (type === 'doubleQcf')
    return [
      ['2', '3', '6', '2', '3', '6'],
      ['2', '6', '2', '3', '6'],
      ['2', '3', '6', '2', '6'],
    ]
  if (type === 'halfCircle')
    return [
      ['6', '3', '2', '1', '4'],
      ['6', '2', '1', '4'],
      ['6', '3', '1', '4'],
      ['6', '3', '2', '4'],
    ]
  if (type === 'dash') return [['6', '5', '6']]
  return []
}

export function matchMotion(timeline, motion, triggerFrame, ruleset = SF6_INPUT_RULESET) {
  if (motion.type === 'charge') {
    const snapshot = timeline.frames.find((frame) => frame.frame === triggerFrame)
    const charge = snapshot?.charge[motion.chargeDirection]
    const releaseDirection = motion.chargeDirection === 'back' ? '6' : '8'
    if (!charge?.ready)
      return {
        valid: false,
        reason: `蓄力不足：${charge?.frames || 0}/${charge?.requiredFrames || 0}F`,
      }
    if (!directionMatches(snapshot.direction, releaseDirection, true))
      return { valid: false, reason: `释放方向错误：需要${releaseDirection}` }
    return { valid: true, matchedFrames: [charge.lastHeldFrame, triggerFrame], charge }
  }

  const maxGap = ruleset.motionWindows[motion.type]
  if (!maxGap) return { valid: false, reason: '该指令窗口待验证' }
  const events = compressedDirections(timeline, triggerFrame)
  for (const path of pathsFor(motion.type)) {
    const matched = matchPath(events, path, maxGap, {
      lenient: motion.type === 'dp',
      strictNoise: motion.type === 'dash',
    })
    if (matched) return { valid: true, matchedFrames: matched.map((event) => event.frame) }
  }
  return { valid: false, reason: '方向路径或输入保持窗口不符合规则' }
}

export function matchButtons(buttonEvents, expected, triggerFrame, ruleset = SF6_INPUT_RULESET) {
  const required =
    expected === 'PP' ? ['P', 'P'] : expected === 'KK' ? ['K', 'K'] : expected.split('+')
  const recent = buttonEvents.filter(
    (event) =>
      event.downFrame <= triggerFrame &&
      triggerFrame - event.downFrame <= ruleset.simultaneousWindowFrames,
  )
  if (expected === 'PP' || expected === 'KK') {
    const suffix = expected.at(-1)
    const matching = recent.filter((event) => event.button.endsWith(suffix))
    return matching.length >= 2
      ? { valid: true, matchedFrames: matching.slice(-2).map((event) => event.downFrame) }
      : { valid: false, reason: `需要同时按下两个${suffix === 'P' ? '拳' : '脚'}键` }
  }
  const matches = required.map((button) =>
    [...recent].reverse().find((event) => event.button === button),
  )
  return matches.every(Boolean)
    ? { valid: true, matchedFrames: matches.map((event) => event.downFrame) }
    : { valid: false, reason: `攻击键不符：需要 ${expected}` }
}

export function recognizeMove(timeline, rule, triggerFrame, ruleset = SF6_INPUT_RULESET) {
  const snapshot = timeline.frames.find((frame) => frame.frame === triggerFrame)
  if (rule.direction && snapshot?.direction !== rule.direction)
    return { valid: false, reason: `方向不符：需要 ${rule.direction}` }
  const buttons = rule.button
    ? matchButtons(timeline.buttonEvents, rule.button, triggerFrame, ruleset)
    : { valid: true, matchedFrames: [] }
  if (!buttons.valid) return buttons
  if (!rule.motion) return { valid: true, buttonFrames: buttons.matchedFrames }
  const motion = matchMotion(timeline, rule.motion, triggerFrame, ruleset)
  if (!rule.button && !motion.valid) return { ...motion, pending: true }
  return motion.valid
    ? {
        valid: true,
        buttonFrames: buttons.matchedFrames,
        motionFrames: motion.matchedFrames,
        charge: motion.charge,
      }
    : motion
}

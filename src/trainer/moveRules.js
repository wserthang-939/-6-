const MOTION_PREFIXES = [
  ['236236', 'doubleQcf'],
  ['41236', 'halfCircle'],
  ['63214', 'halfCircle'],
  ['236', 'qcf'],
  ['214', 'qcb'],
  ['623', 'dp'],
]

export function createMoveRule({ id, name, notation, motion = null, button, direction = null }) {
  return {
    id,
    kind: 'move',
    name,
    notation,
    steps: [{ id: `${id}-step`, label: notation, motion, button, direction }],
    gameplayVerified: false,
  }
}

export function createComboRule({ id, name, notation, steps }) {
  return { id, kind: 'combo', name, notation, steps, gameplayVerified: false }
}

export function ruleFromNotation(notation, name = '自定义指令') {
  const compact = String(notation).toUpperCase().replace(/\s/g, '')
  const button = compact.match(/(LP\+MP|MP\+MK|HP\+HK|PP|KK|LP|MP|HP|LK|MK|HK)$/)?.[0]
  if (!button) return null
  const prefix = MOTION_PREFIXES.find(([value]) => compact.startsWith(value))
  const motion = prefix ? { type: prefix[1] } : null
  const direction = !motion ? compact.match(/[1-9](?=[A-Z])/g)?.at(-1) || null : null
  return createMoveRule({ id: 'custom', name, notation, motion, button, direction })
}

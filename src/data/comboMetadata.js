import { parseCommand } from './commandTerms.js'

export const comboFilterFields = [
  'characterIds',
  'difficulties',
  'starterTypes',
  'starterMoves',
  'driveCosts',
  'superCosts',
  'otherResources',
  'positions',
  'endPositions',
  'driveRushTypes',
  'pressureTypes',
  'advantageGroups',
  'specialConditions',
]

export const currentComboSources = {
  jp: 'https://sf6-lab.net/en/fighters/jp/combo',
  aki: 'https://sf6-lab.net/en/fighters/aki/combo',
  ryu: 'https://sf6-lab.net/en/fighters/ryu/combo',
  ken: 'https://sf6-lab.net/fighters/ken/combo',
  jamie: 'https://sf6-lab.net/en/fighters/jamie/combo',
  mai: 'https://sf6-lab.net/en/fighters/mai/combo',
}

export function createComboFilters() {
  return Object.fromEntries(comboFilterFields.map((field) => [field, []]))
}

function inputDifficulty(command) {
  const steps = command.split(/[>,~]/).filter((part) => part.trim()).length
  const extra = (command.match(/(?:DRC|DR |延迟|236236|214214)/g) || []).length
  const score = steps + extra
  if (score <= 3) return '简单'
  if (score <= 5) return '中等'
  if (score <= 7) return '困难'
  return '高难度'
}

function resourceNumber(cost, name) {
  const match = cost?.match(new RegExp(`(\\d+)\\s*${name}`))
  return match ? Number(match[1]) : 0
}

function starterTypes(item, firstCommand) {
  const result = []
  const base = firstCommand.replace(/^(?:DRC|DR|66)\s+|^j\./, '')
  if (base.startsWith('HP+HK')) result.push('斗气迸放')
  else if (/^(?:22|214|236|623|63214)/.test(base)) result.push('必杀技')
  else if (/L[PK]/.test(base)) result.push('轻攻击')
  else if (/M[PK]/.test(base)) result.push('中攻击')
  else if (/H[PK]/.test(base)) result.push('重攻击')

  const text = `${item.title} ${item.goal || ''} ${item.conditions || ''} ${firstCommand}`
  if (/确反/.test(text)) result.push('确反')
  if (/(?:PC|惩罚康|惩罚反击)/.test(text)) result.push('惩罚反击')
  if (/(?:CH|打康|反击确认)/.test(text)) result.push('反击确认')
  return [...new Set(result.length ? result : ['其他起手'])]
}

function otherResources(item) {
  const text = `${item.cost || ''} ${item.conditions || ''} ${item.description || ''}`
  const result = []
  if (/酒/.test(text)) result.push('酒量')
  if (/中毒|毒发/.test(text)) result.push('中毒状态')
  if (/烈火/.test(text)) result.push('烈火槽')
  if (/电刃/.test(text)) result.push('电刃')
  return result.length ? result : ['无角色资源']
}

function endPosition(item) {
  const text = `${item.title} ${item.goal || ''} ${item.description || ''} ${item.followUp || ''}`
  if (/换边/.test(text)) return '换边'
  if (/送入版边|搬角|逼角/.test(text)) return '送入版边'
  if (item.position === '版边') return '留在版边'
  if (item.position === '版中' && /拉开距离|远程牵制/.test(text)) return '留在版中'
  return '待验证'
}

function driveRushType(command) {
  if (/^DR\s/.test(command)) return '绿冲起手'
  if (/(?:^|[>,])\s*(?:DRC|DR)\s/.test(command)) return '连段中绿冲'
  return '无绿冲'
}

function pressureInfo(item) {
  const followUp = item.followUp || '无'
  const frameMatch = followUp.match(/\+(\d+)F/)
  const pressureFrames = frameMatch ? `+${frameMatch[1]}F` : '待验证'
  let pressureType = '无明确压制'
  if (/安全跳|压起身|投打择|帧数陷阱|起攻/.test(followUp)) pressureType = '可继续压制'
  else if (/牵制/.test(followUp)) pressureType = '可继续牵制'
  const advantageGroup =
    pressureFrames === '+42F'
      ? '+42F'
      : pressureFrames === '+44F'
        ? '+44F'
        : pressureFrames === '待验证'
          ? '待验证'
          : '其他有利帧'
  return { pressureType, pressureFrames, advantageGroup }
}

function specialConditions(item) {
  const text = `${item.title} ${item.command} ${item.conditions || ''} ${item.description || ''}`
  const result = []
  if (/(?:PC|惩罚康|惩罚反击)/.test(text)) result.push('惩罚反击')
  if (/(?:CH|打康|反击确认)/.test(text)) result.push('反击')
  if (/近距离|远端|距离|够到|贴身|近端/.test(text)) result.push('特定距离')
  if (/版边|上墙/.test(text)) result.push('版边限定')
  if (/站姿|蹲姿/.test(text)) result.push('站蹲姿限定')
  if (/中毒|毒发|酒|烈火|电刃/.test(text)) result.push('角色状态')
  if (/HP\+HK|DI /.test(text)) result.push('斗气迸放命中')
  return result.length ? result : ['无特殊条件']
}

export function buildComboMetadata(item) {
  const first = parseCommand(item.command, item.characterId)[0]
  const pressure = pressureInfo(item)
  return {
    comboDifficulty: inputDifficulty(item.command),
    difficultyBasis: '本站按输入长度、绿冲与超必杀操作统一分级',
    starterTypes: starterTypes(item, first.command),
    starterCommand: first.command,
    starterTerm: first.term,
    starterMove: `${item.characterId}|${first.command}`,
    driveCost: resourceNumber(item.cost, '斗气'),
    superCost: resourceNumber(item.cost, 'SA'),
    otherResources: otherResources(item),
    startPosition: item.position || '任意',
    endPosition: endPosition(item),
    driveRushType: driveRushType(item.command),
    ...pressure,
    specialConditions: specialConditions(item),
    damage: '待验证',
    dataVersion: 'Year 4 · 2026-08-03 调整后资料基准',
    dataCheckedAt: '2026-09-16',
    dataSourceUrl: currentComboSources[item.characterId],
    verificationStatus: '资料整理 · 含待验证项',
  }
}

function includesAny(value, selected) {
  if (!selected.length) return true
  const values = Array.isArray(value) ? value : [value]
  return selected.some((choice) => values.includes(choice))
}

export function matchesComboFilters(item, filters) {
  return (
    includesAny(item.characterId, filters.characterIds || []) &&
    includesAny(item.comboDifficulty, filters.difficulties || []) &&
    includesAny(item.starterTypes, filters.starterTypes || []) &&
    includesAny(item.starterMove, filters.starterMoves || []) &&
    includesAny(String(item.driveCost), filters.driveCosts || []) &&
    includesAny(String(item.superCost), filters.superCosts || []) &&
    includesAny(item.otherResources, filters.otherResources || []) &&
    (!filters.positions?.length ||
      filters.positions.some(
        (position) => item.startPosition === position || item.startPosition === '任意',
      )) &&
    includesAny(item.endPosition, filters.endPositions || []) &&
    includesAny(item.driveRushType, filters.driveRushTypes || []) &&
    includesAny(item.pressureType, filters.pressureTypes || []) &&
    includesAny(item.advantageGroup, filters.advantageGroups || []) &&
    includesAny(item.specialConditions, filters.specialConditions || [])
  )
}

export function filterCombos(items, filters) {
  return items.filter((item) => matchesComboFilters(item, filters))
}

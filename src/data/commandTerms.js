const normals = {
  LP: '轻拳',
  MP: '中拳',
  HP: '重拳',
  LK: '轻脚',
  MK: '中脚',
  HK: '重脚',
  '2LP': '蹲轻拳',
  '2MP': '蹲中拳',
  '2HP': '蹲重拳',
  '2LK': '蹲轻脚',
  '2MK': '蹲中脚',
  '2HK': '蹲重脚',
  '4LP': '后轻拳',
  '4MP': '后中拳',
  '4HP': '后重拳',
  '4LK': '后轻脚',
  '4MK': '后中脚',
  '4HK': '后重脚',
  '5LP': '站轻拳',
  '5MP': '站中拳',
  '5HP': '站重拳',
  '5LK': '站轻脚',
  '5MK': '站中脚',
  '5HK': '站重脚',
  '6LP': '前轻拳',
  '6MP': '前中拳',
  '6HP': '前重拳',
  '6LK': '前轻脚',
  '6MK': '前中脚',
  '6HK': '前重脚',
  'HP+HK': '斗气迸放',
}

const characterTerms = {
  jp: {
    '236LP': '轻风神',
    '236MP': '中风神',
    '236HP': '重风神',
    '236PP': 'OD 风神',
    '236MK': '中脚版飞弹',
    '236KK': 'OD 飞弹',
    '22LP': '近地刺',
    '22HP': '远地刺',
  },
  aki: {
    '236LP': '轻蛇头鞭',
    '236MP': '中蛇头鞭',
    '236HP': '重蛇头鞭',
    '214HP': '重毒花环',
    '214HK': '重残酷命运',
    '2PP': '恶鬼蛇行',
  },
  ryu: {
    '623LP': '轻升龙拳',
    '623MP': '中升龙拳',
    '623HP': '重升龙拳',
    '214MK': '中龙卷旋风脚',
    '214MP': '中波掌击',
    '236LK': '轻上段足刀',
    '236HK': '重上段足刀',
    '236236K': 'SA3',
  },
  ken: {
    KK: '奋迅脚',
    '623P': '升龙拳',
    '623LP': '轻升龙拳',
    '623MP': '中升龙拳',
    '623HP': '重升龙拳',
    '214LK': '轻龙卷旋风脚',
    '236MK': '中迅雷脚',
    '236HK': '重迅雷脚',
  },
  jamie: {
    '236LP': '轻流酔拳',
    '623LK': '轻张弓腿',
    '236LK': '轻爆廻',
    '63214K': '指令投',
    '214LP': '轻拳版 214P',
    '214K': '空中俯冲脚',
  },
  mai: {
    '214LP': '轻龙炎舞',
    '214MP': '中龙炎舞',
    '214HP': '重龙炎舞',
    '236LK': '轻必杀忍蜂',
    '623MK': '中飞翔龙炎阵',
    '623HK': '重飞翔龙炎阵',
    '214214P': 'SA3',
  },
}

const annotationNames = { PC: '惩罚康', CH: '康', 上墙: '上墙', 毒发: '毒发' }
const strengths = { L: '轻', M: '中', H: '重' }
const buttons = { P: '拳', K: '脚', PP: '双拳', KK: '双脚' }

function cleanToken(token) {
  return token.replace(/[（(](?:PC|CH|上墙|毒发)[）)]/g, '').trim()
}

function contextTerm(characterId, base, previousToken) {
  const previous = cleanToken(previousToken || '').replace(/^(?:DRC|DR|66|延迟)\s+|^j\./, '')
  if (characterId === 'aki' && previous === '2PP' && base === 'K') return '蛇连咬'
  if (characterId === 'aki' && previous === '2PP' && base === 'P') return '猛毒牙'
  if (characterId === 'ken' && previous === 'KK' && base === 'LK') return '急停'
  if (characterId === 'ken' && /^236[MH]K$/.test(previous) && base === '6HK') return '重脚派生'
  if (characterId === 'jamie' && ['236LP', '6K'].includes(previous) && base === '6K')
    return '脚派生'
  if (characterId === 'jamie' && previous === '214LP' && base === '6P') return '仙姑肘'
  if (characterId === 'mai' && previous === '4HK' && base === 'HK') return '星孔雀派生'
  return null
}

function genericMotionTerm(base) {
  const match = base.match(/^(?:236|214|623|22|63214)(L|M|H)?(PP|KK|P|K)$/)
  if (!match) return null
  return `${strengths[match[1]] || ''}${buttons[match[2]]}版必杀技`
}

export function commandTerm(token, characterId, previousToken = '') {
  const annotations = [...token.matchAll(/[（(](PC|CH|上墙|毒发)[）)]/g)].map(
    ([, value]) => annotationNames[value],
  )
  let base = cleanToken(token)
  const modifiers = []

  if (base.startsWith('DRC ')) {
    modifiers.push('取消绿冲')
    base = base.slice(4)
  } else if (base.startsWith('DR ')) {
    modifiers.push('绿冲')
    base = base.slice(3)
  } else if (base.startsWith('66 ')) {
    modifiers.push('前冲')
    base = base.slice(3)
  }
  if (base.startsWith('延迟 ')) {
    modifiers.push('延迟')
    base = base.slice(3)
  }
  if (base.startsWith('j.')) {
    modifiers.push('跳跃')
    base = base.slice(2)
  }

  let term = contextTerm(characterId, base, previousToken)
  if (characterId === 'mai' && modifiers.includes('跳跃') && base === '214LP') term = '鼯鼠之舞'
  term ||= characterTerms[characterId]?.[base] || normals[base] || genericMotionTerm(base)
  if (!term) return ''
  return [...modifiers, term, ...annotations].join(' · ')
}

export function parseCommand(command, characterId) {
  const parts = command
    .split(/([>,~])/)
    .map((part) => part.trim())
    .filter(Boolean)
  const steps = []
  let separator = ''
  let previousToken = ''

  for (const part of parts) {
    if (['>', ',', '~'].includes(part)) {
      separator = part
      continue
    }
    steps.push({
      command: part,
      separator,
      term: commandTerm(part, characterId, previousToken),
      isDriveRush: /^(?:DRC|DR)\s/.test(part),
      driveRushMode: part.startsWith('DRC ') ? '取消' : '',
    })
    previousToken = part
    separator = ''
  }
  return steps
}

import { createComboRule, createMoveRule } from '../trainer/moveRules.js'

function motion(item, rule) {
  return { ...item, rule }
}

export const trainingMotions = [
  motion(
    {
      id: 'qcf-lp',
      name: '轻波动拳',
      notation: '236LP',
      sequence: ['2', '3', '6', 'LP'],
      windowFrames: 20,
    },
    createMoveRule({
      id: 'qcf-lp',
      name: '轻波动拳',
      notation: '236LP',
      motion: { type: 'qcf' },
      button: 'LP',
    }),
  ),
  motion(
    {
      id: 'dp-hp',
      name: '重升龙拳',
      notation: '623HP',
      sequence: ['6', '2', '3', 'HP'],
      windowFrames: 20,
    },
    createMoveRule({
      id: 'dp-hp',
      name: '重升龙拳',
      notation: '623HP',
      motion: { type: 'dp' },
      button: 'HP',
    }),
  ),
  motion(
    {
      id: 'qcb-mk',
      name: '中龙卷旋风脚',
      notation: '214MK',
      sequence: ['2', '1', '4', 'MK'],
      windowFrames: 20,
    },
    createMoveRule({
      id: 'qcb-mk',
      name: '中龙卷旋风脚',
      notation: '214MK',
      motion: { type: 'qcb' },
      button: 'MK',
    }),
  ),
  motion(
    {
      id: 'double-qcf-hp',
      name: '真空波动拳',
      notation: '236236HP',
      sequence: ['2', '3', '6', '2', '3', '6', 'HP'],
      windowFrames: 32,
    },
    createMoveRule({
      id: 'double-qcf-hp',
      name: '真空波动拳',
      notation: '236236HP',
      motion: { type: 'doubleQcf' },
      button: 'HP',
    }),
  ),
  motion(
    {
      id: 'hcf-lp',
      name: '半圈轻拳',
      notation: '41236LP',
      sequence: ['4', '1', '2', '3', '6', 'LP'],
      windowFrames: 35,
    },
    createMoveRule({
      id: 'hcf-lp',
      name: '半圈轻拳',
      notation: '41236LP',
      motion: { type: 'halfCircle' },
      button: 'LP',
    }),
  ),
  motion(
    {
      id: 'repeat-lp',
      name: '重复轻拳确认',
      notation: '2LP ~ LP ~ LP',
      sequence: ['2', 'LP', 'LP', 'LP'],
      windowFrames: 42,
    },
    createComboRule({
      id: 'repeat-lp',
      name: '重复轻拳确认',
      notation: '2LP ~ LP ~ LP',
      steps: [
        { id: 'repeat-1', label: '2LP', direction: '2', button: 'LP' },
        { id: 'repeat-2', label: 'LP', button: 'LP', linkWindowFrames: null },
        { id: 'repeat-3', label: 'LP', button: 'LP', linkWindowFrames: null },
      ],
    }),
  ),
  motion(
    {
      id: 'od-qcf',
      name: 'OD 波动指令',
      notation: '236PP',
      sequence: ['2', '3', '6', 'PP'],
      windowFrames: 24,
    },
    createMoveRule({
      id: 'od-qcf',
      name: 'OD 波动指令',
      notation: '236PP',
      motion: { type: 'qcf' },
      button: 'PP',
    }),
  ),
  motion(
    {
      id: 'drive-impact',
      name: '斗气迸放',
      notation: 'HP+HK',
      sequence: ['HP+HK'],
      windowFrames: 8,
    },
    createMoveRule({ id: 'drive-impact', name: '斗气迸放', notation: 'HP+HK', button: 'HP+HK' }),
  ),
  motion(
    {
      id: 'drive-rush-low',
      name: '绿冲下段',
      notation: 'DR 2MK',
      sequence: ['6', '6', '2', 'MK'],
      windowFrames: 36,
    },
    createComboRule({
      id: 'drive-rush-low',
      name: '绿冲下段',
      notation: 'DR 2MK',
      steps: [
        { id: 'drive-rush', label: '66（绿冲方向）', motion: { type: 'dash' }, button: null },
        {
          id: 'drive-rush-low',
          label: '2MK',
          direction: '2',
          button: 'MK',
          linkWindowFrames: null,
        },
      ],
    }),
  ),
  motion(
    {
      id: 'light-confirm-combo',
      name: '轻攻击确认连段',
      notation: '2LK ~ LP ~ LP > 236LP',
      sequence: ['2', 'LK', 'LP', 'LP', '3', '6', 'LP'],
      windowFrames: 75,
    },
    createComboRule({
      id: 'light-confirm-combo',
      name: '轻攻击确认连段',
      notation: '2LK ~ LP ~ LP > 236LP',
      steps: [
        { id: 'combo-lk', label: '2LK', direction: '2', button: 'LK' },
        { id: 'combo-lp-1', label: 'LP', button: 'LP', linkWindowFrames: null },
        { id: 'combo-lp-2', label: 'LP', button: 'LP', linkWindowFrames: null },
        {
          id: 'combo-qcf',
          label: '236LP',
          motion: { type: 'qcf' },
          button: 'LP',
          linkWindowFrames: null,
        },
      ],
    }),
  ),
  motion(
    {
      id: 'charge-back-lp',
      name: '后蓄力测试',
      notation: '[4]6LP',
      sequence: ['4', '6', 'LP'],
      windowFrames: 70,
    },
    createMoveRule({
      id: 'charge-back-lp',
      name: '后蓄力测试',
      notation: '[4]6LP',
      motion: { type: 'charge', chargeDirection: 'back' },
      button: 'LP',
    }),
  ),
]

export const inputLabels = {
  1: '↙',
  2: '↓',
  3: '↘',
  4: '←',
  5: 'N',
  6: '→',
  7: '↖',
  8: '↑',
  9: '↗',
  LP: 'LP',
  MP: 'MP',
  HP: 'HP',
  LK: 'LK',
  MK: 'MK',
  HK: 'HK',
  PP: 'PP',
  KK: 'KK',
  'LP+MP': 'LP+MP',
  'MP+MK': 'MP+MK',
  'HP+HK': 'HP+HK',
}

export const inputTerms = {
  1: '后下',
  2: '下',
  3: '前下',
  4: '后',
  5: '回中',
  6: '前',
  7: '后上',
  8: '上',
  9: '前上',
  LP: '轻拳',
  MP: '中拳',
  HP: '重拳',
  LK: '轻脚',
  MK: '中脚',
  HK: '重脚',
  PP: '任意双拳',
  KK: '任意双脚',
  'LP+MP': '轻拳＋中拳',
  'MP+MK': '中拳＋中脚',
  'HP+HK': '重拳＋重脚',
}

export const attackKeyHints = [
  { key: 'U', token: 'LP', term: '轻拳' },
  { key: 'I', token: 'MP', term: '中拳' },
  { key: 'O', token: 'HP', term: '重拳' },
  { key: 'J', token: 'LK', term: '轻脚' },
  { key: 'K', token: 'MK', term: '中脚' },
  { key: 'L', token: 'HK', term: '重脚' },
]

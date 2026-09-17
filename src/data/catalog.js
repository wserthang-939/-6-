import { lessons } from './lessons.js'
import { tutorials, matches } from './videos.js'
import { getCharacter } from './characters.js'
export const catalog = [...lessons, ...tutorials, ...matches]
export const catalogById = new Map(catalog.map((item) => [item.id, item]))
export const kindLabels = {
  move: '拳脚介绍',
  combo: '实用连段',
  trap: '套路与设置',
  video: '视频教学',
  match: '高手对局',
}

export function searchItems(
  items,
  {
    query = '',
    characterId = 'all',
    kind = 'all',
    difficulty = 'all',
    trapCategory = 'all',
    moveGroup = 'all',
    position = 'all',
    playerType = 'all',
    matchType = 'all',
  } = {},
) {
  const term = query.trim().toLowerCase()
  return items.filter(
    (item) =>
      (characterId === 'all' || item.characterId === characterId) &&
      (kind === 'all' || item.kind === kind) &&
      (difficulty === 'all' || item.difficulty === difficulty) &&
      (trapCategory === 'all' || item.trapCategory === trapCategory) &&
      (moveGroup === 'all' || item.moveGroup === moveGroup) &&
      (position === 'all' || item.position === position || item.position === '任意') &&
      (playerType === 'all' || item.playerType === playerType) &&
      (matchType === 'all' || item.matchType === matchType) &&
      (!term ||
        [
          item.title,
          item.description,
          item.command,
          item.conditions,
          item.position,
          item.goal,
          item.trapCategory,
          ...(item.purposeTags || []),
          item.player,
          item.opponent,
          item.author,
          getCharacter(item.characterId)?.name,
          getCharacter(item.characterId)?.englishName,
          getCharacter(item.characterId)?.alias,
          ...(item.tips || []),
        ]
          .join(' ')
          .toLowerCase()
          .includes(term)),
  )
}

export function relatedLessons(item) {
  return lessons.filter(
    (candidate) =>
      item.prerequisiteIds?.includes(candidate.id) || candidate.prerequisiteIds?.includes(item.id),
  )
}

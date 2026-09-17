export const FAVORITES_KEY = 'combo-lab:favorites:v1'

export function decodeFavorites(raw, validIds) {
  if (raw === null) return []
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new TypeError('收藏格式不正确')
  return [...new Set(parsed.filter((id) => typeof id === 'string' && validIds.has(id)))]
}

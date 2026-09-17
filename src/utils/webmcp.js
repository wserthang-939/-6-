import { nextTick } from 'vue'
import { catalog, catalogById } from '../data/catalog.js'
export function registerLabTools(favorites) {
  const context = globalThis.document?.modelContext
  if (!context?.registerTool) return () => {}
  const lifecycle = new AbortController()
  const definitions = [
    {
      name: 'read_learning_collection',
      title: '读取学习资料与收藏',
      description: '读取本站学习资料的标识、角色、名称和当前浏览器的收藏状态。',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input) {
        if (
          !input ||
          typeof input !== 'object' ||
          Array.isArray(input) ||
          Object.keys(input).length
        )
          throw new TypeError('参数必须为空对象')
        return {
          items: catalog.map(({ id, title, characterId, kind }) => ({
            id,
            title,
            characterId,
            kind,
            saved: favorites.has(id),
          })),
        }
      },
    },
    {
      name: 'set_learning_favorites',
      title: '设置本地学习收藏',
      description: '批量收藏或取消收藏已有学习资料。写入当前浏览器并同步界面，不修改原始资料。',
      inputSchema: {
        type: 'object',
        properties: {
          ids: {
            type: 'array',
            minItems: 1,
            maxItems: 108,
            uniqueItems: true,
            items: { type: 'string' },
          },
          saved: { type: 'boolean' },
        },
        required: ['ids', 'saved'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      async execute(input) {
        if (
          !input ||
          typeof input !== 'object' ||
          Object.keys(input).some((k) => !['ids', 'saved'].includes(k)) ||
          !Array.isArray(input.ids) ||
          !input.ids.length ||
          input.ids.length > 108 ||
          new Set(input.ids).size !== input.ids.length ||
          typeof input.saved !== 'boolean' ||
          input.ids.some((id) => typeof id !== 'string' || !catalogById.has(id))
        )
          throw new TypeError('无效的资料标识或收藏状态')
        input.ids.forEach((id) => favorites.setFavorite(id, input.saved))
        await nextTick()
        return {
          updated: input.ids,
          saved: input.saved,
          total: favorites.ids.length,
          warning: favorites.storageWarning || null,
        }
      },
    },
  ]
  for (const tool of definitions) {
    try {
      Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(() => {})
    } catch {
      /* 不支持 WebMCP 的浏览器不影响常规使用。 */
    }
  }
  return () => lifecycle.abort()
}

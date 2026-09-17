import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { catalogById } from '../data/catalog.js'
import { decodeFavorites, FAVORITES_KEY } from '../utils/favoritesStorage.js'

export const useFavoritesStore = defineStore('favorites', () => {
  const ids = ref([])
  const storageWarning = ref('')
  try {
    ids.value = decodeFavorites(localStorage.getItem(FAVORITES_KEY), catalogById)
  } catch {
    storageWarning.value = '无法读取本地收藏；本次收藏仍可使用。'
  }
  const items = computed(() => ids.value.map((id) => catalogById.get(id)).filter(Boolean))
  const has = (id) => ids.value.includes(id)
  function setFavorite(id, saved) {
    if (!catalogById.has(id) || typeof saved !== 'boolean') throw new TypeError('无效的收藏内容')
    if (has(id) !== saved)
      ids.value = saved ? [id, ...ids.value] : ids.value.filter((value) => value !== id)
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids.value))
      storageWarning.value = ''
    } catch {
      storageWarning.value = '浏览器未允许保存，当前收藏关闭页面后可能丢失。'
    }
    return saved
  }
  function toggle(id) {
    return setFavorite(id, !has(id))
  }
  function sync(event) {
    if (event.storageArea && event.storageArea !== globalThis.localStorage) return
    if (event.key !== FAVORITES_KEY && event.key !== null) return
    try {
      ids.value = decodeFavorites(event.newValue, catalogById)
      storageWarning.value = ''
    } catch {
      storageWarning.value = '其他标签页的收藏数据无法读取。'
    }
  }
  return { ids, items, has, setFavorite, toggle, sync, storageWarning }
})

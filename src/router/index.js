import { createRouter, createWebHashHistory } from 'vue-router'
import { routes } from './routes.js'
import { getCharacter } from '../data/characters.js'

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from) {
    return to.path !== from.path ? { top: 0 } : undefined
  },
})

router.afterEach((to) => {
  const title =
    to.name === 'character'
      ? getCharacter(to.params.id)?.name || '未收录角色'
      : to.meta.title || '角色研习'
  document.title = `${title} · COMBO LAB 街霸6研习所`
})
export default router

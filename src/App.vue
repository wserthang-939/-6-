<script setup>
import { onMounted, onUnmounted } from 'vue'
import { ArrowUpRight, Bookmark, Check, Crosshair } from 'lucide-vue-next'
import { useFavoritesStore } from './stores/favorites.js'
import { useNotice } from './composables/useNotice.js'
import { registerLabTools } from './utils/webmcp.js'
const favorites = useFavoritesStore()
const { message } = useNotice()
let unregisterTools
onMounted(() => {
  window.addEventListener('storage', favorites.sync)
  unregisterTools = registerLabTools(favorites)
})
onUnmounted(() => {
  window.removeEventListener('storage', favorites.sync)
  unregisterTools?.()
})
</script>

<template>
  <a class="skip-link" href="#main-content">跳转到主要内容</a>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="brand" aria-label="COMBO LAB 首页"
        ><span class="brand-mark">C<span>↗</span></span
        ><span
          ><strong>COMBO<span>LAB</span><span class="brand-dot">.</span></strong
          ><small>街霸 6 研习所</small></span
        ></RouterLink
      >
      <nav aria-label="主导航">
        <RouterLink
          to="/"
          exact-active-class="nav-active"
          :class="{ 'nav-active': $route.name === 'character' }"
          >角色研习</RouterLink
        ><RouterLink to="/library" active-class="nav-active">连段与套路</RouterLink
        ><RouterLink to="/trainer" active-class="nav-active"
          ><Crosshair :size="15" />指令训练</RouterLink
        ><RouterLink to="/matches" active-class="nav-active"
          >高手对局 <ArrowUpRight :size="14"
        /></RouterLink>
      </nav>
      <RouterLink to="/favorites" class="favorites-link"
        ><Bookmark :size="17" /><span>我的收藏</span
        ><span v-if="favorites.ids.length" class="favorite-count">{{
          favorites.ids.length
        }}</span></RouterLink
      >
    </div>
  </header>
  <div id="main-content" tabindex="-1"><RouterView /></div>
  <Transition name="notice"
    ><div v-if="message" role="status" class="toast">
      <Check :size="17" />{{ message }}
    </div></Transition
  >
  <footer class="site-footer">
    <div>
      <span class="footer-brand">COMBO LAB<span> / </span></span
      ><span>练习有迹可循，进步从不偶然。</span>
    </div>
    <div>
      <span>非官方玩家学习站</span
      ><RouterLink to="/about">关于本站 <ArrowUpRight :size="13" /></RouterLink>
    </div>
  </footer>
</template>

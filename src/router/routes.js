import HomeView from '../views/HomeView.vue'

export const routes = [
  {
    path: '/glossary',
    name: 'glossary',
    component: () => import('../views/GlossaryView.vue'),
    meta: { title: '术语与帧数速查' },
  },
  { path: '/', name: 'home', component: HomeView },
  { path: '/characters', redirect: '/' },
  {
    path: '/character/:id',
    name: 'character',
    component: () => import('../views/CharacterDetailView.vue'),
    meta: { title: '角色详情' },
  },
  {
    path: '/library',
    name: 'library',
    component: () => import('../views/LibraryView.vue'),
    meta: { title: '连段与套路' },
  },
  {
    path: '/matches',
    name: 'matches',
    component: () => import('../views/MatchesView.vue'),
    meta: { title: '高手对局' },
  },
  {
    path: '/trainer',
    name: 'trainer',
    component: () => import('../views/TrainerView.vue'),
    meta: { title: '指令训练中心' },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: () => import('../views/FavoritesView.vue'),
    meta: { title: '我的收藏' },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: { title: '关于本站' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFoundView.vue'),
    meta: { title: '页面不存在' },
  },
]

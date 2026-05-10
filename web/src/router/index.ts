import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/Home.vue'), meta: { title: '首页' } },
  { path: '/features', name: 'Features', component: () => import('@/views/Features.vue'), meta: { title: '功能介绍' } },
  { path: '/features/:slug', name: 'FeatureDetail', component: () => import('@/views/FeatureDetail.vue'), meta: { title: '功能详情' } },
  { path: '/pricing', name: 'Pricing', component: () => import('@/views/Pricing.vue'), meta: { title: '功能方案' } },
  { path: '/download', name: 'Download', component: () => import('@/views/Download.vue'), meta: { title: '下载' } },
  { path: '/about', name: 'About', component: () => import('@/views/About.vue'), meta: { title: '关于我们' } },
  { path: '/help', name: 'HelpCenter', component: () => import('@/views/HelpCenter.vue'), meta: { title: '帮助中心' } },
  { path: '/help/:slug', name: 'HelpDetail', component: () => import('@/views/HelpDetail.vue'), meta: { title: '帮助详情' } },
  { path: '/privacy', name: 'Privacy', component: () => import('@/views/Privacy.vue'), meta: { title: '隐私政策' } },
  { path: '/agreement', name: 'Agreement', component: () => import('@/views/Agreement.vue'), meta: { title: '用户协议' } },
  { path: '/login', name: 'Login', component: () => import('@/views/Login.vue'), meta: { title: '登录' } },
  { path: '/register', name: 'Register', component: () => import('@/views/Register.vue'), meta: { title: '注册' } },
  { path: '/app', name: 'WebApp', component: () => import('@/views/WebApp.vue'), meta: { title: '工作台' } },
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || ''} - 爱辅学`
  // Web应用页面需要登录
  if (to.path === '/app') {
    const token = localStorage.getItem('aifuxue_token')
    if (!token) {
      next('/login')
      return
    }
  }
  window.scrollTo(0, 0)
  next()
})

export default router

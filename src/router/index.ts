import { createRouter, createWebHistory } from 'vue-router'
import { tools } from '@/tools'

const toolRoutes = tools.map((tool) => ({
  path: tool.path,
  name: tool.id,
  component: tool.component,
  meta: { tool, layout: 'tool' },
}))

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('@/pages/PrivacyPage.vue'),
    },
    ...toolRoutes,
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/pages/NotFound.vue'),
    },
  ],
})

import { createRouter, createWebHistory } from 'vue-router'
import { tools } from '@/tools'

const toolRoutes = tools.flatMap((tool) => {
  const canonical = {
    path: tool.path,
    name: tool.id,
    component: tool.component,
    meta: { tool, layout: 'tool' },
  }

  const aliases = (tool.redirectFrom || []).map((path) => ({
    path,
    name: `${tool.id}-alias-${path.replace(/[^a-z0-9-]/g, '-')}`,
    component: tool.component,
    meta: { tool, layout: 'tool' },
  }))

  return [canonical, ...aliases]
})

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

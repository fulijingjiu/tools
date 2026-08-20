import { createApp } from 'vue'
import { router } from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
app.use(router)

const redirectPath = new URLSearchParams(window.location.search).get('_spa_redirect')

if (redirectPath) {
  try {
    const target = decodeURIComponent(redirectPath)
    if (target.startsWith('/') && !target.startsWith('//')) {
      void router.replace(target)
    }
  } catch {
    // ignore invalid redirect param
  }

  window.history.replaceState({}, '', '/')
}

app.mount('#app')

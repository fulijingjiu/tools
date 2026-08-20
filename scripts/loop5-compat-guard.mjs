#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'

function assert(condition, message) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertFile(path, message) {
  assert(existsSync(path), `${message}: ${path} missing`)
}

function main() {
  const routerSource = readFileSync('src/router/index.ts', 'utf8')
  const mainSource = readFileSync('src/main.ts', 'utf8')
  const notFoundSource = readFileSync('public/404.html', 'utf8')
  const viteConfig = readFileSync('vite.config.ts', 'utf8')
  const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))

  assert(routerSource.includes("path: '/:pathMatch(.*)*'"), 'router must include catch-all route')
  assert(
    routerSource.includes('createWebHistory(import.meta.env.BASE_URL)'),
    'router should use the Vite base URL',
  )
  assert(mainSource.includes('_spa_redirect'), 'main.ts should parse _spa_redirect')
  assert(mainSource.includes('router.replace(target)'), 'main.ts should restore deep link path')
  assert(mainSource.includes('import.meta.env.BASE_URL'), 'main.ts should clear redirect query at the base URL')
  assert(notFoundSource.includes("const basePath = '/tools'"), '404.html should declare the Pages base path')
  assert(notFoundSource.includes('window.location.pathname.slice(basePath.length)'), '404.html should strip the Pages base path')
  assert(notFoundSource.includes('window.location.replace(`${basePath}/?_spa_redirect='), '404.html should redirect to the Pages base path')
  assert(notFoundSource.includes('encodeURIComponent'), '404.html should encode redirected path')
  assert(!/copyPublicDir:\s*false/.test(viteConfig), 'vite config should keep public assets enabled (copyPublicDir not false)')
  assert(packageJson.dependencies?.['vue-router'], 'package must include vue-router dependency')
  assert(packageJson.scripts?.['build:pages']?.includes('--base=/tools/'), 'package must provide a Pages build')

  assertFile('public/.nojekyll', 'GitHub Pages artifact guard')
  assertFile('.github/workflows/部署GitHubPages.yml', 'GitHub Pages deployment workflow')

  console.log('Loop5 compatibility guard: PASS')
}

main()

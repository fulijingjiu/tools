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
  const packageJson = readFileSync('package.json', 'utf8')

  assert(routerSource.includes("path: '/:pathMatch(.*)*'"), 'router must include catch-all route')
  assert(routerSource.includes('createWebHistory'), 'router should use history mode')
  assert(mainSource.includes('_spa_redirect'), 'main.ts should parse _spa_redirect')
  assert(mainSource.includes('router.replace(target)'), 'main.ts should restore deep link path')
  assert(mainSource.includes('window.history.replaceState'), 'main.ts should clear redirect query after restore')
  assert(notFoundSource.includes('window.location.replace(`/?_spa_redirect='), '404.html should redirect to root with _spa_redirect')
  assert(notFoundSource.includes('encodeURIComponent'), '404.html should encode redirected path')
  assert(!/copyPublicDir:\s*false/.test(viteConfig), 'vite config should keep public assets enabled (copyPublicDir not false)')
  assert(packageJson.includes('vue-router'), 'package must include vue-router dependency')

  assertFile('public/.nojekyll', 'GitHub Pages artifact guard')

  console.log('Loop5 compatibility guard: PASS')
}

main()

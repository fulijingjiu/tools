#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

const tasks = [
  { name: 'Metadata', cmd: 'npm', args: ['run', 'check:tools'] },
  { name: 'Search smoke', cmd: 'npm', args: ['run', 'qa:loop5:search'] },
  { name: 'UI guard', cmd: 'npm', args: ['run', 'qa:loop5:ui'] },
  { name: 'Theme-order guard', cmd: 'npm', args: ['run', 'qa:loop5:theme-order'] },
  { name: 'Compatibility guard', cmd: 'npm', args: ['run', 'qa:loop5:compat'] },
  { name: 'Build', cmd: 'npm', args: ['run', 'build'] },
]

const args = process.argv.slice(2)
const openBrowser = args.includes('--open')

function runCommand(name, cmd, cmdArgs) {
  const result = spawnSync(cmd, cmdArgs, {
    stdio: 'inherit',
    shell: true,
    encoding: 'utf8',
  })
  if (result.status !== 0) {
    console.error(`\n[loop5-operator] FAILED: ${name}`)
    return false
  }
  console.log(`\n[loop5-operator] PASSED: ${name}`)
  return true
}

console.log('Loop5 operator started...')
for (const task of tasks) {
  const ok = runCommand(task.name, task.cmd, task.args)
  if (!ok) {
    console.error('[loop5-operator] Stopping due to failure.')
    process.exitCode = 1
    break
  }
}

if (process.exitCode === 0 && openBrowser) {
  console.log('\n[loop5-operator] Starting preview server...')
  spawnSync('npm', ['run', 'preview'], {
    stdio: 'inherit',
    shell: true,
    encoding: 'utf8',
  })
}

import assert from 'node:assert/strict'
import { chromium } from '@playwright/test'

const base = (process.env.TEST_BASE_URL || 'https://fulijingjiu.github.io/tools').replace(/\/$/, '')
const browser = await chromium.launch()
const context = await browser.newContext({ acceptDownloads: true })
await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: new URL(base).origin })
const page = await context.newPage()
page.setDefaultTimeout(5000)
page.setDefaultNavigationTimeout(10000)
const results = []
const errors = []

page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (message) => {
  if (message.type() === 'error' && !message.text().includes('status of 404')) errors.push(message.text())
})
page.on('response', (response) => {
  if (response.status() < 400) return
  const expectedPagesFallback =
    response.status() === 404 &&
    response.request().resourceType() === 'document' &&
    response.url().startsWith(`${base}/tools/`)
  if (!expectedPagesFallback) errors.push(`HTTP ${response.status()}: ${response.url()}`)
})

const run = async (id, task) => {
  try {
    await task()
    results.push([id, '通过'])
    console.log(`${id} | 通过`)
  } catch (error) {
    results.push([id, '不通过', error.message])
    console.log(`${id} | 不通过 | ${error.message.split('\n')[0]}`)
  }
}
const tool = (id) => page.goto(`${base}/tools/${id}`, { waitUntil: 'networkidle' })
const input = (placeholder) => page.getByPlaceholder(placeholder)
const output = () => page.locator('textarea').last()

await run('C-01', async () => {
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await input('Search tools by name/description/keyword/tag/category').fill('JSON')
  await assertVisible(page.getByRole('heading', { name: 'JSON 格式化' }))
  assert.equal(await page.getByRole('heading', { name: 'Base64 编解码' }).count(), 0)
  await input('Search tools by name/description/keyword/tag/category').fill('')
  await assertVisible(page.getByRole('heading', { name: 'Base64 编解码' }))
})

await run('C-02', async () => {
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: /JSON 格式化/ }).click()
  await page.waitForURL(`${base}/tools/json-formatter`)
  await page.goBack()
  await assertVisible(page.getByRole('heading', { name: 'Developer Toolkit' }))
  await page.goto(`${base}/tools/base64`, { waitUntil: 'networkidle' })
  await assertVisible(page.getByRole('heading', { name: 'Base64 编解码' }))
})

await run('C-03', async () => {
  await page.goto(`${base}/`, { waitUntil: 'networkidle' })
  const before = await page.locator('html').getAttribute('class')
  await page.getByRole('button', { name: 'Toggle theme' }).click()
  assert.notEqual(await page.locator('html').getAttribute('class'), before)
})

await run('C-04', async () => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 844 })
    await page.goto(`${base}/`, { waitUntil: 'networkidle' })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true)
    await tool('json-formatter')
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), true)
  }
})

await run('C-05', async () => {
  await tool('json-formatter')
  await input('输入 JSON 字符串...').fill('{"a":1}')
  await page.getByRole('button', { name: '格式化' }).click()
  await page.getByRole('button', { name: '复制' }).click()
  await assertVisible(page.getByText(/复制成功|已复制|Copied/i))
})

await run('D-01', async () => {
  await tool('json-formatter')
  await input('输入 JSON 字符串...').fill('{"中文":"测试","n":1}')
  await page.getByRole('button', { name: '格式化' }).click()
  assert.equal(JSON.parse(await output().inputValue()).中文, '测试')
  await input('输入 JSON 字符串...').fill('{bad')
  await page.getByRole('button', { name: '格式化' }).click()
  await assertVisible(page.getByText(/JSON 格式错误/))
})

await run('D-02', async () => {
  await tool('base64')
  await input('输入文本或 Base64 字符串...').fill('中文测试')
  await page.getByRole('button', { name: '编码' }).click()
  assert.equal(await output().inputValue(), '5Lit5paH5rWL6K+V')
  await input('输入文本或 Base64 字符串...').fill('5Lit5paH5rWL6K+V')
  await page.getByRole('button', { name: '解码' }).click()
  assert.equal(await output().inputValue(), '中文测试')
})

await run('D-03', async () => {
  await tool('url-encoder')
  await input('输入文本或 URL 字符串...').fill('中文 a&b')
  await page.getByRole('button', { name: '编码' }).click()
  assert.equal(await output().inputValue(), '%E4%B8%AD%E6%96%87%20a%26b')
  await input('输入文本或 URL 字符串...').fill('%E4%B8%AD%E6%96%87%20a%26b')
  await page.getByRole('button', { name: '解码' }).click()
  assert.equal(await output().inputValue(), '中文 a&b')
})

await run('D-04', async () => {
  await tool('timestamp')
  await input('输入 Unix 时间戳...').fill('1704067200')
  assert.match(await page.locator('textarea').nth(1).inputValue(), /2024/)
  await page.getByRole('button', { name: '现在' }).click()
  assert.match(await input('输入 Unix 时间戳...').inputValue(), /^\d{10,13}$/)
})

await run('D-05', async () => {
  await tool('number-converter')
  await input('输入十进制数字...').fill('255')
  const body = await page.locator('main').innerText()
  assert.match(body, /11111111/)
  assert.match(body, /377/)
  assert.match(body, /FF/i)
})

await run('D-06', async () => {
  await tool('hash')
  await input('输入文本...').fill('abc')
  assert.equal(await output().inputValue(), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
})

await run('D-07', async () => {
  await tool('jwt-parser')
  await input('粘贴 JWT Token...').fill('eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiIxMjMiLCJuYW1lIjoi5rWL6K-VIn0.eA')
  assert.match(await page.locator('textarea').nth(2).inputValue(), /"sub": "123"/)
  await input('粘贴 JWT Token...').fill('bad-token')
  await assertVisible(page.getByText(/JWT 格式不正确/))
})

await run('D-08', async () => {
  await tool('regex-tester')
  await page.getByRole('textbox').nth(0).fill('(\\d+)')
  await page.getByRole('textbox').nth(2).fill('abc 123 def 456')
  assert.match(await page.locator('main').innerText(), /123[\s\S]*456/)
  await page.getByRole('textbox').nth(0).fill('(')
  await assertVisible(page.getByText(/正则表达式错误/).first())
})

await run('T-01', async () => {
  await tool('text-processor')
  await input('输入文本...').fill('b\na\na\n\n')
  await page.getByRole('button', { name: '文本去重' }).click()
  assert.equal((await output().inputValue()).trim(), 'b\na')
  await input('输入文本...').fill('b\na')
  await page.getByRole('button', { name: '升序排列' }).click()
  assert.equal((await output().inputValue()).trim(), 'a\nb')
})

await run('T-02', async () => {
  await tool('text-diff')
  await input('输入原始文本...').fill('第一行\n旧内容')
  await input('输入对比文本...').fill('第一行\n新内容')
  const body = await page.locator('main').innerText()
  assert.match(body, /旧内容/)
  assert.match(body, /新内容/)
})

await run('T-03', async () => {
  await tool('markdown-preview')
  await input('输入 Markdown 文本...').fill('# 标题\n\n**粗体**')
  await assertVisible(page.getByRole('heading', { name: '标题' }))
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: '下载 HTML' }).click()
  assert.equal((await download).suggestedFilename(), 'markdown-preview.html')
})

await run('T-04', async () => {
  await tool('color-converter')
  await input('#000000').fill('#FF0000')
  assert.deepEqual(await page.locator('input[type=number]').evaluateAll((items) => items.map((item) => item.value).slice(0, 3)), ['255', '0', '0'])
})

await run('G-01', async () => {
  await tool('image-compressor')
  await page.locator('input[type=file]').setInputFiles({
    name: 'test.png',
    mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9WlN6jAAAAAASUVORK5CYII=', 'base64'),
  })
  await page.getByRole('button', { name: 'Compress', exact: true }).click()
  await assertVisible(page.getByRole('button', { name: 'Download' }))
})

await run('G-02', async () => {
  await tool('qrcode-generator')
  await input('输入文本或链接...').fill('https://fulijingjiu.github.io/tools/')
  await assertVisible(page.getByRole('img', { name: 'QR Code' }))
  const download = page.waitForEvent('download')
  await page.getByRole('button', { name: '下载 PNG' }).click()
  assert.equal((await download).suggestedFilename(), 'qrcode.png')
})

await run('G-03', async () => {
  await tool('password-generator')
  await page.getByRole('slider').fill('24')
  await page.getByRole('button', { name: '生成密码' }).click()
  assert.equal((await page.locator('textarea').inputValue()).length, 24)
})

await run('G-04', async () => {
  await tool('unit-converter')
  await page.getByRole('spinbutton').fill('1000')
  assert.match(await page.getByText('换算结果').locator('..').innerText(), /\b1\b/)
  await page.getByRole('button', { name: '温度' }).click()
  await page.getByRole('spinbutton').fill('0')
  assert.match(await page.getByText('换算结果').locator('..').innerText(), /32/)
})

await browser.close()
if (errors.length) console.error('浏览器错误:', [...new Set(errors)].join('\n'))
const failed = results.filter(([, status]) => status !== '通过')
if (failed.length || errors.length) process.exitCode = 1

async function assertVisible(locator) {
  await locator.waitFor({ state: 'visible' })
  assert.equal(await locator.isVisible(), true)
}

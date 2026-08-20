# GitHub Pages 部署计划

> 状态：已完成
> 优先级：P0  
> 目标站点：`https://fulijingjiu.github.io/tools/`  
> 适用仓库：`fulijingjiu/tools`  
> 计划日期：2026-08-21

## 执行结果

- GitHub Pages 已启用，发布源为 GitHub Actions。
- 首次部署工作流成功，运行记录：<https://github.com/fulijingjiu/tools/actions/runs/32396684564>。
- 公开地址：<https://fulijingjiu.github.io/tools/>。
- `npm run qa:loop5`、`npm run build:pages` 和 `npm run test:online` 均通过。
- Playwright 按《功能测试文档》完成 21 项检查，结果全部通过。
- 测试发现并补齐 Markdown HTML 文件下载功能。

## 一、目标

建立可重复、可验证、可回滚的 GitHub Pages 自动部署流程，并保证项目站点部署在 `/tools/` 子路径时：首页、静态资源、前端路由和深链接刷新均正常工作。

完成后应达到：

- 推送到 `main` 后自动检查和部署。
- GitHub Pages 首页返回 200。
- 工具页面可以从首页进入。
- 直接访问或刷新工具深链接不会出现 GitHub 404。
- Vercel 使用的根路径构建保持不变。
- 部署失败时不会覆盖最后一个成功版本。

## 二、当前问题

### 构建基础路径

`vite.config.ts` 当前未配置 `base`，生产构建默认生成根路径资源地址。GitHub Pages 项目站点位于 `/tools/`，直接发布后可能请求错误的 `/assets/...` 地址。

### 前端路由基础路径

`src/router/index.ts` 当前使用：

```ts
createWebHistory()
```

路由没有读取 Vite 构建时的基础路径，无法明确区分根站点与 `/tools/` 项目站点。

### 404 回退路径

`public/404.html` 当前把深链接重定向到根路径：

```text
/?_spa_redirect=...
```

项目站点应回到 `/tools/`，并在传递给 Vue Router 前移除仓库基础路径。

### 重定向地址清理

`src/main.ts` 当前完成恢复后将地址清理为 `/`。在 GitHub Pages 中应清理为 `import.meta.env.BASE_URL`，否则浏览器地址会离开 `/tools/`。

### 自动部署

仓库当前没有 `.github/workflows/`，构建产物不会自动发布到 GitHub Pages。

## 三、实施范围

### 本阶段包含

- GitHub Pages 专用构建命令。
- Vite 基础路径和 Vue Router 基础路径适配。
- GitHub Pages 404 深链接恢复。
- GitHub Actions 自动部署。
- 本地构建、产物检查和线上冒烟验证。
- 部署说明和回归清单更新。

### 原计划不包含

- 新工具开发。
- 页面视觉重构。
- Vercel 正式发布操作。
- 自定义域名配置。
- Vitest 测试体系建设。执行阶段按要求增加了单文件 Playwright 线上测试脚本。

## 四、技术方案

### 1. 构建命令拆分

修改 `package.json`：

```json
{
  "scripts": {
    "typecheck": "vue-tsc -b",
    "build": "npm run typecheck && vite build",
    "build:pages": "npm run typecheck && vite build --base=/tools/"
  }
}
```

设计理由：

- 默认 `npm run build` 继续输出根路径版本，供 Vercel 或本地使用。
- `npm run build:pages` 只为 GitHub Pages 生成 `/tools/` 子路径版本。
- 不在 `vite.config.ts` 中硬编码仓库名，避免影响其他部署目标。

### 2. 路由基础路径

修改 `src/router/index.ts`：

```ts
history: createWebHistory(import.meta.env.BASE_URL)
```

预期行为：

- 默认构建的基础路径为 `/`。
- Pages 构建的基础路径为 `/tools/`。
- 工具元数据中的路由仍保持 `/tools/<tool-id>`，无需批量修改。

### 3. 404 深链接恢复

修改 `public/404.html`，逻辑要求：

1. 明确 Pages 基础路径为 `/tools`。
2. 读取当前路径、查询参数和哈希。
3. 从当前路径开头移除 `/tools`，得到应用内部路由。
4. 将应用内部路由编码为 `_spa_redirect`。
5. 跳转到 `/tools/?_spa_redirect=...`。

示例：

```text
/tools/tools/json-formatter
  → /tools/?_spa_redirect=%2Ftools%2Fjson-formatter
  → Vue Router 恢复 /tools/json-formatter
```

安全约束：

- 只接受站内绝对路径。
- 拒绝以 `//` 开头的地址，避免开放重定向。
- 保留原查询参数和哈希。

### 4. 应用启动恢复

修改 `src/main.ts`：

- 从 `_spa_redirect` 读取应用内部路径。
- 解码并验证目标必须以单个 `/` 开头。
- 使用 `router.replace(target)` 恢复路由。
- 使用 `import.meta.env.BASE_URL` 清理临时查询参数。
- 路由准备完成后再挂载应用，避免首页短暂闪烁。

注意：不能继续把浏览器历史地址写死为 `/`。

### 5. GitHub Actions 工作流

新增 `.github/workflows/部署GitHubPages.yml`。

触发条件：

- 推送到 `main`。
- 手工触发 `workflow_dispatch`。

权限：

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

并发策略：

- 使用 `pages` 并发组。
- 新部署可以取消尚未开始发布的旧任务。
- 已开始的生产部署不强制中断。

任务流程：

```text
检出代码
  → 配置 Node.js 20 和 npm 缓存
  → npm ci
  → npm run qa:loop5
  → npm run build:pages
  → 配置 Pages
  → 上传 dist
  → 部署 Pages
```

建议使用：

- `actions/checkout`
- `actions/setup-node`
- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

具体版本在实施时选择当时稳定的官方主版本，并在工作流中固定主版本号。

## 五、实施步骤

### 步骤一：建立部署分支或独立提交

- [ ] 确认工作区干净。
- [ ] 从最新 `main` 开始。
- [ ] 不混入工具功能、文案或测试框架改动。

### 步骤二：修改构建和路由

- [ ] 拆分 `typecheck`、`build` 和 `build:pages`。
- [ ] 路由读取 `import.meta.env.BASE_URL`。
- [ ] 默认构建通过。
- [ ] Pages 构建通过。

### 步骤三：修复深链接

- [ ] 修改 `public/404.html`。
- [ ] 修改 `src/main.ts`。
- [ ] 保留查询参数和哈希。
- [ ] 拒绝不安全的双斜线目标。
- [ ] 更新现有兼容性检查脚本。

### 步骤四：增加自动部署

- [ ] 创建 `.github/workflows/部署GitHubPages.yml`。
- [ ] 配置 Pages 所需权限和环境。
- [ ] 上传内容仅限 `dist/`。
- [ ] 设置并发控制。

### 步骤五：仓库一次性设置

- [ ] 打开仓库 Settings → Pages。
- [ ] 将 Source 设置为 GitHub Actions。
- [ ] 确认 Actions 有读取仓库和发布 Pages 的权限。
- [ ] 首次手工触发工作流或推送部署提交。

### 步骤六：验收与记录

- [ ] 保存成功工作流链接。
- [ ] 记录部署提交哈希和时间。
- [ ] 更新 README 在线地址。
- [ ] 更新项目路线图和回归检查清单。

## 六、验证矩阵

| 场景 | 地址或命令 | 预期结果 |
| --- | --- | --- |
| 默认构建 | `npm run build` | 构建通过，仍使用根路径资源 |
| Pages 构建 | `npm run build:pages` | 构建通过，资源地址以 `/tools/` 开头 |
| 完整检查 | `npm run qa:loop5` | 全部检查通过 |
| 首页 | `/tools/` | 返回 200，页面完整显示 |
| 隐私页 | `/tools/privacy` | 可进入并可刷新 |
| 工具页 | `/tools/tools/json-formatter` | 可进入并可刷新 |
| 工具别名 | `/tools/tools/compress-image` | 正常进入图片压缩工具 |
| 未知路径 | `/tools/not-exists` | 进入应用内 404 页面 |
| 查询与哈希 | 工具路径加 `?a=1#result` | 恢复后仍保留查询和哈希 |
| 静态资源 | `/tools/assets/...` | JS 和 CSS 返回 200 |
| Vercel 构建 | 默认构建产物 | 不出现强制 `/tools/` 前缀 |

## 七、上线检查

### 上线前

- [ ] 工作区干净且远程分支已同步。
- [ ] 完整 QA 和两种构建均通过。
- [ ] `dist/index.html` 中资源路径正确。
- [ ] `dist/404.html` 已包含在产物中。
- [ ] 工作流只上传 `dist/`。
- [ ] README 暂不填写未经验证的在线地址。

### 上线后

- [ ] 首页 HTTP 状态为 200。
- [ ] 无 JS、CSS、图标 404。
- [ ] 桌面端和移动端完成基本浏览。
- [ ] 深色模式正常。
- [ ] 至少检查 5 个代表性工具。
- [ ] 直接刷新工具页正常。
- [ ] GitHub Actions 显示成功部署环境 URL。

## 八、回滚方案

出现资源 404、路由循环或白屏时：

1. 停止继续合并部署相关改动。
2. 在 GitHub Actions 中确认失败阶段和日志。
3. 对部署提交执行普通 `git revert`，不使用强制推送。
4. 推送回滚提交，让 Pages 自动部署上一份稳定源码。
5. 再次检查首页、静态资源和深链接。
6. 在项目路线图记录失败原因和后续修复条件。

如果只是工作流瞬时失败且源码未变，可重新运行对应工作流；不要用重新运行代替真实代码缺陷修复。

## 九、风险与控制

| 风险 | 控制方式 |
| --- | --- |
| `/tools/` 被重复拼接 | 404 页先移除站点基础路径，再传给 Vue Router |
| Vercel 被 Pages 配置影响 | 仅在 `build:pages` 通过 CLI 指定基础路径 |
| 临时查询参数残留 | 应用恢复路由后使用基础路径清理浏览器地址 |
| 外部重定向 | 只接受单斜线开头的站内路径 |
| 部署错误覆盖稳定站点 | 完整 QA 先于上传与部署，失败任务不进入发布步骤 |
| 工作流依赖漂移 | 使用官方 Action 并固定稳定主版本 |

## 十、交付物

- GitHub Pages 专用构建命令。
- 基础路径兼容的 Vue Router 配置。
- 可在项目子路径工作的 404 恢复逻辑。
- GitHub Pages 自动部署工作流。
- 更新后的兼容性检查脚本。
- 更新后的 README、路线图和回归检查清单。
- 成功部署链接和验收记录。

## 十一、提交建议

建议拆成两个提交：

```text
fix: support github pages base path
ci: add github pages deployment workflow
```

第一提交只处理构建、路由和深链接；第二提交只处理工作流和部署文档。任何提交都必须可以独立通过对应检查。

## 十二、完成定义

只有同时满足以下条件，才能把路线图中的“部署闭环”标记为完成：

- GitHub Pages 工作流成功。
- 公开站点返回 200。
- 静态资源无 404。
- 首页、隐私页、工具页和别名路由通过。
- 深链接直接访问及刷新通过。
- 默认根路径构建没有回归。
- README 和回归检查清单已更新。

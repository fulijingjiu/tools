# CLAUDE.md

## 项目概述

my-tools-web — 面向开发者的无广告、纯前端在线工具箱。Vue 3 + TypeScript + Vite + Tailwind CSS。

## 常用命令

```bash
npm run dev       # 启动开发服务器
npm run build     # 构建生产版本（含 vue-tsc 类型检查）
npm run preview   # 预览构建结果
```

## 技术架构

- **框架**: Vue 3 Composition API（`<script setup>`）
- **样式**: Tailwind CSS 4（通过 `@tailwindcss/vite` 插件）
- **路由**: Vue Router 4，路由从 `src/tools/index.ts` 工具注册中心自动生成
- **图标**: Lucide Vue（`lucide-vue-next`）
- **工具库**: VueUse（优先使用组合式函数，避免重复实现）

## 工具开发规范

每个工具一个目录，结构如下：

```
src/tools/<tool-name>/
├── index.ts    # 工具注册（导出 Tool 类型元数据）
├── index.vue   # UI 和交互
└── utils.ts    # 纯函数逻辑
```

新增工具只需在 `src/tools/index.ts` 注册即可，无需修改路由文件。

## 组件规范

- 统一使用 `<script setup>` + Composition API
- 优先使用 VueUse 组合式函数
- 公共组件放 `src/components/`

## 参考文档（均在 `D:\TASK\`）

| 文档 | 内容 |
|------|------|
| `需求书.md` | 项目概述、市场/竞品分析、功能规划、AI 扩展、商业模式、路线图 |
| `功能书.md` | 第一阶段 18 个功能的详细规格、数据模型、验收标准 |
| `技术栈说明书.md` | 选型理由、参考架构、目录结构、类型定义、路由/注册代码示例 |
| `开源项目可复用性分析.md` | it-tools 深度分析、可复用设计点、与当前项目的差距分析、落地执行方案 |

## 参考项目（均在 `D:\TASK\`）

| 项目 | 说明 | 参考价值 |
|------|------|---------|
| `it-tools` | 70+ 工具的开源工具箱（Vue 3 + naive-ui） | ⭐⭐⭐⭐⭐ 工具注册、路由生成、布局模式 |
| `vueuse` | Vue 组合式函数库 | ⭐⭐⭐⭐ 直接使用 `useClipboard`、`useStorage`、`useDark` |
| `icones` | 图标搜索工具 | ⭐⭐⭐ 图标选择逻辑 |
| `tools` | 另一个工具项目 | ⭐⭐⭐⭐ 参考工具实现 |

**重要：** 参考 it-tools 的架构设计，但不直接复制代码（GPLv3 协议）；UI 层用 Tailwind CSS 自行实现，不引入 naive-ui / UnoCSS。

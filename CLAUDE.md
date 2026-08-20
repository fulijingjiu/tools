# CLAUDE.md

## 项目概述

My Tools Web 是基于 Vue 3、TypeScript、Vite 和 Tailwind CSS 的纯前端在线工具箱。

## 常用命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 类型检查并构建生产版本
npm run preview      # 预览生产构建
npm run check:tools  # 检查工具元数据
npm run qa:loop5     # 执行完整项目检查
```

## 技术约定

- 使用 Vue 3 Composition API 和 `<script setup>`。
- 使用 Tailwind CSS 维护界面样式。
- 路由从 `src/tools/index.ts` 的工具注册表生成。
- 图标统一使用 `lucide-vue-next`。
- 优先复用 VueUse 和现有组合式函数。
- 公共组件放在 `src/components/`。

## 工具目录规范

```text
src/tools/<tool-id>/
├─ index.ts    # 工具元数据和异步组件入口
├─ index.vue   # 页面和交互
└─ utils.ts    # 可独立测试的业务逻辑（按需提供）
```

新增工具时：

1. 使用稳定、唯一的工具 ID 和主路径。
2. 填写名称、说明、分类、关键字和标签。
3. 在 `src/tools/index.ts` 注册工具。
4. 不手工向路由文件添加普通工具页面。
5. 运行 `npm run check:tools` 和 `npm run build`。

## 安全与质量

- 用户内容默认只在浏览器本地处理。
- 使用 `v-html` 时必须保留明确的净化策略和安全测试。
- 对空输入、非法参数、超限内容和解析失败提供可读提示。
- 不直接复制许可证不兼容项目的代码。
- 不把构建通过等同于浏览器端功能验收。

## 项目文档

项目状态、代码计划、质量清单和历史记录见 [`doc/文档索引.md`](doc/文档索引.md)。

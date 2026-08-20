# my-tools-web

面向开发者的**无广告、纯前端、打开即用的在线工具箱**�?
## 核心原则

- 🚫 **无广�?* �?页面干净，核心功能无干扰
- 🔒 **纯前�?* �?所有运算在浏览器本地完成，不上传用户数�?- �?**即用即走** �?不登录、不注册、打开即用
- 🆓 **零成本部�?* �?Vercel / GitHub Pages 免费�?
## 技术栈

| 层级 | 选型 |
|------|------|
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite |
| 样式 | Tailwind CSS |
| 图标 | Lucide Vue |
| 路由 | Vue Router 4 |
| 工具函数 | VueUse |
| Markdown | marked |
| 二维�?| qrcode |
| 部署 | Vercel / GitHub Pages |

## 快速开�?
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 目录结构

```
my-tools-web/
├── public/
├── src/
�?  ├── assets/
�?  ├── components/     # 公共 UI 组件
�?  ├── composables/    # 组合式函数（useCopy、useStorage 等）
�?  ├── tools/          # 各工具实�?�?  �?  ├── index.ts    # 工具注册中心
�?  �?  ├── tools.types.ts
�?  �?  └── json-formatter/
�?  ├── router/         # 路由（从 tools 自动生成�?�?  ├── utils/          # 纯工具函�?�?  ├── App.vue
�?  └── main.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## 功能规划

### 第一阶段（P0�?
- JSON 格式�?压缩
- Base64 编码/解码
- URL 编码/解码
- 时间戳转�?- 进制转换
- 文本处理
- 密码生成�?
### 第二阶段（P1�?
- Hash 计算（MD5/SHA1/SHA256�?- JWT 解析
- Markdown 预览
- 二维码生�?- 颜色转换

## 许可

MIT

## Deployment

- Vercel: add `vercel.json` (already included) and deploy the project root directly.
- GitHub Pages (Vue Router SPA fallback):
  - `public/404.html` captures direct deep links.
  - On load it rewrites the path to a root query parameter, and the app restores the route at startup.

## Changelog

- v1.4 (2026-07-29): Added tool route aliases (redirectFrom metadata) and Image Compressor alias `/tools/compress-image`.
- v1.3 (2026-07-29): Added GitHub Pages robustness files (`public/404.html`, `public/.nojekyll`) and documented manual deployment.

- v1.2 (2026-07-29): Added image compression tool registration and page, improved JWT parser (base64url), hardened markdown preview output handling, added GitHub Pages SPA fallback, and updated Vercel rewrite + deployment notes.
- v1.1 (2026-07-29): Loop 2 improvements (input/output consistency, markdown error handling, home/footer polish, private policy wording updates).

## GitHub Pages Deployment (manual)

1. Run `npm run build`.
2. Open `dist/` and upload files to your GitHub Pages branch (`gh-pages`) or use an action.
3. Ensure `public/404.html` and `public/.nojekyll` are included in the deployed artifact.

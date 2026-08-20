# My Tools Web

一个面向开发者和日常使用场景的在线工具箱。项目采用纯前端实现，常用转换、解析与生成操作均在浏览器本地完成，无需注册或登录。

在线使用：[https://fulijingjiu.github.io/tools/](https://fulijingjiu.github.io/tools/)

## 特点

- 纯前端运行：常规输入数据不会上传到后端服务器
- 开箱即用：无需账号，打开页面即可使用
- 响应式界面：支持桌面端和移动端
- 深色模式：自动适配并支持手动切换主题
- 快速检索：可按名称、说明、关键字和标签查找工具
- 按需加载：各工具页面通过动态导入加载
- 易于部署：支持 Vercel 和 GitHub Pages

## 工具列表

### 开发工具

| 工具 | 功能 |
| --- | --- |
| JSON 格式化 | 格式化、压缩并校验 JSON 文本 |
| Base64 编解码 | 在普通文本与 Base64 字符串之间转换，支持中文 |
| URL 编解码 | 编码或解码 URL 参数及特殊字符 |
| 时间戳转换 | Unix 时间戳与北京时间互转，支持秒和毫秒 |
| 进制转换 | 二进制、八进制、十进制和十六进制互转 |
| Hash 计算 | 计算文本的 SHA-1、SHA-256 和 SHA-512 哈希值 |
| JWT 解析 | 解析 JWT 的 Header 和 Payload |
| 正则表达式测试 | 实时查看匹配结果与捕获分组 |

### 文本与设计工具

| 工具 | 功能 |
| --- | --- |
| 文本处理 | 大小写转换、去重、排序、去空行和文本统计 |
| 文本差异对比 | 高亮展示两段文本的新增、删除和未变化内容 |
| Markdown 预览 | 实时渲染 Markdown，并支持导出 HTML |
| 颜色转换 | 在 HEX、RGB 和 HSL 之间转换并实时预览 |

### 图片与通用工具

| 工具 | 功能 |
| --- | --- |
| 图片压缩 | 调整图片尺寸、质量和输出格式，压缩后下载 |
| 二维码生成 | 将文本或链接生成二维码图片并下载 |
| 密码生成器 | 按长度和字符类型生成随机密码 |
| 单位换算 | 支持长度、重量、温度、面积、体积和数据存储等单位 |

## 技术栈

- Vue 3 + TypeScript
- Vite
- Vue Router
- Tailwind CSS
- VueUse
- Lucide Vue
- marked
- qrcode

## 本地运行

环境要求：Node.js 20 或更高版本，推荐使用当前 LTS 版本。

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 类型检查并构建生产版本
npm run build

# 本地预览生产构建
npm run preview
```

Windows 用户也可以双击 `start.bat`。脚本会在缺少依赖时先运行 `npm install`，随后启动开发服务器并打开浏览器。

## 质量检查

```bash
# 检查工具元数据
npm run check:tools

# 执行完整回归检查和生产构建
npm run qa:loop5
```

## 项目结构

```text
my-tools-web/
├─ doc/                    # 项目规划、质量标准和历史记录
├─ public/                 # 静态资源与 GitHub Pages 回退页
├─ scripts/                # 元数据检查和回归测试脚本
├─ src/
│  ├─ components/         # 通用 UI 组件
│  ├─ composables/        # 可复用组合式函数
│  ├─ pages/              # 首页、隐私页和 404 页面
│  ├─ router/             # 路由配置
│  └─ tools/              # 工具注册表及各工具实现
├─ package.json
├─ vercel.json            # Vercel SPA 重写配置
└─ vite.config.ts
```

每个工具位于 `src/tools/<tool-id>/`，通常包含：

- `index.ts`：名称、路径、分类、关键字和组件入口等元数据
- `index.vue`：工具页面
- `utils.ts`：可独立复用或测试的业务逻辑（按需提供）

新增工具后，需要在 `src/tools/index.ts` 中注册，并运行 `npm run check:tools` 验证元数据。

## 项目文档

内部规划、代码执行计划、回归标准和历史记录统一收录在[文档索引](doc/文档索引.md)。

## 部署

### Vercel

将仓库导入 Vercel，使用默认的 Vite 构建配置即可：

- Build Command：`npm run build`
- Output Directory：`dist`

项目中的 `vercel.json` 已配置单页应用路由回退。

### GitHub Pages

```bash
npm run build:pages
```

推送到 `main` 后，GitHub Actions 会完成检查、构建并自动部署到
[https://fulijingjiu.github.io/tools/](https://fulijingjiu.github.io/tools/)。
`public/404.html` 和 `public/.nojekyll` 用于支持直接访问前端路由。

## 隐私说明

工具的核心处理逻辑运行在浏览器本地。项目没有业务后端，但部署平台仍可能按照其服务策略记录常规访问日志。请勿在不了解运行环境的情况下处理高度敏感的信息。

## 许可证

本项目采用 [MIT License](LICENSE)。

# Yu Mail - 临时邮箱接码平台

一个现代化的临时邮箱服务平台，支持多域名选择，保护您的隐私。

## ✨ 功能特性

- 🎯 **三级域名支持**: 支持 xieziji.shop 的多个三级域名（cheyu、yumail、tempmail、mail）
- 🔄 **随机生成**: 一键生成随机临时邮箱地址
- 📧 **实时接收**: 实时接收和显示邮件内容
- 📋 **快速复制**: 一键复制邮箱地址到剪贴板
- 🔃 **自动刷新**: 自动刷新邮件列表，无需手动操作
- 📱 **响应式设计**: 完美支持桌面端和移动端
- 🎨 **现代化UI**: 基于 Tailwind CSS 的美观界面

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 运行开发服务器

```bash
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 📸 界面预览

- **邮箱生成**: 选择域名，一键生成临时邮箱
- **收件箱**: 清晰的邮件列表展示
- **邮件详情**: 完整的邮件内容查看

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **HTTP 客户端**: Axios

## 📦 项目结构

```
youxiang/
├── app/
│   ├── api/
│   │   ├── emails/route.ts      # 邮件接收API
│   │   └── generate/route.ts    # 邮箱生成API
│   ├── layout.tsx               # 根布局
│   ├── page.tsx                 # 主页面
│   └── globals.css              # 全局样式
├── public/                      # 静态资源
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

## 🔧 配置说明

### 三级域名配置

在 `app/page.tsx` 中修改 `SUBDOMAINS` 数组来添加或修改支持的三级域名：

```typescript
const SUBDOMAINS = [
  'cheyu',
  'yumail',
  'tempmail',
  'mail',
  'temp',
  'inbox',
  'email',
  'box',
  'msg'
]

const BASE_DOMAIN = 'xieziji.shop'
```

这样会生成如下格式的邮箱：
- xxx@cheyu.xieziji.shop
- xxx@yumail.xieziji.shop
- xxx@tempmail.xieziji.shop
- xxx@mail.xieziji.shop
- xxx@temp.xieziji.shop
- xxx@inbox.xieziji.shop
- xxx@email.xieziji.shop
- xxx@box.xieziji.shop
- xxx@msg.xieziji.shop

### 邮件服务器配置

详细的邮件服务器配置请参考 [SETUP.md](./SETUP.md)

## 🌐 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 在 Vercel 中导入项目
3. 自动部署完成

### Docker 部署

```bash
docker build -t temp-mail .
docker run -p 3000:3000 temp-mail
```

### 传统服务器部署

```bash
npm run build
pm2 start npm --name "temp-mail" -- start
```

## 📝 API 接口

### 获取邮件列表

```
GET /api/emails?address=xxx@xieziji.shop
```

### 接收新邮件

```
POST /api/emails
Content-Type: application/json

{
  "to": "xxx@xieziji.shop",
  "from": "sender@example.com",
  "subject": "邮件主题",
  "content": "邮件内容"
}
```

### 删除邮件

```
DELETE /api/emails?address=xxx@xieziji.shop&id=123
```

## 🔐 安全建议

- 启用 HTTPS
- 配置 CORS 限制
- 添加速率限制
- 定期清理过期邮件
- 添加垃圾邮件过滤

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请通过 Issue 联系。


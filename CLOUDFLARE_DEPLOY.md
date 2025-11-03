# 🚀 Cloudflare Pages 部署指南

使用 Cloudflare Pages 部署你的临时邮箱平台，完全免费！

## ✅ 为什么选择 Cloudflare Pages？

- ✅ **完全免费** - 无需服务器费用
- ✅ **自动 HTTPS** - 免费 SSL 证书
- ✅ **全球 CDN** - 访问速度快
- ✅ **自定义域名** - 支持 xieziji.shop
- ✅ **自动部署** - 推送代码自动更新
- ✅ **无限带宽** - 不限流量

## 📋 部署步骤

### 第一步：准备 GitHub 仓库

1. **创建 GitHub 账号**（如果还没有）
   - 访问：https://github.com
   - 注册账号

2. **创建新仓库**
   - 点击右上角 `+` → `New repository`
   - 仓库名：`youxiang-temp-mail`
   - 选择 `Public`（公开）
   - 点击 `Create repository`

3. **上传代码到 GitHub**
   
   在你的项目文件夹中打开命令行（以管理员身份）：
   
   ```bash
   # 初始化 Git
   git init
   
   # 添加所有文件
   git add .
   
   # 提交
   git commit -m "Initial commit"
   
   # 连接到 GitHub（替换成你的用户名）
   git remote add origin https://github.com/你的用户名/youxiang-temp-mail.git
   
   # 推送代码
   git branch -M main
   git push -u origin main
   ```

### 第二步：连接 Cloudflare Pages

1. **登录 Cloudflare**
   - 访问：https://dash.cloudflare.com
   - 如果没有账号，先注册一个（免费）

2. **添加域名到 Cloudflare**
   - 点击 `添加站点`
   - 输入：`xieziji.shop`
   - 选择 `Free` 计划
   - 按照提示修改域名的 DNS 服务器（在你购买域名的地方修改）

3. **创建 Pages 项目**
   - 在 Cloudflare 控制台，点击左侧 `Workers 和 Pages`
   - 点击 `创建应用程序`
   - 选择 `Pages` → `连接到 Git`
   - 授权 GitHub 访问
   - 选择你的仓库：`youxiang-temp-mail`

4. **配置构建设置**
   ```
   框架预设：Next.js
   构建命令：npm run build
   构建输出目录：.next
   Node.js 版本：18
   ```

5. **点击 `保存并部署`**

### 第三步：配置自定义域名

1. **在 Cloudflare Pages 项目中**
   - 部署完成后，点击 `自定义域`
   - 点击 `设置自定义域`

2. **添加主域名**
   - 输入：`xieziji.shop`
   - 点击 `激活域`
   - Cloudflare 会自动配置 DNS

3. **添加子域名（支持通配符）**
   - 再次点击 `设置自定义域`
   - 输入：`*.xieziji.shop`
   - 点击 `激活域`
   
   这样所有子域名都会指向你的应用：
   - `cheyu.xieziji.shop`
   - `yumail.xieziji.shop`
   - `tempmail.xieziji.shop`
   - `mail.xieziji.shop`

### 第四步：等待 DNS 生效

- DNS 生效通常需要 5-30 分钟
- 完成后，你就可以通过 `https://xieziji.shop` 访问你的网站了！

## 🎯 访问你的网站

部署成功后，你可以通过以下地址访问：

- **主域名**：https://xieziji.shop
- **子域名**：
  - https://cheyu.xieziji.shop
  - https://yumail.xieziji.shop
  - https://tempmail.xieziji.shop
  - https://mail.xieziji.shop

## 🔄 自动更新

以后每次修改代码，只需要：

```bash
git add .
git commit -m "更新说明"
git push
```

Cloudflare Pages 会自动检测到更新并重新部署！

## ⚠️ 重要提示

### 关于邮件接收功能

Cloudflare Pages 是**静态网站托管 + Serverless 函数**，有一些限制：

1. **API Routes 支持**
   - Next.js 的 API Routes 在 Cloudflare Pages 上需要使用 `@cloudflare/next-on-pages` 适配器
   - 或者改用 Cloudflare Workers/Functions

2. **邮件接收**
   - 需要配置 Cloudflare Email Routing（免费）
   - 或使用第三方邮件 API（如 Mailgun, SendGrid）

### 推荐方案：使用 Cloudflare Email Workers

Cloudflare 提供免费的 Email Workers 功能，可以接收邮件：

1. 在 Cloudflare 控制台 → `Email` → `Email Routing`
2. 启用 Email Routing
3. 配置 MX 记录（自动配置）
4. 创建 Email Worker 处理邮件

详细配置我可以帮你完成！

## 🆘 需要帮助？

如果遇到问题：

1. **构建失败**：检查 Node.js 版本是否为 18
2. **域名无法访问**：等待 DNS 生效（最多 24 小时）
3. **HTTPS 证书问题**：Cloudflare 会自动配置，稍等片刻

## 📝 下一步

部署完成后，你可能需要：

- [ ] 配置 Cloudflare Email Routing 接收邮件
- [ ] 设置环境变量
- [ ] 配置数据库（如果需要持久化存储）
- [ ] 添加分析统计

需要我帮你配置这些吗？


# 临时邮箱平台部署指南

## 项目概述
这是一个基于 Next.js 的临时邮箱接码平台，支持多个三级域名选择。

## 功能特性
- ✅ 支持多个域名选择（886178.xyz, 88617.xyz, 886178.shop, xieziji.shop）
- ✅ 随机生成临时邮箱地址
- ✅ 实时接收和显示邮件
- ✅ 一键复制邮箱地址
- ✅ 自动刷新邮件列表
- ✅ 响应式设计，支持移动端

## 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

## 运行开发服务器

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 域名配置

### 1. DNS 配置
为每个域名添加以下 DNS 记录：

#### A 记录（指向你的服务器IP）
```
xieziji.shop        A    你的服务器IP
*.xieziji.shop      A    你的服务器IP
886178.xyz          A    你的服务器IP
*.886178.xyz        A    你的服务器IP
88617.xyz           A    你的服务器IP
*.88617.xyz         A    你的服务器IP
886178.shop         A    你的服务器IP
*.886178.shop       A    你的服务器IP
```

#### MX 记录（邮件服务器）
```
xieziji.shop        MX   10 mail.xieziji.shop
886178.xyz          MX   10 mail.886178.xyz
88617.xyz           MX   10 mail.88617.xyz
886178.shop         MX   10 mail.886178.shop
```

### 2. 邮件服务器配置

#### 方案一：使用 Postfix + Dovecot（推荐）

安装 Postfix：
```bash
sudo apt update
sudo apt install postfix dovecot-core dovecot-imapd
```

配置 Postfix (`/etc/postfix/main.cf`)：
```
myhostname = mail.xieziji.shop
mydomain = xieziji.shop
myorigin = $mydomain
inet_interfaces = all
mydestination = $myhostname, localhost.$mydomain, localhost, $mydomain
virtual_alias_domains = xieziji.shop, 886178.xyz, 88617.xyz, 886178.shop
virtual_alias_maps = regexp:/etc/postfix/virtual_regexp

# 接收所有邮件
local_recipient_maps =
```

配置虚拟别名 (`/etc/postfix/virtual_regexp`)：
```
/@(xieziji\.shop|886178\.xyz|88617\.xyz|886178\.shop)$/  catchall@localhost
```

配置邮件转发到 API：
创建 `/etc/postfix/master.cf` 添加：
```
smtp      inet  n       -       y       -       -       smtpd
  -o content_filter=api-forward:dummy

api-forward unix -      n       n       -       -       pipe
  flags=F user=www-data argv=/usr/local/bin/forward-to-api.sh ${sender} ${recipient}
```

创建转发脚本 (`/usr/local/bin/forward-to-api.sh`)：
```bash
#!/bin/bash
FROM=$1
TO=$2
CONTENT=$(cat)

curl -X POST http://localhost:3000/api/emails \
  -H "Content-Type: application/json" \
  -d "{
    \"from\": \"$FROM\",
    \"to\": \"$TO\",
    \"subject\": \"$(echo "$CONTENT" | grep -m1 "^Subject:" | cut -d' ' -f2-)\",
    \"content\": \"$(echo "$CONTENT" | sed -n '/^$/,$p')\"
  }"
```

赋予执行权限：
```bash
sudo chmod +x /usr/local/bin/forward-to-api.sh
```

重启服务：
```bash
sudo systemctl restart postfix
```

#### 方案二：使用第三方邮件服务

可以使用以下服务：
- **Mailgun**: 提供 API 接收邮件
- **SendGrid**: 支持 Inbound Parse
- **Amazon SES**: 可配置接收规则

配置 Webhook 指向：`https://yourdomain.com/api/emails`

### 3. 生产环境部署

#### 使用 Vercel 部署（推荐）
```bash
npm install -g vercel
vercel
```

#### 使用 Docker 部署
创建 `Dockerfile`：
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

构建和运行：
```bash
docker build -t temp-mail .
docker run -p 3000:3000 temp-mail
```

#### 使用 PM2 部署
```bash
npm install -g pm2
npm run build
pm2 start npm --name "temp-mail" -- start
pm2 save
pm2 startup
```

### 4. Nginx 反向代理配置

```nginx
server {
    listen 80;
    server_name xieziji.shop *.xieziji.shop;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5. SSL 证书配置

使用 Let's Encrypt：
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d xieziji.shop -d *.xieziji.shop
```

## 数据持久化

当前版本使用内存存储，重启后数据会丢失。生产环境建议使用：

### Redis
```bash
npm install redis
```

### MongoDB
```bash
npm install mongodb
```

### PostgreSQL
```bash
npm install pg
```

## 环境变量

创建 `.env.local` 文件：
```
NEXT_PUBLIC_API_URL=https://xieziji.shop
DATABASE_URL=your_database_url
REDIS_URL=your_redis_url
```

## 安全建议

1. 启用 HTTPS
2. 配置 CORS 限制
3. 添加速率限制
4. 定期清理过期邮件
5. 添加垃圾邮件过滤

## 监控和日志

建议使用：
- **Sentry**: 错误追踪
- **LogRocket**: 用户行为分析
- **Google Analytics**: 访问统计

## 技术栈

- **前端**: Next.js 14 + React 18 + TypeScript
- **样式**: Tailwind CSS
- **图标**: Lucide React
- **部署**: Vercel / Docker / PM2

## 许可证

MIT


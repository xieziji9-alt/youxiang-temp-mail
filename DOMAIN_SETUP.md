# xieziji.shop 域名配置指南

## 域名概述

主域名: **xieziji.shop**
支持的三级域名（共9个）:
- cheyu.xieziji.shop
- yumail.xieziji.shop
- tempmail.xieziji.shop
- mail.xieziji.shop
- temp.xieziji.shop
- inbox.xieziji.shop
- email.xieziji.shop
- box.xieziji.shop
- msg.xieziji.shop

## DNS 配置步骤

### 1. 登录域名管理后台

访问你的域名注册商（如阿里云、腾讯云、Cloudflare等）的管理后台。

### 2. 添加 A 记录

为主域名和通配符子域名添加 A 记录：

| 主机记录 | 记录类型 | 记录值 | TTL |
|---------|---------|--------|-----|
| @ | A | 你的服务器IP | 600 |
| * | A | 你的服务器IP | 600 |

**示例（假设服务器IP为 123.45.67.89）：**

```
xieziji.shop        A    123.45.67.89
*.xieziji.shop      A    123.45.67.89
```

这样配置后，以下域名都会指向你的服务器：
- xieziji.shop
- cheyu.xieziji.shop
- yumail.xieziji.shop
- tempmail.xieziji.shop
- mail.xieziji.shop
- temp.xieziji.shop
- inbox.xieziji.shop
- email.xieziji.shop
- box.xieziji.shop
- msg.xieziji.shop
- 任意前缀.xieziji.shop

### 3. 添加 MX 记录（邮件服务器）

| 主机记录 | 记录类型 | 优先级 | 记录值 | TTL |
|---------|---------|--------|--------|-----|
| @ | MX | 10 | mail.xieziji.shop | 600 |

**示例：**

```
xieziji.shop        MX   10   mail.xieziji.shop
```

### 4. 添加 TXT 记录（SPF，防止邮件被标记为垃圾邮件）

| 主机记录 | 记录类型 | 记录值 | TTL |
|---------|---------|--------|-----|
| @ | TXT | v=spf1 mx ~all | 600 |

### 5. 添加 DKIM 记录（可选，提高邮件送达率）

```
default._domainkey.xieziji.shop    TXT    "v=DKIM1; k=rsa; p=你的公钥"
```

## 完整 DNS 配置示例

假设服务器 IP 为 `123.45.67.89`：

```
# A 记录
xieziji.shop                    A       123.45.67.89
*.xieziji.shop                  A       123.45.67.89

# MX 记录
xieziji.shop                    MX      10 mail.xieziji.shop

# TXT 记录（SPF）
xieziji.shop                    TXT     "v=spf1 mx ~all"

# TXT 记录（DMARC，可选）
_dmarc.xieziji.shop            TXT     "v=DMARC1; p=none; rua=mailto:admin@xieziji.shop"
```

## 三级域名说明

配置了通配符 A 记录（*.xieziji.shop）后，所有三级域名都会自动生效：

- cheyu.xieziji.shop → 自动指向服务器
- yumail.xieziji.shop → 自动指向服务器
- tempmail.xieziji.shop → 自动指向服务器
- mail.xieziji.shop → 自动指向服务器

**无需为每个三级域名单独配置 DNS 记录！**

如果需要添加新的三级域名，只需在代码中修改 `SUBDOMAINS` 数组即可。

## 验证 DNS 配置

### 使用 nslookup（Windows）

```cmd
# 查询 A 记录
nslookup xieziji.shop

# 查询 MX 记录
nslookup -type=mx xieziji.shop

# 查询 TXT 记录
nslookup -type=txt xieziji.shop
```

### 使用 dig（Linux/Mac）

```bash
# 查询 A 记录
dig xieziji.shop A

# 查询 MX 记录
dig xieziji.shop MX

# 查询 TXT 记录
dig xieziji.shop TXT
```

### 在线工具

- [DNSChecker](https://dnschecker.org/) - 全球 DNS 传播检查
- [MXToolbox](https://mxtoolbox.com/) - 邮件服务器检查
- [IntoDNS](https://intodns.com/) - DNS 健康检查

## DNS 生效时间

- **TTL 600**: 10分钟
- **一般情况**: 10分钟 - 2小时
- **全球传播**: 24-48小时

## 常见问题

### Q: DNS 配置后多久生效？
A: 通常 10 分钟到 2 小时，全球传播可能需要 24-48 小时。

### Q: 如何加速 DNS 生效？
A: 
1. 设置较短的 TTL 值（如 600 秒）
2. 使用 Cloudflare 等 CDN 服务
3. 清除本地 DNS 缓存：`ipconfig /flushdns`（Windows）

### Q: 通配符域名是否安全？
A: 对于临时邮箱服务，通配符域名是必需的。确保：
1. 服务器有防火墙保护
2. 应用层有安全验证
3. 定期更新系统和软件

### Q: 需要配置反向 DNS（PTR）吗？
A: 如果要发送邮件，建议配置。联系你的服务器提供商设置 PTR 记录。

## SSL 证书配置

### 使用 Let's Encrypt（免费）

```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx

# 为主域名和通配符域名申请证书
sudo certbot certonly --manual --preferred-challenges dns \
  -d xieziji.shop -d *.xieziji.shop

# 按提示添加 TXT 记录验证域名所有权
```

### 使用 Cloudflare（推荐）

1. 将域名 NS 记录指向 Cloudflare
2. 在 Cloudflare 开启 SSL/TLS
3. 自动获得免费 SSL 证书
4. 额外获得 CDN 加速和 DDoS 防护

## Cloudflare 配置步骤

1. 注册 Cloudflare 账号
2. 添加站点 xieziji.shop
3. 修改域名 NS 记录为 Cloudflare 提供的 NS
4. 在 Cloudflare DNS 页面添加上述记录
5. 在 SSL/TLS 页面选择"完全"或"完全（严格）"
6. 开启"始终使用 HTTPS"

## 邮件服务器配置

详细的邮件服务器配置请参考 [SETUP.md](./SETUP.md)

主要步骤：
1. 安装 Postfix 邮件服务器
2. 配置接收所有邮件
3. 转发邮件到应用 API
4. 配置 SPF、DKIM、DMARC

## 测试邮件接收

配置完成后，测试邮件接收：

```bash
# 使用 telnet 测试
telnet mail.xieziji.shop 25

# 发送测试邮件
HELO test.com
MAIL FROM: test@test.com
RCPT TO: test123@xieziji.shop
DATA
Subject: Test
This is a test email.
.
QUIT
```

## 监控和维护

### 监控工具
- **UptimeRobot**: 监控网站可用性
- **Pingdom**: 性能监控
- **StatusCake**: 免费监控服务

### 日志查看
```bash
# 查看 Postfix 日志
sudo tail -f /var/log/mail.log

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
```

## 安全建议

1. **启用 HTTPS**: 使用 SSL 证书
2. **配置防火墙**: 只开放必要端口（80, 443, 25）
3. **限制发送**: 防止被用于垃圾邮件
4. **定期备份**: 备份配置和数据
5. **监控日志**: 及时发现异常

## 相关文档

- [README.md](./README.md) - 项目概述
- [SETUP.md](./SETUP.md) - 详细部署指南
- [INSTALL.md](./INSTALL.md) - 安装指南


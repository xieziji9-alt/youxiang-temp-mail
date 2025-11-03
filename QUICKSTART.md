# 快速开始指南

## 🚀 5分钟快速启动

### Windows 用户

1. **双击运行开发服务器**
   ```
   双击 dev.bat 文件
   ```

2. **打开浏览器**
   ```
   访问 http://localhost:3000
   ```

就这么简单！

### 手动启动（所有平台）

```bash
# 1. 安装依赖（首次运行）
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
# http://localhost:3000
```

## 📱 使用说明

### 1. 生成临时邮箱

- 选择一个三级域名（默认：cheyu.xieziji.shop）
- 系统自动生成随机邮箱地址
- 点击"复制"按钮复制邮箱地址

### 2. 使用邮箱接收邮件

- 在任何网站使用复制的邮箱地址
- 邮件会自动显示在收件箱
- 点击邮件查看详细内容

### 3. 管理邮件

- 点击刷新按钮手动刷新
- 点击垃圾桶图标删除邮件
- 系统每5秒自动刷新

### 4. 更换邮箱

- 点击"换一个"按钮生成新邮箱
- 或选择不同的三级域名自动生成

## 🎯 功能演示

### 界面布局

```
┌─────────────────────────────────────────────────────────┐
│  Yu Mail                          临时邮箱 · 保护隐私     │
├─────────────────────────────────────────────────────────┤
│  生成临时邮箱                                             │
│  ┌───────────────────────────────────────────────┐      │
│  │ 选择三级域名                                    │      │
│  │ [@cheyu.xieziji.shop] [@yumail.xieziji.shop]  │      │
│  │ [@tempmail.xieziji.shop] [@mail.xieziji.shop] │      │
│  └───────────────────────────────────────────────┘      │
│  ┌───────────────────────────────────────────────┐      │
│  │ abc123@cheyu.xieziji.shop  [复制] [换一个]     │      │
│  └───────────────────────────────────────────────┘      │
├──────────────┬──────────────────────────────────────────┤
│ 收件箱 (1) 🔄│  邮件详情                                 │
│              │                                          │
│ ✉ service@   │  欢迎使用临时邮箱服务                      │
│   欢迎使用... │                                          │
│   10:30      │  发件人: service@example.com             │
│              │  时间: 2024-01-01 10:30                  │
│              │                                          │
│              │  这是一封测试邮件...                      │
└──────────────┴──────────────────────────────────────────┘
```

## 🔧 常见问题

### Q: 如何测试邮件接收？

A: 有几种方式：

1. **使用在线邮件发送工具**
   - 访问 [https://www.gmass.co/smtp-test](https://www.gmass.co/smtp-test)
   - 输入你的临时邮箱地址
   - 发送测试邮件

2. **使用其他邮箱发送**
   - 用你的 Gmail/QQ邮箱等
   - 发送邮件到临时邮箱地址

3. **使用命令行**
   ```bash
   # Linux/Mac
   echo "Test email" | mail -s "Test" your-temp-email@xieziji.shop
   ```

### Q: 为什么收不到邮件？

A: 可能的原因：

1. **邮件服务器未配置**
   - 当前版本需要配置邮件服务器
   - 查看 [SETUP.md](./SETUP.md) 了解配置方法

2. **DNS 未生效**
   - 检查域名 DNS 配置
   - 等待 DNS 传播（最多48小时）

3. **防火墙阻止**
   - 确保端口 25 开放
   - 检查服务器防火墙设置

### Q: 邮件会保存多久？

A: 
- 默认保存 24 小时
- 每个邮箱最多保存 50 封邮件
- 可在 `.env` 文件中修改

### Q: 可以发送邮件吗？

A: 
- 当前版本仅支持接收邮件
- 不支持发送邮件
- 这是临时邮箱的设计初衷

### Q: 安全吗？

A: 
- ⚠️ 不要用于重要账号注册
- ⚠️ 邮件内容可能被他人看到
- ✅ 适合接收验证码、测试邮件
- ✅ 保护你的真实邮箱地址

## 📊 性能优化

### 开发环境
- 热重载：修改代码自动刷新
- 快速编译：使用 Turbopack
- 实时预览：即时查看效果

### 生产环境
```bash
# 构建优化版本
npm run build

# 启动生产服务器
npm start
```

优化效果：
- 更快的加载速度
- 更小的文件体积
- 更好的 SEO

## 🎨 自定义配置

### 修改三级域名列表

编辑 `app/page.tsx`：

```typescript
const SUBDOMAINS = [
  'cheyu',
  'yumail',
  'tempmail',
  'mail',
  'your-subdomain'  // 添加你的三级域名
]

const BASE_DOMAIN = 'xieziji.shop'
```

### 修改自动刷新间隔

编辑 `app/page.tsx`：

```typescript
// 从 5000 毫秒（5秒）改为 10000 毫秒（10秒）
useEffect(() => {
  if (autoRefresh && emailAddress) {
    const interval = setInterval(refreshEmails, 10000)  // 修改这里
    return () => clearInterval(interval)
  }
}, [autoRefresh, emailAddress])
```

### 修改主题颜色

编辑 `tailwind.config.ts`：

```typescript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',    // 蓝色，改为你喜欢的颜色
      secondary: '#1e293b',  // 深灰色
    },
  },
}
```

## 📦 项目结构

```
youxiang/
├── app/                    # Next.js App Router
│   ├── api/               # API 路由
│   │   ├── emails/        # 邮件接收API
│   │   └── generate/      # 邮箱生成API
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 主页面
│   └── globals.css        # 全局样式
├── public/                # 静态资源
├── .env.example           # 环境变量示例
├── dev.bat                # Windows 开发启动脚本
├── start.bat              # Windows 生产启动脚本
├── package.json           # 项目配置
├── README.md              # 项目说明
├── QUICKSTART.md          # 快速开始（本文件）
├── INSTALL.md             # 安装指南
├── SETUP.md               # 部署指南
└── DOMAIN_SETUP.md        # 域名配置指南
```

## 🔗 相关链接

- **项目说明**: [README.md](./README.md)
- **安装指南**: [INSTALL.md](./INSTALL.md)
- **部署指南**: [SETUP.md](./SETUP.md)
- **域名配置**: [DOMAIN_SETUP.md](./DOMAIN_SETUP.md)

## 💡 提示

1. **首次运行**：需要安装依赖，可能需要几分钟
2. **端口占用**：如果 3000 端口被占用，修改为其他端口
3. **网络问题**：如果安装慢，使用国内镜像源
4. **权限问题**：以管理员身份运行命令提示符

## 🎉 开始使用

现在你已经了解了基本使用方法，开始体验吧！

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 🚀


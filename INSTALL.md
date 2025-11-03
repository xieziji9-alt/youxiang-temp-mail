# 安装指南

## 遇到 npm 权限问题？

如果遇到 `EPERM: operation not permitted` 错误，请尝试以下解决方案：

### 方案 1: 以管理员身份运行

1. 右键点击命令提示符或 PowerShell
2. 选择"以管理员身份运行"
3. 导航到项目目录
4. 运行安装命令

```bash
cd d:\code\idea\ideaPrograms\youxiang
npm install
```

### 方案 2: 清理 npm 缓存

```bash
# 清理 npm 缓存
npm cache clean --force

# 重新安装
npm install
```

### 方案 3: 修改 npm 缓存目录

```bash
# 在项目目录下创建本地缓存
npm config set cache ./npm-cache --global

# 重新安装
npm install
```

### 方案 4: 使用 yarn 或 pnpm

#### 使用 yarn
```bash
# 安装 yarn
npm install -g yarn

# 使用 yarn 安装依赖
yarn install

# 运行项目
yarn dev
```

#### 使用 pnpm
```bash
# 安装 pnpm
npm install -g pnpm

# 使用 pnpm 安装依赖
pnpm install

# 运行项目
pnpm dev
```

### 方案 5: 关闭杀毒软件

某些杀毒软件可能会阻止 npm 访问缓存目录，尝试：
1. 临时关闭杀毒软件
2. 将项目目录添加到杀毒软件的白名单
3. 重新运行安装命令

## 安装步骤

### 1. 安装依赖

选择以下任一方式：

```bash
# 使用 npm
npm install

# 或使用 yarn
yarn install

# 或使用 pnpm
pnpm install
```

### 2. 运行开发服务器

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev
```

### 3. 访问应用

打开浏览器访问: [http://localhost:3000](http://localhost:3000)

## 依赖列表

项目主要依赖：

- **next**: ^14.0.0 - React 框架
- **react**: ^18.2.0 - UI 库
- **react-dom**: ^18.2.0 - React DOM 渲染
- **axios**: ^1.6.0 - HTTP 客户端
- **lucide-react**: ^0.294.0 - 图标库
- **typescript**: ^5.0.0 - TypeScript 支持
- **tailwindcss**: ^3.3.0 - CSS 框架

## 手动安装依赖（备选方案）

如果自动安装失败，可以手动下载依赖：

1. 访问 [https://www.npmjs.com/](https://www.npmjs.com/)
2. 搜索并下载所需的包
3. 手动放置到 `node_modules` 目录

或者使用离线安装：

```bash
# 在有网络的机器上打包依赖
npm pack

# 在目标机器上安装
npm install ./package-name.tgz
```

## 验证安装

安装完成后，检查 `node_modules` 目录是否存在：

```bash
# Windows
dir node_modules

# Linux/Mac
ls node_modules
```

应该看到以下主要目录：
- next
- react
- react-dom
- axios
- lucide-react
- tailwindcss

## 常见问题

### Q: 安装速度很慢？
A: 尝试使用国内镜像源：
```bash
npm config set registry https://registry.npmmirror.com
```

### Q: 端口 3000 被占用？
A: 修改端口：
```bash
# Windows
set PORT=3001 && npm run dev

# Linux/Mac
PORT=3001 npm run dev
```

### Q: TypeScript 报错？
A: 确保安装了所有类型定义：
```bash
npm install --save-dev @types/node @types/react @types/react-dom
```

## 获取帮助

如果仍然遇到问题：
1. 查看 [README.md](./README.md) 了解项目概述
2. 查看 [SETUP.md](./SETUP.md) 了解部署配置
3. 在 GitHub 上提交 Issue


@echo off
chcp 65001 >nul
echo ========================================
echo    GitHub 配置助手
echo ========================================
echo.
echo 这个脚本会帮助你配置 GitHub 认证
echo.

REM 检查 Git 是否安装
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到 Git！
    echo.
    echo 请先安装 Git:
    echo 下载地址: https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)

echo ✓ Git 已安装
echo.

REM 配置用户信息
echo [1/3] 配置 Git 用户信息
echo.
set /p git_name="请输入你的 GitHub 用户名: "
set /p git_email="请输入你的 GitHub 邮箱: "

git config --global user.name "%git_name%"
git config --global user.email "%git_email%"

echo ✓ 用户信息配置完成
echo.

REM 配置认证方式
echo [2/3] 配置认证方式
echo.
echo 选择认证方式:
echo 1. Personal Access Token (推荐)
echo 2. SSH Key
echo 3. GitHub Desktop (最简单)
echo.
set /p auth_choice="请选择 (1/2/3): "

if "%auth_choice%"=="1" (
    echo.
    echo === Personal Access Token 配置 ===
    echo.
    echo 步骤:
    echo 1. 访问: https://github.com/settings/tokens
    echo 2. 点击 "Generate new token" → "Generate new token (classic)"
    echo 3. 勾选 "repo" 权限
    echo 4. 点击 "Generate token"
    echo 5. 复制生成的 token
    echo.
    echo 使用方法:
    echo 推送时，用户名输入你的 GitHub 用户名
    echo 密码输入刚才复制的 token
    echo.
    echo 按任意键打开 GitHub Token 页面...
    pause >nul
    start https://github.com/settings/tokens
    echo.
) else if "%auth_choice%"=="2" (
    echo.
    echo === SSH Key 配置 ===
    echo.
    echo 步骤:
    echo 1. 生成 SSH Key:
    echo    ssh-keygen -t ed25519 -C "%git_email%"
    echo.
    echo 2. 复制公钥:
    echo    type %USERPROFILE%\.ssh\id_ed25519.pub
    echo.
    echo 3. 添加到 GitHub:
    echo    https://github.com/settings/keys
    echo.
    echo 按任意键打开 GitHub SSH 设置页面...
    pause >nul
    start https://github.com/settings/keys
    echo.
) else if "%auth_choice%"=="3" (
    echo.
    echo === GitHub Desktop 配置 ===
    echo.
    echo GitHub Desktop 是最简单的方式！
    echo.
    echo 步骤:
    echo 1. 下载并安装 GitHub Desktop
    echo 2. 登录你的 GitHub 账号
    echo 3. 在 GitHub Desktop 中打开这个项目
    echo 4. 点击 "Publish repository" 发布到 GitHub
    echo.
    echo 按任意键打开 GitHub Desktop 下载页面...
    pause >nul
    start https://desktop.github.com/
    echo.
) else (
    echo 无效的选择
    pause
    exit /b 1
)

echo [3/3] 创建 GitHub 仓库
echo.
echo 请在 GitHub 上创建一个新仓库:
echo.
echo 步骤:
echo 1. 访问: https://github.com/new
echo 2. 仓库名: youxiang-temp-mail
echo 3. 选择 Public (公开)
echo 4. 不要勾选任何初始化选项
echo 5. 点击 "Create repository"
echo.
echo 按任意键打开 GitHub 创建仓库页面...
pause >nul
start https://github.com/new
echo.

echo ========================================
echo ✓ 配置完成！
echo ========================================
echo.
echo 下一步:
echo 1. 完成 GitHub 仓库创建
echo 2. 运行 deploy.bat 推送代码
echo.
pause


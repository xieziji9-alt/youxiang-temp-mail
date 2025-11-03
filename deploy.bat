@echo off
chcp 65001 >nul
echo ========================================
echo    临时邮箱平台 - 一键部署到 GitHub
echo ========================================
echo.

REM 检查是否已经初始化 Git
if not exist ".git" (
    echo [1/5] 初始化 Git 仓库...
    git init
    echo ✓ Git 仓库初始化完成
    echo.
) else (
    echo [1/5] Git 仓库已存在，跳过初始化
    echo.
)

REM 添加所有文件
echo [2/5] 添加文件到 Git...
git add .
echo ✓ 文件添加完成
echo.

REM 提交
echo [3/5] 提交更改...
set /p commit_msg="请输入提交说明 (直接回车使用默认): "
if "%commit_msg%"=="" set commit_msg=Update: 部署临时邮箱平台
git commit -m "%commit_msg%"
echo ✓ 提交完成
echo.

REM 检查是否已配置远程仓库
git remote -v | findstr "origin" >nul
if errorlevel 1 (
    echo [4/5] 配置远程仓库...
    echo.
    echo 请输入你的 GitHub 仓库地址
    echo 格式: https://github.com/你的用户名/youxiang-temp-mail.git
    echo.
    set /p repo_url="GitHub 仓库地址: "
    git remote add origin %repo_url%
    echo ✓ 远程仓库配置完成
    echo.
) else (
    echo [4/5] 远程仓库已配置，跳过
    echo.
)

REM 推送到 GitHub
echo [5/5] 推送到 GitHub...
git branch -M main
git push -u origin main
echo.

if errorlevel 1 (
    echo ❌ 推送失败！
    echo.
    echo 可能的原因:
    echo 1. 仓库地址错误
    echo 2. 没有权限（需要配置 GitHub 认证）
    echo 3. 网络问题
    echo.
    echo 解决方案:
    echo 1. 检查仓库地址是否正确
    echo 2. 配置 GitHub Personal Access Token
    echo 3. 或使用 GitHub Desktop 推送
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✓ 部署成功！
echo ========================================
echo.
echo 下一步:
echo 1. 访问 https://dash.cloudflare.com
echo 2. 进入 Workers 和 Pages
echo 3. 创建新应用 → 连接 Git
echo 4. 选择你的仓库并部署
echo.
echo 详细步骤请查看: CLOUDFLARE_DEPLOY.md
echo ========================================
echo.
pause


@echo off
echo ================================
echo Yu Mail - 临时邮箱接码平台
echo ================================
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo [1/3] 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo.
        echo 安装失败！请查看 INSTALL.md 了解解决方案
        pause
        exit /b 1
    )
) else (
    echo [1/3] 依赖已安装
)

echo.
echo [2/3] 正在构建项目...
call npm run build
if errorlevel 1 (
    echo.
    echo 构建失败！
    pause
    exit /b 1
)

echo.
echo [3/3] 正在启动服务器...
echo.
echo 服务器将在 http://localhost:3000 启动
echo 按 Ctrl+C 停止服务器
echo.

call npm start


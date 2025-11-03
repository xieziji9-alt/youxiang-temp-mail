@echo off
echo ================================
echo Yu Mail - 开发模式
echo ================================
echo.

REM 检查 node_modules 是否存在
if not exist "node_modules" (
    echo [1/2] 正在安装依赖...
    call npm install
    if errorlevel 1 (
        echo.
        echo 安装失败！请查看 INSTALL.md 了解解决方案
        pause
        exit /b 1
    )
) else (
    echo [1/2] 依赖已安装
)

echo.
echo [2/2] 正在启动开发服务器...
echo.
echo 开发服务器将在 http://localhost:3000 启动
echo 支持热重载，修改代码后自动刷新
echo 按 Ctrl+C 停止服务器
echo.

call npm run dev


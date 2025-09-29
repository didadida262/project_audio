@echo off
chcp 65001 >nul
title 变声器 - 启动脚本

echo.
echo ========================================
echo           变声器启动脚本
echo ========================================
echo.

echo [1/4] 检查Node.js环境...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到Node.js，请先安装Node.js
    echo 下载地址: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js环境检查通过

echo.
echo [2/4] 检查项目依赖...
if not exist "node_modules" (
    echo 📦 正在安装项目依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 项目依赖已存在
)

echo.
echo [3/4] 检查环境配置...
if not exist ".env.local" (
    if exist "env.example" (
        echo 📝 正在创建环境配置文件...
        copy "env.example" ".env.local" >nul
        echo ✅ 已创建 .env.local 文件，请根据需要修改配置
    ) else (
        echo ⚠️  未找到环境配置模板
    )
) else (
    echo ✅ 环境配置文件已存在
)

echo.
echo [4/4] 启动开发服务器...
echo 🚀 正在启动变声器应用...
echo.
echo ========================================
echo 应用将在浏览器中自动打开
echo 如果没有自动打开，请访问: http://localhost:3000
echo 按 Ctrl+C 停止服务器
echo ========================================
echo.

start http://localhost:3000
npm run dev

pause

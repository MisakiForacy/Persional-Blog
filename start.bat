@echo off
REM Docker Compose 启动脚本 (Windows)
REM 用于快速启动所有服务

setlocal enabledelayedexpansion

echo.
echo 🚀 博客系统 Docker 启动脚本
echo ================================
echo.

REM 检查 Docker
docker --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：Docker 未安装
    exit /b 1
)

docker compose version >nul 2>&1
if errorlevel 1 (
    echo ❌ 错误：Docker Compose 未安装
    exit /b 1
)

echo ✅ Docker 环境检查通过
echo.

REM 检查 .env 文件
if not exist .env (
    echo ⚠️  .env 文件不存在，正在从 .env.example 创建...
    copy .env.example .env
    echo ⚠️  请编辑 .env 文件修改密码后再运行
    pause
    exit /b 1
)

echo ✅ 环境变量已加载
echo.

REM 菜单
echo 选择操作：
echo 1) 构建并启动（首次运行）
echo 2) 只启动（已构建过）
echo 3) 重建并启动（重新构建）
echo 4) 停止所有服务
echo 5) 查看日志
echo 6) 进入容器
echo.

set /p choice="请选择 [1-6]: "

if "%choice%"=="1" (
    echo.
    echo 🔨 正在构建镜像...
    docker compose build
    echo.
    echo 🚀 正在启动服务...
    docker compose up -d
) else if "%choice%"=="2" (
    echo.
    echo 🚀 正在启动服务...
    docker compose up -d
) else if "%choice%"=="3" (
    echo.
    echo 🔨 正在重新构建镜像...
    docker compose down
    docker compose build --no-cache
    echo.
    echo 🚀 正在启动服务...
    docker compose up -d
) else if "%choice%"=="4" (
    echo.
    echo ⛔ 正在停止服务...
    docker compose down
    echo ✅ 服务已停止
    pause
    exit /b 0
) else if "%choice%"=="5" (
    docker compose logs -f
    pause
    exit /b 0
) else if "%choice%"=="6" (
    echo.
    echo 选择要进入的容器：
    echo 1) 后端 (blog-backend)
    echo 2) 数据库 (blog-mongodb)
    echo 3) 前端 (blog-frontend)
    echo.
    set /p container_choice="请选择 [1-3]: "
    
    if "!container_choice!"=="1" (
        docker exec -it blog-backend sh
    ) else if "!container_choice!"=="2" (
        docker exec -it blog-mongodb mongosh -u bloguser -p
    ) else if "!container_choice!"=="3" (
        docker exec -it blog-frontend sh
    ) else (
        echo ❌ 无效选择
        pause
        exit /b 1
    )
    pause
    exit /b 0
) else (
    echo ❌ 无效选择
    pause
    exit /b 1
)

REM 等待服务启动
echo.
echo ⏳ 正在等待服务启动...
timeout /t 5 /nobreak

REM 检查服务状态
echo.
echo 📊 服务状态：
docker compose ps

echo.
echo ✅ 启动完成！
echo.
echo 访问地址：
echo   📱 前端: http://localhost
echo   🔌 后端: http://localhost:3001
echo   🗄️  数据库: localhost:27017
echo.
echo 查看日志：
echo   docker compose logs -f
echo.

pause

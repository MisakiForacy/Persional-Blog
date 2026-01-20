#!/bin/bash
# Docker Compose 启动脚本
# 用于快速启动所有服务

set -e  # 有错误立即退出

echo "🚀 博客系统 Docker 启动脚本"
echo "================================"

# 检查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 错误：Docker 未安装"
    exit 1
fi

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "❌ 错误：Docker Compose 未安装"
    exit 1
fi

echo "✅ Docker 环境检查通过"

# 检查 .env 文件
if [ ! -f .env ]; then
    echo "⚠️  .env 文件不存在，正在从 .env.example 创建..."
    cp .env.example .env
    echo "⚠️  请编辑 .env 文件修改密码后再运行"
    exit 1
fi

echo "✅ 环境变量已加载"

# 提示用户选择操作
echo ""
echo "选择操作："
echo "1) 构建并启动（首次运行）"
echo "2) 只启动（已构建过）"
echo "3) 重建并启动（重新构建）"
echo "4) 停止所有服务"
echo "5) 查看日志"
echo "6) 进入容器"
echo ""

read -p "请选择 [1-6]: " choice

case $choice in
    1)
        echo "🔨 正在构建镜像..."
        docker compose build
        echo "🚀 正在启动服务..."
        docker compose up -d
        ;;
    2)
        echo "🚀 正在启动服务..."
        docker compose up -d
        ;;
    3)
        echo "🔨 正在重新构建镜像..."
        docker compose down
        docker compose build --no-cache
        echo "🚀 正在启动服务..."
        docker compose up -d
        ;;
    4)
        echo "⛔ 正在停止服务..."
        docker compose down
        echo "✅ 服务已停止"
        exit 0
        ;;
    5)
        docker compose logs -f
        exit 0
        ;;
    6)
        echo "选择要进入的容器："
        echo "1) 后端 (blog-backend)"
        echo "2) 数据库 (blog-mongodb)"
        echo "3) 前端 (blog-frontend)"
        read -p "请选择 [1-3]: " container_choice
        
        case $container_choice in
            1)
                docker exec -it blog-backend sh
                ;;
            2)
                docker exec -it blog-mongodb mongosh -u bloguser -p
                ;;
            3)
                docker exec -it blog-frontend sh
                ;;
            *)
                echo "❌ 无效选择"
                exit 1
                ;;
        esac
        exit 0
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

# 等待服务启动
echo ""
echo "⏳ 正在等待服务启动..."
sleep 5

# 检查服务状态
echo ""
echo "📊 服务状态："
docker compose ps

echo ""
echo "✅ 启动完成！"
echo ""
echo "访问地址："
echo "  📱 前端: http://localhost"
echo "  🔌 后端: http://localhost:3001"
echo "  🗄️  数据库: localhost:27017"
echo ""
echo "查看日志："
echo "  docker compose logs -f"
echo ""

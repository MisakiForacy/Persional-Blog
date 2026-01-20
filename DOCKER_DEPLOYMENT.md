# Docker 容器化部署教程

## 🐳 为什么选择 Docker？

### ✅ 优势对比

| 特性 | Docker 部署 | 传统部署 |
|------|------------|---------|
| **环境一致性** | ✅ 开发和生产环境完全一致 | ❌ 可能存在差异 |
| **部署速度** | ✅ 一键启动，秒级部署 | ❌ 需要手动配置多个步骤 |
| **依赖管理** | ✅ 容器自带所有依赖 | ❌ 需手动安装 Node、MongoDB 等 |
| **版本控制** | ✅ 镜像版本化，可回滚 | ❌ 难以回滚 |
| **资源隔离** | ✅ 独立运行，互不干扰 | ❌ 共享系统资源 |
| **迁移成本** | ✅ 拷贝镜像即可 | ❌ 需重新配置环境 |
| **扩展性** | ✅ 轻松扩展多实例 | ❌ 需要复杂配置 |

---

## 📋 目录

- [本地开发测试](#本地开发测试)
- [生产环境部署](#生产环境部署)
- [数据备份与恢复](#数据备份与恢复)
- [常见问题](#常见问题)

---

## 本地开发测试

### 1. 安装 Docker

#### Windows

1. 下载 [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
2. 安装并启动 Docker Desktop
3. 验证安装：

```powershell
docker --version
docker-compose --version
```

#### macOS

```bash
# 使用 Homebrew
brew install --cask docker

# 或下载安装包
# https://www.docker.com/products/docker-desktop/
```

#### Linux (Ubuntu)

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 添加当前用户到 docker 组
sudo usermod -aG docker $USER
newgrp docker

# 安装 Docker Compose
sudo apt install docker-compose-plugin -y

# 验证安装
docker --version
docker compose version
```

### 2. 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件
nano .env
```

修改以下配置：

```env
# MongoDB 配置
MONGO_ROOT_PASSWORD=your_secure_root_password_here
MONGO_USER_PASSWORD=your_secure_user_password_here

# 后端配置
ADMIN_SECRET_KEY=your_super_secure_admin_key_here

# 前端配置（本地测试）
VITE_API_URL=http://localhost:3001
```

### 3. 构建和启动

```bash
# 构建所有服务
docker compose build

# 启动所有服务
docker compose up -d

# 查看运行状态
docker compose ps

# 查看日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f backend
```

### 4. 访问应用

- **前端**: <http://localhost>
- **后端 API**: <http://localhost:3001>
- **MongoDB**: localhost:27017

### 5. 导入现有数据（可选）

```bash
# 从本地 MongoDB 导出数据
mongodump --db myblog --out ./backup

# 导入到 Docker MongoDB
docker exec -i blog-mongodb mongorestore \
  --username bloguser \
  --password your_password \
  --authenticationDatabase myblog \
  --db myblog \
  /backup/myblog

# 或使用卷挂载方式
docker compose exec mongodb mongorestore \
  --username bloguser \
  --password your_password \
  --authenticationDatabase myblog \
  --db myblog
```

### 6. 常用操作

```bash
# 停止所有服务
docker compose down

# 停止并删除所有数据（慎用！）
docker compose down -v

# 重启服务
docker compose restart

# 重新构建并启动
docker compose up -d --build

# 进入容器
docker exec -it blog-backend sh
docker exec -it blog-mongodb mongosh
```

---

## 生产环境部署

### 方案 A：Docker Compose 直接部署（推荐小型项目）

#### 1. 准备服务器

```bash
# 连接服务器
ssh root@your_server_ip

# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo apt install docker-compose-plugin -y

# 设置开机自启
sudo systemctl enable docker
```

#### 2. 上传项目

```bash
# 方法1：使用 Git（推荐）
cd /opt
git clone https://github.com/MisakiForacy/Persional-Blog.git
cd Persional-Blog

# 方法2：使用 rsync
rsync -avz --exclude 'node_modules' \
  ~/projects/Persional-Blog/ \
  root@your_server_ip:/opt/Persional-Blog/
```

#### 3. 配置生产环境变量

```bash
cd /opt/Persional-Blog

# 创建 .env 文件
nano .env
```

输入生产配置：

```env
# MongoDB 配置（务必修改密码！）
MONGO_ROOT_PASSWORD=StrongPassword123!@#
MONGO_USER_PASSWORD=AnotherStrongPass456!@#

# 后端配置
ADMIN_SECRET_KEY=SuperSecureAdminKey789!@#

# 前端配置（改为你的域名）
VITE_API_URL=https://yourdomain.com
```

#### 4. 启动服务

```bash
# 构建并启动
docker compose up -d --build

# 查看状态
docker compose ps

# 查看日志
docker compose logs -f
```

#### 5. 配置 Nginx 反向代理（推荐）

在宿主机安装 Nginx：

```bash
sudo apt install nginx -y
```

创建配置文件：

```bash
sudo nano /etc/nginx/sites-available/blog
```

输入以下内容：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 前端
    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 后端 API
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### 6. 配置 HTTPS

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo systemctl enable certbot.timer
```

### 方案 B：导出镜像部署（适合无外网服务器）

#### 1. 在本地构建镜像

```bash
# 构建镜像
docker compose build

# 查看镜像
docker images | grep blog

# 导出镜像为 tar 文件
docker save \
  persional-blog-frontend:latest \
  persional-blog-backend:latest \
  mongo:7.0 \
  -o blog-images.tar

# 压缩（可选）
gzip blog-images.tar
```

#### 2. 传输到服务器

```bash
# 使用 scp
scp blog-images.tar.gz root@your_server_ip:/opt/

# 或使用 U 盘、网盘等方式传输
```

#### 3. 在服务器上加载镜像

```bash
ssh root@your_server_ip

cd /opt

# 解压（如果压缩了）
gunzip blog-images.tar.gz

# 加载镜像
docker load -i blog-images.tar

# 验证
docker images
```

#### 4. 上传配置文件

```bash
# 上传 docker-compose.yml 和 .env
scp docker-compose.yml .env mongo-init.js root@your_server_ip:/opt/blog/
```

#### 5. 启动服务

```bash
ssh root@your_server_ip
cd /opt/blog

# 启动（不需要 build）
docker compose up -d

# 查看状态
docker compose ps
```

### 方案 C：使用 Docker Hub（推荐团队协作）

#### 1. 登录 Docker Hub

```bash
# 注册账号：https://hub.docker.com/

# 登录
docker login
```

#### 2. 推送镜像

```bash
# 构建并打标签
docker compose build

# 给镜像打标签
docker tag persional-blog-frontend:latest yourusername/blog-frontend:latest
docker tag persional-blog-backend:latest yourusername/blog-backend:latest

# 推送到 Docker Hub
docker push yourusername/blog-frontend:latest
docker push yourusername/blog-backend:latest
```

#### 3. 修改 docker-compose.yml

在服务器上创建 `docker-compose.yml`：

```yaml
services:
  mongodb:
    image: mongo:7.0
    # ... 其他配置不变

  backend:
    image: yourusername/blog-backend:latest  # 使用远程镜像
    # 删除 build 部分

  frontend:
    image: yourusername/blog-frontend:latest  # 使用远程镜像
    # 删除 build 部分
```

#### 4. 在服务器上部署

```bash
# 拉取镜像
docker compose pull

# 启动
docker compose up -d
```

---

## 数据备份与恢复

### 自动备份脚本

创建备份脚本：

```bash
nano ~/backup-docker-blog.sh
```

输入以下内容：

```bash
#!/bin/bash

BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
CONTAINER="blog-mongodb"

mkdir -p $BACKUP_DIR

# 备份数据库
docker exec $CONTAINER mongodump \
  --username bloguser \
  --password your_password \
  --authenticationDatabase myblog \
  --db myblog \
  --archive=/backup_$DATE.archive

# 从容器复制备份文件
docker cp $CONTAINER:/backup_$DATE.archive $BACKUP_DIR/

# 删除容器内的备份
docker exec $CONTAINER rm /backup_$DATE.archive

# 压缩备份
cd $BACKUP_DIR
gzip backup_$DATE.archive

# 删除 7 天前的备份
find $BACKUP_DIR -name "backup_*.gz" -mtime +7 -delete

echo "备份完成: $BACKUP_DIR/backup_$DATE.archive.gz"
```

```bash
chmod +x ~/backup-docker-blog.sh

# 设置定时任务
crontab -e
# 添加：0 2 * * * /root/backup-docker-blog.sh
```

### 数据恢复

```bash
# 解压备份
gunzip backup_20260120_020000.archive.gz

# 恢复到容器
docker cp backup_20260120_020000.archive blog-mongodb:/

docker exec blog-mongodb mongorestore \
  --username bloguser \
  --password your_password \
  --authenticationDatabase myblog \
  --archive=/backup_20260120_020000.archive

# 清理容器内文件
docker exec blog-mongodb rm /backup_20260120_020000.archive
```

---

## 监控和维护

### 查看资源使用

```bash
# 查看所有容器资源使用
docker stats

# 查看特定容器
docker stats blog-backend blog-frontend blog-mongodb
```

### 查看日志

```bash
# 实时查看所有日志
docker compose logs -f

# 查看最近 100 行
docker compose logs --tail 100

# 查看特定服务
docker compose logs -f backend
```

### 更新部署

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker compose up -d --build

# 清理旧镜像
docker image prune -f
```

### 健康检查

```bash
# 检查容器健康状态
docker compose ps

# 检查后端 API
curl http://localhost:3001/api/health

# 进入容器调试
docker exec -it blog-backend sh
docker exec -it blog-mongodb mongosh -u bloguser -p
```

---

## 常见问题

### 1. 容器无法启动

```bash
# 查看详细日志
docker compose logs

# 检查端口占用
netstat -tulpn | grep -E '80|3001|27017'

# 重新构建
docker compose down
docker compose up -d --build
```

### 2. MongoDB 连接失败

```bash
# 检查 MongoDB 健康状态
docker compose ps

# 进入 MongoDB 容器测试
docker exec -it blog-mongodb mongosh

# 在 mongosh 中测试
use myblog
db.auth('bloguser', 'your_password')
db.posts.find().limit(1)
```

### 3. 前端无法访问后端

```bash
# 检查网络
docker network ls
docker network inspect persional-blog_blog-network

# 检查环境变量
docker compose config

# 重启后端
docker compose restart backend
```

### 4. 数据丢失

```bash
# 检查卷是否存在
docker volume ls

# 检查卷内容
docker run --rm -v persional-blog_mongodb_data:/data alpine ls -la /data/db

# 如果卷丢失，从备份恢复
```

### 5. 磁盘空间不足

```bash
# 查看 Docker 磁盘使用
docker system df

# 清理未使用的资源
docker system prune -a --volumes

# 只清理悬空镜像
docker image prune
```

---

## 性能优化

### 1. 多阶段构建优化

前端 Dockerfile 已使用多阶段构建，最终镜像只包含静态文件和 nginx。

### 2. 镜像体积优化

```bash
# 查看镜像大小
docker images

# 使用 alpine 基础镜像（已应用）
# 清理构建缓存
docker builder prune
```

### 3. 资源限制

修改 `docker-compose.yml`：

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

---

## 📊 对比总结

| 部署方式 | 复杂度 | 维护成本 | 推荐场景 |
|---------|--------|---------|---------|
| **Docker Compose** | ⭐⭐ | ⭐ | 个人博客、小型项目 |
| **导出镜像** | ⭐⭐⭐ | ⭐⭐ | 内网/无外网环境 |
| **Docker Hub** | ⭐⭐ | ⭐ | 团队协作、多环境部署 |
| **Kubernetes** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 大规模、高可用场景 |

---

## 🎯 推荐流程

1. **开发阶段**：使用 `docker compose up` 本地测试
2. **测试阶段**：推送到 Docker Hub，在测试服务器拉取
3. **生产部署**：使用 Docker Compose + Nginx + HTTPS
4. **监控维护**：设置自动备份、日志监控、健康检查

---

**最后更新：** 2026年1月20日  
**Docker 版本：** 24.0+  
**Docker Compose 版本：** 2.0+  
**维护者：** Foracy

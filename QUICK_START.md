# Docker Compose 快速部署指南

## 📋 准备工作

### 1. 安装 Docker Desktop (Windows)

1. **下载 Docker Desktop**
   - 访问：<https://www.docker.com/products/docker-desktop/>
   - 下载 Windows 版本

2. **系统要求**
   - Windows 10/11 64位
   - 启用 WSL 2（Windows Subsystem for Linux）
   - 启用虚拟化（在 BIOS 中）

3. **安装步骤**

   ```
   1. 运行下载的安装程序
   2. 勾选 "Use WSL 2 instead of Hyper-V"
   3. 完成安装后重启电脑
   4. 启动 Docker Desktop
   ```

4. **验证安装**
   打开 PowerShell，运行：

   ```powershell
   docker --version
   docker compose version
   ```

---

## 🚀 本地测试部署

### 步骤 1：配置检查

✅ 已完成的配置：

- `.env` 文件已创建（包含数据库密码、管理员密钥）
- `docker-compose.yml` 已配置（前端+后端+MongoDB）
- Dockerfile 已准备好

### 步骤 2：构建和启动

在项目根目录打开 PowerShell：

```powershell
# 切换到项目目录
cd C:\Users\Foracy\Desktop\myBlog\Persional-Blog

# 构建镜像（首次需要几分钟）
docker compose build

# 启动所有服务
docker compose up -d

# 查看运行状态
docker compose ps
```

### 步骤 3：验证服务

```powershell
# 查看日志（确认启动成功）
docker compose logs

# 查看特定服务日志
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb
```

访问测试：

- **前端**: <http://localhost>
- **后端 API**: <http://localhost:3001/api/health>
- **MongoDB**: localhost:27017

### 步骤 4：导入现有数据（可选）

如果你本地已有 MongoDB 数据：

```powershell
# 1. 从本地 MongoDB 导出
mongodump --db myblog --out ./backup

# 2. 复制到容器
docker cp ./backup/myblog blog-mongodb:/backup

# 3. 导入到容器
docker exec blog-mongodb mongorestore `
  --username bloguser `
  --password BlogUser2026Pass! `
  --authenticationDatabase myblog `
  --db myblog `
  /backup
```

### 步骤 5：常用命令

```powershell
# 停止所有服务
docker compose down

# 重启服务
docker compose restart

# 查看实时日志
docker compose logs -f

# 进入容器调试
docker exec -it blog-backend sh
docker exec -it blog-mongodb mongosh

# 清理并重新启动
docker compose down -v
docker compose up -d --build
```

---

## 🌐 服务器部署

### 准备服务器

需要准备：

- 云服务器（阿里云/腾讯云等）
- 操作系统：Ubuntu 22.04 或 CentOS Stream 9
- 配置：2核4G内存，40GB硬盘
- 开放端口：22 (SSH), 80 (HTTP), 443 (HTTPS)

### 部署步骤

#### 1. 连接服务器

```bash
# Windows 使用 PowerShell
ssh root@你的服务器IP
```

#### 2. 安装 Docker

```bash
# 安装 Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 安装 Docker Compose
sudo apt update
sudo apt install docker-compose-plugin -y

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
docker compose version
```

#### 3. 上传项目

**方法 A：使用 Git（推荐）**

```bash
cd /opt
git clone https://github.com/MisakiForacy/Persional-Blog.git
cd Persional-Blog
```

**方法 B：使用 SCP 上传**

```powershell
# 在本地 Windows 上运行
scp -r C:\Users\Foracy\Desktop\myBlog\Persional-Blog root@服务器IP:/opt/
```

#### 4. 配置生产环境

```bash
cd /opt/Persional-Blog

# 编辑 .env 文件
nano .env
```

修改为生产配置：

```env
# MongoDB 配置（务必修改密码！）
MONGO_ROOT_PASSWORD=生产环境超强密码123!@#
MONGO_USER_PASSWORD=另一个超强密码456!@#

# 后端配置
ADMIN_SECRET_KEY=超级安全的管理员密钥789!@#

# 前端配置（改为你的域名或服务器IP）
VITE_API_URL=http://你的服务器IP:3001
# 或者使用域名：
# VITE_API_URL=https://yourdomain.com
```

#### 5. 启动服务

```bash
# 构建并启动
docker compose up -d --build

# 查看状态
docker compose ps

# 查看日志（确认启动成功）
docker compose logs -f
```

#### 6. 配置防火墙

```bash
# Ubuntu/Debian
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
sudo ufw status

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=ssh
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

#### 7. 测试访问

浏览器访问：

- `http://你的服务器IP` - 应该能看到博客首页

---

## 🔒 配置 HTTPS（推荐）

### 前提条件

- 已有域名（如：yourdomain.com）
- 域名已解析到服务器 IP

### 安装 Nginx 和 SSL 证书

```bash
# 安装 Nginx
sudo apt install nginx -y

# 创建站点配置
sudo nano /etc/nginx/sites-available/blog
```

配置内容：

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

安装 SSL 证书：

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 获取证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自动续期
sudo systemctl enable certbot.timer
```

修改 `.env` 中的 API 地址：

```env
VITE_API_URL=https://yourdomain.com
```

重新构建前端：

```bash
docker compose up -d --build frontend
```

---

## 📊 运维管理

### 查看状态和日志

```bash
# 查看所有容器状态
docker compose ps

# 查看资源使用
docker stats

# 查看日志
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

### 数据库备份

```bash
# 创建备份脚本
nano ~/backup-docker.sh
```

内容：

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

docker exec blog-mongodb mongodump \
  --username bloguser \
  --password 你的密码 \
  --authenticationDatabase myblog \
  --db myblog \
  --archive=/backup_$DATE.archive

docker cp blog-mongodb:/backup_$DATE.archive $BACKUP_DIR/
docker exec blog-mongodb rm /backup_$DATE.archive

gzip $BACKUP_DIR/backup_$DATE.archive
find $BACKUP_DIR -name "backup_*.gz" -mtime +7 -delete

echo "备份完成: backup_$DATE.archive.gz"
```

设置定时备份：

```bash
chmod +x ~/backup-docker.sh
crontab -e
# 添加：0 2 * * * /root/backup-docker.sh
```

### 更新部署

```bash
cd /opt/Persional-Blog

# 拉取最新代码
git pull origin main

# 重新构建并启动
docker compose up -d --build

# 清理旧镜像
docker image prune -f
```

---

## ❓ 常见问题

### 1. Docker Desktop 无法启动

**解决方法：**

- 确保 WSL 2 已安装：`wsl --install`
- 在 BIOS 中启用虚拟化（VT-x/AMD-V）
- 重启电脑

### 2. 端口被占用

```powershell
# 查看端口占用
netstat -ano | findstr "80"
netstat -ano | findstr "3001"

# 停止占用进程或修改 docker-compose.yml 中的端口
```

### 3. 容器无法访问网络

```bash
# 重启 Docker 网络
docker network prune
docker compose down
docker compose up -d
```

### 4. MongoDB 连接失败

```bash
# 查看 MongoDB 日志
docker compose logs mongodb

# 进入容器测试
docker exec -it blog-mongodb mongosh
# 在 mongosh 中：
use myblog
db.auth('bloguser', '你的密码')
```

### 5. 前端无法加载

```bash
# 检查前端日志
docker compose logs frontend

# 重新构建前端
docker compose up -d --build frontend

# 检查 VITE_API_URL 配置
docker compose config | grep VITE_API_URL
```

---

## 🎯 部署检查清单

### 本地测试

- [ ] Docker Desktop 已安装并运行
- [ ] `.env` 文件已配置
- [ ] `docker compose up -d` 启动成功
- [ ] <http://localhost> 可以访问
- [ ] 后端 API 正常工作

### 服务器部署

- [ ] 服务器已购买并可访问
- [ ] Docker 已安装
- [ ] 项目已上传到 `/opt/Persional-Blog`
- [ ] `.env` 已配置生产密码
- [ ] `docker compose up -d` 启动成功
- [ ] 防火墙端口已开放
- [ ] 可以通过 IP 访问博客
- [ ] （可选）域名已配置
- [ ] （可选）HTTPS 已启用
- [ ] 数据库备份已设置

---

## 📞 需要帮助？

如果遇到问题：

1. 查看日志：`docker compose logs -f`
2. 检查状态：`docker compose ps`
3. 重启服务：`docker compose restart`
4. 重新构建：`docker compose up -d --build`

---

**部署文档：** DOCKER_DEPLOYMENT.md  
**最后更新：** 2026年1月20日  
**维护者：** Foracy

# ✅ 部署检查清单

## 🔍 本地开发环境检查

### 系统要求

- [ ] Windows 10/11 64位（或 macOS/Linux）
- [ ] 至少 4GB RAM
- [ ] 可用磁盘空间 5GB+

### 必需软件

- [ ] Docker Desktop 已安装
- [ ] Git 已安装
- [ ] Node.js 20+ 已安装（可选，开发用）

### 环境验证

```powershell
# 运行以下命令确认安装
docker --version
docker compose version
git --version
```

---

## 📦 项目文件检查

### 根目录文件

- [x] `.env` - 环境变量配置（已创建）
- [x] `.env.example` - 环境变量模板
- [x] `.dockerignore` - Docker 打包忽略
- [x] `.gitignore` - Git 忽略文件
- [x] `docker-compose.yml` - 容器编排配置
- [x] `mongo-init.js` - MongoDB 初始化脚本
- [x] `start.sh` / `start.bat` - 启动脚本

### 后端文件

- [x] `backend/Dockerfile` - 后端容器配置
- [x] `backend/server.js` - 主程序
- [x] `backend/package.json` - 依赖配置（已添加 mongodb）
- [x] `backend/admin-page/` - 管理页面

### 前端文件

- [x] `Foracy.com/Dockerfile` - 前端容器配置
- [x] `Foracy.com/nginx.conf` - Nginx 配置
- [x] `Foracy.com/vite.config.js` - Vite 配置
- [x] `Foracy.com/package.json` - 依赖配置
- [x] `Foracy.com/src/` - 源码目录

### 文档文件

- [x] `STRUCTURE_CHECK.md` - 文件结构检查报告
- [x] `QUICK_START.md` - 快速开始指南
- [x] `DOCKER_DEPLOYMENT.md` - Docker 部署教程
- [x] `SERVER_DEPLOYMENT.md` - 服务器部署教程（可选）

---

## 🚀 本地测试部署

### 步骤 1: 环境配置

- [ ] `.env` 文件已正确配置
- [ ] 密码已修改为安全值（生产环境）

### 步骤 2: 构建镜像

```powershell
# 方式 A: 使用启动脚本
./start.bat  # Windows
./start.sh   # Linux/macOS

# 方式 B: 手动命令
docker compose build
```

状态检查：

```powershell
# 查看构建是否成功
docker images | findstr blog
```

### 步骤 3: 启动服务

```powershell
docker compose up -d
```

### 步骤 4: 服务验证

```powershell
# 查看服务状态（应全部 running）
docker compose ps

# 查看日志（检查是否有错误）
docker compose logs

# 测试前端
Start-Process "http://localhost"

# 测试后端 API
Invoke-WebRequest "http://localhost:3001/api/health"
```

- [ ] 所有容器状态为 `Up`
- [ ] <http://localhost> 显示博客首页
- [ ] <http://localhost:3001/api/health> 返回成功

### 步骤 5: 数据检查

```powershell
# 进入 MongoDB 容器
docker exec -it blog-mongodb mongosh -u bloguser -p

# 在 mongosh 中运行
use myblog
db.posts.find().limit(1)
```

- [ ] 能成功连接到 MongoDB
- [ ] 数据库中有文章数据

### 步骤 6: 清理测试

```powershell
# 停止容器（但保留数据）
docker compose stop

# 或完全删除（谨慎！）
docker compose down -v
```

---

## 🌐 服务器部署

### 准备阶段

- [ ] 购买云服务器（推荐配置：2核 4GB 内存）
- [ ] 开放防火墙端口：22, 80, 443, 3001
- [ ] 获取服务器 IP 和登录凭证

### 连接服务器

```bash
ssh root@your_server_ip
```

- [ ] 能成功连接到服务器
- [ ] 可以执行 root 权限命令

### 安装 Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
docker --version
docker compose version
```

- [ ] Docker 已成功安装
- [ ] 能查看 Docker 版本

### 上传项目

```bash
# 方法1: Git 克隆（需要 GitHub 访问权限）
cd /opt
git clone https://github.com/MisakiForacy/Persional-Blog.git

# 方法2: SCP 上传
scp -r C:\Users\Foracy\Desktop\myBlog\Persional-Blog root@server_ip:/opt/
```

- [ ] 项目代码已上传到服务器
- [ ] 可以看到 `/opt/Persional-Blog` 目录

### 配置生产环境

```bash
cd /opt/Persional-Blog
nano .env
```

修改以下变量：

```env
# 务必修改为强密码！
MONGO_ROOT_PASSWORD=YourStrongPassword123!@#
MONGO_USER_PASSWORD=AnotherStrongPass456!@#
ADMIN_SECRET_KEY=SuperSecureKey789!@#

# 改为服务器 IP 或域名
VITE_API_URL=http://your_server_ip:3001
# 或者
VITE_API_URL=https://yourdomain.com
```

- [ ] .env 文件已编辑
- [ ] 所有密码已修改为强密码
- [ ] API URL 已正确配置

### 启动服务

```bash
cd /opt/Persional-Blog
docker compose up -d --build
```

监控启动过程：

```bash
# 查看实时日志（Ctrl+C 退出）
docker compose logs -f

# 查看容器状态
docker compose ps

# 检查特定服务
docker compose logs backend
docker compose logs mongodb
docker compose logs frontend
```

- [ ] 所有容器已启动（状态为 `Up`）
- [ ] 没有明显的错误日志
- [ ] 后端已连接到数据库

### 验证服务

```bash
# 测试后端
curl http://localhost:3001/api/health

# 测试前端
curl http://localhost

# 测试数据库
docker exec -it blog-mongodb mongosh -u bloguser -p
```

- [ ] 后端 API 正常响应
- [ ] 前端页面可访问
- [ ] 数据库连接成功

### 配置 HTTPS（推荐）

```bash
# 安装 Nginx
sudo apt update
sudo apt install nginx -y

# 创建反向代理配置
# ... (详见 DOCKER_DEPLOYMENT.md)

# 申请 SSL 证书
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d yourdomain.com
```

- [ ] Nginx 已配置
- [ ] SSL 证书已申请（如果使用域名）
- [ ] <https://yourdomain.com> 可正常访问

### 设置自动备份

```bash
nano ~/backup-docker.sh
# ... (详见 DOCKER_DEPLOYMENT.md)

crontab -e
# 添加定时备份任务
```

- [ ] 备份脚本已创建
- [ ] 定时任务已配置
- [ ] 测试备份成功

---

## 📊 监控和维护

### 日常检查

```bash
# 查看服务状态
docker compose ps

# 查看资源使用
docker stats

# 查看最近的日志
docker compose logs --tail 50
```

- [ ] 每周检查一次服务状态
- [ ] 定期备份数据库
- [ ] 检查磁盘使用情况

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

- [ ] 定期检查代码更新
- [ ] 更新后验证服务正常

### 数据备份

```bash
# 手动备份
docker exec blog-mongodb mongodump \
  --username bloguser \
  --password your_password \
  --authenticationDatabase myblog \
  --db myblog
```

- [ ] 每月至少备份一次
- [ ] 备份文件存放在安全位置
- [ ] 定期测试备份恢复

---

## 🆘 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker compose logs

# 检查端口是否被占用
netstat -tulpn | grep -E '80|3001|27017'

# 重新构建
docker compose down
docker compose up -d --build
```

### MongoDB 连接失败

```bash
# 进入容器测试
docker exec -it blog-mongodb mongosh -u admin -p

# 检查初始化脚本是否执行
docker compose logs mongodb
```

### 前端无法访问后端

```bash
# 检查环境变量
docker compose config | grep VITE_API_URL

# 检查后端是否运行
curl http://localhost:3001/api/health

# 重启后端
docker compose restart backend
```

---

## 📋 最终清单

### ✅ 部署前

- [ ] 所有文件已检查（见 STRUCTURE_CHECK.md）
- [ ] .env 已正确配置
- [ ] 本地测试已通过
- [ ] Docker 镜像已成功构建
- [ ] 数据库初始化脚本已验证

### ✅ 部署中

- [ ] 项目代码已上传到服务器
- [ ] 生产环境密码已设置
- [ ] Docker 容器已启动
- [ ] 所有服务健康检查通过
- [ ] HTTPS 已配置（如适用）

### ✅ 部署后

- [ ] 服务可正常访问
- [ ] 数据已成功迁移
- [ ] 备份方案已启用
- [ ] 监控告警已设置
- [ ] 文档已更新

---

## 📞 需要帮助？

- 查看日志：`docker compose logs -f`
- 查看状态：`docker compose ps`
- 重启服务：`docker compose restart`
- 查看教程：`DOCKER_DEPLOYMENT.md` 或 `QUICK_START.md`

---

**创建日期：** 2026年1月20日  
**最后更新：** 2026年1月20日  
**状态：** ✅ 已准备好部署

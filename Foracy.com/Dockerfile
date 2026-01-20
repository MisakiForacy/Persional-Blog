# 前端 Dockerfile (多阶段构建)
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm ci

# 复制应用代码
COPY . .

# 构建参数（可在构建时指定）
ARG VITE_API_URL=http://localhost:3001
ENV VITE_API_URL=$VITE_API_URL

# 构建应用
RUN npm run build

# 生产阶段 - 使用 nginx 提供静态文件
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]

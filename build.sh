#!/bin/bash

# 定义变量
REPO_URL="https://gitee.com/My1iJ3oe6s/Dianxin-Front.git"
DEST_DIR="Dianxin-Front"
BUILD_DIR="dist"
PARENT_DIR=$(pwd)

# 克隆仓库
echo "克隆仓库..."
# 检查目标目录是否存在
if [ -d "$TARGET_DIR" ]; then
    echo "仓库已存在，跳过克隆步骤。"
else
    echo "仓库不存在，开始克隆..."
    git clone $REPO_URL $TARGET_DIR
fi

# 进入仓库目录
cd $DEST_DIR

# 拉取最新代码
echo "拉取最新代码..."
git pull origin khfx-prod

# 安装依赖
echo "安装依赖..."
npm install

# 构建生产环境代码
echo "构建生产环境代码..."
npm run build:prod

# 检查构建目录是否存在
# if [ -d "$BUILD_DIR" ]; then
#     # 复制dist目录到同级目录
#     echo "复制dist目录到同级目录..."
#     cp -r $BUILD_DIR $PARENT_DIR
# else
#     echo "构建目录不存在，构建可能失败。"
# fi

# 返回到原始目录
# cd $PARENT_DIR

echo "操作完成。"
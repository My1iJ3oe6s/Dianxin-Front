#!/bin/bash

# 仓库 URL
REPO_URL="https://gitee.com/My1iJ3oe6s/Dianxin-Front.git"
# 目标目录
TARGET_DIR="Dianxin-Front"
# 指定分支
BRANCH_NAME="khfx-prod"

# 检查目标目录是否存在
if [ -d "$TARGET_DIR" ]; then
    echo "仓库已存在，检查指定分支..."
    cd $TARGET_DIR
    # 检查分支是否存在
    if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
        echo "指定分支已存在，切换到分支 $BRANCH_NAME..."
        git checkout $BRANCH_NAME
        # 拉取最新代码
        git pull origin $BRANCH_NAME
    else
        echo "分支 $BRANCH_NAME 不存在，尝试从远程仓库拉取..."
        # 尝试从远程仓库拉取分支
        git fetch origin
        # 检查分支是否存在
        if git show-ref --verify --quiet refs/remotes/origin/$BRANCH_NAME; then
            echo "远程分支 $BRANCH_NAME 存在，切换到分支..."
            git checkout -b $BRANCH_NAME origin/$BRANCH_NAME
        else
            echo "远程分支 $BRANCH_NAME 不存在，保持在当前分支..."
        fi
    fi
else
    echo "仓库不存在，克隆包括指定分支 $BRANCH_NAME..."
    # 克隆仓库并指定分支
    git clone -b $BRANCH_NAME --single-branch $REPO_URL $TARGET_DIR
fi

# 后续操作，例如构建等
cd $TARGET_DIR
# 假设构建命令为 npm run build:prod
npm run build:prod
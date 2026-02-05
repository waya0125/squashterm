#!/bin/bash
# SquashTerm Docker 起動スクリプト

set -e

echo "================================"
echo "SquashTerm Docker Start"
echo "================================"

# 既存コンテナ停止
docker-compose down 2>/dev/null || true

# 起動
docker-compose up -d

echo ""
echo "起動完了！"
echo ""
echo "アクセス: http://127.0.0.1:8081"
echo "ログ確認: docker-compose logs -f squashterm"
echo "停止: docker-compose down"

#!/usr/bin/env bash
# 部署到 VPS（ssh alias "vps156"）。新專案改 PROJECT 與 REMOTE_DIR。
# 用法：bash deploy.sh
# 流程：同步檔案 → 建映像 → 資料庫遷移 → 啟動 → 確認每個服務都換成新映像 → 健康檢查。
# 任何一步失敗整個腳本就失敗，不會印出假的「部署完成」（沿用 YatanSp 的做法）。
# 第一次部署前：在主機 $REMOTE_DIR 放好 .env.prod（參考 .env.prod.example）。
set -euo pipefail

PROJECT="anxin-starter"
VPS_ALIAS="${VPS_ALIAS:-vps156}"
REMOTE_DIR="/opt/$PROJECT"
COMPOSE="docker compose -f docker-compose.prod.yml"

echo "==> 確認主機目錄與 .env.prod..."
ssh "$VPS_ALIAS" "mkdir -p $REMOTE_DIR && test -f $REMOTE_DIR/.env.prod" || {
  echo "主機上沒有 $REMOTE_DIR/.env.prod，請先依 .env.prod.example 建立" >&2
  exit 1
}

echo "==> 同步檔案..."
tar --exclude='node_modules' --exclude='.git' --exclude='.venv' --exclude='dist' \
    --exclude='.env' --exclude='.env.prod' --exclude='__pycache__' \
    -czf - . | ssh "$VPS_ALIAS" "cd $REMOTE_DIR && tar -xzf -"

echo "==> 建映像..."
ssh "$VPS_ALIAS" "cd $REMOTE_DIR && $COMPOSE build backend frontend"

echo "==> 資料庫遷移..."
ssh "$VPS_ALIAS" "cd $REMOTE_DIR && $COMPOSE up -d postgres redis && $COMPOSE run --rm backend alembic upgrade head"

echo "==> 啟動所有服務..."
ssh "$VPS_ALIAS" "cd $REMOTE_DIR && $COMPOSE up -d --remove-orphans"

echo "==> 確認服務都跑新映像..."
for svc in backend frontend; do
  ssh "$VPS_ALIAS" "cd $REMOTE_DIR && \
    want=\$(docker image inspect -f '{{.Id}}' $PROJECT-$svc:latest) && \
    got=\$(docker inspect -f '{{.Image}}' \$($COMPOSE ps -q $svc)) && \
    [ \"\$want\" = \"\$got\" ]" || { echo "$svc 沒有換成新映像" >&2; exit 1; }
done

echo "==> 健康檢查..."
ssh "$VPS_ALIAS" "for i in \$(seq 1 20); do curl -fsS http://127.0.0.1:8090/health && exit 0; sleep 2; done; exit 1" \
  || { echo "健康檢查失敗，請看：ssh $VPS_ALIAS 'cd $REMOTE_DIR && $COMPOSE logs --tail=100 backend'" >&2; exit 1; }

echo
echo "部署完成：$PROJECT"

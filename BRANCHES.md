# ブランチ管理ルール

## ブランチ構成

```
upstream  ←→  fork元(ibuto/squashterm)へのPR専用ブランチ
    ↓ merge
  main    ←  upstream + 独自機能の結合点（Dockerや環境依存は含めない）
    ↓ merge
  docker  ←  Docker/Redis/Node.js等の環境依存・デプロイ専用ブランチ
```

## 各ブランチの役割と制約

### `upstream`
- fork元 (ibuto/squashterm) へのPRに使う標準機能のみ
- **Docker固有・環境依存のコードは絶対に含めない**
- mainやdockerからの逆流コミット禁止（不可逆コミット）
- **GitHub上でブランチ保護設定済み（直接pushおよびforce push禁止・PR必須・削除禁止）**
- `upstream` への変更は必ず `feature/` ブランチを作成してPR経由で行うこと

### `main`
- `upstream` の変更と独自機能をまとめる結合点
- **Docker固有のコード（Dockerfile, docker-compose.yml, Redis等）は絶対に含めない**
- upstreamの変更はここ経由でdockerへ渡す

### `docker`（旧: feature/custom）
- DockerfileやRedis・certifi等、デプロイ環境に依存するすべての変更
- mainをベースにDockerレイヤーを上乗せする形
- **upstream/mainへの逆流コミット禁止**

## マージフロー

```
upstream  → main  → docker   （変更の流れ）
```

1. 上流の機能・バグ修正 → `upstream` ブランチで実装・コミット
2. `upstream` → `main` へマージ（通常 fast-forward または merge commit）
3. `main` → `docker` へマージ（Dockerビルド用）

## upstream PR 作成ルール

upstream (ibuto/squashterm) へ PR を出す際は以下を必ず守ること。

### ブランチの起点
- **PR ブランチは必ず `upstream` リモート（ibuto/squashterm main）から切ること**
- `main` や `docker` ブランチをベースにすると、独自コミットが混入して事故になる

```bash
# 正しい手順
git checkout -b feature/xxx origin/main   # origin = ibuto/squashterm
git cherry-pick <commit1> <commit2> ...   # 必要なコミットだけを選ぶ
```

### PR 前のダブルチェック（必須）
```bash
# upstream main との差分コミット数・内容を確認
git log --oneline origin/main..HEAD

# 変更ファイルの確認
git diff --stat origin/main..HEAD
```

**確認ポイント:**
1. コミット数が想定通りか（余計な過去コミットが混入していないか）
2. 変更ファイルが意図したものだけか（Docker固有ファイル・独自機能が含まれていないか）
3. `python3 -m compileall server -q` / `node --check server/static/app.js` が通るか

> PR を作成する前に上記を確認し、**コミット数・ファイル数が想定通りであることを確認してから `gh pr create` を実行すること。**

---



都度、一時ブランチを作成して実施する。

```bash
git checkout -b cherry-pick/fix-xxx <base-branch>
git cherry-pick <commit-hash>
# 確認後マージ
```

## ビルド

`docker` ブランチ上で `docker compose` を使う。  
バージョン情報（Git commit/branch/日時）は `.git` をread-onlyマウントしてコンテナ内から自動取得される。

```bash
git checkout docker

# 通常起動（コード変更はボリュームマウントで即時反映）
docker compose up -d

# Dockerfile や docker-compose.yml を変更した場合のみビルドが必要
docker compose build && docker compose up -d
```

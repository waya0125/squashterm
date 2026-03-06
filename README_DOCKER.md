# README_DOCKER.md — docker ブランチ固有機能ガイド

このドキュメントは `docker` ブランチにのみ存在する機能を説明します。  
`upstream` / `main` ブランチとの差分に焦点を当てて記述しています。

---

## ブランチ比較

| 機能 | upstream | main | **docker** |
|------|:--------:|:----:|:----------:|
| 基本ライブラリ機能（再生・プレイリスト等） | ✅ | ✅ | ✅ |
| PWA 対応（manifest・アイコン） | ❌ | ✅ | ✅ |
| プレイリスト並列バッチダウンロード | ❌ | ✅ | ✅ |
| Dockerfile / docker-compose.yml | ❌ | ❌ | ✅ |
| **ytdlp-core-api 連携（IP バイパス）** | ❌ | ❌ | ✅ |
| Redis / Pillow / certifi 依存 | ❌ | ❌ | ✅ |
| `ytdlp-network`（外部 Docker ネットワーク） | ❌ | ❌ | ✅ |

---

## docker ブランチ固有機能

### 1. ytdlp-core-api 連携（IP バイパス）

#### 概要

`docker` ブランチでは、SquashTerm コンテナが IP 制限を受ける場合に  
[ytdlp-core-api](../ytdlp-core-api/) コンテナを経由してダウンロードを行います。

ytdlp-core-api は Cloudflare WARP ルーティングを持ち、YouTube 等の IP 制限を回避できます。

#### 有効化条件

`YTDLP_API_URL` 環境変数が設定されている場合にのみ API 経由に切り替わります。  
**未設定の場合は従来の直接 `yt-dlp` 呼び出しにフォールバック**するため、  
ローカル開発環境では `docker-compose.yml` の該当行をコメントアウトするだけで無効化できます。

```yaml
# docker-compose.yml (docker ブランチ)
environment:
  - YTDLP_API_URL=http://ytdlp-core-api:8000  # これをコメントアウトで無効化
```

#### 処理フロー

```
SquashTerm
  └─ ytdlp_service.py / sync_service.py
       ├─ YTDLP_API_URL 未設定 → yt-dlp 直接呼び出し（従来動作）
       └─ YTDLP_API_URL 設定済み → ytdlp_api_service.py
            └─ ytdlp-core-api
                 ├─ POST /api/download  （ダウンロード開始）
                 ├─ GET  /api/status/{task_id}  （ポーリング）
                 └─ GET  /api/download/{task_id}/file  （ファイル取得）
                      └─ WARP 経由で YouTube 等にアクセス
```

#### 関連ファイル

| ファイル | 変更種別 | 概要 |
|----------|---------|------|
| `server/ytdlp_api_service.py` | 新規（docker のみ） | API 経由の全ダウンロード処理 |
| `server/ytdlp_service.py` | 追記 | `_YTDLP_API_URL` チェックとルーティング |
| `server/sync_service.py` | 追記 | `fetch_flat_playlist_entries` のルーティング |
| `docker-compose.yml` | docker のみ | `YTDLP_API_URL` env + `ytdlp-network` |

#### ytdlp_api_service.py の主要関数

```python
# プレイリスト同期用: フラットなエントリ一覧を取得
fetch_playlist_entries_via_api(url: str) -> list[dict]

# 単体ダウンロードしてライブラリに登録
ingest_from_url_via_api(url: str, playlist_id: str | None) -> tuple[list[Track], str]

# SSE ストリーミング形式でダウンロード進捗を yield
iter_events_via_api(url: str, playlist_id: str | None, no_playlist: bool)
```

#### サムネイル保存

ダウンロード完了後、ytdlp-core-api のステータス内 `thumbnail_url` から  
サムネイルを自動取得して `MEDIA_DIR/{extractor_id}.webp` に保存します。

---

### 2. Docker 環境設定

#### コンテナ構成

```yaml
# docker-compose.yml
services:
  app:
    ports:
      - "8081:8000"        # ホスト 8081 → コンテナ 8000
    environment:
      - YTDLP_API_URL=http://ytdlp-core-api:8000
    networks:
      - default
      - ytdlp-network      # ytdlp-core-api と通信するための外部ネットワーク

networks:
  ytdlp-network:
    external: true         # ytdlp-core-api の docker-compose で作成済み
```

#### ネットワーク前提条件

`ytdlp-network` は `ytdlp-core-api` 側の `docker compose up` で自動作成されます。  
SquashTerm を起動する前に ytdlp-core-api が起動済みであることを確認してください。

```bash
# ytdlp-core-api を先に起動（ytdlp-network が作成される）
cd /docker/ytdlp-core-api && docker compose up -d

# SquashTerm を起動
cd /docker/waya-squashterm && docker compose up -d
```

#### データ永続化

```
/mnt/hdd01/docker_data/squashterm/data/  ← ライブラリ・メディアファイル
./config/                                 ← 設定ファイル
./.git (read-only)                        ← バージョン情報取得用
```

---

### 3. 追加 Python 依存パッケージ

`main` ブランチの `requirements.txt` に対して以下が追加されています：

| パッケージ | 理由 |
|-----------|------|
| `Pillow` | サムネイル画像処理 |
| `requests` | ytdlp-core-api への HTTP 呼び出し |
| `redis` | Redis クライアント（将来的な拡張用） |
| `certifi` | ARM 環境での SSL 証明書問題の回避 |

> `requests` は `docker compose build` でインストールされます。  
> 稼働中コンテナへの即時適用が必要な場合は `pip install requests` を手動実行してください。

---

## 起動・運用コマンド

```bash
# 通常起動（コード変更はボリュームマウントで即時反映）
docker compose up -d

# Dockerfile / docker-compose.yml 変更後
docker compose build && docker compose up -d

# ログ確認
docker compose logs -f

# 停止
docker compose down
```

> `./server:/app/server` ボリュームマウント済みのため、  
> Python・JS・CSS の変更は再ビルド不要（`docker compose up -d` 再起動のみ）。

---

## upstream / main との互換性

`docker` ブランチの追加コードは環境変数で分岐しているため、  
`upstream` / `main` にマージしても `YTDLP_API_URL` が未設定なら動作に影響しません。

ただし、ブランチポリシー上 **`docker` → `main` / `upstream` への逆流は禁止** です。  
詳細は `BRANCHES.md` を参照してください。

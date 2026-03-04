# AGENTS_WAYA.md

**注意**: AGENTS.mdは上流(ibuto/squashterm)のもののため、ポート番号などは参考にしないでください。このファイルはwaya0125のフォーク固有の情報を記載しています。

## ブランチ構成

詳細は `BRANCHES.md` を参照。概要は以下の通り：

```
upstream  ←→  fork元(ibuto/squashterm)へのPR専用
    ↓ merge
  main    ←  upstream + 独自機能の結合点（Docker・環境依存は含めない）
    ↓ merge
  docker  ←  Docker/デプロイ環境依存の変更専用
```

### 各ブランチの役割

| ブランチ | 役割 | Docker含む |
|----------|------|-----------|
| `upstream` | ibuto へのPR用。標準機能のみ | ❌ |
| `main` | upstream + 独自機能の統合 | ❌ |
| `docker` | Dockerfile・docker-compose等の環境依存 | ✅ |

### 作業フロー

#### 上流(ibuto)にも提供する機能

1. `feature/` ブランチを作成して実装（`upstream` ブランチは保護済みのため直接push・force push禁止）
2. Docker関連ファイルを含めない
3. `feature/` → `upstream` へPR → マージ後 `main` → `docker` へ伝播

#### このフォーク独自の機能（Docker専用等）

1. `main` で実装（Dockerファイルは含めない）
2. `main` → `docker` へマージ

## コードスタイル

変数名は下記ルールを使用してください：

- Pythonではスネークケース（snake_case）
- JavaScriptではキャメルケース（camelCase）

コメントを追加する際は、指示された内容をそのままコメントするのではなく、各関数がどのような働きをするか示す簡潔なコメントを記載してください。

## テスト環境

### URL

開発環境でのテストは以下のURLで行います：

```
http://127.0.0.1:8081/
```

実際にアクセスするパスは、実装したファイルに基づき適宜変更してください。

### Docker操作

```bash
# ビルド（バージョン情報はgitマウントから自動取得されるためbuild.sh不要）
docker compose build

# 起動
docker compose up -d

# ビルド + 起動
docker compose build && docker compose up -d

# ログ確認
docker compose logs -f

# 停止
docker compose down
```

> `./server:/app/server` がボリュームマウントされているため、Pythonファイル・JS・CSSの変更は再ビルド不要（再起動のみ）。  
> Dockerfile や docker-compose.yml を変更した場合は `docker compose build` が必要。

### スクリーンショット取得

- モバイル表示の実装を主としない限り、デスクトップ表示で取得
- 両方のスクリーンショットを取得できる場合は、両方を取得してユーザーに提示

## 開発時の注意点

### 1. ブランチ確認

作業前に必ず現在のブランチを確認してください：

```bash
git branch
git status
```

### 2. コミット前の確認

コミット前に必ず変更内容を確認：

```bash
git diff
git diff --stat
git show --stat HEAD
```

特にCSSやJavaScriptの変更は、コミットに含まれているか確認してください。

### 3. マージ前の確認

- `upstream` / `main` には Dockerfile・docker-compose.yml を含めない
- `docker` ブランチにのみ Docker 関連ファイルを含める
- 他ブランチのファイル確認は `git show branch:file` で行う（`git checkout` するとボリュームマウント経由でコンテナが即時切り替わるため注意）

### 4. localStorage使用時の注意

以下の設定をlocalStorageで永続化しています：

- `playerVolume`: 音量設定
- `loopMode`: ループモード（off/playlist/track）
- `shuffleMode`: シャッフルモード（true/false）
- `currentTrackIndex`: 現在再生中のトラックインデックス
- `currentTrackTime`: 現在の再生位置（秒）

新しい設定を追加する場合は、同様にlocalStorageで保存・復元するようにしてください。

### 5. 音量コントロールの同期

音量スライダーは以下の2箇所に存在します：

- プレイヤーオーバーレイ: `#player-volume-slider`, `#player-volume-toggle`
- ミニプレイヤー: `#mini-volume-slider`, `#mini-volume-toggle`

両者は`volumechange`イベントで同期されているため、どちらを変更しても連動します。

### 6. シャッフル機能の実装

シャッフルモードでは：

- 再生終了時、ループ設定がなくても次の曲に進む
- 1周したら自動的に再シャッフルして継続
- Fisher-Yatesアルゴリズムでシャッフル

### 7. モバイルプレイヤーの実装

モバイル専用全画面プレイヤーは以下の要素で構成されています：

- **ナビゲーションボタン**: `#nav-player-button` - 再生中のみ表示（`.is-hidden`で制御）
- **モバイルプレイヤーオーバーレイ**: `#mobile-player-overlay` - `aria-hidden`属性で表示/非表示を制御
- **タブ復帰機能**: `previousActiveTab`変数で元のタブを記憶し、プレイヤーを閉じると復帰
- **デスクトップとの同期**: `updateMobilePlayerUI()`でデスクトップ版プレイヤーから情報を取得し同期

新しいプレイヤー機能を追加する場合は、デスクトップ版、ミニプレイヤー、モバイルプレイヤーの3箇所すべてに実装してください。

### 8. CSS スタイリングの原則

CSS変更時は、以下の原則を守ってください：

- **既存スタイルとの統一**: 他のページと見た目を揃える
  - カード: `border-radius: 18px`, `padding: 16px`, `box-shadow: inset 0 0 0 1px`
  - ボタン: `border-radius: 999px`, `padding: 10px 16px`, `font-weight: 600`
  - 入力欄: `background: #1d1d1d`, `border: 1px solid #334155`, `border-radius: 10px`

- **マージン・パディングの明示**: 継承に頼らず、すべて明示的に設定
  - 良い例: `margin: 6px 0 0 0;`
  - 悪い例: `margin-top: 6px;` （他の方向が不明確）

- **フレックスボックスの活用**: 
  - 下部配置: `margin-top: auto`
  - 中央揃え: `align-self: center`

- **スペーシングの統一**: 
  - カード間: `gap: 16px`
  - ラベル間: `margin: 0 0 6px 0`
  - ターミナル上部: `padding-top: 12px`

コミットメッセージは英語で、以下の形式で記述：

```
動詞 + 概要

- 詳細1
- 詳細2
- 詳細3
```

例：
```
Add volume control slider to player

- Add volume slider and mute toggle button to player controls
- Add CSS styling for volume slider
- Implement volume persistence with localStorage
```

## デプロイ

変更をリモートにプッシュする際は、変更したブランチのみプッシュします：

```bash
# リモート構成
# fork   = waya0125/squashterm (GitHub、書き込み可能)
# origin = ibuto/squashterm   (GitHub、読み取り専用・上流)
# gitlab = waya0125/squashterm (self-hosted GitLab、ミラー)

# GitHub fork へプッシュ
git push fork main
git push fork docker
# upstream は保護済みのため feature/ ブランチ経由でPR

# GitLab へも同期（ミラー）
git push gitlab main
git push gitlab docker
```

> GitLab は `git@gitlab-local:waya0125/squashterm.git` へ SSH 接続。  
> 機能の一次リポジトリは GitHub (fork)。GitLab は同期ミラーとして扱う。

## Pull Requestの作成

上流リポジトリ (ibuto/squashterm) に機能を提供する場合は Pull Request を作成します。

### 前提条件

- `upstream` ブランチは保護済みのため、必ず `feature/` ブランチを作成して実装
- Docker関連ファイルを含めないこと
- 動作確認済みであること

### PR作成手順

```bash
# 1. feature ブランチを upstream ベースで作成
git checkout upstream
git checkout -b feature/your-feature-name

# 2. 実装・コミット

# 3. fork へプッシュ
git push fork feature/your-feature-name

# 4. GitHub CLI で PR 作成
gh pr create \
  --repo ibuto/squashterm \
  --base main \
  --head waya0125:feature/your-feature-name \
  --title "feat: 機能名" \
  --body "変更内容の説明"
```

### PR作成前のチェックリスト

```bash
# Docker関連ファイルが含まれていないか確認
git diff upstream...feature/your-feature-name --name-only | grep -E "Dockerfile|docker-compose|build\.sh|start\.sh"
# -> 何も表示されないことを確認

# 差分確認
git diff upstream...feature/your-feature-name
```

## トラブルシューティング

### コミットに変更が含まれていない

```bash
git add <file>
git commit --amend --no-edit
```

### ブランチ切り替え時に変更が競合

```bash
git stash
git checkout <branch>
git stash pop
```

または未コミットの変更をコミットしてから切り替え。

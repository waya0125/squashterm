# CHANGELOG_CUSTOM.md

このファイルは、`feature/custom`ブランチと上流リポジトリ（origin/main）との主な差分を記載しています。

## 概要

- **総コミット数**: 110コミット先行（origin/mainから）
- **独自機能のコミット数**: 42コミット（feature/upstreamとの差分）
- **上流との関係**: このフォーク独自のオリジナル機能 + 上流に提供予定の機能を統合

## feature/custom独自のオリジナル機能

これらの機能は、このフォーク独自のもので上流には提供しません。

### Docker対応

- Docker Compose構成の追加
- Dockerfileの追加
- ビルドスクリプト（build.sh）とスタートスクリプト（start.sh）の追加
- Redis対応（キャッシュ・セッション管理用）
- Git情報と日時（JST）を環境変数に設定

**関連コミット:**
- Add Docker Compose setup for easy deployment
- feat: Redis対応とcertifi追加
- docs: Docker環境とRedis版の説明を追加
- chore: Redisサービスをデフォルトで有効化
- ビルドスクリプト追加: Git情報と日時（JST）を環境変数に設定

### 自動ライブラリスキャン機能

ライブラリに新しいファイルが追加された際、自動的にスキャンして取り込む機能。

**関連コミット:**
- 自動ライブラリスキャン機能を実装（複数回）

### 設定保存機能（サーバー側）

ユーザーの設定をサーバー側で永続化する機能。

**関連コミット:**
- 設定保存機能を実装（複数回）

### プレイリスト分割並列ダウンロード機能

大量のプレイリストを分割して並列ダウンロードする機能。並列ダウンロード時のlibrary.json競合も解決。

**関連コミット:**
- feat: プレイリスト分割並列ダウンロード機能を追加
- feat: プレイリスト分割ダウンロード用UIを追加
- fix: フォーム要素の幅を適切に設定
- docs: プレイリスト分割ダウンロード機能の使い方を追加
- 並列ダウンロード時の保存処理を修正（複数回）
- 並列ダウンロード時のlibrary.json競合を修正（複数回）

### プレイリスト自動判定機能

URLからプレイリストかどうかを自動判定する機能。

**関連コミット:**
- プレイリスト自動判定機能を実装

### プレイリストダウンロード修正

プレイリストダウンロード機能の修正と改善。

**関連コミット:**
- fix: プレイリストダウンロードでURLを正しく抽出するように修正
- fix: プレイリストダウンロードを非同期で実行するように修正
- fix: --no-playlistフラグを削除してプレイリストダウンロードを有効化
- cleanup: デバッグログを削除
- プレイリスト一括ダウンロード機能を修正

### 動的バージョン情報機能

Git情報から動的にバージョン情報を生成・表示する機能。

**関連コミット:**
- 動的バージョン情報機能を実装
- fix: バージョン情報取得のフォールバック処理を追加

### UI/UX改善（このフォーク独自）

- モバイル表示のナビゲーションボタンサイズとレイアウトを修正
- Manageタブのチェックボックスを左寄せ横並びに修正
- Manageタブの項目間隔・見出し下の余白を調整
- Manageタブのスタイルを全面的に再構築し、他のページと統一
- ブラウザ互換性向上（labelをgridからflexに変更）
- 全画面プレイヤーのコントロールボタンを左寄せに変更
- 音量スライダーの垂直位置とレンジを調整

**関連コミット:**
- モバイル表示のナビゲーションボタンサイズとレイアウトを修正（複数回）
- Manageタブのチェックボックスを左寄せ横並びに修正
- Manageタブの項目間隔を調整
- Manageタブの見出し下の余白を調整
- Manage項目間隔とnav-buttonサイズを修正
- fix: labelをgridからflexに変更してブラウザ互換性を向上（複数回）
- Rebuild Manage tab styling to match other pages
- Align fullscreen player control buttons to the left
- Fix volume slider vertical alignment with align-self
- Improve volume slider track range

### 上流リファクタリング対応

上流のリファクタリング（PR #31など）に対応し、モジュール構造を刷新。

**関連コミット:**
- Phase 1: PR #31機能をリファクタリング済み構造で再実装
- Phase 2: 追加機能を統合（PlaybackOptionUpdate、自動スキャン、動的バージョン）
- Phase 2-1: 基本的な独自機能を各モジュールに統合
- 上流のリファクタリングをマージ (origin/main)
- 上流リファクタリングに対応：モジュール構造を刷新
- upstream用PR: Docker関連ファイルを除外
- 追加機能のエンドポイント実装
- 統合: 全機能をcustomブランチにマージ

### ドキュメント管理

このフォーク固有のワークフローやガイドを追加。上流版と独自版を適切に切り分け。

**関連コミット:**
- docs: プロジェクト固有のワークフローガイドを追加（複数回）
- docs: 変更の反映ルールをWORKFLOW.mdに追加
- READMEを上流の状態に戻す（複数回、Docker関連を除外するため）

## feature/upstreamから取り込んだ機能

以下の機能は、上流リポジトリにも提供できる機能として`feature/upstream`で開発され、`feature/custom`にマージされたものです。

### シャッフル再生機能

**実装内容:**
- シャッフルボタンの追加（プレイヤーとミニプレイヤー両方）
- Fisher-Yatesアルゴリズムによるランダム再生順序の生成
- 1周したら自動的に再シャッフルして継続
- シャッフルモード時、ループ設定がなくても次の曲に自動進行
- シャッフルボタンのアクティブ状態を再生ボタンと同じ青色で表示

**関連コミット:**
- Add shuffle playback feature
- Refactor shuffle button: overlay text on icon like loop button
- Simplify shuffle button: show blue color when active
- Update shuffle button color to match play button and add mini volume toggle
- Add mini volume controls and fix shuffle playback continuation

### 音量コントロール機能

**実装内容:**
- 音量スライダーの追加（プレイヤーとミニプレイヤー両方）
- ミュートトグルボタンの追加
- 音量設定のlocalStorage永続化
- プレイヤーとミニプレイヤー間の音量同期（volumechangeイベント）
- スライダー幅を100pxに拡張（調整しやすく）

**関連コミット:**
- Add volume control slider to player
- Fix volume listener implementation
- Add volume slider UI and fix shuffle button styling
- Add volume slider to mini player left of prev button
- Add mini volume controls and fix shuffle playback continuation
- Increase volume slider width for easier adjustment

### 再生状態の永続化

**実装内容:**
- ループモード（off/playlist/track）のlocalStorage保存・復元
- シャッフルモード（on/off）のlocalStorage保存・復元
- 再生中のトラックインデックスと再生位置の保存
- ページリロード時に前回の状態から自動復元

**localStorageキー:**
- `playerVolume`: 音量設定
- `loopMode`: ループモード
- `shuffleMode`: シャッフルモード
- `currentTrackIndex`: 現在再生中のトラックインデックス
- `currentTrackTime`: 現在の再生位置（秒）

**関連コミット:**
- Add playback state persistence with localStorage

### その他のUI改善

- ループボタンのラベル表示改善
- アイコン追加
- 曲削除機能

## 変更されたファイル

### 追加されたファイル

```
Dockerfile
docker-compose.yml
build.sh
start.sh
AGENTS_WAYA.md
CHANGELOG_CUSTOM.md
WORKFLOW.md (可能性あり)
```

### 主に変更されたファイル

```
server/static/app.js - 音量コントロール、シャッフル機能、再生状態永続化
server/static/styles.css - 音量スライダー、シャッフルボタンのスタイリング
server/templates/index.html - 音量コントロールUI、シャッフルボタンUI
requirements.txt - Redis、certifi追加
README.md - Docker環境、Redis版の説明追加
```

## マージ戦略

このブランチは以下の流れで更新されます：

1. `feature/upstream`で上流に提供できる機能を開発
2. `feature/upstream`の変更を`feature/custom`にマージ
3. `feature/custom`独自の機能を追加
4. 両方の変更を`main`にマージ

## 今後の展望

### 上流に提供予定の機能

- シャッフル再生機能
- 音量コントロール機能
- 再生状態の永続化

### このフォーク独自で保持する機能

- Docker対応
- Redis対応
- 自動ライブラリスキャン
- 設定保存機能（サーバー側）
- プレイリスト分割並列ダウンロード

---

**最終更新**: 2026-02-06 18:45 JST  
**ベースブランチ**: origin/main  
**現在のコミット数差分**: 122コミット先行  
**独自機能のコミット数**: 59コミット（feature/upstreamとの差分）

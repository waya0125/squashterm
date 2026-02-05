# AGENTS_WAYA.md

**注意**: AGENTS.mdは上流(upstream)のもののため、ポート番号などは参考にしないでください。このファイルはwaya0125のフォーク固有の情報を記載しています。

## プロジェクト構造

このプロジェクトは以下のブランチ構成で管理されています：

### ブランチ戦略

- **main**: 安定版ブランチ。feature/customとfeature/upstreamの変更を統合
- **feature/upstream**: 上流リポジトリにも提供できる機能を開発するブランチ（Dockerファイルを含まない）
- **feature/custom**: **このフォーク独自のオリジナル機能**を含むブランチ（Docker対応、自動スキャン、設定保存など、上流には提供しない機能）

### 作業フロー

#### 上流にも提供できる機能の場合

1. `feature/upstream`で開発
2. Docker関連の変更は含めない（upstreamはDockerfileなし）
3. コミット後、`feature/custom`と`main`にマージ
4. マージは`git merge`で行う（cherry-pickは特定の場合のみ）

#### このフォーク独自の機能の場合

1. `feature/custom`で開発
2. Docker対応や独自設定など、上流に含めない機能を実装
3. コミット後、`main`にマージ

## コードスタイル

変数名は下記ルールを使用してください：

- Pythonではスネークケース（snake_case）
- JavaScriptではキャメルケース（camelCase）

コメントを追加する際は、指示された内容をそのままコメントするのではなく、各関数がどのような働きをするか示す簡潔なコメントを記載してください。

## テスト環境

### URL

開発環境でのテストは以下のURLで行います：

```
http://127.0.0.1:8000/
```

実際にアクセスするパスは、実装したファイルに基づき適宜変更してください。

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

- マージ先ブランチにDockerfileが存在するか確認
- feature/upstreamにはDockerfileを含めない
- feature/customとmainにはDockerfileを含む

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

### 7. コミットメッセージ

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

変更をリモートにプッシュする際は、以下の順序で行います：

```bash
# feature/upstreamで作業後
git checkout feature/custom
git merge feature/upstream

git checkout main
git merge feature/upstream

# プッシュ
git push fork main
git push fork feature/custom
git push fork feature/upstream
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

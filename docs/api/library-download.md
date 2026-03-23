# API仕様: URLダウンロードエンドポイント

`POST /api/library/download` は、`url` で指定したリンクから楽曲をダウンロードしてライブラリへ登録し、登録された楽曲の共有リンクを返します。

Manage画面の「ライブラリに追加」と同等のダウンロード処理をAPIから実行するためのエンドポイントです。

## リクエスト

### クエリパラメータ

- `base_url` (string, 任意)
  - 共有リンクを絶対URLで返したい場合に指定します（例: `https://example.com`）。
  - 省略時は設定ファイルの `app.base_url` を利用し、未設定なら相対パス（`/share/{track_id}`）を返します。

### JSONボディ

```json
{
  "url": "https://www.youtube.com/watch?v=xxxxxxxxxxx",
  "playlist_id": "playlist_xxx"
}
```

- `url` (string, 必須)
  - ダウンロード対象URL。
- `playlist_id` (string, 任意)
  - 指定した場合、登録後に対象プレイリストへ自動追加します。

## レスポンス

### 1曲登録時

```json
{
  "track_id": "abc123",
  "share_url": "/share/abc123"
}
```

### 複数曲登録時（プレイリストURLなど）

```json
{
  "share_links": [
    {
      "track_id": "abc123",
      "share_url": "/share/abc123"
    },
    {
      "track_id": "def456",
      "share_url": "/share/def456"
    }
  ]
}
```

## エラー

- `400 Bad Request`
  - `yt-dlp` 未インストール。
  - ダウンロード後に登録曲が0件。
  - `base_url` が `http://` または `https://` で始まらない。
- `500 Internal Server Error`
  - ダウンロード・登録処理中の予期しないエラー。

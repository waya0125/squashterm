# API仕様: 楽曲登録エンドポイント

`POST /api/library/register` で、サーバー上にある既存の音声ファイルをライブラリへ登録できます。

## リクエストボディ

```json
{
  "file_path": "/absolute/or/relative/path/to/music.mp3",
  "scan_meta": true,
  "playlist_id": "playlist_xxx",
  "metadata": {
    "title": "Manual Title",
    "artist": "Manual Artist",
    "album": "Manual Album",
    "genre": "Pop",
    "year": 2024,
    "duration": "3:45",
    "bpm": 128,
    "source_url": "https://example.com/source"
  }
}
```

## フィールド定義

- `file_path` (string, 必須)
  - 登録対象ファイルのパス。
  - サーバープロセスから参照可能なパスを指定します。
- `scan_meta` (boolean, 任意, デフォルト: `true`)
  - `true`: ファイルのメタデータを直接読み取って登録します。
  - `false`: `metadata` オブジェクトの値を登録時に利用します。
- `playlist_id` (string, 任意)
  - 指定した場合、登録した楽曲を該当プレイリストへ自動追加します。
- `metadata` (object, 条件付き必須)
  - `scan_meta=false` のとき必須です。
  - `scan_meta=true` の場合は無視されます。

## metadataオブジェクトの定義（scan_meta=false時）

- `title` (string, 必須)
- `artist` (string, 必須)
- `album` (string, 必須)
- `genre` (string, 任意, デフォルト: `"Unknown"`)
- `year` (number, 任意, デフォルト: `0`)
- `duration` (string, 任意, デフォルト: `"--"`)
- `bpm` (number, 任意, デフォルト: `0`)
- `source_url` (string, 任意)

## レスポンス例

```json
{
  "track": {
    "id": "local_xxx",
    "title": "Manual Title",
    "artist": "Manual Artist",
    "album": "Manual Album",
    "cover": "/static/images/icon.png",
    "duration": "3:45",
    "bpm": 128,
    "genre": "Pop",
    "year": 2024,
    "file_url": "/media/local_xxx.mp3",
    "source_url": "https://example.com/source",
    "file_format": "mp3",
    "bitrate_kbps": null,
    "video_url": null
  },
  "scan_meta": false
}
```

## エラーレスポンス

- `400 Bad Request`
  - `file_path` が存在しない場合。
  - `scan_meta=false` かつ `metadata` 未指定の場合。

from __future__ import annotations

import json
import shutil
import threading
import uuid
from contextlib import asynccontextmanager
from dataclasses import asdict
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

from html import escape

from fastapi import FastAPI, File, Form, HTTPException, Query, Request, Response, UploadFile
from fastapi.responses import FileResponse, HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
import uvicorn

from library_service import (
    append_track_record,
    append_tracks_to_playlist,
    batch_download_playlist,
    build_upload_track,
    ensure_data_dirs,
    fetch_favorites,
    fetch_playlists,
    fetch_tracks,
    import_local_folder,
    init_library,
    load_library,
    parse_positive_int,
    remove_media_asset,
    save_library,
)
from models import (
    FavoritesUpdate,
    ImportRequest,
    LocalFolderImportRequest,
    PlaylistBatchImportRequest,
    PlaylistCreate,
    PlaylistUpdate,
    TrackUpdate,
)
from paths import AUTO_SYNC_LOCK, MEDIA_DIR, STATIC_DIR, TEMPLATE_PATH
from settings_service import (
    DEFAULT_SETTINGS,
    build_settings_payload,
    build_system_payload,
    build_version_label,
    ensure_version_file,
    load_settings,
    set_base_url,
    update_playback_option,
)
from sync_service import auto_sync_worker, sync_playlist_with_remote
from ytdlp_service import ingest_from_url, iter_ytdlp_events, is_single_video_url
from media_utils import scan_media_directory

REPO_ROOT = Path(__file__).resolve().parent.parent


@asynccontextmanager
async def lifespan(app_: "FastAPI"):  # noqa: F841
    # --- startup ---
    thread = threading.Thread(target=auto_sync_worker, daemon=True)
    thread.start()

    # 自動スキャンが有効なら起動時に実行
    settings = load_settings(DEFAULT_SETTINGS)
    auto_scan_enabled = any(
        opt.get("id") == "auto_scan" and opt.get("enabled")
        for opt in settings.get("playback_options", [])
    )
    if auto_scan_enabled:
        try:
            count = scan_media_directory()
            print(f"Auto scan: {count} files processed")
        except Exception as e:
            print(f"Auto scan failed: {e}")

    # docker 固有: otomad-core-api 定期同期ワーカー
    try:
        from otomad_service import start_otomad_sync_worker
        start_otomad_sync_worker()
    except Exception:
        pass

    yield
    # --- shutdown (必要なら後処理をここに) ---


app = FastAPI(title="SquashTerm Server", version="0.1.0", lifespan=lifespan)

init_library()
load_settings(DEFAULT_SETTINGS)
ensure_version_file()

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")


@app.get("/")
@app.get("/index.html")
async def read_index():
    if not TEMPLATE_PATH.exists():
        raise HTTPException(status_code=404, detail="Index template not found")
    return FileResponse(TEMPLATE_PATH)


@app.get("/favicon.ico")
def get_favicon():
    favicon_path = STATIC_DIR / "images" / "icon.png"
    if not favicon_path.exists():
        raise HTTPException(status_code=404, detail="Favicon not found")
    return FileResponse(favicon_path)


@app.get("/api/share/track/{track_id}")
def get_track_share_url(track_id: str, base_url: str | None = Query(default=None)):
    tracks = fetch_tracks()
    track = next((item for item in tracks if item.id == track_id), None)
    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    raw_base_url = (base_url or "").strip()
    if not raw_base_url:
        settings = load_settings(DEFAULT_SETTINGS)
        app_settings = settings.get("app", {})
        raw_base_url = str(app_settings.get("base_url", "")).strip()

    normalized_base_url = raw_base_url.rstrip("/")
    if normalized_base_url and not normalized_base_url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="Invalid base_url")

    track_path = f"/share/{quote(str(track.id))}"
    share_url = f"{normalized_base_url}{track_path}" if normalized_base_url else track_path
    return {"track_id": track.id, "share_url": share_url}




@app.get("/share/{track_id}", response_class=HTMLResponse)
def render_share_page(track_id: str, request: Request):
    """OGP ランディングページ。クローラーには meta タグを返し、人間には 8 秒後にアプリへリダイレクトする。"""
    tracks = fetch_tracks()
    track = next((t for t in tracks if t.id == track_id), None)
    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")

    settings = load_settings(DEFAULT_SETTINGS)
    configured_base = str(settings.get("app", {}).get("base_url", "")).strip().rstrip("/")
    base_url = _resolve_base_url(request, configured_base)

    relative_cover = track.cover or "/static/images/icon.png"
    abs_cover = f"{base_url}{relative_cover}" if base_url and relative_cover.startswith("/") else relative_cover
    canonical = f"{base_url}/share/{quote(track.id)}" if base_url else f"/share/{quote(track.id)}"
    app_url = f"{base_url}/?id={quote(track.id)}" if base_url else f"/?id={quote(track.id)}"

    t = escape(track.title or "不明")
    artist = escape(track.artist or "不明")
    album = escape(track.album or "不明")
    desc = escape(f"{track.artist or '不明'} · {track.album or '不明'}")
    img = escape(abs_cover)
    url = escape(canonical)
    src_url = escape(track.source_url or "")
    app_url_esc = escape(app_url)

    return _build_share_html(t, artist, album, desc, img, url, app_url_esc, src_url)


def _resolve_base_url(request: Request, settings_base_url: str) -> str:
    """base_url を解決する。設定値が空の場合はリクエストのプロキシヘッダーから自動検出する。

    優先順位: 設定値 > X-Forwarded-Proto + Host > request.base_url
    Cloudflare / nginx などのリバースプロキシ環境でも絶対 URL を生成できる。
    """
    if settings_base_url:
        return settings_base_url
    proto = request.headers.get("x-forwarded-proto", "").split(",")[0].strip()
    host = request.headers.get("x-forwarded-host") or request.headers.get("host", "")
    if proto and host:
        return f"{proto}://{host}"
    return str(request.base_url).rstrip("/")


def _build_share_html(
    title: str,
    artist: str,
    album: str,
    description: str,
    image_url: str,
    canonical_url: str,
    app_url: str,
    source_url: str,
) -> str:
    source_link = (
        f'<a class="src-link" href="{source_url}" target="_blank" rel="noopener noreferrer">'
        f"元の作品を開く ↗</a>"
        if source_url
        else ""
    )
    return f"""<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} - SquashTerm</title>
    <!-- OGP -->
    <meta property="og:type" content="music.song" />
    <meta property="og:site_name" content="SquashTerm" />
    <meta property="og:title" content="{title}" />
    <meta property="og:description" content="{description}" />
    <meta property="og:image" content="{image_url}" />
    <meta property="og:url" content="{canonical_url}" />
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{title}" />
    <meta name="twitter:description" content="{description}" />
    <meta name="twitter:image" content="{image_url}" />
    <style>
      *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
      body {{
        min-height: 100dvh;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0f0f0f;
        color: #e5e7eb;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        padding: 1rem;
      }}
      .card {{
        background: #1a1a1a;
        border: 1px solid #2d2d2d;
        border-radius: 12px;
        max-width: 420px;
        width: 100%;
        overflow: hidden;
        box-shadow: 0 8px 32px rgba(0,0,0,.5);
      }}
      .cover {{
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        display: block;
        background: #111;
      }}
      .info {{ padding: 1.25rem 1.25rem 0.75rem; }}
      .info h1 {{ font-size: 1.2rem; font-weight: 700; line-height: 1.3; margin-bottom: 0.35rem; }}
      .info p  {{ font-size: 0.9rem; color: #9ca3af; }}
      .info p + p {{ margin-top: 0.15rem; }}
      .actions {{ padding: 0.75rem 1.25rem 1.25rem; display: flex; flex-direction: column; gap: 0.6rem; }}
      .btn-open {{
        display: block; width: 100%;
        background: #93c5fd; color: #0f172a;
        border: none; border-radius: 8px;
        padding: 0.7rem 1rem; font-size: 0.95rem; font-weight: 600;
        cursor: pointer; text-align: center; text-decoration: none;
        transition: opacity .15s;
      }}
      .btn-open:hover {{ opacity: .85; }}
      .src-link {{
        display: block; text-align: center;
        color: #6b7280; font-size: 0.8rem;
        text-decoration: none;
      }}
      .src-link:hover {{ color: #9ca3af; }}
      .redirect-note {{
        text-align: center; font-size: 0.78rem; color: #4b5563; padding: 0 1.25rem 1rem;
      }}
    </style>
  </head>
  <body>
    <div class="card">
      <img class="cover" src="{image_url}" alt="カバー画像" loading="lazy" />
      <div class="info">
        <h1>{title}</h1>
        <p>{artist}</p>
        <p>{album}</p>
      </div>
      <div class="actions">
        <a class="btn-open" href="{app_url}">SquashTerm で開く</a>
        {source_link}
      </div>
      <p class="redirect-note" id="note"><span id="sec">8</span> 秒後に自動でアプリを開きます</p>
    </div>
    <script>
      const appUrl = {json.dumps(app_url)};
      let t = 8;
      const el = document.getElementById("sec");
      const note = document.getElementById("note");
      const iv = setInterval(() => {{
        t--;
        if (el) el.textContent = t;
        if (t <= 0) {{
          clearInterval(iv);
          if (note) note.textContent = "アプリを開いています...";
          window.location.replace(appUrl);
        }}
      }}, 1000);
    </script>
  </body>
</html>"""



@app.put("/api/settings/base-url")
def update_base_url(payload: dict):
    base_url = payload.get("base_url", "")
    if base_url is None:
        base_url = ""
    base_url = str(base_url).strip()
    if base_url and not base_url.startswith(("http://", "https://")):
        raise HTTPException(status_code=400, detail="base_url must start with http:// or https://")
    return set_base_url(base_url)


@app.get("/api/library")
def get_library():
    return [asdict(track) for track in fetch_tracks()]


@app.put("/api/library/{track_id}")
def update_track(track_id: str, payload: TrackUpdate):
    data = load_library()
    tracks = data.get("tracks", [])
    track = next((item for item in tracks if item.get("id") == track_id), None)
    if track is None:
        raise HTTPException(status_code=404, detail="Track not found")
    if payload.title is not None:
        track["title"] = payload.title
    if payload.artist is not None:
        track["artist"] = payload.artist
    if payload.album is not None:
        track["album"] = payload.album
    if payload.source_url is not None:
        track["source_url"] = payload.source_url
    save_library(data)
    file_path = track.get("file_path")
    file_url = f"/media/{Path(file_path).name}" if file_path else None
    updated = track.copy()
    updated["file_url"] = file_url
    return updated


@app.delete("/api/library/{track_id}", status_code=204)
def delete_track(track_id: str, delete_file: bool = True):
    data = load_library()
    tracks = data.get("tracks", [])
    target_index = next(
        (index for index, item in enumerate(tracks) if item.get("id") == track_id),
        None,
    )
    if target_index is None:
        raise HTTPException(status_code=404, detail="Track not found")
    removed = tracks.pop(target_index)
    data["favorites"] = [item for item in data.get("favorites", []) if item != track_id]
    for playlist in data.get("playlists", []):
        playlist["track_ids"] = [
            item for item in playlist.get("track_ids", []) if item != track_id
        ]
    save_library(data)
    if delete_file:
        remove_media_asset(removed.get("file_path"))
        remove_media_asset(removed.get("cover"))
    return Response(status_code=204)


@app.get("/api/playlists")
def get_playlists():
    return fetch_playlists()


@app.post("/api/playlists")
def create_playlist(payload: PlaylistCreate):
    data = load_library()
    playlists = data.setdefault("playlists", [])
    auto_sync_interval = parse_positive_int(payload.auto_sync_interval_minutes)
    auto_sync_url = payload.auto_sync_url.strip() if payload.auto_sync_url else None
    auto_sync_enabled = payload.auto_sync_enabled
    if auto_sync_enabled is None:
        auto_sync_enabled = bool(auto_sync_url and auto_sync_interval)
    playlist = {
        "id": f"pl_{uuid.uuid4().hex}",
        "name": payload.name,
        "track_ids": payload.track_ids,
        "auto_sync_url": auto_sync_url,
        "auto_sync_interval_minutes": auto_sync_interval,
        "auto_sync_enabled": auto_sync_enabled,
        "auto_sync_last_run": None,
        "auto_sync_last_error": "",
    }
    playlists.append(playlist)
    save_library(data)
    return playlist


@app.put("/api/playlists/{playlist_id}")
def update_playlist(playlist_id: str, payload: PlaylistUpdate):
    data = load_library()
    playlists = data.get("playlists", [])
    playlist = next((item for item in playlists if item.get("id") == playlist_id), None)
    if playlist is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    if payload.name is not None:
        playlist["name"] = payload.name
    if payload.track_ids is not None:
        playlist["track_ids"] = payload.track_ids
    if payload.auto_sync_url is not None:
        auto_sync_url = payload.auto_sync_url.strip() if payload.auto_sync_url else None
        playlist["auto_sync_url"] = auto_sync_url
        if not auto_sync_url:
            playlist["auto_sync_enabled"] = False
            playlist["auto_sync_last_run"] = None
            playlist["auto_sync_last_error"] = ""
    if payload.auto_sync_interval_minutes is not None:
        playlist["auto_sync_interval_minutes"] = parse_positive_int(
            payload.auto_sync_interval_minutes
        )
    if payload.auto_sync_enabled is not None:
        playlist["auto_sync_enabled"] = payload.auto_sync_enabled
    save_library(data)
    return playlist


@app.delete("/api/playlists/{playlist_id}", status_code=204)
def delete_playlist(playlist_id: str):
    data = load_library()
    playlists = data.get("playlists", [])
    target_index = next(
        (index for index, item in enumerate(playlists) if item.get("id") == playlist_id),
        None,
    )
    if target_index is None:
        raise HTTPException(status_code=404, detail="Playlist not found")
    playlists.pop(target_index)
    save_library(data)
    return Response(status_code=204)


@app.post("/api/playlists/{playlist_id}/sync")
def sync_playlist(playlist_id: str):
    try:
        with AUTO_SYNC_LOCK:
            return sync_playlist_with_remote(playlist_id)
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail="yt-dlp is not installed")
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.get("/api/favorites")
def get_favorites():
    return fetch_favorites()


@app.put("/api/favorites")
def update_favorites(payload: FavoritesUpdate):
    data = load_library()
    data["favorites"] = payload.track_ids
    save_library(data)
    return data["favorites"]


@app.get("/api/status")
def get_status():
    settings = load_settings(DEFAULT_SETTINGS)
    return {
        "version": build_version_label(REPO_ROOT),
        "service": "SquashTerm",
        "time": datetime.utcnow().isoformat(timespec="seconds"),
        "device": settings.get("device", ""),
    }


@app.get("/api/settings")
def get_settings():
    return build_settings_payload(REPO_ROOT)


@app.put("/api/settings/playback-options")
def update_playback_options(payload: dict):
    """再生設定を更新"""
    try:
        option_id = payload.get("option_id")
        enabled = payload.get("enabled")
        if option_id is None or enabled is None:
            raise HTTPException(status_code=400, detail="option_id and enabled are required")
        return update_playback_option(option_id, enabled)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/system")
def get_system():
    return build_system_payload()


@app.post("/api/library/import")
def import_track(payload: ImportRequest):
    """URLからトラックをインポートする。"""
    try:
        tracks, log_output = ingest_from_url(payload.url, payload.playlist_id)
        return {
            "tracks": [asdict(track) for track in tracks],
            "log": log_output,
        }
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail="yt-dlp is not installed")
    except RuntimeError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/library/import/stream")
def import_track_stream(payload: ImportRequest):
    def event_generator():
        try:
            # URL自動判定
            no_playlist = is_single_video_url(payload.url)
            for event in iter_ytdlp_events(payload.url, payload.playlist_id, no_playlist):
                yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        except FileNotFoundError:
            message = {"type": "error", "message": "yt-dlp is not installed"}
            yield f"data: {json.dumps(message, ensure_ascii=False)}\n\n"
        except Exception as exc:
            message = {"type": "error", "message": str(exc)}
            yield f"data: {json.dumps(message, ensure_ascii=False)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/library/import/playlist-batch")
def import_playlist_batch(payload: PlaylistBatchImportRequest):
    """プレイリストを並列ダウンロード"""
    def event_generator():
        try:
            # URL自動判定：単体動画ならストリーム版に切り替え
            if is_single_video_url(payload.url):
                for event in iter_ytdlp_events(payload.url, payload.playlist_id, no_playlist=True):
                    yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
            else:
                # プレイリストなら並列ダウンロード
                for event in batch_download_playlist(
                    payload.url, payload.playlist_id, payload.concurrency
                ):
                    yield f"data: {json.dumps(event, ensure_ascii=False)}\n\n"
        except FileNotFoundError:
            message = {"type": "error", "message": "yt-dlp is not installed"}
            yield f"data: {json.dumps(message, ensure_ascii=False)}\n\n"
        except Exception as exc:
            message = {"type": "error", "message": str(exc)}
            yield f"data: {json.dumps(message, ensure_ascii=False)}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.post("/api/library/import/local-folder")
def import_local_folder_route(payload: LocalFolderImportRequest):
    try:
        tracks = import_local_folder(payload.path, payload.playlist_id, payload.auto_tag)
        return {"added": len(tracks), "tracks": [asdict(track) for track in tracks]}
    except FileNotFoundError:
        raise HTTPException(status_code=400, detail="Folder not found")
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/api/library/upload")
async def upload_track(
    file: UploadFile = File(...),
    cover: UploadFile | None = File(None),
    title: str | None = Form(None),
    artist: str | None = Form(None),
    album: str | None = Form(None),
    genre: str | None = Form(None),
    year: str | None = Form(None),
    source_url: str | None = Form(None),
    auto_tag: str | bool | None = Form(True),
    playlist_id: str | None = Form(None),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="File is required")
    ensure_data_dirs()
    extension = Path(file.filename).suffix or ".mp3"
    track_id = f"local_{uuid.uuid4().hex}"
    file_path = MEDIA_DIR / f"{track_id}{extension}"
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    track = build_upload_track(
        file_path,
        track_id,
        title,
        artist,
        album,
        genre,
        year,
        source_url,
        auto_tag,
        cover,
    )
    append_track_record(track, file_path)
    append_tracks_to_playlist(playlist_id, [track.id])
    return asdict(track)


# ---------------------------------------------------------------------------
# Maintenance endpoints
# ---------------------------------------------------------------------------

@app.post("/api/maintenance/apply-album-from-source-playlists")
def apply_album_from_playlists(payload: dict | list[dict]):
    """プレイリストURLに基づきトラックのAlbumを遡及設定する (one-shot)。

    Body (推奨):
      {"playlists": [{"url": "...", "album_name": "..."}, ...]}

    互換性のため、ルート配列形式も受け付けます:
      [{"url": "...", "album_name": "..."}, ...]

    album_name は省略可（yt-dlp の playlist_title を自動使用）。
    """
    from library_service import apply_album_from_source_playlists

    if isinstance(payload, dict):
        playlists = payload.get("playlists", [])
        if not isinstance(playlists, list):
            raise HTTPException(status_code=400, detail="'playlists' field must be a list")
    else:
        playlists = payload

    return apply_album_from_source_playlists(playlists)


@app.post("/api/maintenance/sync-local-to-otomad")
def sync_local_to_otomad():
    """ライブラリの全トラックを otomad-core-api に一括登録する (one-shot)。"""
    try:
        from otomad_service import sync_local_tracks_to_otomad
        count = sync_local_tracks_to_otomad()
        return {"synced": count}
    except ImportError:
        raise HTTPException(status_code=501, detail="otomad_service not available")


@app.post("/api/maintenance/resolve-soundcloud-urls")
def resolve_soundcloud_urls():
    """既存トラックの SoundCloud API URL を正規ページ URL に修正する (one-shot)。

    ytdlp-core-api の /api/info エンドポイントを使用して解決する。
    YTDLP_API_URL が未設定の場合はスキップ。
    """
    try:
        from ytdlp_api_service import YTDLP_API_URL, resolve_soundcloud_source_urls
        if not YTDLP_API_URL:
            raise HTTPException(status_code=501, detail="YTDLP_API_URL not configured")
        result = resolve_soundcloud_source_urls()
        return result
    except ImportError:
        raise HTTPException(status_code=501, detail="ytdlp_api_service not available")


def run(host: str = "0.0.0.0", port: int = 8000) -> None:
    print(f"SquashTerm server running on http://{host}:{port}")
    uvicorn.run(app, host=host, port=port)


if __name__ == "__main__":
    run()

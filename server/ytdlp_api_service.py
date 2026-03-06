"""
ytdlp-core-api 連携サービス（docker ブランチ限定）

YTDLP_API_URL 環境変数が設定されている場合に使用する。
IP 制限のある環境で WARP 経由の ytdlp-core-api をバイパスとして使う。
"""
from __future__ import annotations

import os
import time
import urllib.request
from dataclasses import asdict
from pathlib import Path

import requests

from library_service import store_downloaded_tracks
from models import Track
from paths import MEDIA_DIR

YTDLP_API_URL: str = os.getenv("YTDLP_API_URL", "").rstrip("/")

# ダウンロード完了待機の設定
_POLL_INTERVAL = 2      # 秒
_POLL_TIMEOUT  = 600    # 秒（最大 10 分）


def fetch_playlist_entries_via_api(url: str) -> list[dict]:
    """ytdlp-core-api /api/playlist からフラットなエントリ一覧を返す。

    sync_service.fetch_flat_playlist_entries と同じ戻り値形式。
    """
    resp = requests.post(
        f"{YTDLP_API_URL}/api/playlist",
        json={"url": url},
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    entries: list[dict] = []
    for e in data.get("entries", []):
        entry_url = e.get("url") or e.get("webpage_url")
        if not entry_url:
            eid = e.get("id")
            if eid:
                entry_url = f"https://www.youtube.com/watch?v={eid}"
        if entry_url:
            entries.append({
                "id":          e.get("id"),
                "webpage_url": entry_url,
                "url":         entry_url,
                "title":       e.get("title"),
                "uploader":    e.get("uploader"),
                "ie_key":      e.get("extractor") or "",
            })
    return entries


def _poll_until_done(task_id: str) -> dict:
    """task_id の完了（または失敗）を待機してステータス dict を返す。"""
    deadline = time.monotonic() + _POLL_TIMEOUT
    while time.monotonic() < deadline:
        time.sleep(_POLL_INTERVAL)
        resp = requests.get(
            f"{YTDLP_API_URL}/api/status/{task_id}",
            timeout=15,
        )
        resp.raise_for_status()
        status = resp.json()
        if status.get("status") == "completed":
            return status
        if status.get("status") == "error":
            raise RuntimeError(status.get("error") or "ytdlp-core-api: download error")
    raise RuntimeError(f"ytdlp-core-api: download timed out after {_POLL_TIMEOUT}s")


def _fetch_file(task_id: str, extractor_id: str) -> Path:
    """完了済みタスクのファイルを MEDIA_DIR に保存して Path を返す。"""
    dest = MEDIA_DIR / f"{extractor_id}.m4a"
    with requests.get(
        f"{YTDLP_API_URL}/api/download/{task_id}/file",
        stream=True,
        timeout=300,
    ) as r:
        r.raise_for_status()
        with dest.open("wb") as f:
            for chunk in r.iter_content(chunk_size=65536):
                f.write(chunk)
    return dest


def _fetch_thumbnail(extractor_id: str, thumbnail_url: str) -> None:
    """サムネイルを MEDIA_DIR/{extractor_id}.webp に保存する（失敗しても無視）。"""
    if not thumbnail_url:
        return
    ext = "webp" if "webp" in thumbnail_url.lower() else "jpg"
    dest = MEDIA_DIR / f"{extractor_id}.{ext}"
    if dest.exists():
        return
    try:
        req = urllib.request.Request(
            thumbnail_url, headers={"User-Agent": "Mozilla/5.0"}
        )
        with urllib.request.urlopen(req, timeout=30) as res:
            dest.write_bytes(res.read())
    except Exception:
        pass


def _build_info_dict(status: dict, extractor_id: str, url: str) -> dict:
    """API ステータスから store_downloaded_tracks 互換の info dict を構築する。"""
    return {
        "id":          extractor_id,
        "title":       status.get("title") or "Unknown Title",
        "uploader":    status.get("uploader"),
        "duration":    status.get("duration"),
        "webpage_url": url,
        "thumbnail":   status.get("thumbnail_url"),
        "ext":         "m4a",
    }


def ingest_from_url_via_api(
    url: str, playlist_id: str | None = None
) -> tuple[list[Track], str]:
    """ytdlp-core-api 経由でダウンロードしてライブラリに登録する。

    ytdlp_service.ingest_from_url の代替。
    """
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)

    resp = requests.post(
        f"{YTDLP_API_URL}/api/download",
        json={
            "url":           url,
            "extract_audio": True,
            "audio_format":  "m4a",
            "embed_thumbnail": True,
        },
        timeout=30,
    )
    resp.raise_for_status()
    task_id = resp.json()["task_id"]

    status = _poll_until_done(task_id)
    extractor_id = status.get("extractor_id") or task_id.replace("-", "")

    _fetch_file(task_id, extractor_id)
    _fetch_thumbnail(extractor_id, status.get("thumbnail_url") or "")

    info = _build_info_dict(status, extractor_id, url)
    tracks = store_downloaded_tracks([info], url, playlist_id)
    log = f"[ytdlp-core-api] {url} → {extractor_id}.m4a"
    return tracks, log


def iter_events_via_api(
    url: str,
    playlist_id: str | None = None,
    no_playlist: bool = False,
):
    """ytdlp-core-api 経由でダウンロードしながら SSE 互換イベントを yield する。

    ytdlp_service.iter_ytdlp_events の代替。
    """
    MEDIA_DIR.mkdir(parents=True, exist_ok=True)

    # -------- ダウンロード開始 --------
    yield {"type": "log", "message": f"[ytdlp-core-api] Submitting: {url}"}

    resp = requests.post(
        f"{YTDLP_API_URL}/api/download",
        json={
            "url":           url,
            "extract_audio": True,
            "audio_format":  "m4a",
            "embed_thumbnail": True,
        },
        timeout=30,
    )
    resp.raise_for_status()
    task_id = resp.json()["task_id"]
    yield {"type": "log", "message": f"[ytdlp-core-api] task_id={task_id}"}

    # -------- ポーリング --------
    deadline = time.monotonic() + _POLL_TIMEOUT
    last_progress = -1.0
    while time.monotonic() < deadline:
        time.sleep(_POLL_INTERVAL)
        try:
            st_resp = requests.get(
                f"{YTDLP_API_URL}/api/status/{task_id}", timeout=15
            )
            st_resp.raise_for_status()
            status = st_resp.json()
        except Exception as e:
            yield {"type": "log", "message": f"[ytdlp-core-api] poll error: {e}"}
            continue

        progress = float(status.get("progress") or 0)
        if progress != last_progress:
            yield {"type": "progress", "value": progress,
                   "message": f"[ytdlp-core-api] {progress:.1f}%"}
            last_progress = progress

        if status.get("status") == "error":
            yield {"type": "error",
                   "message": status.get("error") or "ytdlp-core-api error"}
            return

        if status.get("status") != "completed":
            continue

        # -------- ファイル取得 --------
        extractor_id = status.get("extractor_id") or task_id.replace("-", "")
        yield {"type": "log", "message": f"[ytdlp-core-api] Fetching file: {extractor_id}.m4a"}
        try:
            _fetch_file(task_id, extractor_id)
        except Exception as e:
            yield {"type": "error", "message": f"File fetch failed: {e}"}
            return

        _fetch_thumbnail(extractor_id, status.get("thumbnail_url") or "")

        info = _build_info_dict(status, extractor_id, url)
        tracks = store_downloaded_tracks([info], url, playlist_id)
        failed = 0
        yield {
            "type":      "complete",
            "tracks":    [asdict(t) for t in tracks],
            "completed": len(tracks),
            "failed":    failed,
            "total":     len(tracks) + failed,
        }
        return

    yield {"type": "error", "message": f"ytdlp-core-api timed out after {_POLL_TIMEOUT}s"}

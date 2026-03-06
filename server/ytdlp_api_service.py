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
    entries, _ = fetch_playlist_info_via_api(url)
    return entries


def fetch_playlist_info_via_api(url: str) -> tuple[list[dict], str | None]:
    """ytdlp-core-api /api/playlist からエントリ一覧とプレイリスト名を返す。

    Returns:
        (entries, playlist_title)
    """
    resp = requests.post(
        f"{YTDLP_API_URL}/api/playlist",
        json={"url": url},
        timeout=120,
    )
    resp.raise_for_status()
    data = resp.json()
    playlist_title: str | None = data.get("title")
    entries: list[dict] = []
    for e in data.get("entries", []):
        # webpage_url を優先（SoundCloud では url がストリーム/API URL になる場合がある）
        entry_url = e.get("webpage_url") or e.get("url")
        if not entry_url:
            eid = e.get("id")
            if eid:
                entry_url = f"https://www.youtube.com/watch?v={eid}"
        if entry_url:
            entries.append({
                "id":            e.get("id"),
                "webpage_url":   entry_url,
                "url":           entry_url,
                "permalink_url": e.get("permalink_url"),
                "title":         e.get("title"),
                "uploader":      e.get("uploader"),
                "ie_key":        e.get("extractor") or "",
            })
    return entries, playlist_title


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
        "id":            extractor_id,
        "title":         status.get("title") or "Unknown Title",
        "uploader":      status.get("uploader"),
        "duration":      status.get("duration"),
        "webpage_url":   status.get("webpage_url") or url,
        "permalink_url": status.get("permalink_url"),
        "thumbnail":     status.get("thumbnail_url"),
        "ext":           "m4a",
    }


def ingest_from_url_via_api(
    url: str, playlist_id: str | None = None, playlist_name: str | None = None
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
    tracks = store_downloaded_tracks([info], url, playlist_id, playlist_name)
    try:
        from otomad_service import ingest_to_otomad
        for t in tracks: ingest_to_otomad(asdict(t))
    except Exception: pass
    log = f"[ytdlp-core-api] {url} → {extractor_id}.m4a"
    return tracks, log


def iter_events_via_api(
    url: str,
    playlist_id: str | None = None,
    no_playlist: bool = False,
    playlist_name: str | None = None,
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
            speed = status.get("speed") or ""
            eta = status.get("eta")
            extra = ""
            if speed:
                extra += f" {speed}"
            if eta is not None:
                extra += f" ETA:{eta}s"
            yield {"type": "progress", "value": progress,
                   "message": f"[ytdlp-core-api] {progress:.1f}%{extra}"}
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
        tracks = store_downloaded_tracks([info], url, playlist_id, playlist_name)
        try:
            from otomad_service import ingest_to_otomad
            for t in tracks: ingest_to_otomad(asdict(t))
        except Exception: pass
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


def batch_download_playlist_via_api(
    url: str,
    playlist_id: str | None = None,
    concurrency: int = 3,
):
    """ytdlp-core-api 経由でプレイリストを並列ダウンロードしながら SSE イベントを yield する。

    library_service.batch_download_playlist の API 版。
    """
    import concurrent.futures

    MEDIA_DIR.mkdir(parents=True, exist_ok=True)

    yield {"type": "log", "message": f"[ytdlp-core-api] Fetching playlist: {url}"}

    entries, playlist_title = fetch_playlist_info_via_api(url)
    if not entries:
        yield {"type": "error", "message": "Playlist is empty or could not be fetched"}
        return

    total = len(entries)
    yield {"type": "progress", "total": total, "completed": 0, "failed": 0,
           "message": f"プレイリスト取得完了: {total}件 / {playlist_title or url}"}

    # 全エントリを一括 submit
    task_map: dict[str, dict] = {}  # task_id → entry dict
    for entry in entries:
        entry_url = entry.get("url") or entry.get("webpage_url")
        if not entry_url:
            continue
        try:
            resp = requests.post(
                f"{YTDLP_API_URL}/api/download",
                json={"url": entry_url, "extract_audio": True,
                      "audio_format": "m4a", "embed_thumbnail": True},
                timeout=30,
            )
            resp.raise_for_status()
            task_id = resp.json()["task_id"]
            task_map[task_id] = entry
        except Exception as e:
            yield {"type": "log", "message": f"[ytdlp-core-api] submit failed {entry_url}: {e}"}

    completed_count = 0
    failed_count = 0
    all_tracks: list[Track] = []
    pending = set(task_map.keys())
    deadline = time.monotonic() + _POLL_TIMEOUT + total * 60  # 1 分/エントリ余裕

    while pending and time.monotonic() < deadline:
        time.sleep(_POLL_INTERVAL)
        done_this_round: set[str] = set()

        for task_id in list(pending):
            try:
                st = requests.get(
                    f"{YTDLP_API_URL}/api/status/{task_id}", timeout=15
                ).json()
            except Exception:
                continue

            if st.get("status") == "completed":
                extractor_id = st.get("extractor_id") or task_id.replace("-", "")
                try:
                    _fetch_file(task_id, extractor_id)
                    _fetch_thumbnail(extractor_id, st.get("thumbnail_url") or "")
                    entry_url = task_map[task_id].get("url") or task_map[task_id].get("webpage_url") or ""
                    info = _build_info_dict(st, extractor_id, entry_url)
                    tracks = store_downloaded_tracks([info], entry_url, playlist_id, playlist_title)
                    try:
                        from otomad_service import ingest_to_otomad
                        for t in tracks: ingest_to_otomad(asdict(t))
                    except Exception: pass
                    all_tracks.extend(tracks)
                    completed_count += 1
                except Exception as e:
                    yield {"type": "log", "message": f"[ytdlp-core-api] store failed {extractor_id}: {e}"}
                    failed_count += 1
                done_this_round.add(task_id)

            elif st.get("status") == "error":
                yield {"type": "log",
                       "message": f"[ytdlp-core-api] error: {st.get('error')} ({task_id})"}
                failed_count += 1
                done_this_round.add(task_id)

        pending -= done_this_round
        if done_this_round:
            yield {
                "type": "progress",
                "total": total,
                "completed": completed_count,
                "failed": failed_count,
                "message": f"ダウンロード中 {completed_count + failed_count}/{total}",
            }

    yield {
        "type": "complete",
        "total": total,
        "completed": completed_count,
        "failed": failed_count,
        "tracks": [asdict(t) for t in all_tracks],
    }


def resolve_soundcloud_source_urls() -> dict:
    """ライブラリ内の SoundCloud API URL を /api/info 経由で正規ページ URL に修正する。

    Returns:
        {"resolved": int, "skipped": int, "failed": int}
    """
    from library_service import load_library, save_library, _is_soundcloud_api_url

    data = load_library()
    tracks = data.get("tracks", [])
    resolved = 0
    skipped = 0
    failed = 0

    for track in tracks:
        raw_url = track.get("source_url") or ""
        if not _is_soundcloud_api_url(raw_url):
            skipped += 1
            continue
        try:
            resp = requests.post(
                f"{YTDLP_API_URL}/api/info",
                json={"url": raw_url},
                timeout=30,
            )
            resp.raise_for_status()
            info = resp.json()
            page_url = info.get("webpage_url")
            if page_url and page_url.startswith("https://soundcloud.com"):
                track["source_url"] = page_url
                resolved += 1
            else:
                failed += 1
        except Exception:
            failed += 1

    if resolved:
        save_library(data)

    return {"resolved": resolved, "skipped": skipped, "failed": failed}

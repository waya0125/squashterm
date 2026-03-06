"""
otomad-core-api 連携サービス（docker ブランチ限定）

OTOMAD_API_URL 環境変数が設定されている場合にのみ動作する。
設定されていなければすべての関数はノーオペレーションとなる。
"""
from __future__ import annotations

import os
import threading
import time
import warnings

import requests

OTOMAD_API_URL: str = os.getenv("OTOMAD_API_URL", "").rstrip("/")
OTOMAD_SERVICE_KEY: str = os.getenv("OTOMAD_SERVICE_KEY", "")
OTOMAD_SERVICE_UUID: str = os.getenv("OTOMAD_SERVICE_UUID", "")

_SYNC_INTERVAL_SECS = 7 * 24 * 3600  # 週1回
_INITIAL_SYNC_DELAY = 60              # 起動60秒後に初回同期

_HEADERS = {
    "Content-Type": "application/json",
    "X-Service-Key": OTOMAD_SERVICE_KEY,
}


def _detect_extractor(source_url: str | None, track_id: str) -> tuple[str, str]:
    """source_url とトラックIDから (extractor, extractor_id) を判定する。"""
    raw_id = track_id[3:] if track_id.startswith("yt_") else track_id
    url = (source_url or "").lower()
    if "soundcloud.com" in url:
        return "soundcloud", raw_id
    if "youtube.com" in url or "youtu.be" in url:
        return "youtube", raw_id
    if "nicovideo.jp" in url or "nico.ms" in url:
        return "niconico", raw_id
    return "local", track_id


def ingest_to_otomad(track: dict) -> None:
    """トラック1件を otomad-core-api /ingest に登録する。失敗は警告のみ。"""
    if not OTOMAD_API_URL:
        return
    track_id: str = track.get("id") or ""
    source_url: str | None = track.get("source_url")
    extractor, extractor_id = _detect_extractor(source_url, track_id)
    payload = {
        "source_service": OTOMAD_SERVICE_UUID,
        "extractor": extractor,
        "extractor_id": extractor_id,
        "url": source_url or "",
        "title": track.get("title") or "",
        "uploader": track.get("artist") or "",
        "uploader_url": "",
    }
    try:
        resp = requests.post(
            f"{OTOMAD_API_URL}/ingest",
            json=payload,
            headers=_HEADERS,
            timeout=10,
        )
        resp.raise_for_status()
    except Exception as exc:
        warnings.warn(f"[otomad_service] ingest failed ({track_id}): {exc}")


def sync_local_tracks_to_otomad() -> int:
    """ライブラリの全トラックを otomad-core-api に一括登録する。登録件数を返す。"""
    if not OTOMAD_API_URL:
        return 0
    from library_service import load_library
    data = load_library()
    tracks = data.get("tracks", [])
    count = 0
    for track in tracks:
        try:
            ingest_to_otomad(track)
            count += 1
        except Exception:
            pass
    print(f"[otomad_service] sync complete: {count} tracks ingested")
    return count


def _sync_worker() -> None:
    """週1回の定期同期スレッド本体。"""
    time.sleep(_INITIAL_SYNC_DELAY)
    while True:
        try:
            sync_local_tracks_to_otomad()
        except Exception as exc:
            warnings.warn(f"[otomad_service] periodic sync error: {exc}")
        time.sleep(_SYNC_INTERVAL_SECS)


def start_otomad_sync_worker() -> None:
    """定期同期バックグラウンドスレッドを起動する。OTOMAD_API_URL 未設定なら即 return。"""
    if not OTOMAD_API_URL:
        return
    thread = threading.Thread(target=_sync_worker, daemon=True, name="otomad-sync")
    thread.start()
    print(f"[otomad_service] sync worker started (interval={_SYNC_INTERVAL_SECS}s)")

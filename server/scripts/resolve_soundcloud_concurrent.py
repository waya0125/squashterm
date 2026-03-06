#!/usr/bin/env python3
import sys
sys.path.insert(0, '/app/server')
import os
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
from urllib.parse import urlparse

import requests
from library_service import load_library, save_library

YTDLP_API_URL = os.environ.get('YTDLP_API_URL', '').rstrip('/')
if not YTDLP_API_URL:
    print('YTDLP_API_URL not configured')
    sys.exit(1)


def is_sc_api(url):
    if not url:
        return False
    try:
        netloc = urlparse(url).netloc.lower()
        return 'soundcloud' in netloc and ('api.' in netloc or 'api-' in netloc or netloc.startswith('api.'))
    except Exception:
        return False


data = load_library()
tracks = data.get('tracks', [])
candidates = [t for t in tracks if is_sc_api(t.get('source_url'))]

total = len(candidates)
print(f'Found {total} SoundCloud API URLs to resolve')

if total == 0:
    out = {'resolved': 0, 'failed': 0, 'total': 0}
    open('/app/server/data/resolve_soundcloud_result.json', 'w').write(json.dumps(out, ensure_ascii=False, indent=2))
    print(json.dumps(out, ensure_ascii=False))
    sys.exit(0)


def resolve_one(track):
    raw = track.get('source_url')
    tid = track.get('id')
    try:
        resp = requests.post(f'{YTDLP_API_URL}/api/info', json={'url': raw}, timeout=15)
        resp.raise_for_status()
        info = resp.json()
        page = info.get('webpage_url') or info.get('permalink_url') or info.get('uploader_url')
        if page and isinstance(page, str) and page.startswith('https://soundcloud.com'):
            track['source_url'] = page
            # persist immediately
            save_library(data)
            return (tid, raw, page, True)
        else:
            return (tid, raw, None, False)
    except Exception as e:
        return (tid, raw, None, False)


workers = min(10, max(2, total // 5 if total else 2))
resolved = 0
failed = 0

with ThreadPoolExecutor(max_workers=workers) as ex:
    futures = {ex.submit(resolve_one, t): t for t in candidates}
    for fut in as_completed(futures):
        tid, old, new, ok = fut.result()
        if ok:
            resolved += 1
            print(f'[{resolved}/{total}] resolved {tid}: {old} -> {new}')
        else:
            failed += 1
            print(f'[{resolved}/{total}] failed {tid}: {old}')
        sys.stdout.flush()

out = {'resolved': resolved, 'failed': failed, 'total': total}
open('/app/server/data/resolve_soundcloud_result.json', 'w').write(json.dumps(out, ensure_ascii=False, indent=2))
print('Done:', json.dumps(out, ensure_ascii=False))

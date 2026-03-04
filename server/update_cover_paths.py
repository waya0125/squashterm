#!/usr/bin/env python3
"""
library.json内のカバー画像パスを.webpに更新するスクリプト
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from library_service import load_library, save_library
from paths import MEDIA_DIR


def update_cover_paths_to_webp():
    """library.json内のカバー画像パスを.webpに更新"""
    data = load_library()
    tracks = data.get("tracks", [])
    updated_count = 0
    
    print(f"Checking {len(tracks)} tracks...")
    
    for track in tracks:
        cover_url = track.get("cover", "")
        if not cover_url or not cover_url.startswith("/media/"):
            continue
        
        # ファイル名を取得
        filename = cover_url.replace("/media/", "")
        file_path = MEDIA_DIR / filename
        
        # 既にWebPの場合はスキップ
        if filename.endswith(".webp"):
            continue
        
        # WebPファイルが存在するか確認
        webp_filename = Path(filename).stem + ".webp"
        webp_path = MEDIA_DIR / webp_filename
        
        if webp_path.exists():
            old_url = track["cover"]
            track["cover"] = f"/media/{webp_filename}"
            print(f"Updated: {old_url} -> {track['cover']}")
            updated_count += 1
    
    if updated_count > 0:
        save_library(data)
        print(f"\n✓ Updated {updated_count} cover paths in library.json")
    else:
        print("\n✓ No updates needed")


if __name__ == "__main__":
    update_cover_paths_to_webp()

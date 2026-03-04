#!/usr/bin/env python3
"""
既存の画像ファイルをWebPに変換するスクリプト
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from media_utils import convert_image_to_webp
from paths import MEDIA_DIR


def convert_existing_images():
    """既存のカバー画像をWebPに変換"""
    image_extensions = {".jpg", ".jpeg", ".png", ".avif"}
    converted_count = 0
    skipped_count = 0
    failed_count = 0
    
    print(f"Scanning directory: {MEDIA_DIR}")
    
    for image_path in MEDIA_DIR.iterdir():
        if not image_path.is_file():
            continue
        
        if image_path.suffix.lower() not in image_extensions:
            continue
        
        # 既にWebPがある場合はスキップ
        webp_path = image_path.with_suffix(".webp")
        if webp_path.exists():
            print(f"Skipped (WebP exists): {image_path.name}")
            skipped_count += 1
            continue
        
        print(f"Converting: {image_path.name} -> {webp_path.name}")
        
        try:
            image_data = image_path.read_bytes()
            if convert_image_to_webp(image_data, webp_path):
                print(f"  ✓ Converted successfully")
                # 元のファイルを削除
                image_path.unlink()
                print(f"  ✓ Removed original file")
                converted_count += 1
            else:
                print(f"  ✗ Conversion failed")
                failed_count += 1
        except Exception as e:
            print(f"  ✗ Error: {e}")
            failed_count += 1
    
    print("\n" + "="*50)
    print(f"Conversion complete!")
    print(f"  Converted: {converted_count}")
    print(f"  Skipped:   {skipped_count}")
    print(f"  Failed:    {failed_count}")
    print("="*50)
    
    if converted_count > 0:
        print("\n⚠️  library.jsonのカバーパス更新が必要です")
        print("   次のスクリプトを実行してください:")
        print("   python server/update_cover_paths.py")


if __name__ == "__main__":
    convert_existing_images()

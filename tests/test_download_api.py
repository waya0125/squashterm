import requests
import json

# --- 設定: テスト対象のURLをここで定義 ---
API_BASE_URL = "http://localhost:8000"
TEST_URL_YOUTUBE = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
TEST_URL_NICONICO = "https://www.nicovideo.jp/watch/sm13256898"

# エンドポイント
ENDPOINT = f"{API_BASE_URL}/api/library/download"

def run_download_test(label, target_url):
    """ダウンロード処理の共通テスト関数"""
    print(f"\n[Test] {label}: {target_url}")
    
    payload = {
        "url": target_url
    }
    
    try:
        response = requests.post(ENDPOINT, json=payload)
        
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            # 1曲登録（track_idがある）か、複数曲登録（share_linksがある）かを確認
            if "track_id" in data:
                print(f"Success! Track ID: {data['track_id']}")
            elif "share_links" in data:
                print(f"Success! {len(data['share_links'])} tracks found.")
            
            print(f"Response Body: {json.dumps(data, indent=2, ensure_ascii=False)}")
        else:
            print(f"Failed: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print(f"Error: サーバー（{API_BASE_URL}）に接続できません。")

if __name__ == "__main__":
    # 1. YouTubeのテスト
    run_download_test("YouTube Single Download", TEST_URL_YOUTUBE)
    
    # 2. ニコニコ動画のテスト
    run_download_test("Niconico Single Download", TEST_URL_NICONICO)

    print("\n--- テスト完了 ---")
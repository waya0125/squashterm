#!/usr/bin/env python3
import json
from ytdlp_api_service import resolve_soundcloud_source_urls

if __name__ == '__main__':
    res = resolve_soundcloud_source_urls()
    out_path = '/app/server/data/resolve_soundcloud_result.json'
    log_path = '/app/server/data/resolve_soundcloud_job.log'
    with open(out_path, 'w') as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    with open(log_path, 'a') as f:
        f.write('completed\n')
    print(json.dumps(res, ensure_ascii=False))

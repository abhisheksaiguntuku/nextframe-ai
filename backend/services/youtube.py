from googleapiclient.discovery import build
import httpx
from config import settings
import re

async def fetch_channel_data(handle: str) -> dict:
    if not settings.youtube_api_key:
        return {
            "channel_id": "UC_mock123",
            "handle": handle,
            "subscriber_count": 15000,
            "view_count": 1200000,
            "video_count": 85,
            "recent_videos": []
        }
        
    try:
        query_param = ""
        if handle.startswith("UC") and len(handle) == 24:
            query_param = f"id={handle}"
        else:
            if handle.startswith('@'):
                handle = handle[1:]
            query_param = f"forHandle={handle}"
            
        url = f"https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet,contentDetails&{query_param}&key={settings.youtube_api_key}"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            data = resp.json()
            if "error" in data:
                print(f"YOUTUBE API ERROR ({data['error'].get('status')}): {data['error'].get('message')}")
                return None
            if not data.get("items"):
                print(f"YOUTUBE API: No items found for handle {handle}")
                return None
                
            item = data["items"][0]
            stats = item.get("statistics", {})
            return {
                "channel_id": item["id"],
                "handle": f"@{handle}",
                "subscriber_count": int(stats.get("subscriberCount", 0)),
                "view_count": int(stats.get("viewCount", 0)),
                "video_count": int(stats.get("videoCount", 0)),
                "recent_videos": []
            }
    except Exception as e:
        print(f"YouTube Error: {e}")
        return None

async def fetch_video_comments(video_url: str) -> list[str]:
    if not settings.youtube_api_key:
        return ["Great video!", "Loved this", "Not bad, could be better", "Amazing content"]
        
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", video_url)
    if not match: return []
    video_id = match.group(1)
    
    url = f"https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId={video_id}&maxResults=20&key={settings.youtube_api_key}"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            data = resp.json()
            items = data.get("items", [])
            return [i["snippet"]["topLevelComment"]["snippet"]["textDisplay"] for i in items]
    except Exception:
        return []

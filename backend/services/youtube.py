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
        # Strip full YouTube URLs to just the handle or ID
        # e.g. https://www.youtube.com/@MrBeast → MrBeast
        # e.g. https://www.youtube.com/channel/UCX6OQ3DkcsbYNE6H8uQQuVA → UCX6OQ3DkcsbYNE6H8uQQuVA
        if "youtube.com/channel/" in handle:
            handle = handle.split("youtube.com/channel/")[-1].split("/")[0].strip()
        elif "youtube.com/@" in handle:
            handle = handle.split("youtube.com/@")[-1].split("/")[0].strip()
        elif "youtube.com/" in handle:
            handle = handle.split("youtube.com/")[-1].split("/")[0].strip()

        query_param = ""
        if handle.startswith("UC") and len(handle) >= 20:
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
                print(f"YOUTUBE API: No items found for handle/id: {handle}")
                return None
                
            item = data["items"][0]
            stats = item.get("statistics", {})
            content_details = item.get("contentDetails", {})
            uploads_id = content_details.get("relatedPlaylists", {}).get("uploads")
            snippet = item.get("snippet", {})
            display_handle = snippet.get("customUrl", f"@{handle}")
            
            return {
                "channel_id": item["id"],
                "handle": display_handle,
                "subscriber_count": int(stats.get("subscriberCount", 0)),
                "view_count": int(stats.get("viewCount", 0)),
                "video_count": int(stats.get("videoCount", 0)),
                "uploads_playlist_id": uploads_id,
                "recent_videos": []
            }
    except Exception as e:
        print(f"YouTube Error: {e}")
        return None

async def fetch_recent_video_stats(playlist_id: str, count: int = 50) -> list[dict]:
    """Fetches the last N videos from an uploads playlist including their publish time and performance stats."""
    if not settings.youtube_api_key or not playlist_id:
        return []
        
    try:
        # Step 1: Get latest video IDs and publish times from playlist
        url = f"https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId={playlist_id}&maxResults={count}&key={settings.youtube_api_key}"
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            items = resp.json().get("items", [])
            
            if not items: return []
            
            video_data = []
            video_ids = []
            
            for item in items:
                vid_id = item["contentDetails"]["videoId"]
                video_ids.append(vid_id)
                video_data.append({
                    "id": vid_id,
                    "published_at": item["snippet"]["publishedAt"]
                })
                
            # Step 2: Get statistics for these videos
            stats_url = f"https://www.googleapis.com/youtube/v3/videos?part=statistics&id={','.join(video_ids)}&key={settings.youtube_api_key}"
            stats_resp = await client.get(stats_url)
            stats_items = stats_resp.json().get("items", [])
            
            stats_map = {i["id"]: i["statistics"] for i in stats_items}
            
            for v in video_data:
                s = stats_map.get(v["id"], {})
                v["views"] = int(s.get("viewCount", 0))
                v["likes"] = int(s.get("likeCount", 0))
                
            return video_data
    except Exception as e:
        print(f"YouTube History Error: {e}")
        return []

async def fetch_video_details(video_url: str) -> dict:
    if not settings.youtube_api_key:
        return {"title": "Mock Video Title", "description": "This is a mock description for testing repurposing logic."}
        
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11}).*", video_url)
    if not match: return None
    video_id = match.group(1)
    
    url = f"https://www.googleapis.com/youtube/v3/videos?part=snippet&id={video_id}&key={settings.youtube_api_key}"
    try:
        async with httpx.AsyncClient() as client:
            resp = await client.get(url)
            data = resp.json()
            if not data.get("items"): return None
            snippet = data["items"][0]["snippet"]
            return {
                "video_id": video_id,
                "title": snippet.get("title"),
                "description": snippet.get("description")
            }
    except Exception:
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

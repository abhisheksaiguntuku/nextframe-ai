from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from routes.core import get_current_user
from database import channels_collection

router = APIRouter()

async def get_channel_context(user_id: str) -> str:
    channel = await channels_collection.find_one({"user_id": user_id})
    if channel:
        return f"Handle: {channel.get('handle')}, Subscribers: {channel.get('subscriber_count', 0)}, Views: {channel.get('view_count', 0)}, Total Videos: {channel.get('video_count', 0)}"
    return None

class SentimentRequest(BaseModel):
    video_url: str

@router.post("/sentiment")
async def ai_sentiment(req: SentimentRequest, current_user: dict = Depends(get_current_user)):
    from services.youtube import fetch_video_comments
    from services.openai_service import analyze_sentiment
    comments = await fetch_video_comments(req.video_url)
    if not comments:
        raise HTTPException(status_code=400, detail="Could not fetch comments or no comments available")
    
    result = await analyze_sentiment(comments)
    return result

class SEORequest(BaseModel):
    title: str
    topic: str

@router.post("/seo")
async def ai_seo(req: SEORequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import get_seo_suggestions
    ctx = await get_channel_context(str(current_user["_id"]))
    result = await get_seo_suggestions(req.title, req.topic, ctx)
    return result

class PredictRequest(BaseModel):
    title: str
    tags: str
    category: str

@router.post("/predict")
async def ai_predict(req: PredictRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import predict_video_success
    ctx = await get_channel_context(str(current_user["_id"]))
    result = await predict_video_success(req.title, req.tags, req.category, ctx)
    return result

class CompetitorRequest(BaseModel):
    competitor_channel: str

@router.post("/competitor")
async def ai_competitor(req: CompetitorRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import analyze_competitor
    ctx = await get_channel_context(str(current_user["_id"]))
    result = await analyze_competitor(req.competitor_channel, ctx)
    return result

class NicheRequest(BaseModel):
    niche: str

@router.post("/trends")
async def ai_trends(req: NicheRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import get_trending_ideas
    ctx = await get_channel_context(str(current_user["_id"]))
    return await get_trending_ideas(req.niche, ctx)

async def get_timing_context(user_id: str) -> str:
    from services.youtube import fetch_recent_video_stats
    from datetime import datetime
    
    channel = await channels_collection.find_one({"user_id": user_id})
    if not channel or not channel.get("uploads_playlist_id"):
        return "No historical channel data available."
        
    videos = await fetch_recent_video_stats(channel["uploads_playlist_id"], count=50)
    if not videos:
        return "No recent video performance data found."
        
    # Analyze views per day/hour
    stats = {} # (day, hour) -> [views]
    for v in videos:
        dt = datetime.fromisoformat(v["published_at"].replace("Z", "+00:00"))
        key = (dt.strftime("%A"), dt.hour)
        if key not in stats: stats[key] = []
        stats[key].append(v["views"])
        
    # Calculate averages and find top windows
    averages = []
    for (day, hour), viewsList in stats.items():
        avg = sum(viewsList) / len(viewsList)
        averages.append({"day": day, "hour": hour, "avg": avg})
        
    # Sort and take top 3
    top_3 = sorted(averages, key=lambda x: x["avg"], reverse=True)[:3]
    
    context = "ACTUAL CHANNEL HISTORY (Use this for primary decision making):\n"
    for idx, win in enumerate(top_3):
        # Convert 24h to 12h for AI readability
        h12 = win["hour"] % 12 or 12
        ampm = "AM" if win["hour"] < 12 else "PM"
        context += f"Success Window {idx+1}: {win['day']} around {h12}:00 {ampm} (Average Views: {int(win['avg'])})\n"
        
    return context

@router.post("/best-time")
async def ai_best_time(req: NicheRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import get_best_time
    uid = str(current_user["_id"])
    ctx = await get_channel_context(uid)
    timing_ctx = await get_timing_context(uid)
    
    combined_ctx = f"{ctx}\n\n{timing_ctx}" if ctx else timing_ctx
    return await get_best_time(req.niche, combined_ctx)

class TopicRequest(BaseModel):
    topic: str

@router.post("/persona")
async def ai_persona(req: NicheRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import get_audience_persona
    ctx = await get_channel_context(str(current_user["_id"]))
    return await get_audience_persona(req.niche, ctx)

@router.post("/strategy")
async def ai_strategy(req: TopicRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import get_content_strategy
    ctx = await get_channel_context(str(current_user["_id"]))
    return await get_content_strategy(req.topic, ctx)

@router.post("/script")
async def ai_script(req: TopicRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import generate_script
    ctx = await get_channel_context(str(current_user["_id"]))
    return await generate_script(req.topic, ctx)

@router.post("/title-ab")
async def ai_title_ab(req: TopicRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import generate_title_ab
    ctx = await get_channel_context(str(current_user["_id"]))
    return await generate_title_ab(req.topic, ctx)

class ThumbnailRequest(BaseModel):
    topic: str
    style: str = "Realistic"

@router.post("/thumbnail")
async def ai_thumbnail(req: ThumbnailRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import generate_thumbnail
    ctx = await get_channel_context(str(current_user["_id"]))
    return await generate_thumbnail(req.topic, ctx, req.style)

class RepurposeRequest(BaseModel):
    video_url: str

@router.post("/repurpose")
async def ai_repurpose(req: RepurposeRequest, current_user: dict = Depends(get_current_user)):
    from services.youtube import fetch_video_details
    from services.openai_service import repurpose_to_shorts
    
    details = await fetch_video_details(req.video_url)
    if not details:
        raise HTTPException(status_code=400, detail="Invalid YouTube URL or video not found")
        
    ctx = await get_channel_context(str(current_user["_id"]))
    return await repurpose_to_shorts(details["video_id"], details["title"], details["description"], ctx)

@router.post("/generate-image-preview")
async def ai_image_preview(req: ThumbnailRequest, current_user: dict = Depends(get_current_user)):
    # Simple proxy to external generator or prompt logic
    # For now, we return the URL for Pollinations directly
    import random
    seed = random.randint(1, 999999)
    # Using the topic and style to build a clean prompt for the direct API
    clean_prompt = f"{req.topic} {req.style} style high resolution youtube thumbnail concept"
    url = f"https://image.pollinations.ai/prompt/{clean_prompt.replace(' ', '%20')}?seed={seed}&width=1024&height=1024&nologo=true"
    return {"image_url": url}

@router.post("/recommendations")
async def ai_recommend(req: TopicRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import smart_recommendations
    ctx = await get_channel_context(str(current_user["_id"]))
    return await smart_recommendations(req.topic, ctx)

@router.post("/calendar")
async def ai_calendar(req: NicheRequest, current_user: dict = Depends(get_current_user)):
    from services.youtube import fetch_recent_video_stats
    from services.openai_service import get_30_day_calendar
    
    uid = str(current_user["_id"])
    ctx = await get_channel_context(uid)
    
    history_titles = []
    channel = await channels_collection.find_one({"user_id": uid})
    if channel and channel.get("uploads_playlist_id"):
        recent = await fetch_recent_video_stats(channel["uploads_playlist_id"], count=10)
        history_titles = [v.get("title", "") for v in recent]
    
    history_ctx = ", ".join(history_titles) if history_titles else "New channel, no history yet."
    return await get_30_day_calendar(req.niche, ctx, history_ctx)

@router.post("/report")
async def ai_report(req: TopicRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import generate_report
    ctx = await get_channel_context(str(current_user["_id"]))
    return await generate_report(req.topic, ctx)

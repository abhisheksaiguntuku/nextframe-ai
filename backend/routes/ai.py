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

@router.post("/best-time")
async def ai_best_time(req: NicheRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import get_best_time
    ctx = await get_channel_context(str(current_user["_id"]))
    return await get_best_time(req.niche, ctx)

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

@router.post("/thumbnail")
async def ai_thumbnail(req: TopicRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import generate_thumbnail
    ctx = await get_channel_context(str(current_user["_id"]))
    return await generate_thumbnail(req.topic, ctx)

@router.post("/recommendations")
async def ai_recommend(req: TopicRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import smart_recommendations
    ctx = await get_channel_context(str(current_user["_id"]))
    return await smart_recommendations(req.topic, ctx)

@router.post("/report")
async def ai_report(req: TopicRequest, current_user: dict = Depends(get_current_user)):
    from services.openai_service import generate_report
    ctx = await get_channel_context(str(current_user["_id"]))
    return await generate_report(req.topic, ctx)

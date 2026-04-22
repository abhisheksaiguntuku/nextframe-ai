import openai
from config import settings
import json

client = openai.AsyncOpenAI(
    api_key=settings.groq_api_key,
    base_url="https://api.groq.com/openai/v1"
) if settings.groq_api_key and settings.groq_api_key != "mock" else None

from fastapi import HTTPException

_response_cache = {}

async def _call_openai(prompt: str, mock_data: dict, keys_desc: dict) -> dict:
    if not settings.groq_api_key or settings.groq_api_key == "mock" or client is None:
        return mock_data
        
    if prompt in _response_cache:
        return _response_cache[prompt]
        
    system_prompt = (
        "You are an exclusive YouTube strategist AI. You MUST return ONLY valid JSON. "
        "CRITICAL: Your suggestions MUST be unique, highly personalized, and strategically aligned with the specific brand and channel metadata provided. "
        "DO NOT give generic advice that could apply to any random user. Your goal is to provide a competitive edge unique to this exact channel."
        f"Schema: {json.dumps(keys_desc)}"
    )
    
    try:
        response = await client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.2
        )
        result = json.loads(response.choices[0].message.content)
        _response_cache[prompt] = result
        return result
    except Exception as e:
        print(f"AI PARSING ERROR: {str(e)}")
        return mock_data

async def analyze_sentiment(comments: list[str]) -> dict:
    keys = {"positive": "integer percent", "negative": "integer percent", "neutral": "integer percent", "summary": "string"}
    prompt = (
        "Analyze the sentiment of these YouTube comments. "
        "Provide a summary that directly addresses the creator by their style/handle if available. "
        "Comments:\n" + "\n".join(comments[:20])
    )
    mock = {"positive": 60, "negative": 20, "neutral": 20, "summary": "[MOCKED] The comments show overwhelmingly positive reactions regarding your high production quality. However, a small minority raised concerns about the video length."}
    return await _call_openai(prompt, mock, keys)

async def get_seo_suggestions(title: str, topic: str, channel_context: str = None) -> dict:
    keys = {"seo_score": "int", "better_titles": ["string"], "tags": ["string"], "advice": "string"}
    prompt = f"Optimize SEO for a YouTube video. Current title: '{title}', Topic: '{topic}'."
    if channel_context: 
        prompt += f"\nCHANNEL BRAND SEED: {channel_context}. "
        prompt += "Your title suggestions must match this channel's established tone and scale. No generic viral bait."
    mock = {"seo_score": 85, "better_titles": ["Ultimate Complete Guide", "You Won't Believe This Review!"], "tags": ["review", "guide", "tech", "tutorial", "2024"], "advice": "[MOCKED] Use more high-volume keywords in your first paragraph of the description."}
    return await _call_openai(prompt, mock, keys)

async def predict_video_success(title: str, tags: str, category: str, channel_context: str = None) -> dict:
    keys = {"score": "int", "virality": "string", "expected_views": "string", "improvements": "string"}
    prompt = f"Predict YouTube video success for {title} in {category}. Tags: {tags}."
    if channel_context: 
        prompt += f"\nBASE PERFORMANCE DATA: {channel_context}. "
        prompt += "Evaluate success strictly based on this channel's historical scale and audience habits."
    mock = {"score": 75, "virality": "Medium", "expected_views": "10k-50k views", "improvements": "[MOCKED] The title targets a highly saturated category. Try to narrow your niche tag focus."}
    return await _call_openai(prompt, mock, keys)

async def analyze_competitor(channel_name: str, channel_context: str = None) -> dict:
    keys = {"gap_score": "int", "missed_topics": ["string"], "recommendations": "string"}
    prompt = f"Perform a highly detailed strategist analysis on competitor YouTube channel: '{channel_name}'. Evaluate their missed opportunities and generate a realistic gap score."
    if channel_context: prompt += f" Compare to my channel: {channel_context}"
    mock = {"gap_score": 88, "missed_topics": ["Advanced Workflows", "Live Case Studies", "Beginner Explanations"], "recommendations": "[MOCKED] This competitor dominates top-of-funnel content but neglects in-depth, real-time live demonstrations. Fill this gap."}
    return await _call_openai(prompt, mock, keys)

async def get_trending_ideas(niche: str, channel_context: str = None) -> dict:
    keys = {"trending_topics": ["string"], "viral_ideas": ["string"]}
    prompt = f"Find 5 current viral trending topics and 5 viral ideas in this niche/context: '{niche}'."
    if channel_context: prompt += f" My channel context: {channel_context}"
    mock = {"trending_topics": ["AI Automation in 2024", "No-code Platforms", "GPT-4 Prompts", "OpenAI Sora", "Local LLMs"], "viral_ideas": ["I Survived 100 Days Relying Only on AI", "Why 99% of Developers Fail Formatting", "OpenAI DevDay Reacts"]}
    return await _call_openai(prompt, mock, keys)

async def get_best_time(niche: str, channel_context: str = None) -> dict:
    keys = {
        "best_day": "string", 
        "best_time": "string", 
        "confidence": "string",
        "top_windows": ["string (Day at Time)"],
        "reasoning": "string"
    }
    prompt = f"Find the absolute best Day and Time to post for: '{niche}'."
    if channel_context:
        prompt += f"\nCRITICAL: Use this historical channel data to inform your decision. If the history shows specific peak days/hours, prioritize them: {channel_context}"
    
    mock = {
        "best_day": "Friday", 
        "best_time": "3:00 PM EST", 
        "confidence": "92%",
        "top_windows": ["Friday at 3:00 PM", "Saturday at 10:00 AM", "Wednesday at 6:00 PM"],
        "reasoning": "[MOCKED] Based on your historical data, your audience engagement peaks significantly on Friday afternoons, likely because of your high student-creator demographics."
    }
    return await _call_openai(prompt, mock, keys)

async def get_audience_persona(niche: str, channel_context: str = None) -> dict:
    keys = {"demographics": "string", "psychographics": "string", "pain_points": ["string"]}
    prompt = f"Build a unique audience persona for: '{niche}'."
    if channel_context: 
        prompt += f"\nCHANNEL IDENTITY: {channel_context}. "
        prompt += "Identify the exact sub-persona that currently watches this channel, not just the general niche."
    mock = {"demographics": "25-34 year old males, highly educated, urban living", "psychographics": "Tech early adopters who value efficiency and automated workflows.", "pain_points": ["Overwhelming setup processes", "Debugging cryptic errors", "Time constraints"]}
    return await _call_openai(prompt, mock, keys)

async def get_content_strategy(topic: str, channel_context: str = None) -> dict:
    keys = {"pillar_videos": ["string"], "short_form": ["string"], "community_posts": ["string"]}
    prompt = f"Create a comprehensive YouTube strategy for: '{topic}'."
    if channel_context: prompt += f" Base strategy on: {channel_context}"
    mock = {"pillar_videos": ["Full 30-Min Masterclass", "Top 10 Tools Review", "Interviews with Experts"], "short_form": ["60s Rapid Tips", "Behind the Scenes Workflows", "Common Mistakes Shorts"], "community_posts": ["A/B Thumbnail Polls", "Weekly Highlights", "Question of the Day"]}
    return await _call_openai(prompt, mock, keys)

async def generate_script(topic: str, channel_context: str = None) -> dict:
    keys = {"hook": "string", "body": "string", "call_to_action": "string"}
    prompt = f"Write a YouTube script framework for: '{topic}'."
    if channel_context: 
        prompt += f"\nBRAND PERSONALITY: {channel_context}. "
        prompt += "Write the hook and tone to be 100% consistent with this creator's style and audience expectations. Ensure it is unique to them."
    mock = {"hook": "Stop doing this wrong, I am about to show you exactly how to 10x your output starting right now.", "body": "The meat of the video where we discuss setting expectations. Let me show you my screen. Step 1 is...", "call_to_action": "If this saved you hours of debugging, drop a like and subscribe for more developer tools."}
    return await _call_openai(prompt, mock, keys)

async def generate_title_ab(topic: str, channel_context: str = None) -> dict:
    keys = {"titles": ["string"]}
    prompt = f"Generate 5 highly clickable YouTube video titles for: '{topic}'."
    if channel_context: prompt += f" Tailor for audience: {channel_context}"
    mock = {"titles": ["The PERFECT strategy for beginners", "Why you are failing (and how to fix it)", "Stop rushing: A 2024 Masterclass", "I Tried It For 30 Days", "The Secret Tool NO ONE Uses"]}
    return await _call_openai(prompt, mock, keys)

async def generate_thumbnail(topic: str, channel_context: str = None, style: str = "Realistic") -> dict:
    keys = {"visual_concept": "string", "text_overlay": "string", "image_prompt": "string"}
    prompt = f"Design a highly clickable YouTube thumbnail concept for: '{topic}'. Style: {style}."
    if channel_context:
        prompt += f" Brand Identity: {channel_context}."
    
    prompt += f" \nCRITICAL: Provide a detailed 'image_prompt' specifically for an AI image generator to create this {style} visual. Keep it under 200 words."
    
    mock = {
        "visual_concept": f"A high-contrast {style} visual featuring a centralized subject related to {topic}.",
        "text_overlay": "CRAZY RESULTS!",
        "image_prompt": f"Professional {style} photography of {topic}, high contrast, YouTube style thumbnail design, 8k resolution, cinematic lighting."
    }
    return await _call_openai(prompt, mock, keys)

async def repurpose_to_shorts(video_id: str, title: str, description: str, channel_context: str = None) -> dict:
    keys = {
        "viral_packs": [
            {"short_title": "string", "hook": "string", "script_body": "string", "cta": "string", "visual_cue": "string"}
        ]
    }
    prompt = f"Repurpose this long-form video into 5 viral YouTube Shorts. Title: {title}. Description: {description}."
    if channel_context:
        prompt += f"\nCHANNEL BRANDING: {channel_context}. Ensure the voice is unique to this brand."
    
    mock = {
        "viral_packs": [
            {
                "short_title": "The Secret Hack",
                "hook": "You've been doing this wrong your whole life!",
                "script_body": "Every single creator misses this one step when starting out. Here is why...",
                "cta": "Check the full video for the setup!",
                "visual_cue": "Fast cuts between a confused face and a red error screen."
            }
        ] * 5
    }
    return await _call_openai(prompt, mock, keys)

async def smart_recommendations(topic: str, channel_context: str = None) -> dict:
    keys = {"immediate_actions": ["string"], "long_term_goals": ["string"]}
    prompt = f"Give actionable YouTube growth advice for channel context: '{topic}'."
    if channel_context: prompt += f" Target channel constraints: {channel_context}"
    mock = {"immediate_actions": ["Change your current channel banner to include upload schedule", "Update the outdated links in your about page"], "long_term_goals": ["Build a Discord community", "Establish a Patreon"]}
    return await _call_openai(prompt, mock, keys)

async def get_30_day_calendar(niche: str, channel_context: str = None, history_context: str = None) -> dict:
    keys = {
        "monthly_angle": "string",
        "calendar": [
            {"day": "int", "title": "string", "format": "Short or Long", "strategy": "string", "brief": "string"}
        ]
    }
    prompt = f"Generate a unique 30-day YouTube content calendar for a channel in the '{niche}' category."
    if channel_context:
        prompt += f"\nCHANNEL BRANDING: {channel_context}."
    if history_context:
        prompt += f"\nHISTORY LOCK (Do not repeat these topics): {history_context}."
    
    prompt += (
        "\nCRITICAL INSTRUCTIONS:"
        "\n1. Mix both Shorts (for subs) and Long-form (for revenue)."
        "\n2. Assign a unique 'monthly_angle' based on the channel handle/context."
        "\n3. Ensure EVERY title is highly clickable and brand-aligned."
        "\n4. Generate EXACTLY 30 entries."
    )
    
    mock = {
        "monthly_angle": "[MOCKED] The Educational Leader",
        "calendar": [
            {"day": i, "title": f"Viral {niche} Hack #{i}", "format": "Short" if i % 2 == 0 else "Long", "strategy": "Growth", "brief": "Focus on high retention hooks."} 
            for i in range(1, 31)
        ]
    }
    return await _call_openai(prompt, mock, keys)

async def generate_report(topic: str, channel_context: str = None) -> dict:
    keys = {"executive_summary": "string", "metrics_to_watch": ["string"], "final_verdict": "string"}
    prompt = f"Generate an AI executive growth report for: '{topic}'."
    if channel_context: prompt += f" Base numbers on: {channel_context}"
    mock = {"executive_summary": "Your growth trajectory looks highly promising. Engagement is spiking relative to historical trends, signaling an algorithmic breakout.", "metrics_to_watch": ["Click-Through Rate (CTR)", "Average View Duration (AVD)", "Returning Viewer Volume"], "final_verdict": "Keep pushing daily uploads."}
    return await _call_openai(prompt, mock, keys)

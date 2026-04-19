import asyncio
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from services.openai_service import get_trending_ideas, get_seo_suggestions, predict_video_success, analyze_competitor

async def main():
    print("Testing get_trending_ideas...")
    res1 = await get_trending_ideas('tech')
    print("1:", res1)
    
    print("Testing get_seo_suggestions...")
    res2 = await get_seo_suggestions('test', 'test')
    print("2:", res2)

    print("Testing predict_video_success...")
    res3 = await predict_video_success('a', 'b', 'c')
    print("3:", res3)
    
    print("Testing analyze_competitor...")
    res4 = await analyze_competitor('test')
    print("4:", res4)

if __name__ == "__main__":
    asyncio.run(main())

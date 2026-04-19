import httpx
import asyncio

key = "AIzaSyDOOqAOq-bqAkY_BcZA3Pn0VprFnRpYQ28"

async def main():
    async with httpx.AsyncClient() as client:
        res = await client.get(f"https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=@MrBeast&key={key}")
        print("Response @MrBeast:")
        print(res.json())
        
        res2 = await client.get(f"https://www.googleapis.com/youtube/v3/channels?part=statistics&forHandle=MrBeast&key={key}")
        print("Response MrBeast:")
        print(res2.json())

if __name__ == "__main__":
    asyncio.run(main())

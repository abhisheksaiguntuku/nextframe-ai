from motor.motor_asyncio import AsyncIOMotorClient
from config import settings

client = AsyncIOMotorClient(settings.mongodb_url)
db = client[settings.database_name]

users_collection = db.get_collection("users")
channels_collection = db.get_collection("channels")
cache_collection = db.get_collection("cache")

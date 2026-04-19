from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel
from database import users_collection, channels_collection
import jwt
from config import settings

router = APIRouter()

async def get_current_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        # Also check authorization header as fallback
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            raise HTTPException(status_code=401, detail="Not authenticated")
    else:
        scheme, token_data = token.split() if " " in token else ("Bearer", token)
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid scheme")
        token = token_data
            
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        email = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
        
    user = await users_collection.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")
    return user

@router.get("/dashboard")
async def get_dashboard(current_user: dict = Depends(get_current_user)):
    from services.youtube import fetch_channel_data
    
    user_id = str(current_user["_id"])
    channel = await channels_collection.find_one({"user_id": user_id})
    if not channel:
        return {"has_channel": False, "user_info": {"username": current_user["username"], "email": current_user["email"]}}
    
    # Background refresh of statistics
    try:
        fresh_data = await fetch_channel_data(channel["handle"])
        if fresh_data:
            await channels_collection.update_one({"user_id": user_id}, {"$set": fresh_data})
            # Merge fresh stats to return instantly
            channel.update(fresh_data)
    except Exception as e:
        print(f"Failed to refresh stats: {e}")
        pass # silently fail and return cached data
    
    # Strip object ID
    channel["_id"] = str(channel["_id"])
    return {
        "has_channel": True,
        "channel_data": channel,
        "user_info": {
            "username": current_user["username"],
            "email": current_user["email"]
        }
    }

class ConnectRequest(BaseModel):
    channel_handle: str

@router.post("/connect")
async def connect_channel(req: ConnectRequest, current_user: dict = Depends(get_current_user)):
    from services.youtube import fetch_channel_data
    
    channel_info = await fetch_channel_data(req.channel_handle)
    if not channel_info:
        raise HTTPException(status_code=400, detail="Channel not found")
        
    user_id = str(current_user["_id"])
    channel_info["user_id"] = user_id
    
    await channels_collection.update_one(
        {"user_id": user_id},
        {"$set": channel_info},
        upsert=True
    )
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"has_channel": True}}
    )
    return {"message": "Channel connected successfully", "data": channel_info}

@router.delete("/connect")
async def disconnect_channel(current_user: dict = Depends(get_current_user)):
    user_id = str(current_user["_id"])
    await channels_collection.delete_one({"user_id": user_id})
    await users_collection.update_one(
        {"_id": current_user["_id"]},
        {"$set": {"has_channel": False}}
    )
    return {"message": "Channel disconnected successfully"}

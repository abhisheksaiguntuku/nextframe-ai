from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: str = Field(alias="_id", default=None)
    hashed_password: str
    has_channel: bool = False

class Channel(BaseModel):
    user_id: str
    channel_id: str
    channel_url: Optional[str] = None
    handle: Optional[str] = None
    subscriber_count: int = 0
    view_count: int = 0
    video_count: int = 0
    recent_videos: List[dict] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)

from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from pydantic import BaseModel, EmailStr
from utils.security import verify_password, get_password_hash, create_access_token
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from database import users_collection
from models import UserCreate, UserInDB
from datetime import timedelta
from config import settings

router = APIRouter()

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/register", response_model=Token)
async def register(user: UserCreate, response: Response):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = {
        "username": user.username,
        "email": user.email,
        "hashed_password": hashed_password,
        "has_channel": False
    }
    result = await users_collection.insert_one(new_user)
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.access_token_expire_minutes * 60,
        samesite="lax",
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=Token)
async def login(req: LoginRequest, response: Response):
    user = await users_collection.find_one({"email": req.email})
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=settings.access_token_expire_minutes * 60,
        samesite="lax",
    )
    return {"access_token": access_token, "token_type": "bearer"}

class GoogleAuthRequest(BaseModel):
    credential: str

@router.post("/google", response_model=Token)
async def google_auth(req: GoogleAuthRequest, response: Response):
    try:
        # Note: You still need to place your valid Google client ID in your .env
        client_id_temp = settings.google_client_id if hasattr(settings, 'google_client_id') else "temp"
        
        idinfo = id_token.verify_oauth2_token(req.credential, google_requests.Request(), client_id_temp, clock_skew_in_seconds=60)
        email = idinfo['email']
        username = idinfo.get('name', email.split("@")[0])
        
        user = await users_collection.find_one({"email": email})
        if not user:
            new_user = {
                "username": username,
                "email": email,
                "hashed_password": "", 
                "has_channel": False
            }
            await users_collection.insert_one(new_user)
            user = await users_collection.find_one({"email": email})
            
        access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
        access_token = create_access_token(
            data={"sub": email}, expires_delta=access_token_expires
        )
        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            max_age=settings.access_token_expire_minutes * 60,
            samesite="lax",
        )
        return {"access_token": access_token, "token_type": "bearer"}
    except ValueError as e:
        print(f"FAILED TO VERIFY GOOGLE TOKEN: {str(e)}")
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    return {"message": "Logged out successfully"}

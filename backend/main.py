from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from routes import auth, core, ai
import os

app = FastAPI(title="NextFrame AI API", version="1.0.0")

# Allow both local dev and the production Vercel frontend
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

# In production, FRONTEND_URL env var is set to your Vercel URL
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(core.router, prefix="/channel", tags=["Core"])
app.include_router(ai.router, prefix="/ai", tags=["AI"])

@app.get("/")
async def root():
    return {"message": "NextFrame AI API is live 🚀"}

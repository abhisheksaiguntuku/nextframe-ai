from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "nextframe_ai"
    jwt_secret: str = "SUPER_SECRET_KEY_CHANGE_ME"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24 * 7 
    groq_api_key: str = ""
    youtube_api_key: str = ""
    google_client_id: str = ""

    class Config:
        env_file = ".env"

settings = Settings()

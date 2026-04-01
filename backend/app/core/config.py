from pydantic_settings import BaseSettings
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseSettings):
    SUPABASE_URL: str
    SUPABASE_KEY: str
    GEMINI_API_KEY: str
    APP_ENV: str = "development"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
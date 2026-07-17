# Configuration

from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Demo access is intentionally limited to one shared account. Set these in the
# deployment environment; credentials are never included in source code.
MASTER_USERNAME = os.getenv("MASTER_USERNAME")
MASTER_PASSWORD = os.getenv("MASTER_PASSWORD")
SESSION_SECRET = os.getenv("SESSION_SECRET")
SESSION_DURATION_SECONDS = int(os.getenv("SESSION_DURATION_SECONDS", "28800"))
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() == "true"
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

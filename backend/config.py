import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # ── Flask secret key (for session signing)
    SECRET_KEY = os.getenv("SECRET_KEY", "ait-placement-super-secret-key-2025")

    # ── JWT settings
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "ait-jwt-super-secret-2025")
    JWT_ACCESS_TOKEN_EXPIRES = 86400   # 24 hours in seconds

    # ── SQLite database file path
    DATABASE_PATH = os.getenv("DATABASE_PATH", "./ait_placement.db")

    # ── Server port
    PORT = int(os.getenv("PORT", 5000))

    # ── CORS allowed origin (React dev server)
    CORS_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]

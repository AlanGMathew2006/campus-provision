import os
from dataclasses import dataclass
from pathlib import Path

from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / ".env")


@dataclass(frozen=True)
class Settings:
	mongo_uri: str = os.getenv("MONGO_URI", "mongodb://localhost:27017")
	mongo_db: str = os.getenv("MONGO_DB", "campusprovision")
	jwt_secret: str = os.getenv("JWT_SECRET", "change-me")
	jwt_algorithm: str = os.getenv("JWT_ALGORITHM", "HS256")
	access_token_expire_minutes: int = int(
		os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
	)


settings = Settings()

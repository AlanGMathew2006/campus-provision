from datetime import datetime, timedelta

from jose import jwt

from app.core.config import settings


def create_access_token(subject: str, expires_minutes: int | None = None) -> str:
	expire_minutes = (
		settings.access_token_expire_minutes
		if expires_minutes is None
		else expires_minutes
	)
	expire = datetime.utcnow() + timedelta(minutes=expire_minutes)
	payload = {"sub": subject, "exp": expire}
	return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)

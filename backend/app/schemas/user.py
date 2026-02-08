from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
	name: str = Field(..., min_length=1, max_length=100)
	email: EmailStr
	password: str = Field(..., min_length=6)


class UserLogin(BaseModel):
	email: EmailStr
	password: str = Field(..., min_length=1)


class UserPublic(BaseModel):
	id: str
	email: EmailStr
	name: Optional[str] = None


class AuthResponse(BaseModel):
	token: str
	user: UserPublic

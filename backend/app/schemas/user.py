from typing import Optional

from pydantic import BaseModel, EmailStr, Field, validator


class UserCreate(BaseModel):
	name: str = Field(..., min_length=1, max_length=100)
	email: EmailStr
	password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
	email: EmailStr
	password: str = Field(..., min_length=1)


class PasswordResetRequest(BaseModel):
	email: EmailStr


class PasswordResetConfirm(BaseModel):
	token: str = Field(..., min_length=10)
	password: str = Field(..., min_length=8)


class UserPublic(BaseModel):
	id: str
	email: EmailStr
	name: Optional[str] = None


class AuthResponse(BaseModel):
	token: str
	user: UserPublic

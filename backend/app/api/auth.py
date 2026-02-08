from fastapi import APIRouter, HTTPException, status

from app.schemas.user import AuthResponse, UserCreate, UserLogin
from app.services.auth_service import login_user, signup_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(payload: UserCreate):
	try:
		return signup_user(payload)
	except ValueError as exc:
		raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/login", response_model=AuthResponse)
def login(payload: UserLogin):
	try:
		return login_user(payload)
	except ValueError as exc:
		raise HTTPException(status_code=401, detail=str(exc)) from exc

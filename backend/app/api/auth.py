from fastapi import APIRouter, HTTPException, Request, status

from app.schemas.user import (
	AuthResponse,
	PasswordResetConfirm,
	PasswordResetRequest,
	UserCreate,
	UserLogin,
)
from app.services.auth_service import (
	get_user_from_token,
	login_user,
	request_password_reset,
	reset_password,
	signup_user,
)

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


@router.get("/me", response_model=AuthResponse)
def me(request: Request):
	authorization = request.headers.get("Authorization", "")
	if authorization.startswith("Bearer "):
		token = authorization.removeprefix("Bearer ").strip()
	else:
		token = ""

	if not token:
		raise HTTPException(status_code=401, detail="Not authenticated.")

	try:
		user = get_user_from_token(token)
		return AuthResponse(token=token, user=user)
	except ValueError as exc:
		raise HTTPException(status_code=401, detail=str(exc)) from exc


@router.post("/password-reset/request", status_code=status.HTTP_202_ACCEPTED)
def password_reset_request(payload: PasswordResetRequest):
	try:
		request_password_reset(payload.email)
		return {
			"message": "If an account exists, you'll receive an email shortly."
		}
	except ValueError as exc:
		raise HTTPException(
			status_code=500,
			detail="Password reset is temporarily unavailable.",
		) from exc


@router.post("/password-reset/confirm")
def password_reset_confirm(payload: PasswordResetConfirm):
	try:
		reset_password(payload.token, payload.password)
		return {"message": "Password updated successfully."}
	except ValueError as exc:
		raise HTTPException(status_code=400, detail=str(exc)) from exc

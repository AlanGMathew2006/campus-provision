from datetime import datetime

from app.core.security import create_access_token
from app.database.mongodb import get_users_collection
from app.schemas.user import AuthResponse, UserCreate, UserLogin, UserPublic
from app.utils.hashing import hash_password, verify_password


def _to_public_user(document: dict) -> UserPublic:
	return UserPublic(
		id=str(document.get("_id", "")),
		email=document.get("email", ""),
		name=document.get("name"),
	)


def signup_user(payload: UserCreate) -> AuthResponse:
	users = get_users_collection()
	email = payload.email.lower().strip()
	existing = users.find_one({"email": email})
	if existing:
		raise ValueError("Email already registered.")

	doc = {
		"name": payload.name.strip(),
		"email": email,
		"hashed_password": hash_password(payload.password),
		"created_at": datetime.utcnow(),
	}
	result = users.insert_one(doc)
	user = UserPublic(id=str(result.inserted_id), email=email, name=payload.name)
	token = create_access_token(subject=user.id)
	return AuthResponse(token=token, user=user)


def login_user(payload: UserLogin) -> AuthResponse:
	users = get_users_collection()
	email = payload.email.lower().strip()
	document = users.find_one({"email": email})
	if not document:
		raise ValueError("Invalid email or password.")

	hashed_password = document.get("hashed_password", "")
	if not verify_password(payload.password, hashed_password):
		raise ValueError("Invalid email or password.")

	user = _to_public_user(document)
	token = create_access_token(subject=user.id)
	return AuthResponse(token=token, user=user)

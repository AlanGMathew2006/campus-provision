from datetime import datetime, timedelta
import hashlib
import secrets

from bson import ObjectId

from app.core.security import create_access_token
from app.core.config import settings
from app.core.security import decode_access_token
from app.database.mongodb import get_password_resets_collection, get_users_collection
from app.schemas.user import AuthResponse, UserCreate, UserLogin, UserPublic
from app.services.email_service import send_password_reset_email
from app.utils.hashing import hash_password, verify_and_update_password


def _to_public_user(document: dict) -> UserPublic:
	return UserPublic(
		id=str(document.get("_id", "")),
		email=document.get("email", ""),
		name=document.get("name"),
	)


def get_user_by_id(user_id: str) -> UserPublic:
	users = get_users_collection()
	try:
		object_id = ObjectId(user_id)
	except Exception as exc:
		raise ValueError("Invalid user.") from exc

	document = users.find_one({"_id": object_id})
	if not document:
		raise ValueError("Invalid user.")
	return _to_public_user(document)


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
	is_valid, new_hash = verify_and_update_password(payload.password, hashed_password)
	if not is_valid:
		raise ValueError("Invalid email or password.")
	if new_hash:
		users.update_one({"_id": document["_id"]}, {"$set": {"hashed_password": new_hash}})

	user = _to_public_user(document)
	token = create_access_token(subject=user.id)
	return AuthResponse(token=token, user=user)


def get_user_from_token(token: str) -> UserPublic:
	payload = decode_access_token(token)
	if not payload or "sub" not in payload:
		raise ValueError("Invalid token.")
	return get_user_by_id(str(payload["sub"]))


def _hash_reset_token(token: str) -> str:
	return hashlib.sha256(token.encode("utf-8")).hexdigest()


def request_password_reset(email: str) -> None:
	users = get_users_collection()
	resets = get_password_resets_collection()
	clean_email = email.lower().strip()
	user = users.find_one({"email": clean_email})
	if not user:
		return

	token = secrets.token_urlsafe(32)
	resets.insert_one(
		{
			"user_id": user["_id"],
			"token_hash": _hash_reset_token(token),
			"expires_at": datetime.utcnow() + timedelta(minutes=30),
			"used": False,
			"created_at": datetime.utcnow(),
		}
	)

	reset_url = f"{settings.app_base_url}/reset-password?token={token}"
	send_password_reset_email(clean_email, reset_url)


def reset_password(token: str, new_password: str) -> None:
	resets = get_password_resets_collection()
	users = get_users_collection()
	reset_doc = resets.find_one(
		{"token_hash": _hash_reset_token(token), "used": False}
	)
	if not reset_doc:
		raise ValueError("Reset link is invalid or has expired.")
	if reset_doc.get("expires_at") and reset_doc["expires_at"] < datetime.utcnow():
		raise ValueError("Reset link is invalid or has expired.")

	users.update_one(
		{"_id": reset_doc["user_id"]},
		{"$set": {"hashed_password": hash_password(new_password)}},
	)
	resets.update_many(
		{"user_id": reset_doc["user_id"], "used": False},
		{"$set": {"used": True, "used_at": datetime.utcnow()}},
	)

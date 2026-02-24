from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["argon2", "bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
	return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
	return pwd_context.verify(plain_password, hashed_password)


def verify_and_update_password(
	plain_password: str, hashed_password: str
) -> tuple[bool, str | None]:
	if not pwd_context.verify(plain_password, hashed_password):
		return False, None
	if pwd_context.needs_update(hashed_password):
		return True, pwd_context.hash(plain_password)
	return True, None

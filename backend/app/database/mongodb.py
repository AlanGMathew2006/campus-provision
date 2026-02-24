from pymongo import MongoClient

from app.core.config import settings

client = MongoClient(settings.mongo_uri)
db = client[settings.mongo_db]


def get_users_collection():
	return db["users"]


def get_password_resets_collection():
	return db["password_resets"]

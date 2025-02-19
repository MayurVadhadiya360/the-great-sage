from pymongo import MongoClient
from pymongo.database import Database
import os

CONNECTION_URL = os.getenv("DB_CONNECTION_URL")
DB_NAME = os.getenv("DB_NAME")

DATABASE_CLIENT = MongoClient(CONNECTION_URL)

def get_database() -> Database:
    return DATABASE_CLIENT[DB_NAME]
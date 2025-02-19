import jwt
import pytz
import os
from datetime import datetime, timedelta
from fastapi import HTTPException, Response, Request
from fastapi.security import HTTPBearer

# Secret key for signing JWTs (store securely in .env file)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your_secret_key")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("JWT_ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("JWT_REFRESH_TOKEN_EXPIRE_DAYS", "7"))
ACCESS_TOKEN_COOKIE_NAME = os.getenv("JWT_ACCESS_TOKEN_COOKIE_NAME", "access_token")
REFRESH_TOKEN_COOKIE_NAME = os.getenv("JWT_REFRESH_TOKEN_COOKIE_NAME", "refresh_token")

security = HTTPBearer()  # Extracts token from headers (if needed)

# Generate JWT token
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.now(pytz.timezone('UTC')) + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict):
    expire = datetime.now(pytz.timezone('UTC')) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode = data.copy()
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# Verify token
def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Extract token from cookies
def get_current_user(request: Request):
    token = request.cookies.get(ACCESS_TOKEN_COOKIE_NAME)
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return verify_token(token)

def get_token_payload(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception as e:
        return None

from fastapi import APIRouter, Response, Depends, status
from pymongo.errors import DuplicateKeyError
from typing import Annotated

from .request_models import *
from database.db import get_database, Database, Collections
from utils.encryption import Encryptor
from utils.jwt_utils import (
    create_access_token, 
    create_refresh_token, 
    get_current_user,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME
)

db_dependency = Annotated[Database, Depends(get_database)]

authRouter = APIRouter()

@authRouter.post('/register')
def signup(response: Response, user: User, db: db_dependency, encryptor: Encryptor = Depends(Encryptor) ):
    # hash password for storing in db
    hashed_password = encryptor.encrypt(user.password)

    try:
        db[Collections.Auth].insert_one({
            'username': user.username,
            'email': user.email,
            'password': hashed_password
        })
    except DuplicateKeyError:
        response.status_code=status.HTTP_400_BAD_REQUEST,
        return {"status": "warning", "message": "Username or Email already exists"}

    access_token = create_access_token({"email": user.email, "username": user.username, "password": hashed_password})
    refresh_token = create_refresh_token({"email": user.email, "username": user.username, "password": hashed_password})

    # Set cookies for authentication
    # response.set_cookie(key=ACCESS_TOKEN_COOKIE_NAME, value=access_token, httponly=True, samesite='lax', secure=False) # for development
    response.set_cookie(key=ACCESS_TOKEN_COOKIE_NAME, value=access_token, samesite='strict', secure=True) # for production
    # response.set_cookie(key=REFRESH_TOKEN_COOKIE_NAME, value=refresh_token, httponly=True, samesite='lax', secure=False) # for development
    response.set_cookie(key=REFRESH_TOKEN_COOKIE_NAME, value=refresh_token, samesite='strict', secure=True) # for production

    response.status_code = status.HTTP_201_CREATED
    return {"status": "success", "message": "User created successfully"}


@authRouter.post("/login")
def login(response: Response, user_data: UserLogin, db: db_dependency, encryptor: Encryptor = Depends(Encryptor)):
    # query db for user with matching email
    user = db[Collections.Auth].find_one({'email': user_data.email})
    if user is None:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"status": "warning", "message": "Invalid email or password"}
    
    # check if password matches
    if encryptor.compare(user_data.password, user['password']):
        access_token = create_access_token({"email": user['email'], "username": user['username'], "password": user["password"]})
        refresh_token = create_refresh_token({"email": user['email'], "username": user['username'], "password": user["password"]})

        # Set cookies for authentication
        # response.set_cookie(key=ACCESS_TOKEN_COOKIE_NAME, value=access_token, httponly=True, samesite='lax', secure=False) # for development
        response.set_cookie(key=ACCESS_TOKEN_COOKIE_NAME, value=access_token, samesite='strict', secure=True) # for production
        # response.set_cookie(key=REFRESH_TOKEN_COOKIE_NAME, value=refresh_token, httponly=True, samesite='lax', secure=False) # for development
        response.set_cookie(key=REFRESH_TOKEN_COOKIE_NAME, value=refresh_token, samesite='strict', secure=True) # for production

        return {"status": "success", "message": "User logged in successfully"}
    else:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"status": "warning", "message": "Invalid email or password"}
    

@authRouter.get("/user-profile")
def get_user_profile(response: Response, db: db_dependency, current_user: dict = Depends(get_current_user)):
    user = db[Collections.Auth].find_one({'email': current_user['email']})
    if user:
        return {
            "status": "success", 
            "message": "User profile retrieved successfully", 
            "data": {
                "_id": str(user["_id"]),
                "email": user['email'],
                "username": user['username']
            }
        }
    else:
        response.status_code=status.HTTP_404_NOT_FOUND
        return {
                "status": "error", 
                "message": "User not found",
            }
    

@authRouter.get('/logout')
def logout(response: Response):
    # # for development
    # response.delete_cookie(ACCESS_TOKEN_COOKIE_NAME)
    # response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME)
    # for production
    response.delete_cookie(ACCESS_TOKEN_COOKIE_NAME, secure=True, samesite='strict')
    response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME, secure=True, samesite='strict')
    return {"status": "success", "message": "User logged out successfully"}


@authRouter.get('/delete-account')
def delete_account(response: Response, db: db_dependency, current_user: dict = Depends(get_current_user)):
    user = User(**current_user)

    chat_res = db[Collections.Chat].delete_many({"user_id": user.email})
    chat_nodes_res = db[Collections.ChatNodes].delete_many({"user_id": user.email})
    auth_res = db[Collections.Auth].delete_one({"email": user.email})

    # # for development
    # response.delete_cookie(ACCESS_TOKEN_COOKIE_NAME)
    # response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME)
    # for production
    response.delete_cookie(ACCESS_TOKEN_COOKIE_NAME, secure=True, samesite='strict')
    response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME, secure=True, samesite='strict')
    return {"status": "success", "message": "Account deleted!"}
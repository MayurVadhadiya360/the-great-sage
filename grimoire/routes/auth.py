from fastapi import APIRouter, Response, Request, Depends, status
from fastapi.responses import JSONResponse
from .request_models import *
from database.db import get_database, Database
from pymongo.errors import DuplicateKeyError
from utils.encryption import Encryptor
from typing import Annotated
from utils.jwt_utils import (
    create_access_token, 
    create_refresh_token, 
    get_current_user,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME
)
import traceback

db_dependency = Annotated[Database, Depends(get_database)]

authRouter = APIRouter()

@authRouter.post('/register')
def signup(response: Response, user: User, db: db_dependency, encryptor: Encryptor = Depends(Encryptor) ):
    print(user)
    # hash password for storing in db
    hashed_password = encryptor.encrypt(user.password)

    try:
        db['Auth'].insert_one({
            'username': user.username,
            'email': user.email,
            'password': hashed_password
        })
    except DuplicateKeyError:
        return JSONResponse(
            content = {"status": "warning", "message": "Username or Email already exists"},
            status_code=status.HTTP_400_BAD_REQUEST,
        )

    access_token = create_access_token({"email": user.email, "name": user.username})
    refresh_token = create_refresh_token({"email": user.email, "name": user.username})

    # Set cookies for authentication
    response.set_cookie(key=ACCESS_TOKEN_COOKIE_NAME, value=access_token, httponly=True, samesite='lax', secure=False)
    response.set_cookie(key=REFRESH_TOKEN_COOKIE_NAME, value=refresh_token, httponly=True, samesite='lax', secure=False)

    return JSONResponse(
        content = {"status": "success", "message": "User created successfully"},
        status_code = status.HTTP_201_CREATED
    )


@authRouter.post("/login")
def login(response: Response, user_data: UserLogin, db: db_dependency, encryptor: Encryptor = Depends(Encryptor)):
    # query db for user with matching email
    user = db['Auth'].find_one({'email': user_data.email})
    if user is None:
        return JSONResponse(
            content = {"status": "warning", "message": "Invalid email or password"},
            status_code = status.HTTP_400_BAD_REQUEST
        )
    
    # check if password matches
    if encryptor.compare(user_data.password, user['password']):
        access_token = create_access_token({"email": user['email'], "name": user['username']})
        refresh_token = create_refresh_token({"email": user['email'], "name": user['username']})

        # Set cookies for authentication
        response.set_cookie(key=ACCESS_TOKEN_COOKIE_NAME, value=access_token, httponly=True, samesite='lax', secure=False)
        response.set_cookie(key=REFRESH_TOKEN_COOKIE_NAME, value=refresh_token, httponly=True, samesite='lax', secure=False)

        return JSONResponse(
            content = {"status": "success", "message": "User logged in successfully"},
        )
    
    else:
        return JSONResponse(
            content = {"status": "warning", "message": "Invalid email or password"},
            status_code = status.HTTP_400_BAD_REQUEST
        )
    

@authRouter.get("/user-profile")
def get_user_profile(response: Response, db: db_dependency, current_user: dict = Depends(get_current_user)):
    print(current_user)
    user = db['Auth'].find_one({'email': current_user['email']})
    return JSONResponse(
        content = {
            "status": "success", 
            "message": "User profile retrieved successfully", 
            "data": {
                "_id": str(user["_id"]),
                "email": user['email'],
                "username": user['username']
            }
        }
    )


@authRouter.get('/logout')
def logout(response: Response):
    response.delete_cookie(ACCESS_TOKEN_COOKIE_NAME)
    response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME)
    return JSONResponse(content={"status": "success", "message": "User logged out successfully"})
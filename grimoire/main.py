from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from routes.chat import chatRouter
from routes.auth import authRouter


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins = ['http://localhost:3000', 'http://192.168.1.44:3000'],
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"],
)


CUSTOM_MESSAGES = {
    "string_too_short": {
        "username": "Username must be at least 3 characters long.",
        "password": "Password must be at least 8 characters long."
    },
    "value_error": {
        "email": "Invalid email format. Please enter a valid email address."
    }
}

@app.exception_handler(RequestValidationError)
async def custom_validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    custom_errors = []
    for error in errors:
        # Extract the field name from the error location.
        field_name = error["loc"][-1]
        # Look up a custom message if available.
        custom_msg = CUSTOM_MESSAGES.get(error["type"], {}).get(field_name, error["msg"])
        # Copy the original error and replace the msg field.
        new_error = error.copy()
        new_error["msg"] = custom_msg
        custom_errors.append(new_error)
    return JSONResponse(status_code=422, content={"detail": custom_errors})


app.include_router(authRouter)
app.include_router(chatRouter)


@app.get("/")
def root():
    return {"message": "The Great Sage is awake!!"}
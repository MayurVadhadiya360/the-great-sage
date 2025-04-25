from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles 
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import chatRouter
from routes.auth import authRouter


app = FastAPI()

# # For development
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins = ['http://localhost:3000'],
#     allow_credentials = True,
#     allow_methods = ["*"],
#     allow_headers = ["*"],
# )

app.include_router(authRouter)
app.include_router(chatRouter)

app.mount("/static", StaticFiles(directory="static"), name="static")

templates = Jinja2Templates(directory="templates")

@app.get("/login")
@app.get("/signup")
@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse(request=request, name="index.html")
    return {"message": "The Great Sage is awake!!"}

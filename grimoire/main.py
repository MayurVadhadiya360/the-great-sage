from fastapi import FastAPI
from routes.chat import chatRouter

app = FastAPI()
app.include_router(chatRouter)

@app.get("/")
def root():
    return {"message": "The Great Sage is awake!!"}
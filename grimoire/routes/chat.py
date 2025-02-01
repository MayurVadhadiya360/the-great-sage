from fastapi import APIRouter
from groq import Groq
from dotenv import load_dotenv
from .request_models import *
import os
load_dotenv()
API_KEY = os.getenv("API_KEY")

chatRouter = APIRouter()

@chatRouter.post("/free-chat")
def freeChat(requestData:freeChatRequest):
    print(requestData.message)
    client = Groq(api_key=API_KEY)
    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                'role': 'user',
                'content': requestData.message
            }
        ],
        temperature=1,
        max_completion_tokens=1024,
        top_p=1,
        stream=True,
        stop=None,
    )

    chatResponse = ''.join([chunk.choices[0].delta.content or "" for chunk in completion])
    print(chatResponse)
    # for chunk in completion:
    #     print(chunk.choices)
    #     print(chunk.choices[0].delta.content or "", end="")
    
    return {"message": "Chat started", "response":chatResponse}

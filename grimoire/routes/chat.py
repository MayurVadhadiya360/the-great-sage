from fastapi import APIRouter, Request, Response, Depends, HTTPException
from fastapi.responses import JSONResponse
from .request_models import *
from utils.gpt_ai_models import get_assistant_response, get_provider_models_list

chatRouter = APIRouter()

@chatRouter.get("/get-models-list")
def get_models_list():
    return get_provider_models_list()

@chatRouter.post("/unsigned-chat")
def freeChat(response:Response, requestData:freeChatRequest):
    print(requestData.message)
    context = [
        *requestData.context,
        {
            'role': 'user',
            'content': requestData.message
        }
    ]

    chatResponse = get_assistant_response(model_name=requestData.model, context=context)
    
    print(chatResponse)
    return JSONResponse(
        content={
            "status": "success",
            "message": "Chat started", 
            "data": {
                "response": chatResponse
            }
        }
    )
    


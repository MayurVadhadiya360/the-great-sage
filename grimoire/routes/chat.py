from fastapi import APIRouter, Response, Depends, status
from fastapi.responses import JSONResponse
from datetime import datetime
from bson import ObjectId
import pytz
import uuid

from .request_models import *
from utils.jwt_utils import get_current_user
from utils.gpt_ai_models import get_assistant_response, get_provider_models_list
from database.db import get_collection, Collections

chatRouter = APIRouter()

@chatRouter.get("/get-models-list")
def get_models_list():
    return get_provider_models_list()

    
@chatRouter.get("/chat-list")
def getChatList(current_user: dict = Depends(get_current_user)):
    col_chat = get_collection(Collections.Chat)
    user = User(**current_user)
    chatList = col_chat.find({"user_id": user.email}, {"chat_id": 1, "chat_title": 1, "creation_date": 1, "last_update": 1})
    chatList = list(chatList)
    return JSONResponse(
        content={
            "status": "success", 
            "message": "Chat list", 
            "data": {
                "chat_list": chatList,
            }
        }
    )


@chatRouter.post("/unsigned-chat")
def freeChat(requestData: freeChatRequest):
    print(requestData.message)
    context = [
        *requestData.context,
        {
            'role': 'user',
            'content': requestData.message
        }
    ]

    chatResponse, resTime = get_assistant_response(model_name=requestData.model, context=context)
    
    print(chatResponse)
    return JSONResponse(
        content={
            "status": "success",
            "message": "Chat started", 
            "data": {
                "_id": str(uuid.uuid4()),
                "response": chatResponse,
                "response_time": resTime,
            }
        }
    )


@chatRouter.post("/new-chat")
def newChat(requestData: newChatRequest, current_user: dict = Depends(get_current_user)):
    user = User(**current_user)
    col_chat = get_collection(Collections.Chat)
    col_chat_node = get_collection(Collections.ChatNodes)

    chatContext = []
    if requestData.system_msg:
        chatContext.append({"role": "system", "content": requestData.system_msg})
    chatContext.append({"role": "user", "content": requestData.message})

    chatResponse, resTime = get_assistant_response(model_name=requestData.model, context=chatContext)

    chatContext.append({"role": "assistant", "content": chatResponse})
    chatContext.append({"role": "user", "content": "Can you give one chat name(title) for this conversation? Just chat title no extra words."})

    chatTitle, _ = get_assistant_response(model_name=requestData.model, context=chatContext)

    new_chat_node = {
        "user_id": user.email,
        "user_msg": requestData.message,
        "assistant_msg": chatResponse,
        "model_used": requestData.model,
        "response_time": resTime,
        "creation_date": datetime.now(pytz.timezone('UTC')),
        "active_child_node_index": -1,
        "children_chat_nodes": [],
    }
    new_chat_node_res = col_chat_node.insert_one(new_chat_node)

    new_chat = {
        "chat_id": str(uuid.uuid4()),
        "user_id": user.email,
        "chat_title": chatTitle.strip(),
        "system_msg": requestData.system_msg,
        "creation_date": datetime.now(pytz.timezone('UTC')),
        "last_update": datetime.now(pytz.timezone('UTC')),
        "active_chat_index": 0,
        "chat_tree_roots": [
            str(new_chat_node_res.inserted_id)
        ],
        "all_chat_nodes": [
            str(new_chat_node_res.inserted_id)
        ],
    }
    new_chat_res = col_chat.insert_one(new_chat)

    return JSONResponse(
        content={
            "status": "success",
            "message": "New chat created",
            "data": {
                "chat_id": new_chat["chat_id"],
                "chat_title": new_chat["chat_title"],
                "creation_date": new_chat["creation_date"],
                "last_update": new_chat["last_update"],
            }
        }
    )

@chatRouter.post("/get-chat")
async def get_chat(requestData: getChatRequest, current_user: dict = Depends(get_current_user)):
    user = User(**current_user)
    col_chat = get_collection(Collections.Chat)
    col_chat_node = get_collection(Collections.ChatNodes)

    chat_data = col_chat.find_one({"chat_id": requestData.chat_id, "user_id": user.email})
    if chat_data is None:
        return JSONResponse(content={"status": "error", "message": "Chat not found"}, status_code=status.HTTP_404_NOT_FOUND)
    
    chat_data = dict(chat_data)
    chat_data["_id"] = str(chat_data["_id"])
    
    all_chat_nodes_ids: list[str] = chat_data.get("all_chat_nodes", [])
    all_chat_nodes_ids: list[ObjectId] = list(map(ObjectId, all_chat_nodes_ids))

    chat_nodes = col_chat_node.find({"_id": {"$in": all_chat_nodes_ids}}).sort("creation_date", -1)
    chat_nodes = list(chat_nodes)

    for node in chat_nodes:
        node["_id"] = str(node["_id"])

    return JSONResponse(
        content={
            "status": "success", 
            "message": "Chat data retrieved", 
            "data": {
                **chat_data,
                "chat_nodes": chat_nodes
            }
        }
    )


    

    
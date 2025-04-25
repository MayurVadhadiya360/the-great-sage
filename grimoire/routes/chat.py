from fastapi import APIRouter, Depends, status, BackgroundTasks
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
    for chat in chatList:
        chat["_id"] = str(chat["_id"])
        if "creation_date" in chat and isinstance(chat["creation_date"], datetime):
            chat["creation_date"] = chat["creation_date"].isoformat()
        if "last_update" in chat and isinstance(chat["last_update"], datetime):
            chat["last_update"] = chat["last_update"].isoformat()

    return JSONResponse(
        content={
            "status": "success", 
            "message": "Chat list", 
            "data": {
                "chat_list": chatList,
            }
        }
    )


@chatRouter.post("/anonymous-chat")
def anonymousChat(requestData: anonymousChatRequest):
    context = [
        *requestData.context,
        {
            'role': 'user',
            'content': requestData.message
        }
    ]

    chatResponse, resTime = get_assistant_response(model_name=requestData.model, context=context)
    
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
    chatContext.append({"role": "user", "content": "Can you give one chat name(title) for this conversation? Just chat title no extra words, no markdown, just text."})

    chatTitle, _ = get_assistant_response(model_name=requestData.model, context=chatContext)

    new_chat_node = {
        "user_id": user.email,
        "user_msg": requestData.message,
        "assistant_msg": chatResponse,
        "model_used": requestData.model,
        "response_time": resTime,
        "creation_date": datetime.now(pytz.timezone('UTC')),
        "active_child_node_index": -1,
        "child_chat_nodes": [],
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
                "creation_date": new_chat["creation_date"].isoformat() if "creation_date" in new_chat and isinstance(new_chat["creation_date"], datetime) else datetime.now(pytz.timezone('UTC')),
                "last_update": new_chat["last_update"].isoformat() if "last_update" in new_chat and isinstance(new_chat["last_update"], datetime) else datetime.now(pytz.timezone('UTC')),
            }
        }
    )


@chatRouter.post("/get-chat")
async def get_chat(requestData: chatIdDataRequest, current_user: dict = Depends(get_current_user)):
    user = User(**current_user)
    col_chat = get_collection(Collections.Chat)
    col_chat_node = get_collection(Collections.ChatNodes)

    chat_data = col_chat.find_one({"chat_id": requestData.chat_id, "user_id": user.email})
    if chat_data is None:
        return JSONResponse(content={"status": "error", "message": "Chat not found"}, status_code=status.HTTP_404_NOT_FOUND)
    
    chat_data = dict(chat_data)
    chat_data["_id"] = str(chat_data["_id"])
    if "creation_date" in chat_data and isinstance(chat_data["creation_date"], datetime):
        chat_data["creation_date"] = chat_data["creation_date"].isoformat()
    if "last_update" in chat_data and isinstance(chat_data["last_update"], datetime):
        chat_data["last_update"] = chat_data["last_update"].isoformat()
    
    all_chat_nodes_ids: list[str] = chat_data.get("all_chat_nodes", [])
    all_chat_nodes_ids: list[ObjectId] = list(map(ObjectId, all_chat_nodes_ids))

    chat_nodes = col_chat_node.find({"_id": {"$in": all_chat_nodes_ids}}).sort("creation_date", -1)
    chat_nodes = list(chat_nodes)

    for node in chat_nodes:
        node["_id"] = str(node["_id"])
        if "creation_date" in node and isinstance(node["creation_date"], datetime):
            node["creation_date"] = node["creation_date"].isoformat()

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


@chatRouter.post("/signed-chat")
async def signed_chat(requestData: signedChatRequest, current_user: dict = Depends(get_current_user)):
    user = User(**current_user)
    col_chat = get_collection(Collections.Chat)
    col_chat_node = get_collection(Collections.ChatNodes)

    context = [
        *requestData.context,
        {
            'role': 'user',
            'content': requestData.message
        }
    ]

    chatResponse, resTime = get_assistant_response(model_name=requestData.model, context=context)

    new_chat_node = {
        "user_id": user.email,
        "user_msg": requestData.message,
        "assistant_msg": chatResponse,
        "model_used": requestData.model,
        "response_time": resTime,
        "creation_date": datetime.now(pytz.timezone('UTC')),
        "active_child_node_index": -1,
        "child_chat_nodes": [],
    }
    new_chat_node_res = col_chat_node.insert_one(new_chat_node)

    parent_chat_node_update_res = col_chat_node.update_one(
        {"_id": ObjectId(requestData.parent_chat_node_id)}, 
        {
            "$push": {"child_chat_nodes": str(new_chat_node_res.inserted_id)},
            "$inc": {"active_child_node_index": 1}
        }
    )

    chat_update_res = col_chat.update_one(
        {
            "chat_id": requestData.chat_id,
            "user_id": user.email
        },
        {
            "$push": {"all_chat_nodes": str(new_chat_node_res.inserted_id)},
            "$set": {"last_update": datetime.now(pytz.timezone('UTC'))}
        }
    )

    return JSONResponse(
        content={
            "status": "success",
            "message": "New conversation created in chat!",
            "data": {
                "chat_node": {
                    "_id": str(new_chat_node_res.inserted_id),
                    "user_msg": new_chat_node["user_msg"],
                    "assistant_msg": new_chat_node["assistant_msg"],
                    "model_used": new_chat_node["model_used"],
                    "response_time": new_chat_node["response_time"],
                    "creation_date": new_chat_node["creation_date"].isoformat() if "creation_date" in new_chat_node and isinstance(new_chat_node["creation_date"], datetime) else datetime.now(pytz.timezone('UTC')),
                },
                "parent_chat_node_id": requestData.parent_chat_node_id,
                "last_updated": datetime.now(pytz.timezone('UTC')).isoformat()
            }
        }
    )


@chatRouter.post("/update-chat-title")
def updateChatTitle(requestData: updateChatTitleRequest, current_user: dict = Depends(get_current_user)):
    user = User(**current_user)
    col_chat = get_collection(Collections.Chat)
    chat_update_res = col_chat.update_one(
        {
            "chat_id": requestData.chat_id,
            "user_id": user.email
        },
        {
            "$set": {"chat_title": requestData.chat_title}
        }
    )
    return JSONResponse(
        content={
            "status": "success", 
            "message": "Chat title updated!",
            "data": {
                "chat_id": requestData.chat_id,
                "chat_title": requestData.chat_title
            }
        }
    )


def delete_chat_nodes(chat_id: str, user_id: str) -> None:
    col_chat = get_collection(Collections.Chat)
    col_chat_node = get_collection(Collections.ChatNodes)

    chat_data = col_chat.find_one_and_delete({"chat_id": chat_id, "user_id": user_id})
    if chat_data:
        chat_data = dict(chat_data)
        all_chat_nodes: list[str] = chat_data.get("all_chat_nodes", [])
        chat_nodes: list[ObjectId] = list(map(ObjectId, all_chat_nodes))

        col_chat_node.delete_many({"_id": {"$in": chat_nodes}})


@chatRouter.post("/delete-chat")
def deleteChat(requestData: chatIdDataRequest, background_tasks: BackgroundTasks, current_user: dict = Depends(get_current_user)):
    user = User(**current_user)
    background_tasks.add_task(delete_chat_nodes, requestData.chat_id, user.email)
    return JSONResponse(
        content={
            "status": "success", 
            "message": "Chat deleted!",
            "data": {
                "chat_id": requestData.chat_id
            }
        }
    )
    

    
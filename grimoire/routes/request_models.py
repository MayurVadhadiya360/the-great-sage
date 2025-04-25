from pydantic import BaseModel, EmailStr, Field, field_validator

class User(BaseModel):
    username: str = Field(..., description="Username of user", min_length=3)
    email: EmailStr = Field(..., description="Email address of user")
    password: str = Field(..., description="Password of user", min_length=8)


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Email address of user")
    password: str = Field(..., description="Password of user", min_length=8)

class anonymousChatRequest(BaseModel):
    """Request model for anonymous chat endpoint."""
    model: str
    message: str
    context: list[dict[str, str]]

class newChatRequest(BaseModel):
    """Request model for new chat endpoint."""
    model: str
    system_msg: str | None
    message: str

class chatIdDataRequest(BaseModel):
    chat_id: str

class signedChatRequest(BaseModel):
    """Request model for signed chat endpoint."""
    chat_id: str
    message: str
    model: str
    context: list[dict[str, str]]
    parent_chat_node_id: str

class updateChatTitleRequest(BaseModel):
    """Request model for update chat title endpoint."""
    chat_id: str
    chat_title: str
from pydantic import BaseModel, EmailStr, Field, field_validator

class User(BaseModel):
    username: str = Field(..., description="Username of user", min_length=3)
    email: EmailStr = Field(..., description="Email address of user")
    password: str = Field(..., description="Password of user", min_length=8)


class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Email address of user")
    password: str = Field(..., description="Password of user", min_length=8)

class freeChatRequest(BaseModel):
    """Request model for free chat endpoint."""
    model: str
    message: str
    context: list[dict[str, str]]

class newChatRequest(BaseModel):
    """Request model for new chat endpoint."""
    model: str
    system_msg: str | None
    message: str

class getChatRequest(BaseModel):
    """Request model for get chat endpoint."""
    chat_id: str
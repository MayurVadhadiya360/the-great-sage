from pydantic import BaseModel

class freeChatRequest(BaseModel):
    """Request model for free chat endpoint."""
    message: str

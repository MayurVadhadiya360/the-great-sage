from pydantic import BaseModel, EmailStr, Field, field_validator

class User(BaseModel):
    username: str = Field(..., description="Username of user", min_length=3)
    email: EmailStr = Field(..., description="Email address of user")
    password: str = Field(..., description="Password of user", min_length=8)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value):
        if len(value) < 3:
            raise ValueError("Username must be at least 3 characters long.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value, info):
        try:
            EmailStr()(value)  # This ensures Pydantic's built-in validation still runs
        except ValueError:
            raise ValueError("Invalid email format. Please enter a valid email address.")
        return value

    @field_validator("password")
    @classmethod
    def validate_password(cls, value):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters long.")
        return value

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="Email address of user")
    password: str = Field(..., description="Password of user", min_length=8)

class freeChatRequest(BaseModel):
    """Request model for free chat endpoint."""
    model: str
    message: str
    context: list[dict[str, str]]

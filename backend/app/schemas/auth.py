from pydantic import BaseModel, EmailStr, field_validator
import re


# =========================
# Register Schema
# =========================
class UserRegister(BaseModel):
    username: str
    email: EmailStr
    password: str

    @field_validator("password")
    def validate_password(cls, value: str):
        if len(value) < 8:
            raise ValueError("Password must be at least 8 characters")

        if not re.search(r"[A-Z]", value):
            raise ValueError("Password must contain at least one uppercase letter")

        if not re.search(r"[0-9]", value):
            raise ValueError("Password must contain at least one number")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", value):
            raise ValueError("Password must contain at least one special character")

        return value


# =========================
# Login Schema
# =========================
class UserLogin(BaseModel):
    email: EmailStr
    password: str


# =========================
# Token Response
# =========================
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
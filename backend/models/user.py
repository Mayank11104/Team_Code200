from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime
from pydantic import BaseModel

from ..core.database import Base

from pydantic import BaseModel

class UserBase(BaseModel):
    email: str
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    role: str
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

class UserInDB(User):
    password_hash: str

class UserDB(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    deleted_at = Column(DateTime, nullable=True)
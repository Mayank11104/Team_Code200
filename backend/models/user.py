from typing import Optional
from sqlalchemy import Column, Integer, String, DateTime

from ..core.database import Base

class User(Base):
    __tablename__ = "User"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    avatar_url = Column(String, nullable=True)
    password_hash = Column(String, nullable=False)
    deleted_at = Column(DateTime, nullable=True)
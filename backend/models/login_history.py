from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func

from ..core.database import Base

class LoginHistory(Base):
    __tablename__ = "LoginHistory"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('User.id'), nullable=False)
    login_timestamp = Column(DateTime, server_default=func.now())
    ip_address = Column(String, nullable=True)
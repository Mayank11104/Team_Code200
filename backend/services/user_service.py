
from sqlalchemy.orm import Session

from .. import models

def get_user_by_email(db: Session, email: str) -> models.user.User:
    return db.query(models.user.User).filter(models.user.User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> models.user.User:
    return db.query(models.user.User).filter(models.user.User.id == user_id).first()

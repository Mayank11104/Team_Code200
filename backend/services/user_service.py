
from sqlalchemy.orm import Session

from .. import models

def get_user_by_email(db: Session, email: str) -> models.user.UserDB:
    return db.query(models.user.UserDB).filter(models.user.UserDB.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> models.user.UserDB:
    return db.query(models.user.UserDB).filter(models.user.UserDB.id == user_id).first()

def create_user(db: Session, user_data: dict) -> models.user.UserDB:
    # **user_data unpacks the dictionary into keyword arguments
    new_user = models.user.UserDB(**user_data)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

from sqlalchemy.orm import Session

from .. import models

def create_login_history(db: Session, user_id: int, ip_address: str):
    db_login_history = models.login_history.LoginHistory(user_id=user_id, ip_address=ip_address)
    db.add(db_login_history)
    db.commit()
    db.refresh(db_login_history)
    return db_login_history
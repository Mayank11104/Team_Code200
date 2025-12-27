
from fastapi import APIRouter, Depends, HTTPException, Response, Form, Request
from fastapi.security import OAuth2PasswordRequestForm

from ..core.config import settings
from ..core.security import (
    create_access_token,
    create_refresh_token,
    verify_password,
    get_password_hash,
)
from ..models.token import Token
from ..models.user import User, UserCreate, UserDB
from ..services.user_service import get_user_by_email, create_user
from ..services.audit_service import create_login_history

router = APIRouter()


from sqlalchemy.orm import Session

from ..core.database import get_db

@router.post("/login", response_model=Token)
async def login_for_access_token(request: Request, response: Response, db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends(), role: str = Form(...)):
    user = get_user_by_email(db, form_data.username)
    if not user or user.deleted_at:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # The role check is implicitly handled by the frontend sending the role,
    # but the authoritative role is taken from the database.
    # We can add an explicit check if desired:
    if role != user.role:
        raise HTTPException(
            status_code=401,
            detail="Role mismatch",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        secure=settings.SECURE_COOKIES,  # False in dev, True in prod
        samesite="lax",
    )
    response.set_cookie(
        key="refresh_token",
        value=f"Bearer {refresh_token}",
        httponly=True,
        secure=settings.SECURE_COOKIES,  # False in dev, True in prod
        samesite="lax",
    )

    # create_login_history(db, user.id, request.client.host)

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@router.post("/logout")
async def logout(response: Response):
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return {"message": "Successfully logged out"}


@router.post("/signup", response_model=User)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    db_user = get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = get_password_hash(user_data.password)
    
    # Create a new user dictionary with the hashed password and default role
    new_user_data = user_data.dict()
    new_user_data["password_hash"] = hashed_password
    new_user_data["role"] = "employee"  # Set default role
    del new_user_data["password"]  # Remove plain password

    # The create_user service needs to be adapted to accept this dictionary
    # For now, let's assume it does. If not, we'll adjust the service.
    return create_user(db=db, user_data=new_user_data)

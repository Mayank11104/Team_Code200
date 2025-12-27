
from fastapi import Depends, FastAPI

from .api import auth
from .core.security import require_role
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI(
    title="GearGuard API",
    description="Backend services for the GearGuard Maintenance Management System.",
    version="0.1.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,   # REQUIRED for cookies
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the GearGuard API"}


from .core.database import get_db
from .core.security import require_role
from sqlalchemy.orm import Session

@app.get("/admin")
def read_admin_dashboard(db: Session = Depends(get_db), current_user: dict = Depends(require_role("admin"))):
    return {"message": f"Welcome to the admin dashboard, {current_user.email}!"}

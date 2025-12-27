
from fastapi import Depends, FastAPI

from .api import auth, equipment, teams, maintenance, reports
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

# Register all routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(equipment.router, prefix="/api", tags=["Equipment"])
app.include_router(teams.router, prefix="/api", tags=["Teams"])
app.include_router(maintenance.router, prefix="/api", tags=["Maintenance"])
app.include_router(reports.router, prefix="/api", tags=["Reports & Dashboard"])


@app.get("/")
def read_root():
    return {"message": "Welcome to the GearGuard API"}


from .core.database import get_db
from .core.security import require_role
from sqlalchemy.orm import Session

@app.get("/admin")
def read_admin_dashboard(db: Session = Depends(get_db), current_user: dict = Depends(require_role("admin"))):
    return {"message": f"Welcome to the admin dashboard, {current_user.email}!"}


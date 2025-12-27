from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional

from ..core.database import get_db
from ..core.security import require_role

router = APIRouter()


# ==================== GET Teams List ====================
@router.get("/teams")
def get_teams_list(db: Session = Depends(get_db)):
    """Get list of all maintenance teams"""
    
    query = text("""
        SELECT 
            mt.id,
            mt.name,
            mt.description,
            mt.created_at,
            mt.updated_at,
            COUNT(DISTINCT tm.user_id) as member_count,
            COUNT(DISTINCT e.id) as equipment_count
        FROM maintenanceteam mt
        LEFT JOIN teammember tm ON mt.id = tm.team_id AND tm.deleted_at IS NULL
        LEFT JOIN equipment e ON mt.id = e.maintenance_team_id AND e.deleted_at IS NULL
        WHERE mt.deleted_at IS NULL
        GROUP BY mt.id, mt.name, mt.description, mt.created_at, mt.updated_at
        ORDER BY mt.created_at DESC
    """)
    
    result = db.execute(query)
    teams = []
    
    for row in result:
        teams.append({
            "id": row.id,
            "name": row.name,
            "description": row.description,
            "memberCount": row.member_count,
            "equipmentCount": row.equipment_count,
            "createdAt": row.created_at.isoformat() if row.created_at else None,
            "updatedAt": row.updated_at.isoformat() if row.updated_at else None,
        })
    
    return {"teams": teams, "total": len(teams)}


# ==================== GET Single Team with Members ====================
@router.get("/teams/{team_id}")
def get_team(team_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a team including members"""
    
    # Get team info
    team_query = text("""
        SELECT id, name, description, created_at, updated_at
        FROM maintenanceteam
        WHERE id = :team_id AND deleted_at IS NULL
    """)
    
    team = db.execute(team_query, {"team_id": team_id}).fetchone()
    
    if not team:
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Get team members
    members_query = text("""
        SELECT 
            u.id,
            u.name,
            u.email,
            u.role,
            u.avatar_url,
            tm.created_at as joined_at
        FROM teammember tm
        JOIN "User" u ON tm.user_id = u.id
        WHERE tm.team_id = :team_id AND tm.deleted_at IS NULL AND u.deleted_at IS NULL
        ORDER BY tm.created_at ASC
    """)
    
    members = db.execute(members_query, {"team_id": team_id}).fetchall()
    
    # Get equipment assigned to this team
    equipment_query = text("""
        SELECT id, name, serial_number, category, location
        FROM equipment
        WHERE maintenance_team_id = :team_id AND deleted_at IS NULL
        ORDER BY name ASC
    """)
    
    equipment = db.execute(equipment_query, {"team_id": team_id}).fetchall()
    
    return {
        "id": team.id,
        "name": team.name,
        "description": team.description,
        "createdAt": team.created_at.isoformat() if team.created_at else None,
        "updatedAt": team.updated_at.isoformat() if team.updated_at else None,
        "members": [
            {
                "id": m.id,
                "name": m.name,
                "email": m.email,
                "role": m.role,
                "avatarUrl": m.avatar_url,
                "joinedAt": m.joined_at.isoformat() if m.joined_at else None,
            }
            for m in members
        ],
        "equipment": [
            {
                "id": eq.id,
                "name": eq.name,
                "serialNumber": eq.serial_number,
                "category": eq.category,
                "location": eq.location,
            }
            for eq in equipment
        ]
    }


# ==================== CREATE Team ====================
@router.post("/teams")
def create_team(
    name: str,
    description: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager"]))
):
    """Create new maintenance team (Admin/Manager only)"""
    
    # Check if team name already exists
    check_query = text('SELECT id FROM maintenanceteam WHERE name = :name AND deleted_at IS NULL')
    existing = db.execute(check_query, {"name": name}).fetchone()
    
    if existing:
        raise HTTPException(status_code=400, detail="Team name already exists")
    
    insert_query = text("""
        INSERT INTO maintenanceteam (name, description, created_at, updated_at)
        VALUES (:name, :description, NOW(), NOW())
        RETURNING id
    """)
    
    result = db.execute(insert_query, {"name": name, "description": description})
    db.commit()
    team_id = result.fetchone()[0]
    
    return {"id": team_id, "message": "Team created successfully"}


# ==================== UPDATE Team ====================
@router.put("/teams/{team_id}")
def update_team(
    team_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager"]))
):
    """Update team (Admin/Manager only)"""
    
    updates = []
    params = {"team_id": team_id}
    
    if name is not None:
        updates.append("name = :name")
        params["name"] = name
    
    if description is not None:
        updates.append("description = :description")
        params["description"] = description
    
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updates.append("updated_at = NOW()")
    
    update_query = text(f"""
        UPDATE maintenanceteam
        SET {", ".join(updates)}
        WHERE id = :team_id AND deleted_at IS NULL
        RETURNING id
    """)
    
    result = db.execute(update_query, params)
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Team not found")
    
    return {"message": "Team updated successfully"}


# ==================== DELETE Team ====================
@router.delete("/teams/{team_id}")
def delete_team(
    team_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin"]))
):
    """Soft delete team (Admin only)"""
    
    delete_query = text("""
        UPDATE maintenanceteam
        SET deleted_at = NOW()
        WHERE id = :team_id AND deleted_at IS NULL
        RETURNING id
    """)
    
    result = db.execute(delete_query, {"team_id": team_id})
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Team not found")
    
    return {"message": "Team deleted successfully"}


# ==================== ADD Team Member ====================
@router.post("/teams/{team_id}/members")
def add_team_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager"]))
):
    """Add a member to a team (Admin/Manager only)"""
    
    # Check if team exists
    team_check = text('SELECT id FROM maintenanceteam WHERE id = :team_id AND deleted_at IS NULL')
    if not db.execute(team_check, {"team_id": team_id}).fetchone():
        raise HTTPException(status_code=404, detail="Team not found")
    
    # Check if user exists
    user_check = text('SELECT id FROM "User" WHERE id = :user_id AND deleted_at IS NULL')
    if not db.execute(user_check, {"user_id": user_id}).fetchone():
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if already a member
    member_check = text("""
        SELECT id FROM teammember 
        WHERE team_id = :team_id AND user_id = :user_id AND deleted_at IS NULL
    """)
    if db.execute(member_check, {"team_id": team_id, "user_id": user_id}).fetchone():
        raise HTTPException(status_code=400, detail="User is already a member of this team")
    
    # Add member
    insert_query = text("""
        INSERT INTO teammember (team_id, user_id, created_at)
        VALUES (:team_id, :user_id, NOW())
        RETURNING id
    """)
    
    result = db.execute(insert_query, {"team_id": team_id, "user_id": user_id})
    db.commit()
    
    return {"message": "Member added successfully"}


# ==================== REMOVE Team Member ====================
@router.delete("/teams/{team_id}/members/{user_id}")
def remove_team_member(
    team_id: int,
    user_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager"]))
):
    """Remove a member from a team (Admin/Manager only)"""
    
    delete_query = text("""
        UPDATE teammember
        SET deleted_at = NOW()
        WHERE team_id = :team_id AND user_id = :user_id AND deleted_at IS NULL
        RETURNING id
    """)
    
    result = db.execute(delete_query, {"team_id": team_id, "user_id": user_id})
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    return {"message": "Member removed successfully"}

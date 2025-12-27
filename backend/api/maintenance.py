from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import date

from ..core.database import get_db
from ..core.security import require_role

router = APIRouter()


# ==================== GET Maintenance Requests List ====================
@router.get("/requests")
def get_maintenance_requests(
    status: Optional[str] = None,
    request_type: Optional[str] = None,
    equipment_id: Optional[int] = None,
    team_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Get list of maintenance requests with optional filters"""
    
    query = """
        SELECT 
            mr.id,
            mr.subject,
            mr.description,
            mr.request_type,
            mr.status,
            mr.scheduled_date,
            mr.started_at,
            mr.completed_at,
            mr.created_at,
            mr.updated_at,
            e.name as equipment_name,
            e.serial_number,
            mt.name as team_name,
            tech.name as technician_name,
            creator.name as created_by_name
        FROM maintenancerequest mr
        JOIN equipment e ON mr.equipment_id = e.id
        JOIN maintenanceteam mt ON mr.maintenance_team_id = mt.id
        LEFT JOIN "User" tech ON mr.assigned_technician_id = tech.id
        JOIN "User" creator ON mr.created_by = creator.id
        WHERE mr.deleted_at IS NULL
    """
    
    params = {}
    
    if status:
        query += " AND mr.status = :status"
        params["status"] = status
    
    if request_type:
        query += " AND mr.request_type = :request_type"
        params["request_type"] = request_type
    
    if equipment_id:
        query += " AND mr.equipment_id = :equipment_id"
        params["equipment_id"] = equipment_id
    
    if team_id:
        query += " AND mr.maintenance_team_id = :team_id"
        params["team_id"] = team_id
    
    query += " ORDER BY mr.created_at DESC"
    
    result = db.execute(text(query), params)
    requests = []
    
    for row in result:
        requests.append({
            "id": row.id,
            "subject": row.subject,
            "description": row.description,
            "requestType": row.request_type,
            "status": row.status,
            "scheduledDate": row.scheduled_date.isoformat() if row.scheduled_date else None,
            "startedAt": row.started_at.isoformat() if row.started_at else None,
            "completedAt": row.completed_at.isoformat() if row.completed_at else None,
            "equipmentName": row.equipment_name,
            "serialNumber": row.serial_number,
            "teamName": row.team_name,
            "technicianName": row.technician_name,
            "createdByName": row.created_by_name,
            "createdAt": row.created_at.isoformat() if row.created_at else None,
            "updatedAt": row.updated_at.isoformat() if row.updated_at else None,
        })
    
    return {"requests": requests, "total": len(requests)}


# ==================== GET Single Request ====================
@router.get("/requests/{request_id}")
def get_maintenance_request(request_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a maintenance request"""
    
    query = text("""
        SELECT 
            mr.*,
            e.name as equipment_name,
            e.serial_number,
            e.location,
            mt.name as team_name,
            tech.name as technician_name,
            tech.email as technician_email,
            creator.name as created_by_name,
            creator.email as created_by_email
        FROM maintenancerequest mr
        JOIN equipment e ON mr.equipment_id = e.id
        JOIN maintenanceteam mt ON mr.maintenance_team_id = mt.id
        LEFT JOIN "User" tech ON mr.assigned_technician_id = tech.id
        JOIN "User" creator ON mr.created_by = creator.id
        WHERE mr.id = :request_id AND mr.deleted_at IS NULL
    """)
    
    result = db.execute(query, {"request_id": request_id}).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Request not found")
    
    # Get status history
    status_query = text("""
        SELECT 
            rsl.id,
            rsl.old_status,
            rsl.new_status,
            rsl.changed_at,
            u.name as changed_by_name
        FROM requeststatuslog rsl
        LEFT JOIN "User" u ON rsl.changed_by = u.id
        WHERE rsl.request_id = :request_id
        ORDER BY rsl.changed_at ASC
    """)
    
    status_history = db.execute(status_query, {"request_id": request_id}).fetchall()
    
    # Get comments
    comments_query = text("""
        SELECT 
            rc.id,
            rc.comment,
            rc.created_at,
            u.name as commenter_name,
            u.avatar_url
        FROM requestcomment rc
        LEFT JOIN "User" u ON rc.commented_by = u.id
        WHERE rc.request_id = :request_id AND rc.deleted_at IS NULL
        ORDER BY rc.created_at ASC
    """)
    
    comments = db.execute(comments_query, {"request_id": request_id}).fetchall()
    
    return {
        "id": result.id,
        "subject": result.subject,
        "description": result.description,
        "requestType": result.request_type,
        "status": result.status,
        "equipmentId": result.equipment_id,
        "equipmentName": result.equipment_name,
        "serialNumber": result.serial_number,
        "location": result.location,
        "maintenanceTeamId": result.maintenance_team_id,
        "teamName": result.team_name,
        "assignedTechnicianId": result.assigned_technician_id,
        "technicianName": result.technician_name,
        "technicianEmail": result.technician_email,
        "scheduledDate": result.scheduled_date.isoformat() if result.scheduled_date else None,
        "startedAt": result.started_at.isoformat() if result.started_at else None,
        "completedAt": result.completed_at.isoformat() if result.completed_at else None,
        "createdBy": result.created_by,
        "createdByName": result.created_by_name,
        "createdByEmail": result.created_by_email,
        "createdAt": result.created_at.isoformat() if result.created_at else None,
        "updatedAt": result.updated_at.isoformat() if result.updated_at else None,
        "statusHistory": [
            {
                "id": sh.id,
                "oldStatus": sh.old_status,
                "newStatus": sh.new_status,
                "changedAt": sh.changed_at.isoformat() if sh.changed_at else None,
                "changedByName": sh.changed_by_name,
            }
            for sh in status_history
        ],
        "comments": [
            {
                "id": c.id,
                "comment": c.comment,
                "createdAt": c.created_at.isoformat() if c.created_at else None,
                "commenterName": c.commenter_name,
                "avatarUrl": c.avatar_url,
            }
            for c in comments
        ]
    }


# ==================== CREATE Request ====================
@router.post("/requests")
def create_maintenance_request(
    subject: str,
    description: Optional[str] = None,
    request_type: str = "corrective",
    equipment_id: int = None,
    maintenance_team_id: int = None,
    assigned_technician_id: Optional[int] = None,
    scheduled_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager", "employee"]))
):
    """Create new maintenance request"""
    
    if request_type not in ["corrective", "preventive"]:
        raise HTTPException(status_code=400, detail="Invalid request type")
    
    insert_query = text("""
        INSERT INTO maintenancerequest (
            subject, description, request_type, status, equipment_id,
            maintenance_team_id, assigned_technician_id, scheduled_date,
            created_by, created_at, updated_at
        ) VALUES (
            :subject, :description, :request_type, 'new', :equipment_id,
            :maintenance_team_id, :assigned_technician_id, :scheduled_date,
            :created_by, NOW(), NOW()
        ) RETURNING id
    """)
    
    result = db.execute(insert_query, {
        "subject": subject,
        "description": description,
        "request_type": request_type,
        "equipment_id": equipment_id,
        "maintenance_team_id": maintenance_team_id,
        "assigned_technician_id": assigned_technician_id,
        "scheduled_date": scheduled_date,
        "created_by": current_user.id,
    })
    
    db.commit()
    request_id = result.fetchone()[0]
    
    return {"id": request_id, "message": "Maintenance request created successfully"}


# ==================== UPDATE Request ====================
@router.put("/requests/{request_id}")
def update_maintenance_request(
    request_id: int,
    subject: Optional[str] = None,
    description: Optional[str] = None,
    request_type: Optional[str] = None,
    assigned_technician_id: Optional[int] = None,
    scheduled_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager", "technician"]))
):
    """Update maintenance request"""
    
    updates = []
    params = {"request_id": request_id}
    
    if subject is not None:
        updates.append("subject = :subject")
        params["subject"] = subject
    
    if description is not None:
        updates.append("description = :description")
        params["description"] = description
    
    if request_type is not None:
        if request_type not in ["corrective", "preventive"]:
            raise HTTPException(status_code=400, detail="Invalid request type")
        updates.append("request_type = :request_type")
        params["request_type"] = request_type
    
    if assigned_technician_id is not None:
        updates.append("assigned_technician_id = :assigned_technician_id")
        params["assigned_technician_id"] = assigned_technician_id
    
    if scheduled_date is not None:
        updates.append("scheduled_date = :scheduled_date")
        params["scheduled_date"] = scheduled_date
    
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updates.append("updated_at = NOW()")
    
    update_query = text(f"""
        UPDATE maintenancerequest
        SET {", ".join(updates)}
        WHERE id = :request_id AND deleted_at IS NULL
        RETURNING id
    """)
    
    result = db.execute(update_query, params)
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    
    return {"message": "Request updated successfully"}


# ==================== UPDATE Request Status ====================
@router.patch("/requests/{request_id}/status")
def update_request_status(
    request_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager", "technician"]))
):
    """Update request status and log the change"""
    
    if status not in ["new", "in_progress", "repaired", "scrap"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    # Get current status
    current_status_query = text("""
        SELECT status FROM maintenancerequest
        WHERE id = :request_id AND deleted_at IS NULL
    """)
    current = db.execute(current_status_query, {"request_id": request_id}).fetchone()
    
    if not current:
        raise HTTPException(status_code=404, detail="Request not found")
    
    old_status = current.status
    
    # Update status
    update_query = text("""
        UPDATE maintenancerequest
        SET status = :status, 
            started_at = CASE WHEN :status = 'in_progress' AND started_at IS NULL THEN NOW() ELSE started_at END,
            completed_at = CASE WHEN :status IN ('repaired', 'scrap') AND completed_at IS NULL THEN NOW() ELSE completed_at END,
            updated_at = NOW()
        WHERE id = :request_id
    """)
    
    db.execute(update_query, {"request_id": request_id, "status": status})
    
    # Log status change
    log_query = text("""
        INSERT INTO requeststatuslog (request_id, old_status, new_status, changed_by, changed_at)
        VALUES (:request_id, :old_status, :new_status, :changed_by, NOW())
    """)
    
    db.execute(log_query, {
        "request_id": request_id,
        "old_status": old_status,
        "new_status": status,
        "changed_by": current_user.id
    })
    
    db.commit()
    
    return {"message": "Status updated successfully", "oldStatus": old_status, "newStatus": status}


# ==================== ADD Comment ====================
@router.post("/requests/{request_id}/comments")
def add_comment(
    request_id: int,
    comment: str,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager", "technician", "employee"]))
):
    """Add a comment to a maintenance request"""
    
    # Check if request exists
    check_query = text('SELECT id FROM maintenancerequest WHERE id = :request_id AND deleted_at IS NULL')
    if not db.execute(check_query, {"request_id": request_id}).fetchone():
        raise HTTPException(status_code=404, detail="Request not found")
    
    insert_query = text("""
        INSERT INTO requestcomment (request_id, comment, commented_by, created_at)
        VALUES (:request_id, :comment, :commented_by, NOW())
        RETURNING id
    """)
    
    result = db.execute(insert_query, {
        "request_id": request_id,
        "comment": comment,
        "commented_by": current_user.id
    })
    
    db.commit()
    comment_id = result.fetchone()[0]
    
    return {"id": comment_id, "message": "Comment added successfully"}


# ==================== DELETE Request ====================
@router.delete("/requests/{request_id}")
def delete_maintenance_request(
    request_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin"]))
):
    """Soft delete maintenance request (Admin only)"""
    
    delete_query = text("""
        UPDATE maintenancerequest
        SET deleted_at = NOW()
        WHERE id = :request_id AND deleted_at IS NULL
        RETURNING id
    """)
    
    result = db.execute(delete_query, {"request_id": request_id})
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Request not found")
    
    return {"message": "Request deleted successfully"}

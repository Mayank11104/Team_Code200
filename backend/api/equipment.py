from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List, Optional
from datetime import date

from ..core.database import get_db
from ..core.security import require_role

router = APIRouter()


# ==================== GET Equipment List ====================
@router.get("/equipment")
def get_equipment_list(
    category: Optional[str] = None,
    department: Optional[str] = None,
    is_scrapped: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    """Get list of all equipment with optional filters"""
    
    query = """
        SELECT 
            e.id,
            e.name,
            e.serial_number,
            e.category,
            e.purchase_date,
            e.warranty_expiry,
            e.location,
            e.department,
            e.is_scrapped,
            e.maintenance_team_id,
            e.default_technician_id,
            e.created_at,
            e.updated_at,
            mt.name as team_name,
            u.name as technician_name
        FROM equipment e
        LEFT JOIN maintenanceteam mt ON e.maintenance_team_id = mt.id
        LEFT JOIN "User" u ON e.default_technician_id = u.id
        WHERE e.deleted_at IS NULL
    """
    
    params = {}
    
    if category:
        query += " AND e.category = :category"
        params["category"] = category
    
    if department:
        query += " AND e.department = :department"
        params["department"] = department
    
    if is_scrapped is not None:
        query += " AND e.is_scrapped = :is_scrapped"
        params["is_scrapped"] = is_scrapped
    
    query += " ORDER BY e.created_at DESC"
    
    result = db.execute(text(query), params)
    equipment_list = []
    
    for row in result:
        equipment_list.append({
            "id": row.id,
            "name": row.name,
            "serialNumber": row.serial_number,
            "category": row.category,
            "purchaseDate": row.purchase_date.isoformat() if row.purchase_date else None,
            "warrantyExpiry": row.warranty_expiry.isoformat() if row.warranty_expiry else None,
            "location": row.location,
            "department": row.department,
            "isScrapped": row.is_scrapped,
            "maintenanceTeamId": row.maintenance_team_id,
            "teamName": row.team_name,
            "defaultTechnicianId": row.default_technician_id,
            "technicianName": row.technician_name,
            "createdAt": row.created_at.isoformat() if row.created_at else None,
            "updatedAt": row.updated_at.isoformat() if row.updated_at else None,
        })
    
    return {"equipment": equipment_list, "total": len(equipment_list)}


# ==================== GET Single Equipment ====================
@router.get("/equipment/{equipment_id}")
def get_equipment(equipment_id: int, db: Session = Depends(get_db)):
    """Get detailed information about a single equipment"""
    
    query = text("""
        SELECT 
            e.*,
            mt.name as team_name,
            mt.description as team_description,
            u.name as technician_name,
            u.email as technician_email
        FROM equipment e
        LEFT JOIN maintenanceteam mt ON e.maintenance_team_id = mt.id
        LEFT JOIN "User" u ON e.default_technician_id = u.id
        WHERE e.id = :equipment_id AND e.deleted_at IS NULL
    """)
    
    result = db.execute(query, {"equipment_id": equipment_id}).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    # Get recent maintenance requests for this equipment
    requests_query = text("""
        SELECT 
            mr.id,
            mr.subject,
            mr.status,
            mr.request_type,
            mr.scheduled_date,
            mr.created_at
        FROM maintenancerequest mr
        WHERE mr.equipment_id = :equipment_id AND mr.deleted_at IS NULL
        ORDER BY mr.created_at DESC
        LIMIT 5
    """)
    
    recent_requests = db.execute(requests_query, {"equipment_id": equipment_id}).fetchall()
    
    return {
        "id": result.id,
        "name": result.name,
        "serialNumber": result.serial_number,
        "category": result.category,
        "purchaseDate": result.purchase_date.isoformat() if result.purchase_date else None,
        "warrantyExpiry": result.warranty_expiry.isoformat() if result.warranty_expiry else None,
        "location": result.location,
        "department": result.department,
        "isScrapped": result.is_scrapped,
        "maintenanceTeamId": result.maintenance_team_id,
        "teamName": result.team_name,
        "teamDescription": result.team_description,
        "defaultTechnicianId": result.default_technician_id,
        "technicianName": result.technician_name,
        "technicianEmail": result.technician_email,
        "createdAt": result.created_at.isoformat() if result.created_at else None,
        "updatedAt": result.updated_at.isoformat() if result.updated_at else None,
        "recentRequests": [
            {
                "id": req.id,
                "subject": req.subject,
                "status": req.status,
                "requestType": req.request_type,
                "scheduledDate": req.scheduled_date.isoformat() if req.scheduled_date else None,
                "createdAt": req.created_at.isoformat() if req.created_at else None,
            }
            for req in recent_requests
        ]
    }


# ==================== CREATE Equipment ====================
@router.post("/equipment")
def create_equipment(
    name: str,
    serial_number: str,
    category: Optional[str] = None,
    purchase_date: Optional[str] = None,
    warranty_expiry: Optional[str] = None,
    location: Optional[str] = None,
    department: Optional[str] = None,
    maintenance_team_id: Optional[int] = None,
    default_technician_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager"]))
):
    """Create new equipment (Admin/Manager only)"""
    
    # Check if serial number already exists
    check_query = text('SELECT id FROM equipment WHERE serial_number = :serial_number')
    existing = db.execute(check_query, {"serial_number": serial_number}).fetchone()
    
    if existing:
        raise HTTPException(status_code=400, detail="Serial number already exists")
    
    insert_query = text("""
        INSERT INTO equipment (
            name, serial_number, category, purchase_date, warranty_expiry,
            location, department, maintenance_team_id, default_technician_id,
            created_at, updated_at
        ) VALUES (
            :name, :serial_number, :category, :purchase_date, :warranty_expiry,
            :location, :department, :maintenance_team_id, :default_technician_id,
            NOW(), NOW()
        ) RETURNING id
    """)
    
    result = db.execute(insert_query, {
        "name": name,
        "serial_number": serial_number,
        "category": category,
        "purchase_date": purchase_date,
        "warranty_expiry": warranty_expiry,
        "location": location,
        "department": department,
        "maintenance_team_id": maintenance_team_id,
        "default_technician_id": default_technician_id,
    })
    
    db.commit()
    equipment_id = result.fetchone()[0]
    
    return {"id": equipment_id, "message": "Equipment created successfully"}


# ==================== UPDATE Equipment ====================
@router.put("/equipment/{equipment_id}")
def update_equipment(
    equipment_id: int,
    name: Optional[str] = None,
    category: Optional[str] = None,
    purchase_date: Optional[str] = None,
    warranty_expiry: Optional[str] = None,
    location: Optional[str] = None,
    department: Optional[str] = None,
    maintenance_team_id: Optional[int] = None,
    default_technician_id: Optional[int] = None,
    is_scrapped: Optional[bool] = None,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin", "manager"]))
):
    """Update equipment (Admin/Manager only)"""
    
    # Build dynamic update query
    updates = []
    params = {"equipment_id": equipment_id}
    
    if name is not None:
        updates.append("name = :name")
        params["name"] = name
    
    if category is not None:
        updates.append("category = :category")
        params["category"] = category
    
    if purchase_date is not None:
        updates.append("purchase_date = :purchase_date")
        params["purchase_date"] = purchase_date
    
    if warranty_expiry is not None:
        updates.append("warranty_expiry = :warranty_expiry")
        params["warranty_expiry"] = warranty_expiry
    
    if location is not None:
        updates.append("location = :location")
        params["location"] = location
    
    if department is not None:
        updates.append("department = :department")
        params["department"] = department
    
    if maintenance_team_id is not None:
        updates.append("maintenance_team_id = :maintenance_team_id")
        params["maintenance_team_id"] = maintenance_team_id
    
    if default_technician_id is not None:
        updates.append("default_technician_id = :default_technician_id")
        params["default_technician_id"] = default_technician_id
    
    if is_scrapped is not None:
        updates.append("is_scrapped = :is_scrapped")
        params["is_scrapped"] = is_scrapped
    
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    updates.append("updated_at = NOW()")
    
    update_query = text(f"""
        UPDATE equipment
        SET {", ".join(updates)}
        WHERE id = :equipment_id AND deleted_at IS NULL
        RETURNING id
    """)
    
    result = db.execute(update_query, params)
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    return {"message": "Equipment updated successfully"}


# ==================== DELETE Equipment ====================
@router.delete("/equipment/{equipment_id}")
def delete_equipment(
    equipment_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_role(["admin"]))
):
    """Soft delete equipment (Admin only)"""
    
    delete_query = text("""
        UPDATE equipment
        SET deleted_at = NOW()
        WHERE id = :equipment_id AND deleted_at IS NULL
        RETURNING id
    """)
    
    result = db.execute(delete_query, {"equipment_id": equipment_id})
    db.commit()
    
    if result.rowcount == 0:
        raise HTTPException(status_code=404, detail="Equipment not found")
    
    return {"message": "Equipment deleted successfully"}

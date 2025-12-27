from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Optional

from ..core.database import get_db

router = APIRouter()


# ==================== Dashboard Statistics ====================
@router.get("/dashboard/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    
    # Total equipment count
    equipment_count = db.execute(text("""
        SELECT COUNT(*) as total,
               SUM(CASE WHEN is_scrapped = false THEN 1 ELSE 0 END) as active,
               SUM(CASE WHEN is_scrapped = true THEN 1 ELSE 0 END) as scrapped
        FROM equipment
        WHERE deleted_at IS NULL
    """)).fetchone()
    
    # Maintenance requests by status
    requests_by_status = db.execute(text("""
        SELECT 
            status,
            COUNT(*) as count
        FROM maintenancerequest
        WHERE deleted_at IS NULL
        GROUP BY status
    """)).fetchall()
    
    # Requests by type
    requests_by_type = db.execute(text("""
        SELECT 
            request_type,
            COUNT(*) as count
        FROM maintenancerequest
        WHERE deleted_at IS NULL
        GROUP BY request_type
    """)).fetchall()
    
    # Teams count
    teams_count = db.execute(text("""
        SELECT COUNT(*) as total
        FROM maintenanceteam
        WHERE deleted_at IS NULL
    """)).fetchone()
    
    # Recent activity (last 5 requests)
    recent_activity = db.execute(text("""
        SELECT 
            mr.id,
            mr.subject,
            mr.status,
            mr.created_at,
            e.name as equipment_name,
            u.name as created_by_name
        FROM maintenancerequest mr
        JOIN equipment e ON mr.equipment_id = e.id
        JOIN "User" u ON mr.created_by = u.id
        WHERE mr.deleted_at IS NULL
        ORDER BY mr.created_at DESC
        LIMIT 5
    """)).fetchall()
    
    status_dict = {status.status: status.count for status in requests_by_status}
    type_dict = {req_type.request_type: req_type.count for req_type in requests_by_type}
    
    return {
        "equipment": {
            "total": equipment_count.total,
            "active": equipment_count.active,
            "scrapped": equipment_count.scrapped
        },
        "requests": {
            "byStatus": {
                "new": status_dict.get("new", 0),
                "inProgress": status_dict.get("in_progress", 0),
                "repaired": status_dict.get("repaired", 0),
                "scrap": status_dict.get("scrap", 0)
            },
            "byType": {
                "corrective": type_dict.get("corrective", 0),
                "preventive": type_dict.get("preventive", 0)
            },
            "total": sum(status_dict.values())
        },
        "teams": {
            "total": teams_count.total
        },
        "recentActivity": [
            {
                "id": activity.id,
                "subject": activity.subject,
                "status": activity.status,
                "equipmentName": activity.equipment_name,
                "createdByName": activity.created_by_name,
                "createdAt": activity.created_at.isoformat() if activity.created_at else None
            }
            for activity in recent_activity
        ]
    }


# ====================Calendar Events ====================
@router.get("/calendar/events")
def get_calendar_events(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Get scheduled maintenance events for calendar"""
    
    query = """
        SELECT 
            mr.id,
            mr.subject,
            mr.description,
            mr.status,
            mr.scheduled_date,
            mr.started_at,
            mr.completed_at,
            e.name as equipment_name,
            mt.name as team_name,
            u.name as technician_name
        FROM maintenancerequest mr
        JOIN equipment e ON mr.equipment_id = e.id
        JOIN maintenanceteam mt ON mr.maintenance_team_id = mt.id
        LEFT JOIN "User" u ON mr.assigned_technician_id = u.id
        WHERE mr.deleted_at IS NULL
          AND mr.scheduled_date IS NOT NULL
    """
    
    params = {}
    
    if start_date:
        query += " AND mr.scheduled_date >= :start_date"
        params["start_date"] = start_date
    
    if end_date:
        query += " AND mr.scheduled_date <= :end_date"
        params["end_date"] = end_date
    
    query += " ORDER BY mr.scheduled_date ASC"
    
    result = db.execute(text(query), params)
    events = []
    
    for row in result:
        events.append({
            "id": row.id,
            "title": row.subject,
            "description": row.description,
            "status": row.status,
            "scheduledDate": row.scheduled_date.isoformat() if row.scheduled_date else None,
            "startedAt": row.started_at.isoformat() if row.started_at else None,
            "completedAt": row.completed_at.isoformat() if row.completed_at else None,
            "equipmentName": row.equipment_name,
            "teamName": row.team_name,
            "technicianName": row.technician_name,
        })
    
    return {"events": events, "total": len(events)}


# ==================== Reports ====================
@router.get("/reports/maintenance-by-team")
def get_maintenance_by_team(db: Session = Depends(get_db)):
    """Get maintenance statistics by team"""
    
    query = text("""
        SELECT 
            mt.id,
            mt.name,
            COUNT(mr.id) as total_requests,
            SUM(CASE WHEN mr.status = 'new' THEN 1 ELSE 0 END) as new_requests,
            SUM(CASE WHEN mr.status = 'in_progress' THEN 1 ELSE 0 END) as in_progress,
            SUM(CASE WHEN mr.status = 'repaired' THEN 1 ELSE 0 END) as completed,
            SUM(CASE WHEN mr.status = 'scrap' THEN 1 ELSE 0 END) as scrapped
        FROM maintenanceteam mt
        LEFT JOIN maintenancerequest mr ON mt.id = mr.maintenance_team_id AND mr.deleted_at IS NULL
        WHERE mt.deleted_at IS NULL
        GROUP BY mt.id, mt.name
        ORDER BY total_requests DESC
    """)
    
    result = db.execute(query)
    teams = []
    
    for row in result:
        teams.append({
            "id": row.id,
            "name": row.name,
            "totalRequests": row.total_requests,
            "newRequests": row.new_requests,
            "inProgress": row.in_progress,
            "completed": row.completed,
            "scrapped": row.scrapped
        })
    
    return {"teams": teams}


@router.get("/reports/equipment-status")
def get_equipment_status_report(db: Session = Depends(get_db)):
    """Get equipment status report"""
    
    query = text("""
        SELECT 
            e.category,
            COUNT(e.id) as total,
            SUM(CASE WHEN e.is_scrapped = false THEN 1 ELSE 0 END) as active,
            SUM(CASE WHEN e.is_scrapped = true THEN 1 ELSE 0 END) as scrapped,
            SUM(CASE WHEN e.warranty_expiry < CURRENT_DATE THEN 1 ELSE 0 END) as warranty_expired
        FROM equipment e
        WHERE e.deleted_at IS NULL
        GROUP BY e.category
        ORDER BY total DESC
    """)
    
    result = db.execute(query)
    categories = []
    
    for row in result:
        categories.append({
            "category": row.category or "Uncategorized",
            "total": row.total,
            "active": row.active,
            "scrapped": row.scrapped,
            "warrantyExpired": row.warranty_expired
        })
    
    return {"categories": categories}


@router.get("/reports/technician-workload")
def get_technician_workload(db: Session = Depends(get_db)):
    """Get technician workload report"""
    
    query = text("""
        SELECT 
            u.id,
            u.name,
            u.email,
            COUNT(mr.id) as total_assigned,
            SUM(CASE WHEN mr.status = 'in_progress' THEN 1 ELSE 0 END) as active_tasks,
            SUM(CASE WHEN mr.status = 'repaired' THEN 1 ELSE 0 END) as completed_tasks
        FROM "User" u
        LEFT JOIN maintenancerequest mr ON u.id = mr.assigned_technician_id AND mr.deleted_at IS NULL
        WHERE u.role = 'technician' AND u.deleted_at IS NULL
        GROUP BY u.id, u.name, u.email
        ORDER BY active_tasks DESC, total_assigned DESC
    """)
    
    result = db.execute(query)
    technicians = []
    
    for row in result:
        technicians.append({
            "id": row.id,
            "name": row.name,
            "email": row.email,
            "totalAssigned": row.total_assigned,
            "activeTasks": row.active_tasks,
            "completedTasks": row.completed_tasks
        })
    
    return {"technicians": technicians}

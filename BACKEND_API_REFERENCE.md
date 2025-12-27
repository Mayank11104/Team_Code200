# GearGuard Backend API Reference

## Server Setup

### Start the Backend Server
```powershell
cd "c:\Users\rites\Desktop\ODOO HACKATHON\Team_Code200\backend"
python -m uvicorn main:app --reload --port 8000
```

### API Documentation
Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

---

## Equipment APIs (`/api/equipment`)

### GET /api/equipment
Get list of all equipment with optional filters
**Query Parameters:**
- `category` (optional): Filter by category
- `department` (optional): Filter by department
- `is_scrapped` (optional): Filter by scrapped status

**Response:**
```json
{
  "equipment": [...],
  "total": 12
}
```

### GET /api/equipment/{id}
Get detailed information about a single equipment including recent maintenance requests

### POST /api/equipment
Create new equipment (Admin/Manager only)
**Required:**  `name`, `serial_number`

### PUT /api/equipment/{id}
Update equipment (Admin/Manager only)

### DELETE /api/equipment/{id}
Soft delete equipment (Admin only)

---

## Teams APIs (`/api/teams`)

### GET /api/teams
Get list of all teams with member and equipment counts

### GET /api/teams/{id}
Get team details including members list and assigned equipment

### POST /api/teams
Create new team (Admin/Manager only)
**Required:** `name`

### PUT /api/teams/{id}
Update team (Admin/Manager only)

### DELETE /api/teams/{id}
Soft delete team (Admin only)

### POST /api/teams/{id}/members
Add a member to team (Admin/Manager only)
**Required:** `user_id`

### DELETE /api/teams/{id}/members/{user_id}
Remove member from team (Admin/Manager only)

---

## Maintenance Request APIs (`/api/requests`)

### GET /api/requests
Get list of maintenance requests with optional filters
**Query Parameters:**
- `status`: Filter by status (new, in_progress, repaired, scrap)
- `request_type`: Filter by type (corrective, preventive)
- `equipment_id`: Filter by equipment
- `team_id`: Filter by team

### GET /api/requests/{id}
Get detailed request info with status history and comments

### POST /api/requests
Create new maintenance request
**Required:** `subject`, `equipment_id`, `maintenance_team_id`
**Optional:** `description`, `request_type`, `assigned_technician_id`, `scheduled_date`

### PUT /api/requests/{id}
Update maintenance request (Admin/Manager/Technician)

### PATCH /api/requests/{id}/status
Update request status with automatic logging
**Required:** `status` (new, in_progress, repaired, scrap)

### POST /api/requests/{id}/comments
Add comment to a request
**Required:** `comment`

### DELETE /api/requests/{id}
Soft delete request (Admin only)

---

## Reports & Dashboard APIs (`/api/`)

### GET /api/dashboard/stats
Get dashboard statistics
**Returns:**
- Equipment counts (total, active, scrapped)
- Requests by status and type
- Team counts
- Recent activity

### GET /api/calendar/events
Get scheduled maintenance events for calendar
**Query Parameters:**
- `start_date` (optional): Filter start date
- `end_date` (optional): Filter end date

### GET /api/reports/maintenance-by-team
Get maintenance statistics by team

### GET /api/reports/equipment-status
Get equipment status report by category

### GET /api/reports/technician-workload
Get technician workload report

---

## Authentication

All protected endpoints require authentication via JWT token or session cookie from the `/auth` endpoints.

### Role-Based Access:
- **Admin**: Full access to all  endpoints
- **Manager**: CRUD on equipment, teams, and requests
- **Technician**: Update requests and add comments
- **Employee**: Create requests and add comments

---

## Test the APIs

### Using cURL (Equipment List):
```powershell
curl http://localhost:8000/api/equipment
```

### Using Browser:
Visit http://localhost:8000/docs and use the interactive Swagger UI

---

## Response Format

All responses use camelCase for JSON fields to match frontend conventions:
- `serialNumber` (not `serial_number`)
- `createdAt` (not `created_at`)
- `maintenanceTeamId` (not `maintenance_team_id`)

---

## Error Responses

```json
{
  "detail": "Error message here"
}
```

Common status codes:
- `400`: Bad Request
- `401`: Unauthorized  
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

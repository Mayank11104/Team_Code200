# GearGuard Database Setup Guide

## Quick Setup

### Step 1: Create the Database
```powershell
# Using psql command
psql -U postgres -c "CREATE DATABASE gearguard;"
```

Or manually:
```powershell
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE gearguard;

# Exit
\q
```

### Step 2: Run Schema and Seed Data
```powershell
# Navigate to backend/database directory
cd "c:\Users\rites\Desktop\ODOO HACKATHON\Team_Code200\backend\database"

# Apply schema
psql -U postgres -d gearguard -f schema.sql

# Load seed data
psql -U postgres -d gearguard -f seed_enhanced.sql
```

### Alternative: One Command Setup
```powershell
cd "c:\Users\rites\Desktop\ODOO HACKATHON\Team_Code200\backend\database"
psql -U postgres -d gearguard -f setup_database.sql
```

## Test Credentials

All users have the password: `password123`

- **Admin**: admin@gearguard.com
- **Manager**: manager@gearguard.com
- **Technicians**: 
  - john.tech@gearguard.com
  - alice.tech@gearguard.com
  - emma.tech@gearguard.com
  - lisa.tech@gearguard.com
- **Employees**:
  - bob@gearguard.com
  - michael@gearguard.com

## What's Included

### Users (8 total)
- 1 Admin
- 1 Manager
- 4 Technicians
- 2 Employees

### Teams (4 total)
- Mechanical Team
- IT Support Team
- Electrical Team
- HVAC Team

### Equipment (12 items)
- 4 Mechanical items
- 4 IT items
- 2 Electrical items
- 2 HVAC items

### Maintenance Requests (7 total)
- 2 New requests
- 2 In Progress requests
- 2 Repaired requests
- 1 Scrap request

### Additional Data
- Team member assignments
- Request status change logs
- Request comments
- Login history

## Verify Setup

```powershell
# Connect to database
psql -U postgres -d gearguard

# Check tables
\dt

# Count records
SELECT 'Users' as table_name, COUNT(*) FROM "User"
UNION ALL
SELECT 'Teams', COUNT(*) FROM MaintenanceTeam
UNION ALL
SELECT 'Equipment', COUNT(*) FROM Equipment
UNION ALL
SELECT 'Requests', COUNT(*) FROM MaintenanceRequest;

# Exit
\q
```

Expected output:
- Users: 8
- Teams: 4
- Equipment: 12
- Requests: 7

## Database Connection String

Update your `backend/core/config.py`:
```python
DATABASE_URL: str = "postgresql://postgres:YOUR_PASSWORD@localhost/gearguard"
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

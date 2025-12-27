-- =========================================================
-- GearGuard Database Schema
-- Normalized to 3NF
-- PostgreSQL
-- =========================================================

-- ---------- USER ----------
CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'manager', 'technician', 'employee')),
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ---------- MAINTENANCE TEAM ----------
CREATE TABLE MaintenanceTeam (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ---------- TEAM MEMBER (JUNCTION TABLE) ----------
CREATE TABLE TeamMember (
    id SERIAL PRIMARY KEY,
    team_id INT NOT NULL REFERENCES MaintenanceTeam(id),
    user_id INT NOT NULL REFERENCES "User"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    UNIQUE (team_id, user_id)
);

-- ---------- EQUIPMENT ----------
CREATE TABLE Equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    serial_number VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    purchase_date DATE,
    warranty_expiry DATE,
    location VARCHAR(150),
    department VARCHAR(100),
    maintenance_team_id INT REFERENCES MaintenanceTeam(id),
    default_technician_id INT REFERENCES "User"(id),
    is_scrapped BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ---------- WORK CENTER ----------
CREATE TABLE WorkCenter (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(150),
    capacity INT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
    maintenance_team_id INT REFERENCES MaintenanceTeam(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ---------- MAINTENANCE REQUEST ----------
CREATE TABLE MaintenanceRequest (
    id SERIAL PRIMARY KEY,
    subject VARCHAR(200) NOT NULL,
    description TEXT,
    request_type VARCHAR(20) NOT NULL CHECK (request_type IN ('corrective', 'preventive')),
    priority VARCHAR(10) CHECK (priority IN ('low', 'medium', 'high')),
    duration INT, -- in hours/minutes? explicit
    status VARCHAR(20) NOT NULL CHECK (status IN ('new', 'in_progress', 'repaired', 'scrap')),
    equipment_id INT REFERENCES Equipment(id),
    work_center_id INT REFERENCES WorkCenter(id),
    maintenance_team_id INT NOT NULL REFERENCES MaintenanceTeam(id),
    assigned_technician_id INT REFERENCES "User"(id),
    CONSTRAINT chk_maintenance_target CHECK (
        (equipment_id IS NOT NULL AND work_center_id IS NULL) OR
        (equipment_id IS NULL AND work_center_id IS NOT NULL)
    ),
    scheduled_date DATE,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_by INT NOT NULL REFERENCES "User"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ---------- REQUEST STATUS LOG ----------
CREATE TABLE RequestStatusLog (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES MaintenanceRequest(id),
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by INT REFERENCES "User"(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------- REQUEST COMMENT (OPTIONAL) ----------
CREATE TABLE RequestComment (
    id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES MaintenanceRequest(id),
    comment TEXT NOT NULL,
    commented_by INT REFERENCES "User"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- ---------- INDEXES ----------
CREATE INDEX idx_equipment_team ON Equipment(maintenance_team_id);
CREATE INDEX idx_request_status ON MaintenanceRequest(status);
CREATE INDEX idx_request_equipment ON MaintenanceRequest(equipment_id);
CREATE INDEX idx_request_team ON MaintenanceRequest(maintenance_team_id);

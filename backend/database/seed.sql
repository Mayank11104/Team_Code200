-- =========================================================
-- GearGuard Seed Data
-- =========================================================

-- ---------- USERS ----------
INSERT INTO "User" (name, email, role) VALUES
('Admin User', 'admin@gearguard.com', 'admin'),
('Maintenance Manager', 'manager@gearguard.com', 'manager'),
('Tech John', 'john.tech@gearguard.com', 'technician'),
('Tech Alice', 'alice.tech@gearguard.com', 'technician'),
('Employee Bob', 'bob@gearguard.com', 'employee');

-- ---------- MAINTENANCE TEAMS ----------
INSERT INTO MaintenanceTeam (name, description) VALUES
('Mechanical Team', 'Handles mechanical equipment'),
('IT Support Team', 'Handles IT assets');

-- ---------- TEAM MEMBERS ----------
INSERT INTO TeamMember (team_id, user_id) VALUES
(1, 3),
(1, 4),
(2, 4);

-- ---------- EQUIPMENT ----------
INSERT INTO Equipment (
    name,
    serial_number,
    category,
    location,
    department,
    maintenance_team_id,
    default_technician_id
) VALUES
('CNC Machine', 'CNC-001', 'Machine', 'Factory Floor', 'Production', 1, 3),
('Office Printer', 'PR-101', 'Printer', 'Admin Office', 'Administration', 2, 4),
('Company Laptop', 'LT-900', 'Computer', 'IT Room', 'IT', 2, 4);

-- ---------- MAINTENANCE REQUESTS ----------
INSERT INTO MaintenanceRequest (
    subject,
    description,
    request_type,
    status,
    equipment_id,
    maintenance_team_id,
    assigned_technician_id,
    created_by
) VALUES
(
    'Oil leakage detected',
    'Oil leaking from CNC machine',
    'corrective',
    'new',
    1,
    1,
    NULL,
    5
),
(
    'Monthly printer check',
    'Routine preventive maintenance',
    'preventive',
    'new',
    2,
    2,
    4,
    2
);

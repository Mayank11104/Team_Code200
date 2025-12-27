-- =========================================================
-- GearGuard Enhanced Seed Data with Password Hashes
-- Password for all users: "password123"
-- Hash generated using Argon2
-- =========================================================

-- ---------- USERS ----------
-- Clearing existing data (if any)
TRUNCATE TABLE RequestComment, RequestStatusLog, MaintenanceRequest, Equipment, TeamMember, MaintenanceTeam, LoginHistory, "User" RESTART IDENTITY CASCADE;

-- Admin, Manager, Technicians, and Employees with hashed passwords
INSERT INTO "User" (name, email, password_hash, role, avatar_url, created_at, updated_at) VALUES
('Admin User', 'admin@gearguard.com', '$argon2id$v=19$m=65536,t=3,p=4$B4DwnpPSujdGqBWiVGrtXQ$Brl5344W6ozq+GuTOmqZR6N/FwccFA1Mac6JMqw7Ur8', 'admin', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin', NOW(), NOW()),
('Sarah Johnson', 'manager@gearguard.com', '$argon2id$v=19$m=65536,t=3,p=4$B4DwnpPSujdGqBWiVGrtXQ$Brl5344W6ozq+GuTOmqZR6N/FwccFA1Mac6JMqw7Ur8', 'manager', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', NOW(), NOW()),
('John Mitchell', 'john.tech@gearguard.com', '$argon2id$v=19$m=65536,t=3,p=4$B4DwnpPSujdGqBWiVGrtXQ$Brl5344W6ozq+GuTOmqZR6N/FwccFA1Mac6JMqw7Ur8', 'technician', 'https://api.dicebear.com/7.x/avataaars/svg?seed=John', NOW(), NOW()),
('Alice Cooper', 'alice.tech@gearguard.com', '$argon2id$v=19$m=65536,t=3,p=4$B4DwnpPSujdGqBWiVGrtXQ$Brl5344W6ozq+GuTOmqZR6N/FwccFA1Mac6JMqw7Ur8', 'technician', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', NOW(), NOW()),
('Bob Williams', 'bob@gearguard.com', '$argon2id$v=19$m=65536,t=3,p=4$B4DwnpPSujdGqBWiVGrtXQ$Brl5344W6ozq+GuTOmqZR6N/FwccFA1Mac6JMqw7Ur8', 'employee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob', NOW(), NOW()),
('Emma Davis', 'emma.tech@gearguard.com', '$argon2id$v=19$m=65536,t=3,p=4$B4DwnpPSujdGqBWiVGrtXQ$Brl5344W6ozq+GuTOmqZR6N/FwccFA1Mac6JMqw7Ur8', 'technician', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', NOW(), NOW()),
('Michael Brown', 'michael@gearguard.com', '$argon2id$v=19$m=65536,t=3,p=4$B4DwnpPSujdGqBWiVGrtXQ$Brl5344W6ozq+GuTOmqZR6N/FwccFA1Mac6JMqw7Ur8', 'employee', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', NOW(), NOW()),
('Lisa Anderson', 'lisa.tech@gearguard.com', '$argon2id$v=19$m=65536,t=3,p=4$B4DwnpPSujdGqBWiVGrtXQ$Brl5344W6ozq+GuTOmqZR6N/FwccFA1Mac6JMqw7Ur8', 'technician', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', NOW(), NOW());

-- ---------- MAINTENANCE TEAMS ----------
INSERT INTO MaintenanceTeam (name, description, created_at, updated_at) VALUES
('Mechanical Team', 'Responsible for all mechanical equipment maintenance and repairs', NOW(), NOW()),
('IT Support Team', 'Handles all IT infrastructure, computers, and network equipment', NOW(), NOW()),
('Electrical Team', 'Manages electrical systems and power equipment', NOW(), NOW()),
('HVAC Team', 'Heating, Ventilation, and Air Conditioning specialists', NOW(), NOW());

-- ---------- TEAM MEMBERS ----------
-- Mechanical Team: John, Alice
INSERT INTO TeamMember (team_id, user_id, created_at) VALUES
(1, 3, NOW()),
(1, 4, NOW());

-- IT Support Team: Alice, Emma
INSERT INTO TeamMember (team_id, user_id, created_at) VALUES
(2, 4, NOW()),
(2, 6, NOW());

-- Electrical Team: Lisa
INSERT INTO TeamMember (team_id, user_id, created_at) VALUES
(3, 8, NOW());

-- HVAC Team: John, Lisa
INSERT INTO TeamMember (team_id, user_id, created_at) VALUES
(4, 3, NOW()),
(4, 8, NOW());

-- ---------- EQUIPMENT ----------
INSERT INTO Equipment (
    name,
    serial_number,
    category,
    purchase_date,
    warranty_expiry,
    location,
    department,
    maintenance_team_id,
    default_technician_id,
    is_scrapped,
    created_at,
    updated_at
) VALUES
-- Mechanical Equipment
('CNC Machine X-500', 'CNC-001-2023', 'CNC Machine', '2023-01-15', '2026-01-15', 'Factory Floor A', 'Production', 1, 3, FALSE, NOW(), NOW()),
('Lathe Machine', 'LAT-002-2022', 'Lathe', '2022-06-20', '2025-06-20', 'Factory Floor B', 'Production', 1, 4, FALSE, NOW(), NOW()),
('Hydraulic Press', 'HYD-003-2021', 'Press', '2021-03-10', '2024-03-10', 'Factory Floor A', 'Production', 1, 3, FALSE, NOW(), NOW()),
('Conveyor Belt System', 'CVB-004-2023', 'Conveyor', '2023-08-01', '2026-08-01', 'Warehouse', 'Logistics', 1, 4, FALSE, NOW(), NOW()),

-- IT Equipment
('Dell Server R740', 'SRV-101-2023', 'Server', '2023-02-15', '2026-02-15', 'Server Room', 'IT', 2, 6, FALSE, NOW(), NOW()),
('HP Office Printer', 'PRN-102-2022', 'Printer', '2022-11-01', '2024-11-01', 'Admin Office', 'Administration', 2, 4, FALSE, NOW(), NOW()),
('Lenovo ThinkPad X1', 'LAP-103-2023', 'Laptop', '2023-05-20', '2026-05-20', 'IT Room', 'IT', 2, 6, FALSE, NOW(), NOW()),
('Cisco Network Switch', 'NET-104-2022', 'Network Equipment', '2022-09-10', '2027-09-10', 'Server Room', 'IT', 2, 6, FALSE, NOW(), NOW()),

-- Electrical Equipment
('Generator 500KW', 'GEN-201-2020', 'Generator', '2020-04-15', '2025-04-15', 'Power Room', 'Facilities', 3, 8, FALSE, NOW(), NOW()),
('Transformer 2000V', 'TRF-202-2021', 'Transformer', '2021-07-20', '2026-07-20', 'Electrical Room', 'Facilities', 3, 8, FALSE, NOW(), NOW()),

-- HVAC Equipment
('Central AC Unit', 'HVAC-301-2022', 'Air Conditioner', '2022-03-01', '2027-03-01', 'Roof Top', 'Facilities', 4, 3, FALSE, NOW(), NOW()),
('Industrial Chiller', 'CHL-302-2023', 'Chiller', '2023-01-10', '2028-01-10', 'Basement', 'Facilities', 4, 8, FALSE, NOW(), NOW());

-- ---------- MAINTENANCE REQUESTS ----------
INSERT INTO MaintenanceRequest (
    subject,
    description,
    request_type,
    status,
    equipment_id,
    maintenance_team_id,
    assigned_technician_id,
    scheduled_date,
    started_at,
    completed_at,
    created_by,
    created_at,
    updated_at
) VALUES
-- New Requests
(
    'Oil leakage detected on CNC Machine',
    'Heavy oil leakage observed from the hydraulic system of CNC Machine X-500. Production has been halted.',
    'corrective',
    'new',
    1,
    1,
    NULL,
    '2025-12-28',
    NULL,
    NULL,
    5,
    NOW(),
    NOW()
),
(
    'Printer paper jam recurring',
    'Office printer experiencing frequent paper jams. Needs thorough inspection.',
    'corrective',
    'new',
    6,
    2,
    4,
    '2025-12-29',
    NULL,
    NULL,
    7,
    NOW(),
    NOW()
),

-- In Progress Requests
(
    'Monthly preventive maintenance - Server',
    'Scheduled monthly check: dust cleaning, update firmware, check cooling system',
    'preventive',
    'in_progress',
    5,
    2,
    6,
    '2025-12-27',
    NOW() - INTERVAL '2 hours',
    NULL,
    2,
    NOW() - INTERVAL '1 day',
    NOW()
),
(
    'Conveyor belt alignment issue',
    'Conveyor belt is misaligned causing products to fall off',
    'corrective',
    'in_progress',
    4,
    1,
    4,
    '2025-12-27',
    NOW() - INTERVAL '4 hours',
    NULL,
    5,
    NOW() - INTERVAL '5 hours',
    NOW()
),

-- Repaired Requests
(
    'Generator maintenance check',
    'Quarterly preventive maintenance for emergency generator',
    'preventive',
    'repaired',
    9,
    3,
    8,
    '2025-12-20',
    NOW() - INTERVAL '7 days',
    NOW() - INTERVAL '6 days',
    2,
    NOW() - INTERVAL '10 days',
    NOW() - INTERVAL '6 days'
),
(
    'AC Unit filter replacement',
    'Replace air filters and clean condensers',
    'preventive',
    'repaired',
    11,
    4,
    3,
    '2025-12-15',
    NOW() - INTERVAL '12 days',
    NOW() - INTERVAL '11 days',
    2,
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '11 days'
),

-- Scrap Request
(
    'Transformer overheating failure',
    'Transformer showing critical overheating. Safety inspection recommends replacement.',
    'corrective',
    'scrap',
    10,
    3,
    8,
    '2025-12-10',
    NOW() - INTERVAL '17 days',
    NOW() - INTERVAL '15 days',
    1,
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '15 days'
);

-- ---------- REQUEST STATUS LOGS ----------
-- Log for request 3 (Server maintenance: new -> in_progress)
INSERT INTO RequestStatusLog (request_id, old_status, new_status, changed_by, changed_at) VALUES
(3, 'new', 'in_progress', 6, NOW() - INTERVAL '2 hours');

-- Log for request 4 (Conveyor: new -> in_progress)
INSERT INTO RequestStatusLog (request_id, old_status, new_status, changed_by, changed_at) VALUES
(4, 'new', 'in_progress', 4, NOW() - INTERVAL '4 hours');

-- Logs for request 5 (Generator: new -> in_progress -> repaired)
INSERT INTO RequestStatusLog (request_id, old_status, new_status, changed_by, changed_at) VALUES
(5, 'new', 'in_progress', 8, NOW() - INTERVAL '7 days'),
(5, 'in_progress', 'repaired', 8, NOW() - INTERVAL '6 days');

-- Logs for request 6 (AC Unit: new -> in_progress -> repaired)
INSERT INTO RequestStatusLog (request_id, old_status, new_status, changed_by, changed_at) VALUES
(6, 'new', 'in_progress', 3, NOW() - INTERVAL '12 days'),
(6, 'in_progress', 'repaired', 3, NOW() - INTERVAL '11 days');

-- Logs for request 7 (Transformer: new -> in_progress -> scrap)
INSERT INTO RequestStatusLog (request_id, old_status, new_status, changed_by, changed_at) VALUES
(7, 'new', 'in_progress', 8, NOW() - INTERVAL '17 days'),
(7, 'in_progress', 'scrap', 1, NOW() - INTERVAL '15 days');

-- ---------- REQUEST COMMENTS ----------
-- Comments on various requests
INSERT INTO RequestComment (request_id, comment, commented_by, created_at) VALUES
(1, 'This is urgent as it is blocking production. Please prioritize.', 2, NOW() - INTERVAL '30 minutes'),
(1, 'Will inspect today and provide estimate.', 3, NOW() - INTERVAL '15 minutes'),

(3, 'Starting the routine maintenance now.', 6, NOW() - INTERVAL '2 hours'),
(3, 'Firmware update completed, proceeding with physical inspection.', 6, NOW() - INTERVAL '1 hour'),

(4, 'Realigning the belt. Will test after adjustment.', 4, NOW() - INTERVAL '3 hours'),
(4, 'Adjustment complete, running test cycle.', 4, NOW() - INTERVAL '2 hours'),

(5, 'Maintenance completed successfully. All systems nominal.', 8, NOW() - INTERVAL '6 days'),

(7, 'Safety inspection report attached. Equipment must be scrapped.', 1, NOW() - INTERVAL '15 days'),
(7, 'Replacement order has been placed.', 2, NOW() - INTERVAL '14 days');

-- ---------- LOGIN HISTORY ----------
-- Sample login history
INSERT INTO LoginHistory (user_id, login_timestamp, ip_address) VALUES
(1, NOW() - INTERVAL '1 hour', '192.168.1.10'),
(2, NOW() - INTERVAL '2 hours', '192.168.1.11'),
(3, NOW() - INTERVAL '3 hours', '192.168.1.12'),
(4, NOW() - INTERVAL '30 minutes', '192.168.1.13'),
(6, NOW() - INTERVAL '2 hours', '192.168.1.14'),
(1, NOW() - INTERVAL '1 day', '192.168.1.10'),
(2, NOW() - INTERVAL '1 day', '192.168.1.11');

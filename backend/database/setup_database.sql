-- =========================================================
-- GearGuard Database Full Setup Script
-- Run this file to create and populate the entire database
-- =========================================================

-- This script combines schema creation and seed data
-- Execute with: psql -U postgres -d gearguard -f setup_database.sql

\echo 'Creating GearGuard database schema...'
\i schema.sql

\echo 'Loading seed data...'
\i seed_enhanced.sql

\echo 'Database setup complete!'
\echo 'Test credentials - All users password: password123'
\echo '  Admin: admin@gearguard.com'
\echo '  Manager: manager@gearguard.com'
\echo '  Technician: john.tech@gearguard.com'

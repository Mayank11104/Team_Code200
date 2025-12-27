# GearGuard Database Setup

## Prerequisites
- PostgreSQL installed
- `psql` available in PATH

## Setup Steps

1. Create database
```bash
createdb gearguard_db
```
2. Apply schema
```bash
psql gearguard_db < database/schema.sql
```

3. Load seed data
```bash
psql gearguard_db < database/seed.sql
```
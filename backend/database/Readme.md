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
psql -U postgres -d gearguard_db -f database/schema.sql

```

3. Load seed data
```bash
psql -U postgres -d gearguard_db -f database/seed.sql

```
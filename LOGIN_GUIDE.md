# Login Troubleshooting Guide

## The Issue
Getting 401 Unauthorized when trying to login.

## Solution: Role Must Match Database

The login form has a **Role dropdown** at the top. You MUST select the role that matches the user's role in the database.

## Correct Login Steps:

### For Admin User:
1. **Select Role dropdown**: Choose **"Admin"**
2. **Email**: `admin@gearguard.com`
3. **Password**: `password123`
4. Click "Sign In"

### For Manager User:
1. **Select Role dropdown**: Choose **"Manager"**
2. **Email**: `manager@gearguard.com`
3. **Password**: `password123`
4. Click "Sign In"

### For Technician:
1. **Select Role dropdown**: Choose **"Technician"**
2. **Email**: `john.tech@gearguard.com` (or alice, emma, lisa)
3. **Password**: `password123`
4. Click "Sign In"

### For Employee:
1. **Select Role dropdown**: Choose **"Employee"**
2. **Email**: `bob@gearguard.com` (or michael)
3. **Password**: `password123`
4. Click "Sign In"

## Why This Happens

The backend `/auth/login` endpoint checks if the selected role matches the user's role in the database:

```python
if role != user.role:
    raise HTTPException(status_code=401, detail="Role mismatch")
```

So if you select "Technician" but try to login with `admin@gearguard.com`, it will fail because the admin's role in the database is "admin", not "technician".

##  Quick Fix Test:

**Try this exact sequence:**
1. Open the login modal
2. In the **FIRST dropdown** (Select Role), choose: **Admin**
3. Email: `admin@gearguard.com`
4. Password: `password123`
5. Click Sign In

This should work! The role dropdown defaults to "technician" which is why it's failing for the admin account.

# Quick Fix for CORS and Login Issues

## Problem 1: Missing argon2_cffi Package

The backend is crashing because the Argon2 password library is not installed.

### Fix:
```powershell
cd backend
pip install argon2-cffi
```

## Problem 2: Backend Needs Restart

After installing the package, restart the backend server:

```powershell
# Stop the current server (Ctrl+C)
# Then start it again:
python -m uvicorn main:app --reload --port 8000
```

## Problem 3: CORS Configuration

The CORS middleware is already configured in `main.py` to allow all origins, but you need to restart the server for it to take effect.

## Complete Fix Steps:

1. **Stop the backend server** (press Ctrl+C in the terminal where it's running)

2. **Install argon2-cffi:**
   ```powershell
   cd backend
   pip install argon2-cffi
   ```

3. **Restart the backend:**
   ```powershell
   python -m uvicorn main:app --reload --port 8000
   ```

4. **Try login again:**
   - Role: Admin
   - Email: admin@gearguard.com
   - Password: password123

The CORS errors and 500 errors should be gone after this! 🚀

## Why This Happened:

- `argon2-cffi` was in `requirements.txt` but might not have been installed in your virtual environment
- PassLib needs this package to verify Argon2 password hashes
- Without it, the password verification fails and causes a 500 error
- CORS errors occur because the backend crashes before it can respond

## Verification:

After restarting, you should see in the backend terminal:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete
```

And NO errors when accessing the Equipment or Teams pages!

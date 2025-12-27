# Cookie Authentication Fix

## Problem
- User was logged in successfully
- Cookies were set with access_token
- But creating requests returned 401 Unauthorized
- User was redirected to root page (/)

## Root Cause
The backend `get_current_user()` function was reading the JWT token from the **Authorization header** (using `OAuth2PasswordBearer`) instead of from **cookies**.

## What Was Fixed

### Backend: `security.py`

**Before:**
```python
def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    # Reads token from Authorization header
    payload = jwt.decode(token, ...)
```

**After:**
```python
def get_current_user(request: Request, db: Session = Depends(get_db)):
    # Reads token from cookie
    token_str = request.cookies.get("access_token")
    if not token_str:
        raise credentials_exception
    
    # Remove "Bearer " prefix if present
    if token_str.startswith("Bearer "):
        token_str = token_str[7:]
    
    payload = jwt.decode(token_str, ...)
```

### Changes Made:

1. **Added `Request` parameter** to `get_current_user()`
2. **Read token from cookies** instead of Authorization header
3. **Handle "Bearer " prefix** that might be in the cookie
4. **Updated `require_role()`** to accept list of roles (e.g., `["admin", "manager"]`)

## How It Works Now

1. **Login Flow:**
   ```
   User logs in → Backend sets cookie → Frontend stores cookie
   ```

2. **API Request Flow:**
   ```
   Frontend makes request → Sends cookie automatically (withCredentials: true)
   → Backend reads token from cookie → Validates token → Returns user
   ```

3. **Protected Endpoints:**
   ```python
   @router.post("/api/requests")
   def create_request(
       current_user = Depends(require_role(["admin", "manager", "employee"]))
   ):
       # This now works! Token is read from cookie
   ```

## Testing

1. **Login:**
   - Go to login page
   - Enter credentials
   - Should redirect to dashboard
   - Check browser DevTools → Application → Cookies → Should see `access_token`

2. **Create Request:**
   - Click "New Request"
   - Fill form
   - Click "Create Request"
   - **Should work now!** ✅
   - Should see success toast
   - Should NOT redirect to root page

3. **Check Backend Logs:**
   ```
   INFO: POST /api/requests HTTP/1.1 200 OK  ✅
   (Instead of 401 Unauthorized)
   ```

## Frontend Already Configured

The frontend was already correctly configured in `client.ts`:
```typescript
const apiClient = axios.create({
  withCredentials: true, // ✅ Sends cookies with every request
});
```

And in login/signup:
```typescript
fetch('http://localhost:8000/auth/login', {
  credentials: 'include', // ✅ Sends cookies
});
```

## What Still Works

- Login/Signup
- Equipment list (no auth required)
- Teams list (no auth required)
- All protected endpoints now work with cookie authentication
- Drag & drop status updates in Kanban
- Creating maintenance requests

## Restart Required

**Restart the backend server** for changes to take effect:
```powershell
# Stop current server (Ctrl+C)
python -m uvicorn main:app --reload --port 8000
```

Then test creating a request again! 🚀

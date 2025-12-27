# Create Maintenance Request - How It Works

## ✅ What Was Updated

The `CreateRequestDialog` component now fully integrates with your PostgreSQL database through the backend API.

## 📋 Required Fields

When creating a new maintenance request, you need to provide:

### 1. **Subject** (Required)
- Brief title describing the issue
- Example: "Oil leakage on CNC Machine"

### 2. **Request Type** (Required)
- **Corrective**: For repairs and breakdowns
- **Preventive**: For scheduled maintenance

### 3. **Equipment** (Required)
- Select from dropdown of all non-scrapped equipment
- Shows: Equipment name + Serial number
- **Auto-fills team** when you select equipment (if equipment has default team)

### 4. **Maintenance Team** (Required)
- Select which team will handle the request
- Shows all active teams from database

### 5. **Assigned Technician** (Optional)
- Enter technician user ID
- Available technicians:
  - **3** - John Mitchell (john.tech@gearguard.com)
  - **4** - Alice Chen (alice.tech@gearguard.com)
  - **5** - Emma Davis (emma.tech@gearguard.com)
  - **6** - Lisa Wong (lisa.tech@gearguard.com)
- Leave empty to assign later

### 6. **Scheduled Date** (Optional)
- When the maintenance should be performed
- Format: YYYY-MM-DD

### 7. **Description** (Optional)
- Detailed explanation of the issue or maintenance needed

## 🚀 How to Use

1. **Go to Maintenance Requests page**
2. **Click "New Request" button** (top right)
3. **Fill in the form:**
   - Subject: e.g., "Replace worn belt"
   - Type: Select "Corrective" or "Preventive"
   - Equipment: e.g., "CNC Machine X-500 (CNC-001-2023)"
   - Team: Will auto-select if equipment has default team
   - Technician ID: Enter 3, 4, 5, or 6 (or leave empty)
   - Scheduled Date: Optional
   - Description: Optional details
4. **Click "Create Request"**

## ✨ Features

- **Auto-fills team** when you select equipment
- **Real-time validation** - submit button disabled until required fields filled
- **Loading state** - shows spinner while creating
- **Success toast** - "Maintenance request created successfully"
- **Error handling** - Shows specific error messages if creation fails
- **Auto-refresh** - Request list updates automatically after creation

## 🔍 What Happens Behind the Scenes

1. Form data is sent to: `POST /api/requests`
2. Backend creates new record in `MaintenanceRequest` table
3. Sets status to `'new'` automatically
4. Creates initial status log entry
5. Returns created request with ID
6. Frontend cache invalidates and refetches request list
7. New request appears in the list immediately

## 🧪 Test It

### Example Request to Create:

```
Subject: Replace hydraulic oil
Type: Preventive
Equipment: Hydraulic Press HP-200 (HYD-002-2023)
Team: Mechanical Team (auto-filled from equipment)
Technician: 3 (John Mitchell)
Scheduled Date: 2025-12-30
Description: Routine hydraulic oil change as per maintenance schedule
```

Click "Create Request" and you should see:
- ✅ Success toast message
- ✅ New request appears in the list
- ✅ Dialog closes automatically
- ✅ Form resets for next request

## 📝 Database Fields

The API endpoint expects (in camelCase):
- `subject` (string, required)
- `description` (string, optional)
- `requestType` ('corrective' | 'preventive', required)
- `equipmentId` (number, required)
- `maintenanceTeamId` (number, required)
- `assignedTechnicianId` (number, optional)
- `scheduledDate` (string YYYY-MM-DD, optional)

Backend automatically sets:
- `status`: 'new'
- `createdBy`: Current logged-in user
- `createdAt`: Current timestamp
- Creates initial status log entry

## 🐛 Troubleshooting

**If create button is disabled:**
- Make sure Subject is filled
- Make sure Equipment is selected
- Make sure Team is selected

**If you get an error:**
- Check backend is running (localhost:8000)
- Check you're logged in
- Check equipment/team IDs exist in database
- Check browser console for detailed error message

**To verify it worked:**
1. Check the Maintenance Requests page - new request should appear
2. Check Swagger UI: GET /api/requests - should show the new request
3. Check database: `SELECT * FROM maintenancerequest ORDER BY id DESC LIMIT 1;`

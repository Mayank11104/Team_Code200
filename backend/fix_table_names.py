"""Fix table names in API files to match PostgreSQL lowercase names"""

import os

# Define the replacements
replacements = {
    '"Equipment"': 'equipment',
    '"MaintenanceTeam"': 'maintenanceteam',
    '"MaintenanceRequest"': 'maintenancerequest',
    '"TeamMember"': 'teammember',
    '"RequestStatusLog"': 'requeststatuslog',
    '"RequestComment"': 'requestcomment',
}

# Files to fix
files_to_fix = [
    r'C:\Users\rites\Desktop\ODOO HACKATHON\Team_Code200\backend\api\equipment.py',
    r'C:\Users\rites\Desktop\ODOO HACKATHON\Team_Code200\backend\api\teams.py',
    r'C:\Users\rites\Desktop\ODOO HACKATHON\Team_Code200\backend\api\maintenance.py',
    r'C:\Users\rites\Desktop\ODOO HACKATHON\Team_Code200\backend\api\reports.py',
]

for filepath in files_to_fix:
    if not os.path.exists(filepath):
        print(f"Skipping {filepath} - file not found")
        continue
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Apply all replacements
    for old, new in replacements.items():
        content = content.replace(old, new)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"Fixed: {os.path.basename(filepath)}")

print("\n✅ All files fixed! Restart the backend server now.")

export type MaintenanceStatus = 'new' | 'in_progress' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';
// Equipment status is derived in the UI or simplified. SQL only has is_scrapped.
// We can keep a UI helper type or remove it. Let's rely on isScrapped boolean in data.

export interface User {
  id: string; // mapped from SERIAL (kept as string for frontend routing)
  name: string;
  email: string;
  avatarUrl?: string; // mapped from avatar_url
  role: 'technician' | 'manager' | 'admin' | 'employee';
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description: string;
  members: User[];
  // category removed as it's not in SQL MaintenanceTeam
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  defaultTechnician?: User; // mapped from default_technician_id
  maintenanceTeam?: MaintenanceTeam;
  location: string;
  warrantyExpiry: string;
  purchaseDate: string;
  isScrapped: boolean; // mapped from is_scrapped
  category: string;
  openRequestsCount: number; // Derived/View-only
}

export interface WorkCenter {
  id: string;
  name: string;
  department: string;
  location: string;
  capacity: number;
  status: 'active' | 'inactive' | 'maintenance';
  maintenanceTeam: MaintenanceTeam;
  openRequestsCount?: number; // Derived
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  type: RequestType; // mapped from request_type
  equipment?: Equipment;
  workCenter?: WorkCenter;
  status: MaintenanceStatus;
  assignedTechnician?: User;
  maintenanceTeam: MaintenanceTeam; // SQL implies NOT NULL for maintenance_team_id
  scheduledDate?: string;
  duration?: string; // e.g. "02:00" or number hours
  description: string;
  createdAt: string;
  createdBy?: User; // Added to match diagram
  priority?: 'low' | 'medium' | 'high';
}

export interface DashboardStats {
  totalEquipment: number;
  activeRequests: number;
  completedThisMonth: number;
  overdueRequests: number;
  equipmentByDepartment: { department: string; count: number }[];
  requestsByStatus: { status: string; count: number }[];
  requestsByTeam: { team: string; count: number }[];
}

// ✅ ADD THESE NEW TYPES FOR LANDING PAGE
export interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
  bgColor: string;
  iconColor: string;
}

export interface WorkflowStep {
  step: string;
  title: string;
  desc: string;
}

export type MaintenanceStatus = 'new' | 'in-progress' | 'repaired' | 'scrap';
export type RequestType = 'corrective' | 'preventive';
export type EquipmentStatus = 'operational' | 'under-maintenance' | 'scrapped';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'technician' | 'manager' | 'admin';
}

export interface MaintenanceTeam {
  id: string;
  name: string;
  description: string;
  members: User[];
  category: string;
}

export interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  department: string;
  assignedEmployee?: User;
  maintenanceTeam?: MaintenanceTeam;
  location: string;
  warrantyExpiry: string;
  purchaseDate: string;
  status: EquipmentStatus;
  category: string;
  openRequestsCount: number;
}

export interface MaintenanceRequest {
  id: string;
  subject: string;
  type: RequestType;
  equipment: Equipment;
  status: MaintenanceStatus;
  assignedTechnician?: User;
  maintenanceTeam?: MaintenanceTeam;
  scheduledDate?: string;
  duration: number; // in hours
  description: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
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

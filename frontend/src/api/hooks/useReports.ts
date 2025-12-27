import { useQuery } from '@tanstack/react-query';
import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

// ==================== Dashboard Stats ====================
export const useDashboardStats = () => {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.DASHBOARD.STATS);
            return data;
        },
        refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    });
};

// ==================== Calendar Events ====================
export const useCalendarEvents = (startDate?: string, endDate?: string) => {
    return useQuery({
        queryKey: ['calendar', 'events', startDate, endDate],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.CALENDAR.EVENTS, {
                params: { start_date: startDate, end_date: endDate },
            });
            return data;
        },
    });
};

// ==================== Maintenance by Team Report ====================
export const useMaintenanceByTeam = () => {
    return useQuery({
        queryKey: ['reports', 'maintenance-by-team'],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.REPORTS.MAINTENANCE_BY_TEAM);
            return data;
        },
    });
};

// ==================== Equipment Status Report ====================
export const useEquipmentStatus = () => {
    return useQuery({
        queryKey: ['reports', 'equipment-status'],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.REPORTS.EQUIPMENT_STATUS);
            return data;
        },
    });
};

// ==================== Technician Workload Report ====================
export const useTechnicianWorkload = () => {
    return useQuery({
        queryKey: ['reports', 'technician-workload'],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.REPORTS.TECHNICIAN_WORKLOAD);
            return data;
        },
    });
};

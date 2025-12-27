import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

// Types
interface MaintenanceRequest {
    id: number;
    subject: string;
    description?: string;
    requestType: 'corrective' | 'preventive';
    status: 'new' | 'in_progress' | 'repaired' | 'scrap';
    equipmentId: number;
    equipmentName?: string;
    serialNumber?: string;
    maintenanceTeamId: number;
    teamName?: string;
    assignedTechnicianId?: number;
    technicianName?: string;
    scheduledDate?: string;
    startedAt?: string;
    completedAt?: string;
    createdBy?: number;
    createdByName?: string;
    createdAt?: string;
    updatedAt?: string;
    statusHistory?: any[];
    comments?: Comment[];
}

interface Comment {
    id: number;
    comment: string;
    requestId: number;
    commentedBy?: number;
    commenterName?: string;
    avatarUrl?: string;
    createdAt?: string;
}

interface RequestFilters {
    status?: string;
    request_type?: string;
    equipment_id?: number;
    team_id?: number;
}

// ==================== GET Requests List ====================
export const useMaintenanceRequests = (filters?: RequestFilters) => {
    return useQuery({
        queryKey: ['requests', 'list', filters],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.REQUESTS.LIST, {
                params: filters,
            });
            return data;
        },
    });
};

// ==================== GET Single Request ====================
export const useMaintenanceRequest = (id: number) => {
    return useQuery({
        queryKey: ['requests', id],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.REQUESTS.DETAIL(id));
            return data;
        },
        enabled: !!id,
    });
};

// ==================== CREATE Request ====================
export const useCreateRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (requestData: Partial<MaintenanceRequest>) => {
            // Convert camelCase to snake_case for backend
            const params = new URLSearchParams();
            if (requestData.subject) params.append('subject', requestData.subject);
            if (requestData.description) params.append('description', requestData.description);
            if (requestData.requestType) params.append('request_type', requestData.requestType);
            if (requestData.equipmentId) params.append('equipment_id', requestData.equipmentId.toString());
            if (requestData.maintenanceTeamId) params.append('maintenance_team_id', requestData.maintenanceTeamId.toString());
            if (requestData.assignedTechnicianId) params.append('assigned_technician_id', requestData.assignedTechnicianId.toString());
            if (requestData.scheduledDate) params.append('scheduled_date', requestData.scheduledDate);

            const { data } = await apiClient.post(
                `${API_ENDPOINTS.REQUESTS.CREATE}?${params.toString()}`,
                {} // Empty body since we're using query params
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

// ==================== UPDATE Request ====================
export const useUpdateRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...requestData }: Partial<MaintenanceRequest> & { id: number }) => {
            const { data } = await apiClient.put(
                API_ENDPOINTS.REQUESTS.UPDATE(id),
                requestData
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['requests', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['requests', 'list'] });
        },
    });
};

// ==================== UPDATE Request Status ====================
export const useUpdateRequestStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            // Send status as query parameter
            const { data } = await apiClient.patch(
                `${API_ENDPOINTS.REQUESTS.UPDATE_STATUS(id)}?status=${status}`,
                {} // Empty body
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['requests', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['requests', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

// ==================== ADD Comment ====================
export const useAddComment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ requestId, comment }: { requestId: number; comment: string }) => {
            // Send comment as query parameter
            const params = new URLSearchParams();
            params.append('comment', comment);

            const { data } = await apiClient.post(
                `${API_ENDPOINTS.REQUESTS.ADD_COMMENT(requestId)}?${params.toString()}`,
                {} // Empty body
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['requests', variables.requestId] });
        },
    });
};

// ==================== DELETE Request ====================
export const useDeleteRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await apiClient.delete(API_ENDPOINTS.REQUESTS.DELETE(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['requests', 'list'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
};

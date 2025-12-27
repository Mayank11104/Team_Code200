import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

// Types
interface Equipment {
    id: number;
    name: string;
    serialNumber: string;
    category?: string;
    purchaseDate?: string;
    warrantyExpiry?: string;
    location?: string;
    department?: string;
    isScrapped: boolean;
    maintenanceTeamId?: number;
    teamName?: string;
    defaultTechnicianId?: number;
    technicianName?: string;
    createdAt?: string;
    updatedAt?: string;
}

interface EquipmentFilters {
    category?: string;
    department?: string;
    is_scrapped?: boolean;
}

// ==================== GET Equipment List ====================
export const useEquipmentList = (filters?: EquipmentFilters) => {
    return useQuery({
        queryKey: ['equipment', 'list', filters],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.EQUIPMENT.LIST, {
                params: filters,
            });
            return data;
        },
    });
};

// ==================== GET Single Equipment ====================
export const useEquipment = (id: number) => {
    return useQuery({
        queryKey: ['equipment', id],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.EQUIPMENT.DETAIL(id));
            return data;
        },
        enabled: !!id,
    });
};

// ==================== CREATE Equipment ====================
export const useCreateEquipment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (equipmentData: Partial<Equipment>) => {
            const { data } = await apiClient.post(API_ENDPOINTS.EQUIPMENT.CREATE, equipmentData);
            return data;
        },
        onSuccess: () => {
            // Invalidate and refetch equipment list
            queryClient.invalidateQueries({ queryKey: ['equipment', 'list'] });
        },
    });
};

// ==================== UPDATE Equipment ====================
export const useUpdateEquipment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...equipmentData }: Partial<Equipment> & { id: number }) => {
            const { data } = await apiClient.put(
                API_ENDPOINTS.EQUIPMENT.UPDATE(id),
                equipmentData
            );
            return data;
        },
        onSuccess: (_, variables) => {
            // Invalidate specific equipment and list
            queryClient.invalidateQueries({ queryKey: ['equipment', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['equipment', 'list'] });
        },
    });
};

// ==================== DELETE Equipment ====================
export const useDeleteEquipment = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await apiClient.delete(API_ENDPOINTS.EQUIPMENT.DELETE(id));
            return data;
        },
        onSuccess: () => {
            // Invalidate equipment list
            queryClient.invalidateQueries({ queryKey: ['equipment', 'list'] });
        },
    });
};

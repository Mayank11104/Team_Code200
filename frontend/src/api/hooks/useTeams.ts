import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../client';
import { API_ENDPOINTS } from '../endpoints';

// Types
interface Team {
    id: number;
    name: string;
    description?: string;
    memberCount?: number;
    equipmentCount?: number;
    createdAt?: string;
    updatedAt?: string;
    members?: TeamMember[];
    equipment?: any[];
}

interface TeamMember {
    id: number;
    name: string;
    email: string;
    role: string;
    avatarUrl?: string;
    joinedAt?: string;
}

// ==================== GET Teams List ====================
export const useTeamsList = () => {
    return useQuery({
        queryKey: ['teams', 'list'],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.TEAMS.LIST);
            return data;
        },
    });
};

// ==================== GET Single Team ====================
export const useTeam = (id: number) => {
    return useQuery({
        queryKey: ['teams', id],
        queryFn: async () => {
            const { data } = await apiClient.get(API_ENDPOINTS.TEAMS.DETAIL(id));
            return data;
        },
        enabled: !!id,
    });
};

// ==================== CREATE Team ====================
export const useCreateTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (teamData: { name: string; description?: string }) => {
            const { data } = await apiClient.post(API_ENDPOINTS.TEAMS.CREATE, teamData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', 'list'] });
        },
    });
};

// ==================== UPDATE Team ====================
export const useUpdateTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, ...teamData }: { id: number; name?: string; description?: string }) => {
            const { data } = await apiClient.put(API_ENDPOINTS.TEAMS.UPDATE(id), teamData);
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['teams', variables.id] });
            queryClient.invalidateQueries({ queryKey: ['teams', 'list'] });
        },
    });
};

// ==================== DELETE Team ====================
export const useDeleteTeam = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: number) => {
            const { data } = await apiClient.delete(API_ENDPOINTS.TEAMS.DELETE(id));
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['teams', 'list'] });
        },
    });
};

// ==================== ADD Team Member ====================
export const useAddTeamMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ teamId, userId }: { teamId: number; userId: number }) => {
            const { data } = await apiClient.post(
                API_ENDPOINTS.TEAMS.ADD_MEMBER(teamId),
                { user_id: userId }
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId] });
            queryClient.invalidateQueries({ queryKey: ['teams', 'list'] });
        },
    });
};

// ==================== REMOVE Team Member ====================
export const useRemoveTeamMember = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ teamId, userId }: { teamId: number; userId: number }) => {
            const { data } = await apiClient.delete(
                API_ENDPOINTS.TEAMS.REMOVE_MEMBER(teamId, userId)
            );
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['teams', variables.teamId] });
            queryClient.invalidateQueries({ queryKey: ['teams', 'list'] });
        },
    });
};

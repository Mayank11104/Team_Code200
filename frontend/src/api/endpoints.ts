// API endpoint constants
export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        SIGNUP: '/auth/signup',
    },

    // Equipment
    EQUIPMENT: {
        LIST: '/api/equipment',
        DETAIL: (id: number) => `/api/equipment/${id}`,
        CREATE: '/api/equipment',
        UPDATE: (id: number) => `/api/equipment/${id}`,
        DELETE: (id: number) => `/api/equipment/${id}`,
    },

    // Teams
    TEAMS: {
        LIST: '/api/teams',
        DETAIL: (id: number) => `/api/teams/${id}`,
        CREATE: '/api/teams',
        UPDATE: (id: number) => `/api/teams/${id}`,
        DELETE: (id: number) => `/api/teams/${id}`,
        ADD_MEMBER: (id: number) => `/api/teams/${id}/members`,
        REMOVE_MEMBER: (teamId: number, userId: number) => `/api/teams/${teamId}/members/${userId}`,
    },

    // Maintenance Requests
    REQUESTS: {
        LIST: '/api/requests',
        DETAIL: (id: number) => `/api/requests/${id}`,
        CREATE: '/api/requests',
        UPDATE: (id: number) => `/api/requests/${id}`,
        DELETE: (id: number) => `/api/requests/${id}`,
        UPDATE_STATUS: (id: number) => `/api/requests/${id}/status`,
        ADD_COMMENT: (id: number) => `/api/requests/${id}/comments`,
    },

    // Dashboard & Reports
    DASHBOARD: {
        STATS: '/api/dashboard/stats',
    },

    CALENDAR: {
        EVENTS: '/api/calendar/events',
    },

    REPORTS: {
        MAINTENANCE_BY_TEAM: '/api/reports/maintenance-by-team',
        EQUIPMENT_STATUS: '/api/reports/equipment-status',
        TECHNICIAN_WORKLOAD: '/api/reports/technician-workload',
    },
} as const;

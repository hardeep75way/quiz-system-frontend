import { apiClient } from './client';
import type { LoginRequest, RegisterRequest, LoginResponse, UserResponse } from '@/types/auth';

export const authApi = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<UserResponse> => {
        const response = await apiClient.post<UserResponse>('/auth/register', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout');
    },

    getCurrentUser: async (): Promise<UserResponse> => {
        const response = await apiClient.get<UserResponse>('/auth/me');
        return response.data;
    },

    refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/refresh', {
            refresh_token: refreshToken,
        });
        return response.data;
    },
};

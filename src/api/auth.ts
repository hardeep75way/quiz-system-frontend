import { apiClient } from './client';
import type { LoginResponse, UserResponse } from '@/types/auth';

export const authApi = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/login', { email, password });
        return response.data;
    },

    register: async (email: string, username: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/auth/register', { email, username, password });
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

    forgotPassword: async (email: string): Promise<{ message: string; reset_token?: string }> => {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (token: string, password: string): Promise<{ message: string }> => {
        const response = await apiClient.post('/auth/reset-password', { token, password });
        return response.data;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
        const response = await apiClient.post('/auth/change-password', {
            current_password: currentPassword,
            new_password: newPassword,
        });
        return response.data;
    },
};

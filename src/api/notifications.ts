import { apiClient } from './client';
import type { Notification, NotificationListResponse, UnreadCountResponse } from '@/types/notification';

export const notificationsApi = {
    getAll: async (page: number = 1, size: number = 20, unreadOnly: boolean = false) => {
        const response = await apiClient.get<NotificationListResponse>('/notifications', {
            params: { page, size, unread_only: unreadOnly }
        });
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
        return response.data;
    },

    markAsRead: async (id: string) => {
        const response = await apiClient.patch<Notification>(`/notifications/${id}/read`);
        return response.data;
    },

    markAllAsRead: async () => {
        const response = await apiClient.post<void>('/notifications/mark-all-read');
        return response.data;
    },

    delete: async (id: string) => {
        await apiClient.delete(`/notifications/${id}`);
    }
};

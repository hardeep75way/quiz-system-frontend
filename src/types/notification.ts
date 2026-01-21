export type NotificationType =
    | 'quiz_published'
    | 'quiz_assigned'
    | 'result_available'
    | 'deadline_approaching';

export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    quiz_id?: string;
    attempt_id?: string;
    result_id?: string;
    is_read: boolean;
    read_at?: string;
    created_at: string;
}

export interface NotificationListResponse {
    items: Notification[];
    total: number;
    page: number;
    size: number;
    pages: number;
    unread_count: number;
}

export interface UnreadCountResponse {
    count: number;
}

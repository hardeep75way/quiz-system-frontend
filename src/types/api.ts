export interface ApiErrorDetail {
    code: string;
    message: string;
    details?: Record<string, unknown>;
}

export interface ApiErrorResponse {
    error: ApiErrorDetail;
}

export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    per_page: number;
    pages: number;
}

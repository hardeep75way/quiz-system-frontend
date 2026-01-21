import { apiClient } from './client';
import type { Quiz, QuizCreate, QuizUpdate, QuizAssignment } from '@/types/quiz';

export const quizzesApi = {
    getAll: async (): Promise<Quiz[]> => {
        const response = await apiClient.get<Quiz[]>('/quizzes');
        return response.data;
    },

    getMyQuizzes: async (): Promise<Quiz[]> => {
        const response = await apiClient.get<Quiz[]>('/quizzes/my-quizzes');
        return response.data;
    },

    getById: async (id: string): Promise<Quiz> => {
        const response = await apiClient.get<Quiz>(`/quizzes/${id}`);
        return response.data;
    },

    create: async (data: QuizCreate): Promise<Quiz> => {
        const response = await apiClient.post<Quiz>('/quizzes', data);
        return response.data;
    },

    update: async (id: string, data: QuizUpdate): Promise<Quiz> => {
        const response = await apiClient.put<Quiz>(`/quizzes/${id}`, data);
        return response.data;
    },

    publish: async (id: string): Promise<Quiz> => {
        const response = await apiClient.post<Quiz>(`/quizzes/${id}/publish`);
        return response.data;
    },

    assign: async (id: string, data: QuizAssignment): Promise<void> => {
        await apiClient.post(`/quizzes/${id}/assign`, data);
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/quizzes/${id}`);
    },
};

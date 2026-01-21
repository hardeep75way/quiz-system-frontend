import { apiClient } from './client';
import type { Attempt, AnswerSubmit, Answer } from '@/types/attempt';

export const attemptsApi = {
    start: async (quizId: string): Promise<Attempt> => {
        const response = await apiClient.post<Attempt>(`/attempts/start/${quizId}`);
        return response.data;
    },

    getActive: async (): Promise<Attempt | null> => {
        try {
            const response = await apiClient.get<Attempt>('/attempts/active');
            return response.data;
        } catch (error) {
            return null;
        }
    },

    submitAnswer: async (attemptId: string, data: AnswerSubmit): Promise<Answer> => {
        const response = await apiClient.post<Answer>(`/attempts/${attemptId}/answer`, data);
        return response.data;
    },

    submitAttempt: async (attemptId: string): Promise<{ result_id: string; score: number; percentage: number; passed: boolean }> => {
        const response = await apiClient.post(`/attempts/${attemptId}/submit`);
        return response.data;
    },

    getAttempt: async (attemptId: string): Promise<Attempt> => {
        const response = await apiClient.get<Attempt>(`/attempts/${attemptId}`);
        return response.data;
    },
};

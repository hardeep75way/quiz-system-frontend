import { apiClient } from './client';
import type { Result, ResultWithQuiz } from '@/types/result';

export const resultsApi = {
    getById: async (id: string): Promise<Result> => {
        const response = await apiClient.get<Result>(`/results/${id}`);
        return response.data;
    },

    getMyResults: async (): Promise<ResultWithQuiz[]> => {
        const response = await apiClient.get<ResultWithQuiz[]>('/results/my-results');
        return response.data;
    },

    getQuizResults: async (quizId: string): Promise<Result[]> => {
        const response = await apiClient.get<Result[]>(`/results/quiz/${quizId}`);
        return response.data;
    },
};

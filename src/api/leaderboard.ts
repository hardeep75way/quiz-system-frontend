import { apiClient } from './client';
import type { LeaderboardEntry } from '@/types/result';

export const leaderboardApi = {
    getLeaderboard: async (quizId?: string): Promise<LeaderboardEntry[]> => {
        const url = quizId ? `/leaderboard/${quizId}` : '/leaderboard';
        const response = await apiClient.get<LeaderboardEntry[]>(url);
        return response.data;
    },
};

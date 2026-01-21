export interface Result {
    id: string;
    attempt_id: string;
    user_id: string;
    quiz_id: string;
    score: number;
    total_points: number;
    percentage: number;
    passed: boolean;
    rank: number | null;
    created_at: string;
}

export interface ResultWithQuiz extends Result {
    quiz_title: string;
    quiz: {
        title: string;
        passing_score: number;
    };
}

export interface LeaderboardEntry {
    rank: number;
    user_id: string;
    username: string;
    score: number;
    total_points: number;
    percentage: number;
    completed_at: string;
}

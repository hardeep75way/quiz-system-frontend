export type AttemptStatus = 'in_progress' | 'submitted' | 'expired';

export interface Attempt {
    id: string;
    quiz_id: string;
    user_id: string;
    started_at: string;
    expires_at: string;
    submitted_at: string | null;
    is_submitted: boolean;
    time_taken_seconds: number | null;
    status: AttemptStatus;
}

export interface Answer {
    id: string;
    attempt_id: string;
    question_id: string;
    selected_answer: string;
    created_at: string;
    updated_at: string;
}

export interface AnswerSubmit {
    question_id: string;
    selected_answer: string;
}

export interface AttemptWithAnswers extends Attempt {
    answers: Answer[];
}

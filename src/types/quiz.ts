export type QuestionType = 'mcq' | 'true_false';

export interface Question {
    id: string;
    quiz_id: string;
    question_text: string;
    question_type: QuestionType;
    options: string[];
    points: number;
    order: number;
}

export interface QuestionCreate {
    question_text: string;
    question_type: QuestionType;
    options: string[];
    correct_answer: string;
    points: number;
    order: number;
}

export interface Quiz {
    id: string;
    title: string;
    description: string;
    duration_minutes: number;
    passing_score: number;
    is_public: boolean;
    is_published: boolean;
    randomize_questions: boolean;
    randomize_options: boolean;
    max_attempts: number | null;
    created_by: string;
    created_at: string;
    updated_at: string;
    questions?: Question[];
}

export interface QuizCreate {
    title: string;
    description: string;
    duration_minutes: number;
    passing_score: number;
    is_public: boolean;
    randomize_questions: boolean;
    randomize_options: boolean;
    max_attempts: number | null;
    questions: QuestionCreate[];
}

export interface QuizUpdate {
    title?: string;
    description?: string;
    duration_minutes?: number;
    passing_score?: number;
    randomize_questions?: boolean;
    randomize_options?: boolean;
    max_attempts?: number | null;
}

export interface QuizAssignment {
    user_ids: string[];
    due_date?: string | null;
}

export interface QuizListItem {
    id: string;
    title: string;
    description: string;
    duration_minutes: number;
    is_published: boolean;
    question_count: number;
    created_at: string;
}

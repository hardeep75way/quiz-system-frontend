import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup.string().email('Invalid Email Address').required('Email is required'),
    password: yup.string().required('Passowrd is required'),
});

export const registerSchema = yup.object({
    email: yup.string().email('Invalid email address').required('Email is required'),
    username: yup
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must be at most 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .required('Username is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('Password is required'),
});
export const questionSchema = yup.object({
    question_text: yup.string().min(5, 'Question must be at least 5 characters').required(),
    question_type: yup.mixed<'mcq' | 'true_false'>().oneOf(['mcq', 'true_false']).required(),
    options: yup.array().of(yup.string().required()).min(2, 'At least 2 options required').required(),
    correct_answer: yup.string().required('Correct answer is required'),
    points: yup.number().min(1, 'Points must be at least 1').required(),
    order: yup.number().optional(), // Optional for CreateQuiz
});
export const quizSchema = yup.object({
    title: yup.string().min(3).max(255).required('Title is required'),
    description: yup.string().min(10).required('Description is required'),
    duration_minutes: yup.number().min(1).max(300).required(),
    passing_score: yup.number().min(0).max(100).required(),
    is_public: yup.boolean().required(),
    randomize_questions: yup.boolean().required(),
    randomize_options: yup.boolean().required(),
    max_attempts: yup.number().nullable().transform((v) => (isNaN(v) ? null : v)),
    questions: yup.array().of(questionSchema).min(1, 'At least one question required'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;
export type RegisterFormData = yup.InferType<typeof registerSchema>;
export type QuestionFormData = yup.InferType<typeof questionSchema>;
export type QuizFormData = yup.InferType<typeof quizSchema>;
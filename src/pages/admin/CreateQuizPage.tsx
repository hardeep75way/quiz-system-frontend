import { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import Layout from '@/components/layout/Layout';
import { quizzesApi } from '@/api/quizzes';
import { quizSchema, type QuizFormData } from '@/lib/validators';
import { Add as Plus, Delete as Trash2, Save, ArrowBack as ArrowLeft } from '@mui/icons-material';
import type { QuizCreate, QuestionCreate } from '@/types/quiz';

export default function CreateQuiz() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<QuizFormData>({
        resolver: yupResolver(quizSchema) as unknown as import('react-hook-form').Resolver<QuizFormData>,
        defaultValues: {
            title: '',
            description: '',
            duration_minutes: 30,
            passing_score: 70,
            is_public: false,
            randomize_questions: false,
            randomize_options: false,
            max_attempts: 1,
            questions: [
                {
                    question_text: '',
                    question_type: 'mcq',
                    options: ['', '', '', ''],
                    correct_answer: '',
                    points: 1,
                    order: 1,
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'questions',
    });

    const createQuizMutation = useMutation({
        mutationFn: quizzesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['quizzes-list'] });
            navigate('/admin/dashboard');
        },
        onError: (err: AxiosError<{ detail: string }>) => {
            setError(err.response?.data?.detail || 'Failed to create quiz');
        },
    });

    const onSubmit: SubmitHandler<QuizFormData> = (data) => {
        // Transform form data to API-compatible format
        const quizCreateData: QuizCreate = {
            title: data.title,
            description: data.description,
            duration_minutes: data.duration_minutes,
            passing_score: data.passing_score,
            is_public: data.is_public,
            randomize_questions: data.randomize_questions,
            randomize_options: data.randomize_options,
            max_attempts: data.max_attempts ?? null,
            questions: (data.questions || []).map((q, index): QuestionCreate => ({
                question_text: q.question_text,
                question_type: q.question_type,
                options: (q.options || []).filter((o) => o.trim() !== ''),
                correct_answer: q.correct_answer,
                points: q.points,
                order: q.order ?? index + 1,
            })),
        };
        createQuizMutation.mutate(quizCreateData);
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto pb-12">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="mr-4 p-2 rounded-full hover:bg-gray-100"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Quiz</h1>
                </div>

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Basic Info Section */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900 border-b pb-2">Quiz Details</h2>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Title</label>
                                <input
                                    type="text"
                                    {...register('title')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="e.g. Introduction to Python"
                                />
                                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    rows={3}
                                    {...register('description')}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    placeholder="Describe what this quiz covers..."
                                />
                                {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                                    <input
                                        type="number"
                                        {...register('duration_minutes', { valueAsNumber: true })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                    {errors.duration_minutes && <p className="mt-1 text-sm text-red-600">{errors.duration_minutes.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Passing Score (%)</label>
                                    <input
                                        type="number"
                                        {...register('passing_score', { valueAsNumber: true })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                    {errors.passing_score && <p className="mt-1 text-sm text-red-600">{errors.passing_score.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Max Attempts</label>
                                    <input
                                        type="number"
                                        {...register('max_attempts', { valueAsNumber: true })}
                                        placeholder="Empty for unlimited"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                    />
                                </div>
                            </div>

                            <div className="flex space-x-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        {...register('is_public')}
                                        id="is_public"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
                                        Public Quiz
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        {...register('randomize_questions')}
                                        id="randomize_questions"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="randomize_questions" className="ml-2 block text-sm text-gray-900">
                                        Randomize Questions
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Builder Section */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 flex justify-between items-center">
                            Questions
                            <button
                                type="button"
                                onClick={() => append({
                                    question_text: '',
                                    question_type: 'mcq',
                                    options: ['', '', '', ''],
                                    correct_answer: '',
                                    points: 1,
                                    order: fields.length + 1
                                })}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Question
                            </button>
                        </h2>

                        {fields.map((field, index) => (
                            <div key={field.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative">
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-1 gap-4">
                                    <h3 className="text-sm font-medium text-gray-500">Question {index + 1}</h3>

                                    <div>
                                        <input
                                            type="text"
                                            {...register(`questions.${index}.question_text`)}
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                            placeholder="Enter your question text here..."
                                        />
                                        {errors.questions?.[index]?.question_text && (
                                            <p className="mt-1 text-sm text-red-600">{errors.questions[index]?.question_text?.message}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase">Type</label>
                                            <select
                                                {...register(`questions.${index}.question_type`)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                            >
                                                <option value="mcq">Multiple Choice</option>
                                                <option value="true_false">True / False</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-500 uppercase">Points</label>
                                            <input
                                                type="number"
                                                {...register(`questions.${index}.points`, { valueAsNumber: true })}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Options</label>
                                        <div className="space-y-2">
                                            {[0, 1, 2, 3].map((optIndex) => (
                                                <input
                                                    key={optIndex}
                                                    type="text"
                                                    {...register(`questions.${index}.options.${optIndex}`)}
                                                    placeholder={`Option ${optIndex + 1}`}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border"
                                                />
                                            ))}
                                        </div>
                                        {errors.questions?.[index]?.options && (
                                            <p className="mt-1 text-sm text-red-600">Minimum 2 options required</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 uppercase mb-2">Correct Answer</label>
                                        <input
                                            type="text"
                                            {...register(`questions.${index}.correct_answer`)}
                                            placeholder="Paste the exact text of the correct option"
                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 border bg-green-50"
                                        />
                                        {errors.questions?.[index]?.correct_answer && (
                                            <p className="mt-1 text-sm text-red-600">Correct answer is required</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-end pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/dashboard')}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={createQuizMutation.isPending}
                            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {createQuizMutation.isPending ? 'Creating...' : 'Create Quiz'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
}

import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { quizzesApi } from '@/api/quizzes';
import { attemptsApi } from '@/api/attempts';
import { AccessTime as Clock, Quiz as FileQuestion, GpsFixed as Target, PlayArrow as Play } from '@mui/icons-material';

export default function QuizDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const { data: quiz, isLoading } = useQuery({
        queryKey: ['quiz', id],
        queryFn: () => quizzesApi.getById(id!),
        enabled: !!id,
    });

    const handleStartQuiz = async () => {
        if (!id) return;

        try {
            await attemptsApi.start(id);
            navigate(`/quiz/${id}/take`);
        } catch (error) {
            alert('Failed to start quiz. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quiz...</p>
                </div>
            </Layout>
        );
    }

    if (!quiz) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <p className="text-red-600">Quiz not found</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{quiz.title}</h1>
                    <p className="text-lg text-gray-600 mb-8">{quiz.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <FileQuestion className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Questions</p>
                                <p className="text-xl font-semibold">{quiz.questions?.length || 0}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Duration</p>
                                <p className="text-xl font-semibold">{quiz.duration_minutes} min</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Passing Score</p>
                                <p className="text-xl font-semibold">{quiz.passing_score}%</p>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructions</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 mb-6">
                            <li>You have {quiz.duration_minutes} minutes to complete this quiz</li>
                            <li>Answer all questions to the best of your ability</li>
                            <li>You can navigate between questions</li>
                            <li>Quiz will auto-submit when time expires</li>
                            <li>You need {quiz.passing_score}% to pass</li>
                        </ul>

                        <button
                            onClick={handleStartQuiz}
                            className="flex items-center space-x-2 px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-lg shadow-md"
                        >
                            <Play className="w-5 h-5" />
                            <span>Start Quiz</span>
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

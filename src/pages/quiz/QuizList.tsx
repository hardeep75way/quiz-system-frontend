import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { quizzesApi } from '@/api/quizzes';
import { AccessTime as Clock, Quiz as FileQuestion, GpsFixed as Target } from '@mui/icons-material';

export default function QuizList() {
    const { data: quizzes, isLoading } = useQuery({
        queryKey: ['my-quizzes'],
        queryFn: quizzesApi.getMyQuizzes,
    });

    if (isLoading) {
        return (
            <Layout>
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading quizzes...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">My Quizzes</h2>
                    <p className="text-gray-600 mt-2">Quizzes assigned to you</p>
                </div>

                {!quizzes || quizzes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No quizzes assigned</h3>
                        <p className="text-gray-600">Check back later for new quizzes</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz) => (
                            <Link
                                key={quiz.id}
                                to={`/quiz/${quiz.id}`}
                                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{quiz.description}</p>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <FileQuestion className="w-4 h-4 mr-2" />
                                        <span>{quiz.questions?.length || 0} questions</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>{quiz.duration_minutes} minutes</span>
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Target className="w-4 h-4 mr-2" />
                                        <span>Pass: {quiz.passing_score}%</span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {quiz.is_published ? 'Available' : 'Draft'}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}

import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';

import { resultsApi } from '@/api/results';
import { Cancel as XCircle, ArrowBack as ArrowLeft, EmojiEvents as Trophy } from '@mui/icons-material';

export default function QuizResult() {
    const { id } = useParams<{ id: string }>();

    const { data: result, isLoading } = useQuery({
        queryKey: ['result', id],
        queryFn: () => resultsApi.getById(id!),
        enabled: !!id,
    });

    if (isLoading) {
        return (

            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>

        );
    }

    if (!result) {
        return (

            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">Result not found</h2>
                <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
                    Return to Dashboard
                </Link>
            </div>

        );
    }

    return (

        <div className="max-w-3xl mx-auto space-y-8">
            {/* Score Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className={`p-8 text-center ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                    <div className="flex justify-center mb-4">
                        {result.passed ? (
                            <div className="bg-green-100 p-4 rounded-full">
                                <Trophy className="w-12 h-12 text-green-600" />
                            </div>
                        ) : (
                            <div className="bg-red-100 p-4 rounded-full">
                                <XCircle className="w-12 h-12 text-red-600" />
                            </div>
                        )}
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {result.passed ? 'Congratulations! You Passed!' : 'Better Luck Next Time'}
                    </h1>
                    <p className="text-gray-600 mb-6">
                        You scored {result.score} out of {result.total_points} points
                    </p>

                    <div className="flex justify-center items-end space-x-2">
                        <span className={`text-6xl font-bold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {result.percentage}%
                        </span>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-gray-100 flex justify-between text-center">
                    <div className="flex-1 border-r border-gray-100">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Status</p>
                        <p className={`text-lg font-semibold ${result.passed ? 'text-green-600' : 'text-red-600'}`}>
                            {result.passed ? 'PASSED' : 'FAILED'}
                        </p>
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-gray-500 uppercase tracking-wide">Rank</p>
                        <p className="text-lg font-semibold text-indigo-600">
                            {result.rank ? `#${result.rank}` : '-'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex justify-center space-x-4">
                <Link
                    to="/quizzes"
                    className="flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Quizzes
                </Link>
                <Link
                    to="/leaderboard"
                    className="flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm"
                >
                    View Leaderboard
                </Link>
            </div>
        </div>

    );
}

import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { resultsApi } from '@/api/results';
import { formatDate } from '@/lib/utils';
import { CheckCircle, Cancel as XCircle, Description as FileText, ArrowForward as ArrowRight } from '@mui/icons-material';

export default function MyResults() {
    const { data: results, isLoading } = useQuery({
        queryKey: ['my-results'],
        queryFn: resultsApi.getMyResults,
    });

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">My Results</h2>
                    <p className="text-gray-600 mt-2">History of your quiz attempts</p>
                </div>

                {!results || results.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results yet</h3>
                        <p className="text-gray-600 mb-6">You haven't completed any quizzes yet.</p>
                        <Link
                            to="/quizzes"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Take a Quiz
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md border border-gray-200">
                        <ul className="divide-y divide-gray-200">
                            {results.map((result) => (
                                <li key={result.id}>
                                    <Link to={`/result/${result.id}`} className="block hover:bg-gray-50 transition-colors">
                                        <div className="px-4 py-4 sm:px-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className={`p-2 rounded-full mr-4 ${result.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                                                        {result.passed ? (
                                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <XCircle className="w-5 h-5 text-red-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-indigo-600 truncate">{result.quiz_title}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {formatDate(result.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <div className="text-right mr-6">
                                                        <p className="text-sm font-bold text-gray-900">{result.percentage}%</p>
                                                        <p className="text-xs text-gray-500">
                                                            {result.score} / {result.total_points} pts
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </Layout>
    );
}

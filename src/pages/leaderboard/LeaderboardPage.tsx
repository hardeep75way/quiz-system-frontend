import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import { leaderboardApi } from '@/api/leaderboard';
import { quizzesApi } from '@/api/quizzes';
import { EmojiEvents as Trophy, MilitaryTech as Medal } from '@mui/icons-material';

export default function Leaderboard() {
    const [selectedQuizId, setSelectedQuizId] = useState<string>('');

    const { data: quizzes } = useQuery({
        queryKey: ['quizzes-list'],
        queryFn: quizzesApi.getAll,
    });

    const { data: leaderboard, isLoading } = useQuery({
        queryKey: ['leaderboard', selectedQuizId],
        queryFn: () => leaderboardApi.getLeaderboard(selectedQuizId || undefined),
    });

    return (
        // WIP

        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Leaderboard</h2>
                    <p className="text-gray-600 mt-2">Top performers across quizzes</p>
                </div>

                <div className="w-full sm:w-64">
                    <select
                        value={selectedQuizId}
                        onChange={(e) => setSelectedQuizId(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option value="">All Quizzes</option>
                        {quizzes?.map((quiz) => (
                            <option key={quiz.id} value={quiz.id}>
                                {quiz.title}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
            ) : !leaderboard || leaderboard.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No data available</h3>
                    <p className="text-gray-600">Be the first to take a quiz and top the leaderboard!</p>
                </div>
            ) : (
                <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rank
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Score
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Percentage
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {leaderboard.map((entry, index) => (
                                <tr key={`${entry.user_id}-${index}`} className={index < 3 ? 'bg-yellow-50/30' : ''}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {index === 0 && <Trophy className="w-5 h-5 text-yellow-500 mr-2" />}
                                            {index === 1 && <Medal className="w-5 h-5 text-gray-400 mr-2" />}
                                            {index === 2 && <Medal className="w-5 h-5 text-amber-600 mr-2" />}
                                            <span className={`font-semibold ${index < 3 ? 'text-gray-900' : 'text-gray-500'}`}>
                                                #{index + 1}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold mr-3">
                                                {entry.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">{entry.username}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{entry.score} pts</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {entry.percentage}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

    );
}

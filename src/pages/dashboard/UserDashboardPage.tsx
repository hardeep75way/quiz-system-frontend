import { useAppSelector } from '@/store/hooks';


export default function UserDashboard() {
    const user = useAppSelector((state) => state.auth.user);

    return (

        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.username}!</h2>
                <p className="text-gray-600 mt-2">Here's an overview of your quiz activity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Assigned Quizzes</h3>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">0</p>
                    <p className="text-sm text-gray-500 mt-1">Quizzes available</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Completed</h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">0</p>
                    <p className="text-sm text-gray-500 mt-1">Quizzes finished</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Average Score</h3>
                    <p className="text-4xl font-bold text-purple-600 mt-2">0%</p>
                    <p className="text-sm text-gray-500 mt-1">Overall performance</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <p className="text-gray-500 text-center py-8">No recent activity</p>
            </div>
        </div>

    );
}

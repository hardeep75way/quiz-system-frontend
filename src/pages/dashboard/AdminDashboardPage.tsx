import { Link } from 'react-router-dom';


export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
                <p className="text-gray-600 mt-2">Manage quizzes and monitor system activity</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Quizzes</h3>
                    <p className="text-4xl font-bold text-indigo-600 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Total Users</h3>
                    <p className="text-4xl font-bold text-blue-600 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Attempts</h3>
                    <p className="text-4xl font-bold text-green-600 mt-2">0</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase">Active Now</h3>
                    <p className="text-4xl font-bold text-purple-600 mt-2">0</p>
                </div>
            </div>

            <div className="flex space-x-4">
                <Link
                    to="/admin/quizzes/create"
                    className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium shadow-sm"
                >
                    Create New Quiz
                </Link>
            </div>
        </div>

    );
}

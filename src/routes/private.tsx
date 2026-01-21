import { redirect, RouteObject } from 'react-router-dom';
import UserDashboard from '@/pages/dashboard/UserDashboard';
import QuizList from '@/pages/quiz/QuizList';
import { store } from '@/store';
import { quizzesApi } from '@/api/quizzes';
// Protected Loader
const protectedLoader = () => {
    if (!store.getState().auth.isAuthenticated) {
        return redirect('/login');
    }
    return null;
};
export const privateRoutes: RouteObject[] = [
    {
        path: '/dashboard',
        element: <UserDashboard />,
        loader: protectedLoader,
    },
    {
        path: '/quizzes',
        element: <QuizList />,
        loader: async () => {
            const authCheck = protectedLoader();
            if (authCheck) return authCheck;
            return await quizzesApi.getAll(); // Load data before render!
        },
    },
    // Add other routes similarly...
];
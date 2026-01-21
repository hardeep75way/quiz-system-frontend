import { redirect, RouteObject } from 'react-router-dom';
import UserDashboard from '@/pages/dashboard/UserDashboardPage';
import AdminDashboard from '@/pages/dashboard/AdminDashboardPage';
import QuizList from '@/pages/quiz/QuizListPage';
import QuizDetail from '@/pages/quiz/QuizDetailPage';
import CreateQuiz from '@/pages/admin/CreateQuizPage';
import TakeQuiz from '@/pages/attempt/TakeQuizPage';
import QuizResult from '@/pages/attempt/QuizResultPage';
import MyResults from '@/pages/results/MyResultsPage';
import Leaderboard from '@/pages/leaderboard/LeaderboardPage';
import ChangePasswordPage from '@/pages/auth/ChangePasswordPage';
import { store } from '@/store';
import { quizzesApi } from '@/api/quizzes';

// Protected Loader
const protectedLoader = () => {
    if (!store.getState().auth.isAuthenticated) {
        return redirect('/login');
    }
    return null;
};

// Admin-only loader
const adminLoader = () => {
    const state = store.getState().auth;
    if (!state.isAuthenticated) {
        return redirect('/login');
    }

    // On refresh, user might not be in Redux yet, check localStorage
    let userRole = state.user?.role;

    if (!userRole) {
        // Try to get user from localStorage as fallback
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                const user = JSON.parse(userStr);
                userRole = user.role;
            } catch (e) {
                // If parsing fails, redirect to login
                return redirect('/login');
            }
        }
    }

    if (userRole !== 'admin') {
        return redirect('/dashboard'); // Redirect non-admins to dashboard
    }
    return null;
};

export const privateRoutes: RouteObject[] = [
    // User Dashboard
    {
        path: '/dashboard',
        element: <UserDashboard />,
        loader: protectedLoader,
    },

    // Quiz Routes
    {
        path: '/quizzes',
        element: <QuizList />,
        loader: async () => {
            const authCheck = protectedLoader();
            if (authCheck) return authCheck;
            return await quizzesApi.getAll();
        },
    },
    {
        path: '/quiz/:id',
        element: <QuizDetail />,
        loader: protectedLoader,
    },
    {
        path: '/quiz/:id/take',
        element: <TakeQuiz />,
        loader: protectedLoader,
    },
    {
        path: '/quiz/:id/assign',
        element: <QuizDetail />, // Assignment UI will be in QuizDetail
        loader: adminLoader,
    },

    // Results Routes
    {
        path: '/result/:id',
        element: <QuizResult />,
        loader: protectedLoader,
    },
    {
        path: '/results',
        element: <MyResults />,
        loader: protectedLoader,
    },

    // Leaderboard
    {
        path: '/leaderboard',
        element: <Leaderboard />,
        loader: protectedLoader,
    },

    // Admin Routes
    {
        path: '/admin/dashboard',
        element: <AdminDashboard />,
        loader: adminLoader,
    },
    {
        path: '/admin/quizzes/create',
        element: <CreateQuiz />,
        loader: adminLoader,
    },

    // Password Management
    {
        path: '/change-password',
        element: <ChangePasswordPage />,
        loader: protectedLoader,
    },
];
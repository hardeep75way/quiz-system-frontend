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
import { quizzesApi } from '@/api/quizzes';
import { isAuthenticated, isAdmin } from '@/lib/auth-guards';
import { UploadPage } from '@/pages/upload/UploadPage';

// Protected Loader - now handles token refresh automatically
const protectedLoader = async () => {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
        return redirect('/login');
    }
    return null;
};

// Admin-only loader - now handles token refresh automatically
const adminLoader = async () => {
    const admin = await isAdmin();
    if (!admin) {
        // Check if they're at least authenticated (but not admin)
        const authenticated = await isAuthenticated();
        if (!authenticated) {
            return redirect('/login');
        }
        // Authenticated but not admin
        return redirect('/dashboard');
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
            const authCheck = await protectedLoader();
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
        path: '/admin/quizzes',
        element: <CreateQuiz />,
        loader: adminLoader,
    },

    // Admin Routes (continued)
    {
        path: '/admin/upload',
        element: <UploadPage />,
        loader: adminLoader,
    },

    // Password Management
    {
        path: '/change-password',
        element: <ChangePasswordPage />,
        loader: protectedLoader,
    },
];
import { redirect, RouteObject } from 'react-router-dom';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import { store } from '@/store'; // Direct store access for loaders
// Helper to redirect if already logged in
const publicLoader = () => {
    if (store.getState().auth.isAuthenticated) {
        return redirect('/dashboard');
    }
    return null;
};
export const publicRoutes: RouteObject[] = [
    {
        path: '/login',
        element: <LoginPage />,
        loader: publicLoader,
    },
    {
        path: '/register',
        element: <RegisterPage />,
        loader: publicLoader,
    },
    {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
        loader: publicLoader,
    },
    {
        path: '/reset-password',
        element: <ResetPasswordPage />,
        loader: publicLoader,
    },
];
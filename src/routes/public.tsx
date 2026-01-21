import { redirect, RouteObject } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import ForgotPassword from '@/pages/auth/ForgotPassword';
import ResetPassword from '@/pages/auth/ResetPassword';
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
        element: <Login />,
        loader: publicLoader,
    },
    {
        path: '/register',
        element: <Register />,
        loader: publicLoader,
    },
    {
        path: '/forgot-password',
        element: <ForgotPassword />,
        loader: publicLoader,
    },
    {
        path: '/reset-password',
        element: <ResetPassword />,
        loader: publicLoader,
    },
];
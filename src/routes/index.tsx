import { createBrowserRouter, Navigate } from 'react-router-dom';
import { publicRoutes } from './public';
import { privateRoutes } from './private';
import Layout from '@/components/layout/Layout';

const appRoutes = [
    // ✅ ROOT REDIRECT
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },

    // ✅ PUBLIC ROUTES
    {
        path: '/',
        children: publicRoutes,
    },

    // ✅ PRIVATE ROUTES (WITH LAYOUT)
    {
        path: '/',
        element: <Layout />,
        children: privateRoutes,
    },
];

export const router = createBrowserRouter(appRoutes);

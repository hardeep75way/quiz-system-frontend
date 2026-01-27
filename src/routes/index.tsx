import { createBrowserRouter, Navigate } from 'react-router-dom';
import { publicRoutes } from './public';
import { privateRoutes } from './private';
import Layout from '@/components/layout/Layout';
import { RouteErrorBoundary } from '@/components/errorBoundary/RouteErrorBoundary';

const appRoutes = [
    {
        path: '/',
        element: <Navigate to="/login" replace />,
    },

    ...publicRoutes,

    {
        element: <Layout />,
        errorElement: <RouteErrorBoundary />,
        children: privateRoutes,
    },
];

export const router = createBrowserRouter(appRoutes);

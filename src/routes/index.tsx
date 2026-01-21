import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './public';
import { privateRoutes } from './private';
import Layout from '@/components/layout/Layout'; // You'll need to refactor Layout for Outlet
// Wrap private routes in a Layout if needed
const appRoutes = [
    {
        path: '/',
        children: publicRoutes,
    },
    {
        path: '/',
        element: <Layout />, // Ensure Layout uses <Outlet />
        children: privateRoutes,
    },
];
export const router = createBrowserRouter(appRoutes);
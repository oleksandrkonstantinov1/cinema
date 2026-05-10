import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';

import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import SessionsPage from '@/pages/SessionsPage';
import SessionDetailPage from '@/pages/SessionDetailPage';
import MyTicketsPage from '@/pages/MyTicketsPage';
import ProfilePage from '@/pages/ProfilePage';
import AdminSessionsPage from '@/pages/admin/AdminSessionsPage';
import AdminFilmsPage from '@/pages/admin/AdminFilmsPage';

export const router = createBrowserRouter([
  // Public
  { path: '/', element: <SessionsPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/sessions/:id', element: <SessionDetailPage /> },

  // Authenticated users
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/my-tickets', element: <MyTicketsPage /> },
      { path: '/profile', element: <ProfilePage /> },
    ],
  },

  // Admin only
  {
    element: <ProtectedRoute requiredRole="ADMIN" />,
    children: [
      { path: '/admin/sessions', element: <AdminSessionsPage /> },
      { path: '/admin/films', element: <AdminFilmsPage /> },
    ],
  },
]);

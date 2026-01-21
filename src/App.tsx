import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import UserDashboard from '@/pages/dashboard/UserDashboard';
import AdminDashboard from '@/pages/dashboard/AdminDashboard';
import QuizList from '@/pages/quiz/QuizList';
import QuizDetail from '@/pages/quiz/QuizDetail';
import TakeQuiz from '@/pages/attempt/TakeQuiz';
import QuizResult from '@/pages/attempt/QuizResult';
import MyResults from '@/pages/results/MyResults';
import Leaderboard from '@/pages/leaderboard/Leaderboard';

import CreateQuiz from '@/pages/admin/CreateQuiz';
import { useAppSelector } from './store/hooks';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User routes */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute><QuizList /></ProtectedRoute>} />
        <Route path="/quiz/:id" element={<ProtectedRoute><QuizDetail /></ProtectedRoute>} />
        <Route path="/quiz/:id/take" element={<ProtectedRoute><TakeQuiz /></ProtectedRoute>} />
        <Route path="/result/:id" element={<ProtectedRoute><QuizResult /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute><MyResults /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/quizzes/create" element={<ProtectedRoute requireAdmin><CreateQuiz /></ProtectedRoute>} />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

// Protected route wrapper
function ProtectedRoute({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const user = useAppSelector((state) => state.auth.user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export default App;

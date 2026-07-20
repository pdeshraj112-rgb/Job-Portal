import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

// Wrap page elements: <ProtectedRoute roles={['employer']}><PostJobPage/></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
}

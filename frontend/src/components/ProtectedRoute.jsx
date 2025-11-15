import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) return null;
  if (!user) return <Navigate to="/" replace />;

  return children;
}

export default ProtectedRoute;
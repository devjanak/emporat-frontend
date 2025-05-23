import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../services/authContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  // Show a loading state while checking authentication
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-emerald-600 font-medium">Loading...</div>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  
  // Render children if authenticated
  return children;
}

export default ProtectedRoute; 
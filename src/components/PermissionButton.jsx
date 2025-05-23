import { useAuth } from '../services/authContext';

/**
 * A component that conditionally renders its children based on user permissions
 * 
 * @param {Object} props
 * @param {string} props.requiredRole - The role required to view this component ('ADMIN' or 'USER')
 * @param {React.ReactNode} props.children - The content to render if authorized
 * @param {React.ReactNode} props.fallback - Optional content to show if not authorized
 * @param {boolean} props.hide - If true, completely hides the component when not authorized instead of showing fallback
 */
function PermissionButton({ requiredRole, children, fallback = null, hide = false }) {
  const { user, isAdmin } = useAuth();
  
  // Check if user has required permissions
  const hasPermission = () => {
    if (!user) return false;
    
    if (requiredRole === 'ADMIN') {
      return isAdmin();
    }
    
    // Regular user role - anyone logged in can see
    if (requiredRole === 'USER') {
      return true;
    }
    
    return false;
  };
  
  if (!hasPermission()) {
    if (hide) return null;
    return fallback;
  }
  
  return children;
}

export default PermissionButton; 
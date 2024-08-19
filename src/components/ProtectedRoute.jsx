// ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from './contexts/AuthContext';
import Loading from './LoadingComponent';

const ProtectedRoute = ({ children, roles = [] }) => {
  const { userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!userData || !userData.token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If no roles are specified, allow access
  if (roles.length === 0) {
    return children;
  }

  const hasAllowedRole = (
    (roles.includes('student') && userData.isStudent) ||
    (roles.includes('counselor') && userData.isCounselor) ||
    (roles.includes('admin') && userData.isAdmin)
  );

  if (!hasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  roles: PropTypes.arrayOf(PropTypes.oneOf(['student', 'counselor', 'admin'])),
};

export default ProtectedRoute;
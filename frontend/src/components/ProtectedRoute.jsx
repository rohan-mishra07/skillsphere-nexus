import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — combined authentication + optional role-based guard.
 *
 * @param {string[]} [allowedRoles]  If provided, only users whose role is in
 *                                   this list may access the route.  Others are
 *                                   redirected to `unauthorizedRedirect`.
 * @param {string}   [unauthorizedRedirect='/dashboard']  Where to send a
 *                   logged-in user who lacks the required role.
 */
export const ProtectedRoute = ({
  children,
  allowedRoles = [],
  unauthorizedRedirect = '/dashboard',
}) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 1. Not logged in → send to /login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Role check (if allowedRoles is specified)
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to={unauthorizedRedirect} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;


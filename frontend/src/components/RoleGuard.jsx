import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';

/**
 * RoleGuard — declarative route-level authorization component.
 *
 * Wraps a route element and redirects or renders a 403 banner when the
 * authenticated user's role is not in the `allowedRoles` list.
 *
 * @param {string[]}  allowedRoles   Roles permitted to view this route.
 *                                   Use the ROLE_ prefix format, e.g. ['ROLE_ADMIN'].
 * @param {string}    [redirectTo]   Path to redirect unauthorized users.
 *                                   Defaults to '/dashboard'. Pass null to render
 *                                   an inline 403 banner instead of redirecting.
 * @param {ReactNode} children       The protected content.
 *
 * Usage in App.jsx:
 *   <Route path="/admin/create-course" element={
 *     <RoleGuard allowedRoles={['ROLE_ADMIN', 'ROLE_TRAINER']}>
 *       <CreateCoursePage />
 *     </RoleGuard>
 *   } />
 *
 * Usage inline in components:
 *   <RoleGuard allowedRoles={['ROLE_ADMIN']} redirectTo={null}>
 *     <button>Create Job</button>
 *   </RoleGuard>
 */
export function RoleGuard({ allowedRoles = [], redirectTo = '/dashboard', children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Not authenticated at all — send to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user.role ?? '';
  const isAuthorized = allowedRoles.length === 0 || allowedRoles.includes(userRole);

  if (!isAuthorized) {
    // Hard redirect — for dedicated admin routes
    if (redirectTo !== null) {
      return <Navigate to={redirectTo} replace />;
    }

    // Inline 403 banner — for partial UI blocks
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8 bg-slate-900/60 border border-red-500/20 rounded-2xl text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Shield className="w-6 h-6 text-red-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-red-400 flex items-center gap-2 justify-center">
            <AlertTriangle className="w-4 h-4" />
            Access Restricted
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Your role ({userRole.replace('ROLE_', '')}) does not have permission to access this section.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default RoleGuard;

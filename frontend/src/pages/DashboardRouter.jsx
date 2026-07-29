import React from 'react';
import { useAuth } from '../context/AuthContext';
import { AdminDashboard } from './AdminDashboard';
import { HRDashboard } from './HRDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { EmployeeDashboard } from './EmployeeDashboard';

export const DashboardRouter = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case 'ROLE_ADMIN':
      return <AdminDashboard />;
    case 'ROLE_HR':
      return <HRDashboard />;
    case 'ROLE_MANAGER':
      return <ManagerDashboard />;
    case 'ROLE_EMPLOYEE':
    case 'ROLE_TRAINER':
    case 'ROLE_STUDENT':
    default:
      return <EmployeeDashboard />;
  }
};

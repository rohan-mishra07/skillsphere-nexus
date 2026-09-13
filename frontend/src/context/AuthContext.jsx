import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useWorkforce } from './WorkforceContext';

const AuthContext = createContext();

export const getInitials = (name) => {
  if (!name) return 'RM';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const MOCK_USERS = [
  { id: 4, email: 'employee@skillsphere.com', fullName: 'Rohan Mishra (Software Engineer)', role: 'ROLE_EMPLOYEE', department: 'Software Engineering', designation: 'Software Engineer' },
  { id: 1, email: 'admin@skillsphere.com', fullName: 'Sarah Jenkins (Platform Director)', role: 'ROLE_ADMIN', department: 'Executive Management', designation: 'Platform Director' },
  { id: 2, email: 'hr@skillsphere.com', fullName: 'Priya Sharma (HR Manager)', role: 'ROLE_HR', department: 'Human Resources', designation: 'HR Manager' },
  { id: 3, email: 'manager@skillsphere.com', fullName: 'Elena Rostova', role: 'ROLE_MANAGER', department: 'Engineering & IT', designation: 'Engineering Manager' },
  { id: 5, email: 'alex@skillsphere.com', fullName: 'Alex Chen', role: 'ROLE_EMPLOYEE', department: 'Engineering & IT', designation: 'Senior Full Stack Engineer' },
  { id: 6, email: 'student@skillsphere.com', fullName: 'Rohan Mishra', role: 'ROLE_STUDENT', department: 'Computer Science & Engineering', designation: 'Enrolled Student' },
  { id: 7, email: 'trainer@skillsphere.com', fullName: 'Prof. David Sterling', role: 'ROLE_TRAINER', department: 'Learning & Development', designation: 'Lead Technical Instructor' },
];

export const AuthProvider = ({ children }) => {
  const workforce = useWorkforce();
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('auth_user') || localStorage.getItem('skillsphere_user');
    const savedToken = localStorage.getItem('auth_token') || localStorage.getItem('token');
    if (savedUser && savedToken) {
      try {
        const parsed = JSON.parse(savedUser);
        return {
          ...parsed,
          name: parsed.name || parsed.fullName || 'Rohan Mishra',
          fullName: parsed.fullName || parsed.name || 'Rohan Mishra',
          position: parsed.position || parsed.designation || 'Software Engineer',
          designation: parsed.designation || parsed.position || 'Software Engineer',
        };
      } catch (e) {
        return null;
      }
    }
    return null; // Unauthenticated by default if no stored session
  });

  const isAuthenticated = !!user;

  const login = async (email, password, customName, customDesignation, customRole) => {
    let userData;
    const token = 'mock-jwt-token-skillsphere-nexus-' + Date.now();
    try {
      const res = await api.post('/auth/login', { email, password });
      userData = res.data;
      if (customName) {
        userData.fullName = customName;
        userData.name = customName;
      }
      if (customDesignation) {
        userData.designation = customDesignation;
        userData.position = customDesignation;
      }
      if (customRole) userData.role = customRole;
    } catch (err) {
      const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: Date.now(),
        email: email,
        fullName: customName || 'Rohan Mishra',
        name: customName || 'Rohan Mishra',
        role: customRole || 'ROLE_EMPLOYEE',
        department: 'Software Engineering',
        designation: customDesignation || 'Software Engineer',
        position: customDesignation || 'Software Engineer',
      };

      userData = { 
        ...found, 
        fullName: customName || found.fullName || found.name,
        name: customName || found.name || found.fullName,
        designation: customDesignation || found.designation || found.position,
        position: customDesignation || found.position || found.designation,
        role: customRole || found.role,
        token: token
      };
    }

    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', userData.token || token);
    localStorage.setItem('skillsphere_user', JSON.stringify(userData));
    localStorage.setItem('token', userData.token || token);
    localStorage.setItem('role', userData.role);

    if (workforce?.recordLogin) workforce.recordLogin(userData);
    return userData;
  };

  const register = async (registerData) => {
    try {
      await api.post('/auth/register', registerData);
    } catch (err) {
      console.warn("Backend register notice:", err);
    }
    const token = 'mock-jwt-token-registered-' + Date.now();
    const newUser = {
      id: Date.now(),
      email: registerData.email,
      fullName: registerData.fullName,
      role: registerData.role || 'ROLE_EMPLOYEE',
      department: registerData.department || 'Software Engineering',
      designation: registerData.designation || 'Software Engineer',
      token: token
    };
    setUser(newUser);
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('skillsphere_user', JSON.stringify(newUser));
    localStorage.setItem('token', token);
    localStorage.setItem('role', newUser.role);
    if (workforce?.recordLogin) workforce.recordLogin(newUser);
    return newUser;
  };

  const loginAsStudent = (studentName, studentEmail) => {
    const token = 'mock-jwt-token-student-' + Date.now();
    const studentUser = {
      id: Date.now(),
      email: studentEmail || 'student@skillsphere.com',
      fullName: studentName || 'Rohan Mishra',
      role: 'ROLE_STUDENT',
      department: 'Computer Science & Engineering',
      designation: 'Enrolled Student',
      token: token
    };
    setUser(studentUser);
    localStorage.setItem('auth_user', JSON.stringify(studentUser));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('skillsphere_user', JSON.stringify(studentUser));
    localStorage.setItem('token', token);
    localStorage.setItem('role', studentUser.role);
    if (workforce?.recordLogin) workforce.recordLogin(studentUser);
    return studentUser;
  };

  const [roleToast, setRoleToast] = useState('');

  // Synchronize stored active role from localStorage
  const savedActiveRole = localStorage.getItem('skillsphere_active_role');
  if (user && savedActiveRole && user.role !== savedActiveRole) {
    user.role = savedActiveRole;
  }

  const switchRole = (newRole, customName) => {
    const roleMapNames = {
      ROLE_ADMIN: 'Admin',
      ROLE_HR: 'HR Executive',
      ROLE_EMPLOYEE: 'Employee',
      ROLE_MANAGER: 'Manager',
      ROLE_STUDENT: 'Student'
    };

    const target = MOCK_USERS.find(u => u.role === newRole) || MOCK_USERS[0];
    const token = 'mock-jwt-token-role-' + Date.now();
    const updatedUser = { 
      ...target, 
      role: newRole,
      fullName: customName || (newRole === 'ROLE_EMPLOYEE' ? 'Rohan Mishra' : newRole === 'ROLE_HR' ? 'Priya Sharma' : target.fullName),
      name: customName || (newRole === 'ROLE_EMPLOYEE' ? 'Rohan Mishra' : newRole === 'ROLE_HR' ? 'Priya Sharma' : target.fullName),
      token: token 
    };

    setUser(updatedUser);
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('skillsphere_user', JSON.stringify(updatedUser));
    localStorage.setItem('token', token);
    localStorage.setItem('role', newRole);
    localStorage.setItem('skillsphere_active_role', newRole);

    if (workforce?.recordLogin) workforce.recordLogin(updatedUser);

    // Trigger Toast Notification
    const roleDisplayName = roleMapNames[newRole] || 'Role';
    setRoleToast(`Active session switched to ${roleDisplayName}`);
    setTimeout(() => {
      setRoleToast('');
    }, 4000);
  };

  const logout = () => {
    if (user && workforce?.recordLogout) workforce.recordLogout(user);
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('skillsphere_user');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('skillsphere_active_role');
    sessionStorage.clear();

    const keycloak = window.keycloak;
    if (keycloak && keycloak.authenticated) {
      keycloak.logout({ redirectUri: window.location.origin + '/login' });
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, loginAsStudent, logout, switchRole, roleToast, setRoleToast, MOCK_USERS, getInitials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

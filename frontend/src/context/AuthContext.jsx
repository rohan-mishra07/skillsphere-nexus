import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useWorkforce } from './WorkforceContext';

const AuthContext = createContext();

export const getInitials = (name) => {
  if (!name) return 'L';
  const finalName = name.trim() || 'Learner';
  return finalName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
};

export const MOCK_USERS = [
  { id: 4, email: 'employee@skillsphere.com', fullName: 'Software Engineer', role: 'ROLE_EMPLOYEE', department: 'Software Engineering', designation: 'Software Engineer' },
  { id: 1, email: 'admin@skillsphere.com', fullName: 'Sarah Jenkins', role: 'ROLE_ADMIN', department: 'Executive Management', designation: 'Platform Director' },
  { id: 2, email: 'hr@skillsphere.com', fullName: 'Priya Sharma', role: 'ROLE_HR', department: 'Human Resources', designation: 'HR Manager' },
  { id: 3, email: 'manager@skillsphere.com', fullName: 'Elena Rostova', role: 'ROLE_MANAGER', department: 'Engineering & IT', designation: 'Engineering Manager' },
  { id: 5, email: 'alex@skillsphere.com', fullName: 'Alex Chen', role: 'ROLE_EMPLOYEE', department: 'Engineering & IT', designation: 'Senior Full Stack Engineer' },
  { id: 6, email: 'student@skillsphere.com', fullName: 'Enrolled Student', role: 'ROLE_STUDENT', department: 'Computer Science & Engineering', designation: 'Enrolled Student' },
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
        const name = parsed.name || parsed.fullName || 'Learner';
        const initials = parsed.initials || getInitials(name);
        return {
          ...parsed,
          name: name,
          fullName: name,
          initials: initials,
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
    const finalName = (typeof customName === 'string' && customName.trim()) ? customName.trim() : 'Learner';
    const initials = finalName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

    try {
      const res = await api.post('/auth/login', { email, password });
      userData = res.data || {};
      userData.name = finalName;
      userData.fullName = finalName;
      userData.initials = initials;
      if (customDesignation) {
        userData.designation = customDesignation;
        userData.position = customDesignation;
      }
      if (customRole) userData.role = customRole;
    } catch (err) {
      const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());

      userData = { 
        ...(found || {}), 
        id: found?.id || Date.now(),
        email: email,
        fullName: finalName,
        name: finalName,
        initials: initials,
        designation: customDesignation || found?.designation || found?.position || 'Software Engineer',
        position: customDesignation || found?.position || found?.designation || 'Software Engineer',
        role: customRole || found?.role || 'ROLE_EMPLOYEE',
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
    const finalName = registerData.fullName?.trim() || 'Learner';
    const initials = getInitials(finalName);
    const newUser = {
      id: Date.now(),
      email: registerData.email,
      name: finalName,
      fullName: finalName,
      initials: initials,
      role: registerData.role || 'ROLE_EMPLOYEE',
      department: registerData.department || 'Software Engineering',
      designation: registerData.designation || 'Software Engineer',
      position: registerData.designation || 'Software Engineer',
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
    const finalName = studentName?.trim() || 'Learner';
    const initials = getInitials(finalName);
    const studentUser = {
      id: Date.now(),
      email: studentEmail || 'student@skillsphere.com',
      name: finalName,
      fullName: finalName,
      initials: initials,
      role: 'ROLE_STUDENT',
      department: 'Computer Science & Engineering',
      designation: 'Enrolled Student',
      position: 'Enrolled Student',
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
    const currentName = user?.name || user?.fullName;
    const finalName = (customName || currentName || target.fullName || 'Learner').trim();
    const initials = getInitials(finalName);

    const updatedUser = { 
      ...target, 
      ...user,
      role: newRole,
      fullName: finalName,
      name: finalName,
      initials: initials,
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

import React, { createContext, useContext, useState } from 'react';
import api from '../api/axios';
import { useWorkforce } from './WorkforceContext';

const AuthContext = createContext();

export const getInitials = (name) => {
  if (!name) return 'U';
  const finalName = name.trim();
  if (!finalName) return 'U';
  return finalName.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase();
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
    const saved = localStorage.getItem('nexus_user') || localStorage.getItem('auth_user') || localStorage.getItem('skillsphere_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && (parsed.name || parsed.fullName)) {
          const name = parsed.name || parsed.fullName;
          return {
            ...parsed,
            name: name,
            fullName: name,
            initials: parsed.initials || getInitials(name),
          };
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const isAuthenticated = !!user;

  const login = async (userDataOrEmail, password, customName, customDesignation, customRole) => {
    let userData;
    if (typeof userDataOrEmail === 'object' && userDataOrEmail !== null) {
      const name = userDataOrEmail.name || userDataOrEmail.fullName;
      const initials = userDataOrEmail.initials || getInitials(name);
      userData = {
        ...userDataOrEmail,
        name: name,
        fullName: name,
        initials: initials,
        token: userDataOrEmail.token || ('mock-jwt-token-skillsphere-nexus-' + Date.now())
      };
    } else {
      const email = userDataOrEmail;
      const token = 'mock-jwt-token-skillsphere-nexus-' + Date.now();
      const finalName = (typeof customName === 'string' && customName.trim()) ? customName.trim() : 'Learner';
      const initials = getInitials(finalName);

      userData = { 
        email: email,
        fullName: finalName,
        name: finalName,
        initials: initials,
        designation: customDesignation || 'Software Engineer',
        position: customDesignation || 'Software Engineer',
        role: customRole || 'ROLE_EMPLOYEE',
        token: token
      };
    }

    setUser(userData);
    localStorage.setItem('nexus_user', JSON.stringify(userData));
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('skillsphere_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', userData.token);
    localStorage.setItem('token', userData.token);
    if (userData.role) localStorage.setItem('role', userData.role);

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
    const finalName = registerData.fullName?.trim() || registerData.name?.trim() || 'Learner';
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
    localStorage.setItem('nexus_user', JSON.stringify(newUser));
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    localStorage.setItem('skillsphere_user', JSON.stringify(newUser));
    localStorage.setItem('auth_token', token);
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
    localStorage.setItem('nexus_user', JSON.stringify(studentUser));
    localStorage.setItem('auth_user', JSON.stringify(studentUser));
    localStorage.setItem('skillsphere_user', JSON.stringify(studentUser));
    localStorage.setItem('auth_token', token);
    localStorage.setItem('token', token);
    localStorage.setItem('role', studentUser.role);
    if (workforce?.recordLogin) workforce.recordLogin(studentUser);
    return studentUser;
  };

  // Comprehensive Logout & Session Sanitization
  const logout = () => {
    if (user && workforce?.recordLogout) workforce.recordLogout(user);
    
    // Completely wipe all storage items and active session state
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('skillsphere_user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('skillsphere_active_role');
    sessionStorage.clear();
    
    setUser(null);

    const keycloak = window.keycloak;
    if (keycloak && keycloak.authenticated) {
      keycloak.logout({ redirectUri: window.location.origin + '/login' });
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, loginAsStudent, logout, MOCK_USERS, getInitials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

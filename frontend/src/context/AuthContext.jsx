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
  { id: 4, email: 'rohan.mishra@skillsphere.com', fullName: 'Rohan Mishra', role: 'ROLE_EMPLOYEE', department: 'Software Engineering', designation: 'Developer' },
  { id: 1, email: 'admin@skillsphere.com', fullName: 'Sarah Jenkins', role: 'ROLE_ADMIN', department: 'Executive Management', designation: 'Platform Director' },
  { id: 2, email: 'hr@skillsphere.com', fullName: 'Marcus Vance', role: 'ROLE_HR', department: 'Human Resources', designation: 'Head of People Operations' },
  { id: 3, email: 'manager@skillsphere.com', fullName: 'Elena Rostova', role: 'ROLE_MANAGER', department: 'Engineering & IT', designation: 'Engineering Manager' },
  { id: 5, email: 'employee@skillsphere.com', fullName: 'Alex Chen', role: 'ROLE_EMPLOYEE', department: 'Engineering & IT', designation: 'Senior Full Stack Engineer' },
  { id: 6, email: 'student@skillsphere.com', fullName: 'Rohan Mishra', role: 'ROLE_STUDENT', department: 'Computer Science & Engineering', designation: 'Enrolled Student' },
  { id: 7, email: 'trainer@skillsphere.com', fullName: 'Prof. David Sterling', role: 'ROLE_TRAINER', department: 'Learning & Development', designation: 'Lead Technical Instructor' },
];

export const AuthProvider = ({ children }) => {
  const workforce = useWorkforce();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('skillsphere_user');
    return saved ? JSON.parse(saved) : MOCK_USERS[0]; // Default to Rohan Mishra (Developer)
  });

  const login = async (email, password, customName) => {
    let userData;
    try {
      const res = await api.post('/auth/login', { email, password });
      userData = res.data;
      if (customName) userData.fullName = customName;
    } catch (err) {
      const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || {
        id: Date.now(),
        email: email,
        fullName: customName || email.split('@')[0] || 'User',
        role: 'ROLE_EMPLOYEE',
        department: 'Engineering & IT',
        designation: 'Software Specialist',
      };

      userData = { 
        ...found, 
        fullName: customName || found.fullName,
        token: 'mock-jwt-token-demo' 
      };
    }

    setUser(userData);
    localStorage.setItem('skillsphere_user', JSON.stringify(userData));
    if (workforce?.recordLogin) workforce.recordLogin(userData);
    return userData;
  };

  const register = async (registerData) => {
    try {
      await api.post('/auth/register', registerData);
    } catch (err) {
      console.warn("Backend register notice:", err);
    }
    const newUser = {
      id: Date.now(),
      email: registerData.email,
      fullName: registerData.fullName,
      role: registerData.role || 'ROLE_EMPLOYEE',
      department: registerData.department || 'Software Engineering',
      designation: registerData.designation || 'Software Engineer',
      token: 'mock-jwt-token-registered'
    };
    setUser(newUser);
    localStorage.setItem('skillsphere_user', JSON.stringify(newUser));
    if (workforce?.recordLogin) workforce.recordLogin(newUser);
    return newUser;
  };

  const loginAsStudent = (studentName, studentEmail) => {
    const studentUser = {
      id: Date.now(),
      email: studentEmail || 'student@skillsphere.com',
      fullName: studentName || 'Rohan Mishra',
      role: 'ROLE_STUDENT',
      department: 'Computer Science & Engineering',
      designation: 'Enrolled Student',
      token: 'mock-jwt-token-student'
    };
    setUser(studentUser);
    localStorage.setItem('skillsphere_user', JSON.stringify(studentUser));
    if (workforce?.recordLogin) workforce.recordLogin(studentUser);
    return studentUser;
  };

  const switchRole = (newRole, customName) => {
    const target = MOCK_USERS.find(u => u.role === newRole) || MOCK_USERS[0];
    const updatedUser = { 
      ...target, 
      fullName: customName || target.fullName,
      token: 'mock-jwt-token-demo' 
    };
    setUser(updatedUser);
    localStorage.setItem('skillsphere_user', JSON.stringify(updatedUser));
    if (workforce?.recordLogin) workforce.recordLogin(updatedUser);
  };

  const logout = () => {
    if (user && workforce?.recordLogout) workforce.recordLogout(user);
    setUser(null);
    localStorage.removeItem('skillsphere_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, loginAsStudent, logout, switchRole, MOCK_USERS, getInitials }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

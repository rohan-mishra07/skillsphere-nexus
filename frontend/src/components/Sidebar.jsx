import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Target, 
  Clock, 
  TrendingUp, 
  UserPlus, 
  BarChart3, 
  ShieldCheck, 
  Sparkles,
  Layers,
  GraduationCap,
  LogIn
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Overview Dashboard', icon: LayoutDashboard, path: '/', roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE', 'ROLE_TRAINER', 'ROLE_STUDENT'] },
    { label: 'Student Portal Sign In', icon: GraduationCap, path: '/login', roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE', 'ROLE_TRAINER', 'ROLE_STUDENT'] },
    { label: 'Learning (LMS)', icon: BookOpen, path: '/courses', roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE', 'ROLE_TRAINER', 'ROLE_STUDENT'] },
    { label: 'Employee Skill Management', icon: Target, path: '/skills', roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE', 'ROLE_STUDENT'] },
    { label: 'Workforce & Shifts', icon: Clock, path: '/workforce', roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { label: 'Performance & KPIs', icon: TrendingUp, path: '/performance', roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER', 'ROLE_EMPLOYEE'] },
    { label: 'Recruitment & Onboarding', icon: UserPlus, path: '/recruitment', roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER'] },
    { label: 'Reports & Analytics', icon: BarChart3, path: '/analytics', roles: ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER'] },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between h-screen sticky top-0">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1.5 font-outfit">
              Skill<span className="gradient-text">Sphere</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">Workforce & Student Engine</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems
            .filter(item => item.roles.includes(user?.role || 'ROLE_EMPLOYEE'))
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
        </nav>
      </div>

      {/* Footer Banner */}
      <div className="p-4 border-t border-slate-800/80">
        <div className="glass-panel p-3 rounded-xl border border-indigo-500/20 relative overflow-hidden">
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-indigo-500/10 blur-xl"></div>
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Copilot Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Real-time skill gap analysis & student certificates connected.
          </p>
        </div>
      </div>
    </aside>
  );
};

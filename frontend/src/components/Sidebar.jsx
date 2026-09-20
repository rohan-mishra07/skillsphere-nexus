import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Home,
  BookOpen, 
  Award,
  Briefcase,
  Users,
  ClipboardList,
  BarChart3,
  Sparkles,
  Layers
} from 'lucide-react';

export const Sidebar = ({ onOpenAiCopilot }) => {
  const { user } = useAuth();

  // Determine if active session has management privileges
  const isManagement = ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER'].includes(user?.role);

  // Strict Segregated Menu Structures:
  
  // Non-Management (Employee Portal) Links (ONLY 4 Links)
  const employeeNavItems = [
    { label: 'My Growth Hub', icon: Home, path: '/dashboard', iconEmoji: '🏠' },
    { label: 'Course Catalog', icon: BookOpen, path: '/learning', iconEmoji: '📚' },
    { label: 'My Certifications', icon: Award, path: '/certifications', iconEmoji: '🏆' },
    { label: 'Internal Jobs', icon: Briefcase, path: '/jobs', iconEmoji: '💼' },
  ];

  // Management Portal Administrative Links (5 Administrative Links)
  const managementNavItems = [
    { label: 'Management Intelligence', icon: Home, path: '/dashboard', iconEmoji: '🏠' },
    { label: 'User Directory & RBAC', icon: Users, path: '/admin/users', iconEmoji: '👥' },
    { label: 'Workforce & Leaves', icon: ClipboardList, path: '/workforce', iconEmoji: '📋' },
    { label: 'Course Management', icon: BookOpen, path: '/learning', iconEmoji: '📚' },
    { label: 'Reports & Analytics', icon: BarChart3, path: '/reports', iconEmoji: '📊' },
  ];

  const currentNav = isManagement ? managementNavItems : employeeNavItems;

  return (
    <aside className="hidden md:flex w-64 bg-slate-900 border-r border-slate-800 flex-col justify-between h-screen sticky top-0 shrink-0">
      {/* Brand Header */}
      <div>
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Layers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-extrabold text-lg text-white tracking-tight flex items-center gap-1 font-outfit">
              SkillSphere <span className="text-cyan-400">Nexus</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-wide">
              {isManagement ? 'Management Portal' : 'Employee Workspace'}
            </p>
          </div>
        </div>

        {/* Dynamic Navigation Menu */}
        <nav className="p-3 space-y-1 mt-2">
          {currentNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/dashboard' || item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/30 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`
                }
              >
                <span className="text-sm shrink-0">{item.iconEmoji}</span>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Banner - Clickable AI Copilot Card */}
      <div className="p-4 border-t border-slate-800/80">
        <div 
          onClick={onOpenAiCopilot}
          className="glass-panel p-3.5 rounded-2xl border border-indigo-500/30 hover:border-purple-500/50 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 relative overflow-hidden cursor-pointer hover:scale-[1.02] transition-all duration-200 shadow-lg group"
          title="Open Nexus Talent Copilot"
        >
          <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-purple-500/20 blur-xl group-hover:bg-purple-500/40 transition-colors"></div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-300">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span>AI Copilot Active</span>
            </div>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
            Real-time skill gap analysis &amp; verified certificates connected. <strong className="text-purple-300">Click to launch →</strong>
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

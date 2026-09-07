import React, { useState } from 'react';
import { useAuth, getInitials } from '../context/AuthContext';
import { useWorkforce } from '../context/WorkforceContext';
import { NotificationBar, INITIAL_NOTIFICATIONS } from './NotificationBar';
import { ServiceStatusPills } from './ServiceStatusPills';
import { 
  Bell, 
  Search, 
  UserCheck, 
  ChevronDown, 
  LogOut,
  ShieldAlert, 
  Briefcase, 
  GraduationCap, 
  Users,
  Bot,
  Activity
} from 'lucide-react';

export const Navbar = ({ onOpenAiModal, onOpenLoginModal }) => {
  const { user, switchRole, logout } = useAuth();
  const { activeInOffice, pulseType } = useWorkforce();
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotificationBar, setShowNotificationBar] = useState(false);
  const [notifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const roleLabels = {
    ROLE_ADMIN: { label: 'Admin', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
    ROLE_HR: { label: 'HR Manager', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
    ROLE_MANAGER: { label: 'Team Lead / Manager', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    ROLE_EMPLOYEE: { label: 'Employee', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
    ROLE_STUDENT: { label: 'Student Learner', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
    ROLE_TRAINER: { label: 'Instructor / Trainer', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  };

  const activeRoleBadge = roleLabels[user?.role] || roleLabels.ROLE_ADMIN;
  const userName = user?.name || user?.fullName || 'Rohan Mishra';
  const userPosition = user?.position || user?.designation || 'Software Engineer';
  const avatarInitials = getInitials(userName);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 shadow-md">
      {/* Left: Mobile Brand & Global Search */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="md:hidden flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md">
            <Activity className="w-4.5 h-4.5" />
          </div>
          <span className="font-extrabold text-base text-white font-outfit">Skill<span className="text-cyan-400">Sphere</span></span>
        </div>

        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search skills, courses, certifications..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        {/* Live Staff Ticker */}
        <div className={`hidden xl:flex items-center gap-2 px-3 py-1 rounded-xl border text-xs font-semibold shrink-0 transition-all ${
          pulseType === 'JOIN' 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' 
            : pulseType === 'LEFT'
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
            : 'bg-slate-950 text-slate-300 border-slate-800'
        }`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-outfit font-bold text-white text-[11px]">{activeInOffice} Staff Live</span>
        </div>
      </div>

      {/* Right Utility Bar: Status Pills, Role Switcher, AI, Bell, User Profile, Logout */}
      <div className="flex items-center gap-3 shrink-0">
        <ServiceStatusPills />

        {/* Quick Role Switcher Banner */}
        <div className="relative hidden sm:block">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold tracking-wide transition-all ${activeRoleBadge.color}`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Role: {activeRoleBadge.label}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {showRoleDropdown && (
            <div className="absolute right-0 mt-2 w-64 glass-panel rounded-xl shadow-2xl p-2 z-50 border border-slate-700">
              <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                Quick Role Tester
              </div>
              <button onClick={() => { switchRole('ROLE_ADMIN'); setShowRoleDropdown(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-rose-300">
                <ShieldAlert className="w-3.5 h-3.5" /> Admin View
              </button>
              <button onClick={() => { switchRole('ROLE_HR'); setShowRoleDropdown(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-purple-300">
                <Users className="w-3.5 h-3.5" /> HR View
              </button>
              <button onClick={() => { switchRole('ROLE_MANAGER'); setShowRoleDropdown(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-amber-300">
                <Briefcase className="w-3.5 h-3.5" /> Manager View
              </button>
              <button onClick={() => { switchRole('ROLE_STUDENT'); setShowRoleDropdown(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-pink-300 font-bold">
                <GraduationCap className="w-3.5 h-3.5 text-pink-400" /> Student View
              </button>
              <button onClick={() => { switchRole('ROLE_EMPLOYEE'); setShowRoleDropdown(false); }} className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-indigo-300">
                <GraduationCap className="w-3.5 h-3.5" /> Employee View
              </button>
            </div>
          )}
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={onOpenAiModal}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md hover:scale-105 transition-transform"
        >
          <Bot className="w-4 h-4" />
          <span>AI Assistant</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationBar(!showNotificationBar)}
            className="relative p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Notification Bar"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] font-extrabold flex items-center justify-center border-2 border-slate-900 shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          <NotificationBar
            isOpen={showNotificationBar}
            onClose={() => setShowNotificationBar(false)}
          />
        </div>

        {/* User Info Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
            {avatarInitials}
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-bold text-white leading-none">{userName}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{userPosition}</div>
          </div>
        </div>

        {/* Direct Logout Action */}
        <button
          type="button"
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-800/60 rounded-lg hover:bg-rose-900/60 hover:text-rose-200 transition-all cursor-pointer"
        >
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

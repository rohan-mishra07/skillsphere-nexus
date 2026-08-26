import React, { useState } from 'react';
import { useAuth, getInitials } from '../context/AuthContext';
import { useWorkforce } from '../context/WorkforceContext';
import { NotificationBar, INITIAL_NOTIFICATIONS } from './NotificationBar';
import { 
  Sparkles, 
  Bell, 
  Search, 
  UserCheck, 
  ChevronDown, 
  LogIn, 
  ShieldAlert, 
  Briefcase, 
  GraduationCap, 
  Users,
  Bot,
  Activity
} from 'lucide-react';

export const Navbar = ({ onOpenAiModal, onOpenLoginModal }) => {
  const { user, switchRole, logout } = useAuth();
  const { totalHeadcount, activeInOffice, pulseType, latestEvent } = useWorkforce();
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

  const activeRoleBadge = roleLabels[user?.role] || roleLabels.ROLE_STUDENT;
  const avatarInitials = getInitials(user?.fullName || 'Rohan Mishra');

  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-3 flex items-center justify-between">
      {/* Left: Search Bar & Real-time Live Staff Badge */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, skills, students, or job postings..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Dynamic Real-Time Employee Ticker */}
        <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-300 ${
          pulseType === 'JOIN' 
            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/20 scale-105' 
            : pulseType === 'LEFT'
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/20 scale-105'
            : 'bg-slate-950 text-slate-300 border-slate-800'
        }`}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-outfit font-extrabold text-white">{activeInOffice} Staff Live</span>
          {pulseType === 'JOIN' && (
            <span className="text-[10px] text-emerald-400 font-bold animate-pulse">+1 Joined ({latestEvent.name.split(' ')[0]})</span>
          )}
          {pulseType === 'LEFT' && (
            <span className="text-[10px] text-amber-400 font-bold animate-pulse">-1 Left ({latestEvent.name.split(' ')[0]})</span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Prominent Login Bar Button */}
        <button
          onClick={onOpenLoginModal}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all shadow-md"
        >
          <LogIn className="w-4 h-4 text-indigo-400" />
          <span>Login Bar</span>
        </button>

        {/* Quick Role Tester Switcher Banner */}
        <div className="relative">
          <button
            onClick={() => setShowRoleDropdown(!showRoleDropdown)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold tracking-wide transition-all ${activeRoleBadge.color}`}
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
              <button
                onClick={() => { switchRole('ROLE_ADMIN'); setShowRoleDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-rose-300"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Admin View
              </button>
              <button
                onClick={() => { switchRole('ROLE_HR'); setShowRoleDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-purple-300"
              >
                <Users className="w-3.5 h-3.5" /> HR View
              </button>
              <button
                onClick={() => { switchRole('ROLE_MANAGER'); setShowRoleDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-amber-300"
              >
                <Briefcase className="w-3.5 h-3.5" /> Manager View
              </button>
              <button
                onClick={() => { switchRole('ROLE_STUDENT'); setShowRoleDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-pink-300 font-bold"
              >
                <GraduationCap className="w-3.5 h-3.5 text-pink-400" /> Student View
              </button>
              <button
                onClick={() => { switchRole('ROLE_EMPLOYEE'); setShowRoleDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-indigo-300"
              >
                <GraduationCap className="w-3.5 h-3.5" /> Employee View
              </button>
              <button
                onClick={() => { switchRole('ROLE_TRAINER'); setShowRoleDropdown(false); }}
                className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-slate-800 flex items-center gap-2 text-emerald-300"
              >
                <Sparkles className="w-3.5 h-3.5" /> Trainer View
              </button>
            </div>
          )}
        </div>

        {/* AI Assistant Floating Trigger Button */}
        <button
          onClick={onOpenAiModal}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-xs font-semibold shadow-lg hover:shadow-indigo-500/25 transition-all hover:scale-105"
        >
          <Bot className="w-4 h-4" />
          <span>AI Assistant</span>
        </button>

        {/* Interactive Notification Bell & Panel Container */}
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

        {/* User Info Avatar - Displays Correct Initials (RM for Rohan Mishra) */}
        <button 
          onClick={onOpenLoginModal}
          className="flex items-center gap-2.5 pl-2 border-l border-slate-800 hover:opacity-80 transition-opacity text-left"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
            {avatarInitials}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-bold text-white">{user?.fullName || 'Rohan Mishra'}</div>
            <div className="text-[10px] text-slate-400">{user?.designation || 'Enrolled Student'}</div>
          </div>
        </button>
      </div>
    </header>
  );
};

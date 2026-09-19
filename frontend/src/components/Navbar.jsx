import React, { useState } from 'react';
import { useAuth, getInitials } from '../context/AuthContext';
import { useWorkforce } from '../context/WorkforceContext';
import { NotificationBar, INITIAL_NOTIFICATIONS } from './NotificationBar';
import { ServiceStatusPills } from './ServiceStatusPills';
import { 
  Bell, 
  Search, 
  LogOut,
  Bot,
  Activity
} from 'lucide-react';

export const Navbar = ({ onOpenAiModal, onOpenLoginModal }) => {
  const { user, logout } = useAuth();
  const { activeInOffice, pulseType } = useWorkforce();
  const [showNotificationBar, setShowNotificationBar] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const userName = user?.name || user?.fullName;
  const userPosition = user?.position || user?.designation;
  const avatarInitials = user ? (user.initials || (userName ? getInitials(userName) : 'U')) : '';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 shadow-md relative">
      
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

      {/* Right Utility Bar */}
      <div className="flex items-center gap-3 shrink-0">
        <ServiceStatusPills />

        {/* Conditional User Session Pill & Actions */}
        {user ? (
          <>
            {/* Read-Only Active Role Badge */}
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
              {user?.role === 'ROLE_ADMIN' ? 'Platform Administrator' : 
               user?.role === 'ROLE_HR' ? 'HR Executive' : 
               user?.role === 'ROLE_MANAGER' ? 'Team Lead / Manager' : 'Employee Portal'}
            </div>

            {/* AI Assistant Button */}
            <button
              onClick={onOpenAiModal}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>AI Assistant</span>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationBar(!showNotificationBar)}
                className="relative p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
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
                notifications={notifications}
                setNotifications={setNotifications}
              />
            </div>

            {/* User Info Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                {avatarInitials}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-none">{userName}</div>
                {userPosition && <div className="text-[10px] text-slate-400 mt-0.5">{userPosition}</div>}
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
          </>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;

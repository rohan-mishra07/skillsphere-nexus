import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Trash2, 
  BookOpen, 
  Calendar, 
  TrendingUp, 
  UserPlus, 
  Sparkles,
  Award,
  Clock,
  ShieldCheck
} from 'lucide-react';

export const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Digital Certificate Issued',
    message: 'Congratulations! Your Enterprise Java Spring Boot 3 Certificate (SKSP-89F2A90C) is ready to download.',
    time: '10 mins ago',
    type: 'lms',
    read: false,
    icon: Award,
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 2,
    title: 'Leave Request Approved',
    message: 'HR Manager Marcus Vance approved your Annual Vacation request (Aug 10 - Aug 14).',
    time: '1 hour ago',
    type: 'workforce',
    read: false,
    icon: Check,
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 3,
    title: 'AI Skill Gap Recommendation',
    message: 'SkillSphere AI detected a 20% proficiency gap in React Micro-Frontends. Recommended course assigned.',
    time: '3 hours ago',
    type: 'ai',
    read: false,
    icon: Sparkles,
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  },
  {
    id: 4,
    title: 'Manager Feedback Added',
    message: 'Elena Rostova commented on your OKR: "Great progress on security filters. Keep up the high code quality."',
    time: 'Yesterday',
    type: 'performance',
    read: true,
    icon: TrendingUp,
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
  },
  {
    id: 5,
    title: 'New Applicant Match',
    message: 'Candidate Jordan Rivera applied for Senior Cloud Backend Architect with a 94% AI match score.',
    time: '2 days ago',
    type: 'recruitment',
    read: true,
    icon: UserPlus,
    color: 'text-rose-400 bg-rose-500/10 border-rose-500/20'
  }
];

export const NotificationBar = ({ isOpen, onClose, notifications: propsNotifications, setNotifications: propsSetNotifications }) => {
  const [localNotifications, setLocalNotifications] = useState(INITIAL_NOTIFICATIONS);
  const notifications = propsNotifications !== undefined ? propsNotifications : localNotifications;
  const setNotifications = propsSetNotifications || setLocalNotifications;
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'UNREAD'

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filtered = filter === 'UNREAD' ? notifications.filter(n => !n.read) : notifications;

  return (
    <div className="fixed inset-x-3 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-14 w-auto sm:w-96 max-w-[calc(100vw-24px)] z-50 glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden bg-slate-900/95 animate-fade-in flex flex-col max-h-[80vh]">
      {/* Header Bar */}
      <div className="px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
            <Bell className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2 font-outfit truncate">
              <span className="truncate">Notification Center</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold shrink-0">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <p className="text-[10px] text-slate-400 truncate">LMS, Workforce &amp; AI Real-Time Activity</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0" title="Close notifications">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Control Filter Bar */}
      <div className="flex items-center justify-between p-2.5 px-4 bg-slate-950/60 border-b border-slate-800/80 text-xs shrink-0">
        <div className="flex gap-1">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('UNREAD')}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
              filter === 'UNREAD' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" /> Read All
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-slate-400 hover:text-rose-400 transition-colors p-1"
              title="Clear all notifications"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Notification Items List */}
      <div className="max-h-[60vh] sm:max-h-[380px] overflow-y-auto divide-y divide-slate-800/60 flex-1">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs space-y-1">
            <Bell className="w-6 h-6 mx-auto opacity-40 mb-2 text-indigo-400" />
            <p className="font-semibold text-slate-300">No Notifications</p>
            <p className="text-[11px]">You're all caught up with your LMS & Workforce activity.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                onClick={() => toggleRead(item.id)}
                className={`p-3.5 transition-all cursor-pointer flex items-start gap-3 relative ${
                  item.read ? 'opacity-70 bg-slate-950/40 hover:bg-slate-900/40' : 'bg-slate-900/90 hover:bg-slate-800/60'
                }`}
              >
                {!item.read && (
                  <span className="absolute top-3.5 left-2 w-2 h-2 rounded-full bg-indigo-500"></span>
                )}

                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-bold text-xs text-white truncate">{item.title}</h4>
                    <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">{item.message}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-center">
        <span className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-400" /> Real-time SSE Notification Engine Active
        </span>
      </div>
    </div>
  );
};

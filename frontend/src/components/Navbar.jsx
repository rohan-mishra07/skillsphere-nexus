import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getInitials } from '../context/AuthContext';
import { useWorkforce } from '../context/WorkforceContext';
import { NotificationBar, INITIAL_NOTIFICATIONS } from './NotificationBar';
import { ServiceStatusPills } from './ServiceStatusPills';
import AiAssistantModal from '../components/AiAssistantModal';
import { 
  Bell, 
  Search, 
  LogOut,
  Bot,
  Activity,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

const SEARCH_INDEX = [
  { title: "Workforce & Leaves", description: "Attendance logs, clock-ins & leave approvals", category: "Navigation", link: "/workforce", keywords: ["workforce", "leave", "attendance", "pto", "clock"] },
  { title: "User Directory & RBAC", description: "Manage staff, provision users & roles", category: "Navigation", link: "/admin/users", keywords: ["users", "user", "directory", "rbac", "staff", "admin"] },
  { title: "Job Requisitions & ATS", description: "Internal job openings & candidate applications", category: "Navigation", link: "/jobs", keywords: ["jobs", "job", "requisition", "career", "hiring", "ats", "apply"] },
  { title: "Course Catalog", description: "LMS learning courses & workshops", category: "Navigation", link: "/courses", keywords: ["courses", "course", "learning", "lms", "training", "catalog"] },
  { title: "Skill Management Hub", description: "Skill matrix, ratings & radar graph", category: "Navigation", link: "/skills", keywords: ["skills", "skill", "matrix", "radar", "competency", "assessment"] },
  { title: "My Certifications", description: "View & verify digital certificates", category: "Navigation", link: "/certifications", keywords: ["certifications", "cert", "certificate", "badge", "verify"] },
  { title: "Reports & Analytics", description: "Executive telemetry & performance reports", category: "Navigation", link: "/reports", keywords: ["reports", "analytics", "telemetry", "metrics"] },
  { title: "Enterprise Java Spring Boot 4 & Security", description: "Backend Engineering Course", category: "Course", link: "/courses/1", keywords: ["java", "spring", "boot", "security"] },
  { title: "React 18 & Modern Tailwind CSS Enterprise UI", description: "Frontend Web Development Course", category: "Course", link: "/courses/2", keywords: ["react", "tailwind", "ui", "frontend"] },
  { title: "AWS Certified Solutions Architect & Cloud Native", description: "Cloud & DevOps Strategy Course", category: "Course", link: "/courses/3", keywords: ["aws", "cloud", "devops", "architect"] }
];

export const Navbar = ({ onOpenAiModal, onOpenLoginModal }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { activeInOffice, pulseType } = useWorkforce();
  const [showNotificationBar, setShowNotificationBar] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [syncToastMsg, setSyncToastMsg] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  useEffect(() => {
    const handleSystemSync = () => {
      setSyncToastMsg('System telemetry & cached records re-synchronized.');
      setTimeout(() => setSyncToastMsg(''), 4000);
    };
    window.addEventListener('nexus_system_sync', handleSystemSync);
    return () => window.removeEventListener('nexus_system_sync', handleSystemSync);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    window.dispatchEvent(new CustomEvent('nexus_global_search', { detail: query }));
  };

  const searchResults = searchQuery.trim() ? SEARCH_INDEX.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
  ) : [];

  const unreadCount = (notifications || []).filter(n => !n.read).length;

  const userName = user?.name || user?.fullName;
  const userPosition = user?.position || user?.designation;
  const avatarInitials = user ? (user.initials || (userName ? getInitials(userName) : 'U')) : '';

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-6 py-2.5 flex items-center justify-between gap-4 shadow-md relative">
      
      {/* Toast Notification Banner */}
      {syncToastMsg && (
        <div className="fixed top-16 right-6 z-50 px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold rounded-2xl shadow-xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncToastMsg}</span>
        </div>
      )}

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
            placeholder="Search workforce, jobs, courses, users, skills..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
          />

          {/* Quick-Jump Global Search Dropdown */}
          {searchQuery.trim() && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900/95 border border-indigo-500/40 rounded-2xl shadow-2xl p-2 z-50 space-y-1 backdrop-blur-xl animate-in fade-in zoom-in duration-150">
              <div className="text-[10px] font-extrabold text-indigo-400 px-2 py-1 uppercase tracking-wider">
                Quick Jump Navigation ({searchResults.length}):
              </div>
              {searchResults.slice(0, 5).map((res, rIdx) => (
                <button
                  key={rIdx}
                  onClick={() => {
                    setSearchQuery('');
                    navigate(res.link);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-indigo-600/20 border border-transparent hover:border-indigo-500/30 flex items-center justify-between group transition-all cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-indigo-300 font-outfit flex items-center gap-1.5">
                      <span>{res.title}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">{res.category}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{res.description}</div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-300 group-hover:text-white bg-indigo-500/20 px-2.5 py-1 rounded-full border border-indigo-500/30 shrink-0 flex items-center gap-1 transition-all">
                    Go to page <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}
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
               user?.role === 'ROLE_MANAGER' ? 'Team Manager' : 'Employee Portal'}
            </div>

            {/* AI Assistant Button — desktop only (FAB handles mobile below) */}
            <button
              type="button"
              id="btn-ai-assistant-navbar"
              onClick={() => {
                setIsAiModalOpen(true);
                if (typeof onOpenAiModal === 'function') onOpenAiModal();
              }}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-md hover:scale-105 transition-transform cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>✨ AI Assistant</span>
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
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-500 to-pink-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
                  {avatarInitials}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-bold text-white leading-none">{user.name || userName}</div>
                  {userPosition && <div className="text-[10px] text-slate-400 mt-0.5">{userPosition}</div>}
                </div>
              </div>
            )}

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

      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/*
       * Floating Action Button (FAB) — visible on ALL viewport sizes.
       *
       * Positioning:
       *   - Mobile (<md): bottom-20 clears the MobileBottomNav (h ~64px + gap)
       *   - Desktop (≥md): bottom-6 (no bottom nav present)
       *   - Always right-5, z-50 (above page content, below modals at z-[60])
       *
       * Touch target: 52×52px — exceeds WCAG 2.5.5 minimum of 44×44px.
       * The pulsing ring gives a subtle "live" signal on mobile.
       */}
      {user && (
        <button
          id="fab-ai-assistant"
          type="button"
          onClick={() => {
            setIsAiModalOpen(true);
            if (typeof onOpenAiModal === 'function') onOpenAiModal();
          }}
          className="md:hidden fixed bottom-20 right-5 z-50 w-[52px] h-[52px] flex items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 text-white shadow-2xl shadow-purple-700/60 hover:scale-110 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 relative overflow-visible"
          aria-label="Open AI Assistant"
          title="Open AI Assistant"
        >
          {/* Pulsing glow ring */}
          <span className="absolute inset-0 rounded-full animate-ping bg-purple-500/30 pointer-events-none" aria-hidden="true" />
          <Bot className="w-5 h-5 relative z-10" />
        </button>
      )}
    </header>
  );
};

export default Navbar;

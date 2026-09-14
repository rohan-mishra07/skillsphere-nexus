import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  BookOpen,
  Award,
  Sparkles,
  UserPlus
} from 'lucide-react';

export const MobileBottomNav = () => {
  const tabs = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { label: 'Skills', icon: Target, path: '/skills' },
    { label: 'Learning', icon: BookOpen, path: '/courses' },
    { label: 'Certifications', icon: Award, path: '/certifications' },
    { label: 'Career', icon: Sparkles, path: '/career-analytics' },
    { label: 'Jobs', icon: UserPlus, path: '/recruitment' }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 pointer-events-auto bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 px-1 py-2 grid grid-cols-6 items-center justify-items-center shadow-2xl">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full min-h-[44px] px-1 py-1 rounded-xl text-[9px] font-bold transition-all ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`
            }
          >
            <Icon className="w-4 h-4 mb-0.5" />
            <span>{tab.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileBottomNav;

import React, { useState } from 'react';
import { 
  Briefcase, 
  Target, 
  TrendingUp, 
  Users, 
  Sparkles, 
  CheckSquare, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ManagerDashboard = () => {
  const [teamMembers] = useState([
    { name: 'Alex Chen', role: 'Senior Full Stack Engineer', skillMatch: '88%', okrProgress: 75, status: 'On Track' },
    { name: 'Priya Sharma', role: 'Frontend Specialist', skillMatch: '92%', okrProgress: 90, status: 'Exceeding' },
    { name: 'David Kim', role: 'DevOps Engineer', skillMatch: '74%', okrProgress: 60, status: 'Needs Support' },
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="glass-panel p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-slate-900 via-amber-950/20 to-slate-900 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20 mb-2">
            <Briefcase className="w-3.5 h-3.5" /> Engineering & IT Team Operations
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Manager <span className="text-amber-400">Control Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Team Skill Matrices, OKR Goal Approvals, Shift Calendars & Performance Reviews.
          </p>
        </div>
      </div>

      {/* Team Performance Grid */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            Direct Reports & Skill Health
          </h3>
          <Link to="/skills" className="text-xs text-amber-400 font-semibold">View Full Skill Heatmap →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(teamMembers || []).map((m, idx) => (
            <div key={idx} className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-sm text-white">{m.name}</div>
                  <div className="text-[11px] text-slate-400">{m.role}</div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  m.status === 'Exceeding' ? 'bg-emerald-500/20 text-emerald-300' :
                  m.status === 'On Track' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {m.status}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Skill Alignment:</span>
                  <span className="font-bold text-white">{m.skillMatch}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Q3 OKR Progress:</span>
                  <span className="font-bold text-white">{m.okrProgress}%</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-400 h-full" style={{ width: `${m.okrProgress}%` }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

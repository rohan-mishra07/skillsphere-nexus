import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Clock, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Briefcase, 
  Calendar,
  Sparkles,
  Activity
} from 'lucide-react';
import api from '../api/axios';
import { useWorkforce } from '../context/WorkforceContext';

export const HRDashboard = () => {
  const { activeInOffice, totalHeadcount, pulseType, latestEvent, liveLog } = useWorkforce();
  const [leaves, setLeaves] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);

  useEffect(() => {
    fetchHrData();
  }, []);

  const fallbackLeaves = [
    { id: 1, userName: 'Alex Chen', leaveType: 'Annual Vacation', startDate: '2026-08-10', endDate: '2026-08-14', reason: 'Attending International Tech Summit', status: 'PENDING' }
  ];
  const fallbackJobPostings = [
    { id: 1, title: 'Senior Cloud Backend Architect', department: 'Engineering', location: 'Remote', applicantCount: 14, status: 'Active' }
  ];

  const fetchHrData = async () => {
    try {
      const lRes = await api.get('/workforce/leaves');
      setLeaves(Array.isArray(lRes.data) && lRes.data.length > 0 ? lRes.data : fallbackLeaves);
      const jRes = await api.get('/recruitment/jobs');
      setJobPostings(Array.isArray(jRes.data) && jRes.data.length > 0 ? jRes.data : fallbackJobPostings);
    } catch (err) {
      setLeaves(fallbackLeaves);
      setJobPostings(fallbackJobPostings);
    }
  };

  const handleUpdateLeave = async (id, status) => {
    try {
      await api.put(`/workforce/leaves/${id}/status?status=${status}&approvedBy=Marcus Vance`);
    } catch (err) {}
    setLeaves(prev => (Array.isArray(prev) ? prev : fallbackLeaves).map(l => l.id === id ? { ...l, status } : l));
  };

  return (
    <div className="space-y-6">
      {/* HR Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20 mb-2">
            <Users className="w-3.5 h-3.5" /> Human Resources Management Suite
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            People Operations <span className="text-purple-400">Dashboard</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Workforce Planning, Real-time Clock-ins, Leave Approvals, Recruitment ATS Pipeline & Employee Records.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`glass-panel p-4 rounded-2xl border transition-all duration-300 ${
          pulseType === 'JOIN' ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20' :
          pulseType === 'LEFT' ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Headcount (Live)</span>
            <Users className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{activeInOffice} Staff</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            {pulseType === 'JOIN' ? `+1 ${latestEvent.name.split(' ')[0]} joined` :
             pulseType === 'LEFT' ? `-1 ${latestEvent.name.split(' ')[0]} left` :
             'Dynamic Real-Time Sync'}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending Leaves</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{leaves.filter(l => l.status === 'PENDING').length} Requests</div>
          <div className="text-[11px] text-amber-400 mt-1">Requires HR/Manager Signoff</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Open Positions</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">6 Requisitions</div>
          <div className="text-[11px] text-indigo-400 mt-1">42 Candidates in Pipeline</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Retention Index</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">96.4%</div>
          <div className="text-[11px] text-emerald-400 mt-1">+3.1% YoY Improvement</div>
        </div>
      </div>

      {/* Pending Leave Requests Section */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            Pending Employee Leave Requests
          </h3>
        </div>

        <div className="space-y-3">
          {(leaves || []).map((leave) => (
            <div key={leave.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-white">{leave.userName}</span>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">
                    {leave.leaveType}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Dates: {leave.startDate} to {leave.endDate} • Reason: "{leave.reason}"
                </div>
              </div>

              <div className="flex items-center gap-2">
                {leave.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => handleUpdateLeave(leave.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdateLeave(leave.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                ) : (
                  <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    leave.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}>
                    {leave.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

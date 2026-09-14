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
  Activity,
  RotateCcw
} from 'lucide-react';
import api from '../api/axios';
import { useWorkforce } from '../context/WorkforceContext';

export const HRDashboard = () => {
  const { activeInOffice, totalHeadcount, pulseType, latestEvent, liveLog, leaveRequests, updateLeaveStatus } = useWorkforce();
  const [leaveTab, setLeaveTab] = useState('pending'); // 'pending' | 'history'
  const [leaves, setLeaves] = useState([]);
  const [jobPostings, setJobPostings] = useState([]);

  const fallbackLeaves = [
    { 
      id: 'LV-101', 
      userName: 'Alex Chen', 
      leaveType: 'Annual Vacation', 
      startDate: '2026-08-10', 
      endDate: '2026-08-14', 
      reason: 'Attending International Tech Summit', 
      status: 'PENDING' 
    },
    { 
      id: 'LV-102', 
      userName: 'Rohan Mishra', 
      leaveType: 'Wedding / Earned Leave', 
      startDate: '2026-09-18', 
      endDate: '2026-09-22', 
      reason: 'Attending sibling wedding in Rajasthan', 
      status: 'PENDING' 
    },
    { 
      id: 'LV-103', 
      userName: 'Dr. Sarah Jenkins', 
      leaveType: 'Sick Leave', 
      startDate: '2026-09-01', 
      endDate: '2026-09-03', 
      reason: 'Medical Recovery & Rest', 
      status: 'APPROVED',
      processedAt: 'Sep 1, 2026' 
    },
    { 
      id: 'LV-104', 
      userName: 'David Miller', 
      leaveType: 'Casual Leave', 
      startDate: '2026-08-28', 
      endDate: '2026-08-29', 
      reason: 'Personal Family Matter', 
      status: 'REJECTED',
      processedAt: 'Aug 27, 2026' 
    }
  ];

  const fallbackJobPostings = [
    { id: 1, title: 'Senior Cloud Backend Architect', department: 'Engineering', location: 'Remote', applicantCount: 14, status: 'Active' }
  ];

  useEffect(() => {
    fetchHrData();
  }, [leaveRequests]);

  const fetchHrData = async () => {
    try {
      const lRes = await api.get('/workforce/leaves');
      if (Array.isArray(lRes.data) && lRes.data.length > 0) {
        setLeaves(lRes.data);
      } else if (Array.isArray(leaveRequests) && leaveRequests.length > 0) {
        setLeaves(leaveRequests.map(l => ({ ...l, userName: l.userName || l.employeeName })));
      } else {
        setLeaves(fallbackLeaves);
      }
      const jRes = await api.get('/recruitment/jobs');
      setJobPostings(Array.isArray(jRes.data) && jRes.data.length > 0 ? jRes.data : fallbackJobPostings);
    } catch (err) {
      if (Array.isArray(leaveRequests) && leaveRequests.length > 0) {
        setLeaves(leaveRequests.map(l => ({ ...l, userName: l.userName || l.employeeName })));
      } else {
        setLeaves(fallbackLeaves);
      }
      setJobPostings(fallbackJobPostings);
    }
  };

  const handleUpdateLeave = async (id, status) => {
    const nowStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    try {
      await api.put(`/workforce/leaves/${id}/status?status=${status}&approvedBy=Marcus Vance`);
    } catch (err) {}

    if (updateLeaveStatus) {
      updateLeaveStatus(id, status);
    }

    setLeaves(prev => (Array.isArray(prev) ? prev : fallbackLeaves).map(l => 
      String(l.id) === String(id) ? { ...l, status, processedAt: status === 'PENDING' ? undefined : (l.processedAt || nowStr) } : l
    ));
  };

  const pendingLeaves = (leaves || []).filter(r => r.status === 'PENDING' || !r.status);
  const historyLeaves = (leaves || []).filter(r => r.status === 'APPROVED' || r.status === 'REJECTED');

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
            Workforce Planning, Real-time Clock-ins, Leave Approvals, Recruitment ATS Pipeline &amp; Employee Records.
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
          <div className="text-2xl font-extrabold text-white font-outfit">{pendingLeaves.length} Requests</div>
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

      {/* Leave Management & Decision History Section */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white font-outfit">
              Employee Leave Management
            </h3>
          </div>

          {/* Segmented Tab Controls */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
            <button
              onClick={() => setLeaveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                leaveTab === 'pending'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Pending ({pendingLeaves.length})
            </button>
            <button
              onClick={() => setLeaveTab('history')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                leaveTab === 'history'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Decision History ({historyLeaves.length})
            </button>
          </div>
        </div>

        {/* Tab Content Display */}
        {leaveTab === 'pending' ? (
          <div className="space-y-3">
            {pendingLeaves.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium bg-slate-950/40 rounded-xl border border-slate-800/50">
                No pending leave requests at this time.
              </div>
            ) : (
              pendingLeaves.map((leave) => (
                <div key={leave.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{leave.userName || leave.employeeName}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">
                        {leave.leaveType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Dates: {leave.startDate} to {leave.endDate} • Reason: "{leave.reason}"
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleUpdateLeave(leave.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdateLeave(leave.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {historyLeaves.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium bg-slate-950/40 rounded-xl border border-slate-800/50">
                No decision history recorded yet.
              </div>
            ) : (
              historyLeaves.map((leave) => (
                <div key={leave.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{leave.userName || leave.employeeName}</span>
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold border border-purple-500/30">
                        {leave.leaveType}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Dates: {leave.startDate} to {leave.endDate} • Reason: "{leave.reason}"
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium mt-1">
                      Processed by HR on {leave.processedAt || 'Sep 15, 2026'}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {leave.status === 'APPROVED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <CheckCircle className="w-3.5 h-3.5" /> Approved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" /> Rejected
                      </span>
                    )}

                    <button
                      onClick={() => handleUpdateLeave(leave.id, 'PENDING')}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold border border-slate-700 transition-all flex items-center gap-1 cursor-pointer"
                      title="Move request back to Pending"
                    >
                      <RotateCcw className="w-3 h-3 text-indigo-400" /> Undo / Re-evaluate
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

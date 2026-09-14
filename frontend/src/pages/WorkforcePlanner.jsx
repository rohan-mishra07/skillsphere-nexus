import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, AlertCircle, Plus, Send, UserCheck, Users, Activity } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useWorkforce, getIndiaDateString } from '../context/WorkforceContext';

export const WorkforcePlanner = () => {
  const { user } = useAuth();
  const { totalHeadcount, activeInOffice, clockedInToday, pulseType, latestEvent, liveLog } = useWorkforce();
  const [leaves, setLeaves] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveForm, setLeaveForm] = useState({
    leaveType: 'Annual Vacation',
    startDate: '',
    endDate: '',
    reason: ''
  });

  useEffect(() => {
    fetchWorkforceData();
  }, []);

  const fallbackLeaves = [
    { id: 1, leaveType: 'Annual Vacation', startDate: '2026-08-10', endDate: '2026-08-14', reason: 'Tech Summit', status: 'APPROVED', approvedBy: 'Marcus Vance' }
  ];

  const fetchWorkforceData = async () => {
    try {
      const lRes = await api.get(`/workforce/leaves/user/${user?.id || 4}`);
      setLeaves(Array.isArray(lRes.data) && lRes.data.length > 0 ? lRes.data : fallbackLeaves);
    } catch (err) {
      setLeaves(fallbackLeaves);
    }
  };

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workforce/leaves/apply', {
        userId: user?.id || 4,
        userName: user?.fullName || 'Alex Chen',
        ...leaveForm
      });
      fetchWorkforceData();
    } catch (err) {
      setLeaves(prev => [...prev, { id: Date.now(), userName: user?.fullName || 'Alex Chen', ...leaveForm, status: 'PENDING' }]);
    }
    setShowLeaveModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <Clock className="w-3.5 h-3.5" /> Enterprise Real-Time Workforce Engine (IST)
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Attendance, Shifts & <span className="gradient-text">Leave Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated live clock-in logs (India Standard Time IST), real-time user login tracking, and HR leave workflows.
          </p>
        </div>

        <button
          onClick={() => setShowLeaveModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {/* Live Workforce Counter Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className={`glass-panel p-4 rounded-2xl border transition-all duration-300 ${
          pulseType === 'JOIN' ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20' :
          pulseType === 'LEFT' ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Live Staff Count</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{activeInOffice} Staff</div>
          <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            {pulseType === 'JOIN' ? `+1 ${latestEvent.name} clocked in` :
             pulseType === 'LEFT' ? `-1 ${latestEvent.name} clocked out` :
             'India Standard Time (IST)'}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Clocked-In Today</span>
            <UserCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{clockedInToday} Staff</div>
          <div className="text-[11px] text-indigo-300 mt-1">IST Active Shift</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Total Enterprise Staff</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{totalHeadcount.toLocaleString()}</div>
          <div className="text-[11px] text-purple-300 mt-1">Global Workforce</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Attendance Rate</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">98.2%</div>
          <div className="text-[11px] text-emerald-400 mt-1">+1.4% higher than avg</div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Log Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-white flex items-center gap-2 font-outfit">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  Live Real-Time Attendance & Clock-In Log (IST)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{getIndiaDateString()} • Real-Time India Standard Time</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live IST Clock
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Shift</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {(liveLog || []).map((a, idx) => (
                    <tr key={a.id} className={`transition-all duration-300 ${
                      idx === 0 && pulseType === 'JOIN' ? 'bg-emerald-500/10 font-bold' :
                      idx === 0 && pulseType === 'LEFT' ? 'bg-amber-500/10 font-bold' : 'hover:bg-slate-900/40'
                    }`}>
                      <td className="p-3 font-semibold text-white flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          a.action === 'JOIN' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}>
                          {a.name.substring(0, 2).toUpperCase()}
                        </div>
                        {a.name}
                        {idx === 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-500 text-white uppercase tracking-wider animate-pulse">
                            Just Now
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-slate-400">{a.department || 'Engineering'}</td>
                      <td className="p-3 text-slate-400">{a.shift || 'Morning Shift'}</td>
                      <td className="p-3 font-mono text-slate-200">{a.time}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1 ${
                          a.action === 'JOIN' 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {a.action === 'JOIN' ? '🟢 Clocked In' : '🟠 Clocked Out'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Leave Requests Log */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              My Leave Tracker
            </h3>

            <div className="space-y-3">
              {(leaves || []).map((l) => (
                <div key={l.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{l.leaveType}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      l.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {l.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {l.startDate} → {l.endDate}
                  </div>
                  <p className="text-[11px] text-slate-300 italic">"{l.reason}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Leave Application Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white">Apply for Leave</h3>

            <form onSubmit={handleApplyLeave} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300">Leave Category</label>
                <select
                  value={leaveForm.leaveType}
                  onChange={(e) => setLeaveForm({ ...leaveForm, leaveType: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                >
                  <option>Annual Vacation</option>
                  <option>Casual Leave</option>
                  <option>Sick Leave</option>
                  <option>Maternity/Paternity</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300">Start Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.startDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300">End Date</label>
                  <input
                    type="date"
                    required
                    value={leaveForm.endDate}
                    onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                    className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">Reason</label>
                <textarea
                  required
                  rows={3}
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  placeholder="Explain brief reason for leave request..."
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white"
                ></textarea>
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 bg-slate-800 text-xs text-slate-300 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-xs text-white font-semibold rounded-xl flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

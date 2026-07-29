import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, AlertCircle, Plus, Send, UserCheck } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const WorkforcePlanner = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
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

  const fetchWorkforceData = async () => {
    try {
      const aRes = await api.get('/workforce/attendance/all');
      setAttendance(aRes.data);
      const lRes = await api.get(`/workforce/leaves/user/${user?.id || 4}`);
      setLeaves(lRes.data);
    } catch (err) {
      setAttendance([
        { id: 1, userName: 'Alex Chen', date: '2026-07-27', checkInTime: '08:55', status: 'Present', shift: 'Morning Shift (09:00 - 17:00)' },
        { id: 2, userName: 'Priya Sharma', date: '2026-07-27', checkInTime: '09:02', status: 'Present', shift: 'Morning Shift (09:00 - 17:00)' },
        { id: 3, userName: 'David Kim', date: '2026-07-27', checkInTime: '09:15', status: 'Late', shift: 'Morning Shift (09:00 - 17:00)' },
      ]);
      setLeaves([
        { id: 1, leaveType: 'Annual Vacation', startDate: '2026-08-10', endDate: '2026-08-14', reason: 'Tech Summit', status: 'APPROVED', approvedBy: 'Marcus Vance' }
      ]);
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
            <Clock className="w-3.5 h-3.5" /> Enterprise Workforce Engine
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Attendance, Shifts & <span className="gradient-text">Leave Management</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated clock-in logs, shift scheduling, and HR leave workflow automation.
          </p>
        </div>

        <button
          onClick={() => setShowLeaveModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl transition-colors shadow-lg shadow-indigo-600/20 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Apply for Leave
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Log Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                Today's Workforce Attendance Log
              </h3>
              <span className="text-xs text-slate-400">Date: July 27, 2026</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Employee</th>
                    <th className="p-3">Shift</th>
                    <th className="p-3">Check-In</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {attendance.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-semibold text-white">{a.userName}</td>
                      <td className="p-3 text-slate-400">{a.shift}</td>
                      <td className="p-3 font-mono">{a.checkInTime}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          a.status === 'Present' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {a.status}
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
              {leaves.map((l) => (
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

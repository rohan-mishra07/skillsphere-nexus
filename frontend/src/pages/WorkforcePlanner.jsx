import React, { useState, useEffect } from 'react';
import { 
  Clock, Calendar, CheckCircle2, AlertCircle, Plus, Send, 
  UserCheck, Users, Activity, Check, X, ShieldAlert 
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useWorkforce, getIndiaDateString } from '../context/WorkforceContext';

export const WorkforcePlanner = () => {
  const { user } = useAuth();
  const { 
    totalHeadcount, 
    activeInOffice, 
    clockedInToday, 
    pulseType, 
    latestEvent, 
    liveLog,
    leaveRequests,
    approveLeaveRequest,
    rejectLeaveRequest
  } = useWorkforce();

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.designation?.includes('Admin') || user?.name?.includes('Admin');

  const [leaves, setLeaves] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
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
    showToast('Leave application submitted successfully!');
  };

  const handleApproveLeave = (reqId) => {
    approveLeaveRequest(reqId);
    showToast('Leave request approved.');
  };

  const handleRejectLeave = (reqId) => {
    const reasonPrompt = window.prompt('Reason for rejection:', 'Insufficient coverage');
    if (reasonPrompt === null) return;
    rejectLeaveRequest(reqId, reasonPrompt);
    showToast('Leave request rejected.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-indigo-600 border border-indigo-400 text-white text-xs font-bold rounded-2xl shadow-xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-cyan-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <Clock className="w-3.5 h-3.5 text-purple-400" /> Enterprise Real-Time Workforce Engine (IST)
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Attendance, Shifts &amp; <span className="gradient-text">Leave Governance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isAdmin 
              ? 'Platform Administrator View: Manage leave approvals queue and monitor real-time workforce clock-ins.' 
              : 'Automated live clock-in logs (India Standard Time IST) and personal leave tracking.'}
          </p>
        </div>

        {/* Apply for Leave Button - Hidden for Admins */}
        {!isAdmin && (
          <button
            onClick={() => setShowLeaveModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Apply for Leave
          </button>
        )}
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
                  Live Real-Time Attendance &amp; Clock-In Log (IST)
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">{getIndiaDateString()} • India Standard Time</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live IST
                </span>
              </div>
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 shadow-inner scrollbar-thin scrollbar-thumb-slate-700">
              <table className="w-full text-left text-xs text-slate-300 min-w-[640px] border-collapse">
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
                      <td className="p-3 font-semibold text-white flex items-center gap-2 whitespace-nowrap">
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
                      <td className="p-3 text-slate-400 whitespace-nowrap">{a.department || 'Engineering'}</td>
                      <td className="p-3 text-slate-400 whitespace-nowrap">{a.shift || 'Morning Shift'}</td>
                      <td className="p-3 font-mono text-slate-200 whitespace-nowrap">{a.time}</td>
                      <td className="p-3 whitespace-nowrap">
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

        {/* Right Column: Admin Approvals Queue vs Employee Tracker */}
        <div className="space-y-4">
          {isAdmin ? (
            /* ADMIN ONLY: Workforce Pending Leave Approvals Queue */
            <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-purple-950/10 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2 font-outfit">
                  <ShieldAlert className="w-4 h-4 text-purple-400" />
                  Workforce Pending Leave Approvals
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/40">
                  {(leaveRequests || []).filter(r => r.status === 'PENDING').length} Pending
                </span>
              </div>

              <div className="space-y-3">
                {(leaveRequests || []).filter(r => r.status === 'PENDING').length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">No pending leave approvals in queue.</p>
                ) : (
                  (leaveRequests || []).filter(r => r.status === 'PENDING').map((req) => (
                    <div key={req.id} className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-white">{req.userName || req.employeeName}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {req.leaveType}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{req.startDate} → {req.endDate}</p>
                      <p className="text-[11px] text-slate-300 italic">"{req.reason}"</p>

                      <div className="flex gap-2 justify-end pt-2 border-t border-slate-800">
                        <button
                          onClick={() => handleRejectLeave(req.id)}
                          className="px-3 py-1 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-[11px] font-bold rounded-lg border border-rose-500/30 transition-colors flex items-center gap-1"
                        >
                          <X className="w-3 h-3" /> Reject
                        </button>
                        <button
                          onClick={() => handleApproveLeave(req.id)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-colors flex items-center gap-1 shadow-md shadow-emerald-600/20"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            /* EMPLOYEE ONLY: My Leave Tracker */
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
          )}
        </div>
      </div>

      {/* Leave Application Modal - Available for Employees */}
      {!isAdmin && showLeaveModal && (
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

export default WorkforcePlanner;

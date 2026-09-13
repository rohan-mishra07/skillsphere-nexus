import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldAlert, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Activity, 
  Settings, 
  Lock,
  Database,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Star
} from 'lucide-react';
import api from '../api/axios';
import { useWorkforce } from '../context/WorkforceContext';
import { useFeedback } from '../context/FeedbackContext';
import { ProvisionUserModal } from '../components/ProvisionUserModal';
import { Calendar, CheckCircle2, XCircle, Clock, FileText } from 'lucide-react';

const PRE_SEEDED_LEAVES = [
  {
    id: 'LEAVE-8012',
    employeeName: 'Rohan Mishra',
    employeeEmail: 'rohan.mishra@skillsphere.com',
    employeeRole: 'Software Engineer',
    leaveType: 'Wedding / Earned Leave',
    startDate: '2026-09-18',
    endDate: '2026-09-22',
    daysCount: '4 Days',
    reason: 'Attending sibling wedding in Rajasthan',
    submissionDate: 'Sept 11, 2026',
    status: 'PENDING'
  },
  {
    id: 'LEAVE-8013',
    employeeName: 'Alex Chen',
    employeeEmail: 'employee@skillsphere.com',
    employeeRole: 'Senior Full Stack Engineer',
    leaveType: 'Sick Leave',
    startDate: '2026-09-14',
    endDate: '2026-09-16',
    daysCount: '2 Days',
    reason: 'Viral fever & rest advice by doctor',
    submissionDate: 'Sept 12, 2026',
    status: 'PENDING'
  }
];

export const AdminDashboard = () => {
  const { 
    activeInOffice, 
    pulseType, 
    latestEvent, 
    leaveRequests, 
    approveLeaveRequest, 
    rejectLeaveRequest 
  } = useWorkforce();
  const { totalFeedbackCount, feedbacks } = useFeedback();
  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [provisionToast, setProvisionToast] = useState('');
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
    totalEmployees: 5,
    activeCourses: 3,
    certificatesIssued: 12,
    workforceProductivityIndex: '94.2%'
  });

  const handleApproveLeave = (reqId) => {
    approveLeaveRequest(reqId);
    setProvisionToast('Leave request approved successfully.');
    setTimeout(() => setProvisionToast(''), 4000);
  };

  const handleRejectLeave = (reqId) => {
    const reasonPrompt = window.prompt('Reason for rejection:', 'Insufficient team coverage during sprint');
    if (reasonPrompt === null) return;

    rejectLeaveRequest(reqId, reasonPrompt);
    setProvisionToast('Leave request rejected.');
    setTimeout(() => setProvisionToast(''), 4000);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      setUsers(res.data);
    } catch (err) {
      setUsers([
        { id: 1, fullName: 'Sarah Jenkins', email: 'admin@skillsphere.com', role: 'ROLE_ADMIN', department: 'Executive', active: true },
        { id: 2, fullName: 'Marcus Vance', email: 'hr@skillsphere.com', role: 'ROLE_HR', department: 'Human Resources', active: true },
        { id: 3, fullName: 'Elena Rostova', email: 'manager@skillsphere.com', role: 'ROLE_MANAGER', department: 'Engineering', active: true },
        { id: 4, fullName: 'Alex Chen', email: 'employee@skillsphere.com', role: 'ROLE_EMPLOYEE', department: 'Engineering', active: true },
        { id: 5, fullName: 'Prof. David Sterling', email: 'trainer@skillsphere.com', role: 'ROLE_TRAINER', department: 'L&D', active: true },
      ]);
    }
  };

  const handleUserProvisioned = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
    setMetrics(prev => ({ ...prev, totalEmployees: prev.totalEmployees + 1 }));

    // Trigger Toast Notification
    const toastMsg = `User ${newUser.fullName} successfully provisioned with role ${newUser.roleLabel}`;
    setProvisionToast(toastMsg);
    setTimeout(() => {
      setProvisionToast('');
    }, 4500);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Toast Notification */}
      {provisionToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold rounded-2xl shadow-xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{provisionToast}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-500/20 bg-gradient-to-r from-slate-900 via-rose-950/20 to-slate-900 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-300 text-xs font-semibold border border-rose-500/20 mb-2">
            <ShieldAlert className="w-3.5 h-3.5" /> System Administrator Control Center
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            SkillSphere <span className="text-rose-400">Admin Portal</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global User Management, Real-time Staff Movement Audits, RBAC Permissions & Infrastructure Health.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsProvisionModalOpen(true)}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-rose-600/20 cursor-pointer flex items-center gap-1.5"
          >
            + Provision User
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
        <div className={`glass-panel p-4 rounded-2xl border transition-all duration-300 ${
          pulseType === 'JOIN' ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/20' :
          pulseType === 'LEFT' ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/20' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Staff (Live)</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{activeInOffice} Staff</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            {pulseType === 'JOIN' ? `+1 ${latestEvent.name.split(' ')[0]} clocked in` :
             pulseType === 'LEFT' ? `-1 ${latestEvent.name.split(' ')[0]} clocked out` :
             '100% RBAC Enforced'}
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Security Engine</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">Spring Security 6</div>
          <div className="text-[11px] text-emerald-400 mt-1">Stateless JWT + BCrypt</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Database Layer</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">H2 / MySQL JPA</div>
          <div className="text-[11px] text-indigo-400 mt-1">Auto Schema Update</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">System Uptime</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">99.98%</div>
          <div className="text-[11px] text-emerald-400 mt-1">Zero latency issues</div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 bg-purple-950/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-purple-300">User Feedbacks</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit flex items-center gap-1.5">
            {totalFeedbackCount} <span className="text-xs text-slate-400 font-normal">Entries</span>
          </div>
          <div className="text-[11px] text-amber-400 font-bold mt-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400" /> 4.9 ★ Rating Avg
          </div>
        </div>
      </div>

      {/* User Management Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" />
            Global User Directory &amp; Permissions
          </h3>
          <span className="text-xs text-slate-400">Total Records: {users.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Email</th>
                <th className="p-3">Department</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-semibold text-white flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-200">
                      {u.fullName?.substring(0, 2).toUpperCase()}
                    </div>
                    {u.fullName}
                  </td>
                  <td className="p-3 text-slate-400">{u.email}</td>
                  <td className="p-3">{u.department || 'General'}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-rose-300 border border-slate-700 font-mono text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                      <CheckCircle className="w-3 h-3" /> Active
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[11px] font-semibold border border-slate-700">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Management & Approvals Queue */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-slate-900/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-sm text-white">
              Pending Leave Approvals Queue
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
              {leaveRequests.filter(r => r.status === 'PENDING').length} Pending
            </span>
          </div>
          <span className="text-xs text-slate-400">Total Requests: {leaveRequests.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Leave Type</th>
                <th className="p-3">Duration</th>
                <th className="p-3">Dates</th>
                <th className="p-3">Reason / Note</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Approval Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {leaveRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-semibold text-white">
                    <div>{req.employeeName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{req.employeeRole}</div>
                  </td>
                  <td className="p-3">
                    <span className="px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold">
                      {req.leaveType}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-amber-400">{req.daysCount}</td>
                  <td className="p-3 text-slate-300 font-mono text-[11px]">
                    {req.startDate} → {req.endDate}
                  </td>
                  <td className="p-3 max-w-xs text-slate-300">
                    <div className="truncate" title={req.reason}>{req.reason}</div>
                    {req.rejectionReason && (
                      <div className="text-[10px] text-rose-400 mt-0.5">Reason: {req.rejectionReason}</div>
                    )}
                  </td>
                  <td className="p-3">
                    {req.status === 'PENDING' && (
                      <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold inline-flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" /> PENDING
                      </span>
                    )}
                    {req.status === 'APPROVED' && (
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" /> APPROVED
                      </span>
                    )}
                    {req.status === 'REJECTED' && (
                      <span className="px-2.5 py-1 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold inline-flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-400" /> REJECTED
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right">
                    {req.status === 'PENDING' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleApproveLeave(req.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectLeave(req.id)}
                          className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono">Decision Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision User Modal */}
      <ProvisionUserModal
        isOpen={isProvisionModalOpen}
        onClose={() => setIsProvisionModalOpen(false)}
        onUserProvisioned={handleUserProvisioned}
      />
    </div>
  );
};

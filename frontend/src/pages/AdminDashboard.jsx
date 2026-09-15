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
  Star,
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock
} from 'lucide-react';
import api from '../api/axios';
import { useWorkforce } from '../context/WorkforceContext';
import { useFeedback } from '../context/FeedbackContext';
import { ProvisionUserModal } from '../components/ProvisionUserModal';

export const AdminDashboard = () => {
  const { 
    activeInOffice, 
    pulseType, 
    latestEvent, 
    leaveRequests, 
    approveLeaveRequest, 
    rejectLeaveRequest 
  } = useWorkforce();
  const { totalFeedbackCount } = useFeedback();

  const [isProvisionModalOpen, setIsProvisionModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [provisionToast, setProvisionToast] = useState('');
  const [users, setUsers] = useState([]);

  const fallbackUsers = [
    { id: 1, fullName: 'Sarah Jenkins', email: 'admin@skillsphere.com', role: 'ROLE_ADMIN', department: 'Executive', status: 'Active', active: true },
    { id: 2, fullName: 'Marcus Vance', email: 'hr@skillsphere.com', role: 'ROLE_HR', department: 'Human Resources', status: 'Active', active: true },
    { id: 3, fullName: 'Elena Rostova', email: 'manager@skillsphere.com', role: 'ROLE_MANAGER', department: 'Engineering', status: 'Active', active: true },
    { id: 4, fullName: 'Alex Chen', email: 'employee@skillsphere.com', role: 'ROLE_EMPLOYEE', department: 'Engineering', status: 'Active', active: true },
    { id: 5, fullName: 'Prof. David Sterling', email: 'trainer@skillsphere.com', role: 'ROLE_TRAINER', department: 'L&D', status: 'Active', active: true }
  ];

  const fetchUsers = async () => {
    const saved = localStorage.getItem('nexus_user_directory') || localStorage.getItem('skillsphere_admin_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsers(parsed);
          return;
        }
      } catch (e) {
        console.warn('Failed to parse cached users:', e);
      }
    }
    try {
      const res = await api.get('/auth/users');
      const loaded = Array.isArray(res.data) && res.data.length > 0 ? res.data : fallbackUsers;
      setUsers(loaded);
      localStorage.setItem('nexus_user_directory', JSON.stringify(loaded));
      localStorage.setItem('skillsphere_admin_users', JSON.stringify(loaded));
    } catch (err) {
      setUsers(fallbackUsers);
      localStorage.setItem('nexus_user_directory', JSON.stringify(fallbackUsers));
      localStorage.setItem('skillsphere_admin_users', JSON.stringify(fallbackUsers));
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

  const handleUserProvisioned = (newUser) => {
    setUsers(prev => {
      const updated = [newUser, ...prev];
      localStorage.setItem('nexus_user_directory', JSON.stringify(updated));
      localStorage.setItem('skillsphere_admin_users', JSON.stringify(updated));
      return updated;
    });

    const toastMsg = `User ${newUser.fullName || newUser.email} successfully provisioned with role ${newUser.roleLabel || newUser.role}`;
    setProvisionToast(toastMsg);
    setTimeout(() => {
      setProvisionToast('');
    }, 4500);
  };

  const handleSaveEditedUser = (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      status: editingUser.status || (editingUser.active !== false ? 'Active' : 'Inactive'),
      active: editingUser.status === 'Active' || editingUser.active === true
    };

    setUsers(prev => {
      const updated = prev.map(u => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem('nexus_user_directory', JSON.stringify(updated));
      localStorage.setItem('skillsphere_admin_users', JSON.stringify(updated));
      return updated;
    });

    setIsEditModalOpen(false);
    setEditingUser(null);
    setProvisionToast(`Updated permissions for ${updatedUser.fullName || updatedUser.email} successfully.`);
    setTimeout(() => {
      setProvisionToast('');
    }, 4000);
  };

  return (
    <div className="space-y-6 relative pb-12">
      
      {/* Inline Confirmation Toast Notification */}
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
            Global User Directory, Real-time Staff Movement Audits, RBAC Permissions &amp; Infrastructure Health.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
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
            {pulseType === 'JOIN' ? `+1 ${latestEvent?.name ? latestEvent.name.split(' ')[0] : 'Staff'} clocked in` :
             pulseType === 'LEFT' ? `-1 ${latestEvent?.name ? latestEvent.name.split(' ')[0] : 'Staff'} clocked out` :
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
            {totalFeedbackCount || 0} <span className="text-xs text-slate-400 font-normal">Entries</span>
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
          <span className="text-xs text-slate-400">Total Records: {(users || []).length}</span>
        </div>

        {/* Mobile Stacked Card Layout (< sm viewports) */}
        <div className="sm:hidden space-y-3">
          {(users || []).map((u) => (
            <div key={u.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-white flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-200">
                    {u.fullName ? u.fullName.substring(0, 2).toUpperCase() : 'US'}
                  </div>
                  {u.fullName}
                </div>
                {u.status === 'Suspended' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <AlertTriangle className="w-3 h-3" /> Suspended
                  </span>
                ) : u.status === 'Inactive' || u.active === false ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <XCircle className="w-3 h-3" /> Inactive
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                    <CheckCircle className="w-3 h-3" /> Active
                  </span>
                )}
              </div>
              <div className="text-xs text-slate-400 truncate max-w-[240px]" title={u.email}>{u.email}</div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <span className="text-[10px] font-mono text-rose-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{u.role}</span>
                <button
                  type="button"
                  onClick={() => {
                    setEditingUser({ ...u });
                    setIsEditModalOpen(true);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all cursor-pointer whitespace-nowrap"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet Table View (hidden on sm, visible on >= sm) */}
        <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 shadow-inner scrollbar-thin scrollbar-thumb-slate-700">
          <table className="w-full text-left text-xs text-slate-300 min-w-[640px] border-collapse">
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
              {(users || []).map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-semibold text-white flex items-center gap-2 whitespace-nowrap">
                    <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center font-bold text-[10px] text-slate-200">
                      {u.fullName ? u.fullName.substring(0, 2).toUpperCase() : 'US'}
                    </div>
                    {u.fullName}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[180px] truncate" title={u.email}>{u.email}</td>
                  <td className="p-3 whitespace-nowrap">{u.department || 'General'}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-800 text-rose-300 border border-slate-700 font-mono text-[10px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    {u.status === 'Suspended' ? (
                      <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                        <AlertTriangle className="w-3 h-3 text-amber-400" /> Suspended
                      </span>
                    ) : u.status === 'Inactive' || u.active === false ? (
                      <span className="inline-flex items-center gap-1 text-slate-400 font-semibold">
                        <XCircle className="w-3 h-3 text-slate-500" /> Inactive
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                        <CheckCircle className="w-3 h-3 text-emerald-400" /> Active
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingUser({ ...u });
                        setIsEditModalOpen(true);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/30 transition-all cursor-pointer whitespace-nowrap"
                    >
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
              {(leaveRequests || []).filter(r => r.status === 'PENDING').length} Pending
            </span>
          </div>
          <span className="text-xs text-slate-400">Total Requests: {(leaveRequests || []).length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 min-w-[640px]">
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
              {(leaveRequests || []).map((req) => (
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
                          type="button"
                          onClick={() => handleApproveLeave(req.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-bold shadow-md transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          type="button"
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

      {/* Edit User Modal UI */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white font-outfit">Edit User Directory Entry</h3>
                  <p className="text-[11px] text-slate-400">Modify display name, department, role, and status</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                }}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditedUser} className="space-y-4">
              {/* Full Name / Display Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.fullName || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Email (Read-Only) */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Enterprise Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={editingUser.email || ''}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400 cursor-not-allowed"
                />
              </div>

              {/* Department selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Department
                </label>
                <select
                  value={editingUser.department || 'Engineering'}
                  onChange={(e) => setEditingUser({ ...editingUser, department: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Executive">Executive</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Engineering">Engineering</option>
                  <option value="L&D">L&amp;D</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>

              {/* Role selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Role / RBAC Authorization
                </label>
                <select
                  value={editingUser.role || 'ROLE_EMPLOYEE'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer font-mono"
                >
                  <option value="ROLE_ADMIN">ROLE_ADMIN</option>
                  <option value="ROLE_HR">ROLE_HR</option>
                  <option value="ROLE_MANAGER">ROLE_MANAGER</option>
                  <option value="ROLE_EMPLOYEE">ROLE_EMPLOYEE</option>
                  <option value="ROLE_TRAINER">ROLE_TRAINER</option>
                </select>
              </div>

              {/* Status selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Account Status
                </label>
                <select
                  value={editingUser.status || (editingUser.active !== false ? 'Active' : 'Inactive')}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value, active: e.target.value === 'Active' })}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Action Buttons: "Save Changes" and "Cancel" */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

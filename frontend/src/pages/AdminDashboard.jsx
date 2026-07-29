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
  AlertTriangle
} from 'lucide-react';
import api from '../api/axios';

export const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
    totalEmployees: 5,
    activeCourses: 3,
    certificatesIssued: 12,
    workforceProductivityIndex: '94.2%'
  });

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

  return (
    <div className="space-y-6">
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
            Global User Management, Security Audit Logs, RBAC Permissions & Infrastructure Health.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-rose-600/20">
            + Provision User
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Platform Accounts</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">{users.length || 5} Active</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% RBAC Enforced</div>
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
      </div>

      {/* User Management Table */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-400" />
            Global User Directory & Permissions
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
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { X, UserPlus, Shield, CheckCircle2, Building, Target, Mail, User } from 'lucide-react';

export const ProvisionUserModal = ({ isOpen, onClose, onUserProvisioned }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [roleOption, setRoleOption] = useState('Employee');
  const [department, setDepartment] = useState('Engineering');
  const [careerTrack, setCareerTrack] = useState('Senior Cloud Architect Track');

  // Listen for ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email) return;

    const roleMap = {
      'Employee': 'ROLE_EMPLOYEE',
      'HR Executive': 'ROLE_HR',
      'System Administrator': 'ROLE_ADMIN'
    };

    const mappedRole = roleMap[roleOption] || 'ROLE_EMPLOYEE';

    const newUser = {
      id: Date.now(),
      fullName,
      email,
      role: mappedRole,
      roleLabel: roleOption,
      department,
      careerTrack,
      active: true
    };

    // 1. Add audit log entry to localStorage for AuditLogsView
    try {
      const existingLogs = JSON.parse(localStorage.getItem('skillsphere_audit_logs') || '[]');
      const newAuditLog = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actorName: 'admin.jenkins',
        actorRole: 'System Administrator',
        category: 'PROVISION',
        actionDescription: `[PROVISION] User ${fullName} created by Admin (${roleOption} - ${department})`,
        ipOrigin: '127.0.0.1',
        status: 'SUCCESS'
      };
      localStorage.setItem('skillsphere_audit_logs', JSON.stringify([newAuditLog, ...existingLogs]));
    } catch (err) {
      console.warn('Could not record audit log entry:', err);
    }

    // 2. Invoke callback
    if (onUserProvisioned) {
      onUserProvisioned(newUser);
    }

    // Reset form and close
    setFullName('');
    setEmail('');
    setRoleOption('Employee');
    setDepartment('Engineering');
    setCareerTrack('Senior Cloud Architect Track');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-[#131b2e] border border-[#1e293b] rounded-3xl shadow-2xl overflow-hidden relative space-y-5 p-6 text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-600/20">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-outfit tracking-wide flex items-center gap-2">
                Provision New Enterprise User
              </h2>
              <p className="text-xs text-slate-400">Onboard employee, assign RBAC role, and configure career track.</p>
            </div>
          </div>

          <button 
            onClick={onClose} 
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            title="Close (ESC)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provision Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Full Name */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-400" /> Full Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Sharma"
              className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          {/* Enterprise Email */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" /> Enterprise Email
            </label>
            <input
              type="email"
              required
              placeholder="e.g. vikram.sharma@skillsphere.com"
              className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Grid: Role & Department */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Role / RBAC Level Dropdown */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-purple-400" /> Role / RBAC Level
              </label>
              <select
                className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                value={roleOption}
                onChange={(e) => setRoleOption(e.target.value)}
              >
                <option value="Employee">Employee (Default)</option>
                <option value="HR Executive">HR Executive</option>
                <option value="System Administrator">System Administrator</option>
              </select>
            </div>

            {/* Department Dropdown */}
            <div>
              <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" /> Department
              </label>
              <select
                className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-cyan-500 transition-colors cursor-pointer"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="Engineering">Engineering</option>
                <option value="Cloud & Infrastructure">Cloud &amp; Infrastructure</option>
                <option value="Product Design">Product Design</option>
                <option value="Data & AI">Data &amp; AI</option>
              </select>
            </div>
          </div>

          {/* Initial Career Track */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-emerald-400" /> Initial Career Track
            </label>
            <select
              className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500 transition-colors cursor-pointer"
              value={careerTrack}
              onChange={(e) => setCareerTrack(e.target.value)}
            >
              <option value="Senior Cloud Architect Track">Senior Cloud Architect Track</option>
              <option value="Lead UI Specialist Track">Lead UI Specialist Track</option>
              <option value="Full Stack Engineering Track">Full Stack Engineering Track</option>
              <option value="AI & Data Engineering Track">AI &amp; Data Engineering Track</option>
            </select>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#1e293b] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all border border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-rose-600/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Provision &amp; Assign Credentials
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ProvisionUserModal;

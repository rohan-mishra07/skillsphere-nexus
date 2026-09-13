import React, { useState, useEffect } from 'react';
import { X, Calendar, FileText, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWorkforce } from '../context/WorkforceContext';

export const ApplyLeaveModal = ({ isOpen, onClose, onLeaveSubmitted }) => {
  const { user } = useAuth();
  const { addLeaveRequest } = useWorkforce();
  
  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  const [leaveType, setLeaveType] = useState('Sick Leave');
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [reason, setReason] = useState('');

  // Calculate days count automatically
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  };

  const daysCount = calculateDays();

  // Listen for ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const newSubmission = {
      id: `LV-${Date.now().toString().slice(-4)}`,
      employeeName: user?.name || user?.fullName || 'Rohan Mishra',
      employeeEmail: user?.email || 'rohan.mishra@skillsphere.com',
      role: user?.position || user?.designation || 'Software Engineer',
      employeeRole: user?.position || user?.designation || 'Software Engineer',
      leaveType,
      startDate,
      endDate,
      duration: `${daysCount} Days`,
      daysCount: `${daysCount} Days`,
      reason: reason || 'Personal leave request',
      submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'PENDING'
    };

    // 1. Prepend to WorkforceContext shared state (persisted to localStorage)
    addLeaveRequest(newSubmission);

    // 2. Add audit log entry
    try {
      const existingLogs = JSON.parse(localStorage.getItem('skillsphere_audit_logs') || '[]');
      const newAuditLog = {
        id: `AUD-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
        actorName: user?.email || 'rohan.mishra',
        actorRole: user?.role || 'Employee',
        category: 'CAREER_GAP',
        actionDescription: `[LEAVE_REQUEST] Leave request submitted by ${newSubmission.employeeName} (${leaveType} - ${newSubmission.daysCount})`,
        ipOrigin: '127.0.0.1',
        status: 'PENDING'
      };
      localStorage.setItem('skillsphere_audit_logs', JSON.stringify([newAuditLog, ...existingLogs]));
    } catch (err) {
      console.warn('Could not record audit log:', err);
    }

    if (onLeaveSubmitted) {
      onLeaveSubmitted(newSubmission);
    }

    setReason('');
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-lg bg-[#131b2e] border border-[#1e293b] rounded-3xl shadow-2xl overflow-hidden relative p-6 text-slate-100 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white font-outfit tracking-wide">
                Apply for Time Off / Leave
              </h2>
              <p className="text-xs text-slate-400">Submit leave request for manager review and workforce coverage.</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Leave Type */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" /> Leave Category / Type
            </label>
            <select
              className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value)}
            >
              <option value="Sick Leave">Sick Leave</option>
              <option value="Wedding / Earned Leave">Wedding / Earned Leave</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Exam / Study Leave">Exam / Study Leave</option>
            </select>
          </div>

          {/* Dates & Days Count */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Start Date</label>
              <input
                type="date"
                required
                className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">End Date</label>
              <input
                type="date"
                required
                className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-indigo-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {/* Days Count Auto Indicator */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 font-semibold">
              <Clock className="w-3.5 h-3.5 text-indigo-400" /> Calculated Duration:
            </span>
            <span className="font-extrabold text-amber-400 font-outfit text-sm">
              {daysCount} {daysCount === 1 ? 'Day' : 'Days'}
            </span>
          </div>

          {/* Reason / Handover Note */}
          <div>
            <label className="block text-slate-300 font-bold mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-400" /> Reason / Handover Note
            </label>
            <textarea
              rows={3}
              required
              placeholder="Provide context or task handover arrangements..."
              className="w-full bg-[#0b1120] border border-[#1e293b] rounded-xl p-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {/* Action Buttons */}
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
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Leave Request
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ApplyLeaveModal;

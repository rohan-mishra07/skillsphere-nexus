import React, { useState } from 'react';
import { Clock, UserCheck, Users, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { useWorkforce, getIndiaDateString } from '../context/WorkforceContext';

export const DEFAULT_SHIFTS = [
  { id: 'shift-101', empId: 'EMP-948201', employeeName: 'Rohan Mishra', email: 'rohan.mishra@skillsphere.com', department: 'Engineering', shiftType: 'Morning (09:00 - 17:00 IST)', date: '2026-09-15', status: 'ON_SHIFT', clockedInAt: '09:02 IST' },
  { id: 'shift-102', empId: 'EMP-948202', employeeName: 'Sarah Jenkins', email: 'sarah.jenkins@skillsphere.com', department: 'Executive', shiftType: 'Morning (09:00 - 17:00 IST)', date: '2026-09-15', status: 'ON_SHIFT', clockedInAt: '08:55 IST' },
  { id: 'shift-103', empId: 'EMP-948203', employeeName: 'Marcus Vance', email: 'marcus.vance@skillsphere.com', department: 'Human Resources', shiftType: 'General (10:00 - 18:00 IST)', date: '2026-09-15', status: 'ON_SHIFT', clockedInAt: '09:48 IST' },
  { id: 'shift-104', empId: 'EMP-948204', employeeName: 'Elena Rostova', email: 'elena.rostova@skillsphere.com', department: 'Engineering', shiftType: 'General (10:00 - 18:00 IST)', date: '2026-09-15', status: 'ON_SHIFT', clockedInAt: '09:58 IST' },
  { id: 'shift-105', empId: 'EMP-948205', employeeName: 'Alex Chen', email: 'alex.chen@skillsphere.com', department: 'Engineering', shiftType: 'Evening (14:00 - 22:00 IST)', date: '2026-09-15', status: 'SCHEDULED', clockedInAt: 'Pending' }
];

export function WorkforceShifts() {
  const { activeInOffice, clockedInToday, liveLog } = useWorkforce();
  const [shifts, setShifts] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_workforce_shifts');
      return saved ? JSON.parse(saved) : DEFAULT_SHIFTS;
    } catch (e) {
      return DEFAULT_SHIFTS;
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400" /> Enterprise Shift &amp; Roster Ledger (IST)
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Workforce Shifts &amp; <span className="gradient-text">Live Roster</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time shift schedules, clocked-in personnel status, and roster assignments.
          </p>
        </div>
      </div>

      {/* Roster & Shift Table Container */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-2 font-outfit">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            Active Workforce Shifts &amp; Clock-In Roster ({getIndiaDateString()})
          </h3>
          <span className="text-xs text-slate-400">Total Shift Records: {(shifts || []).length}</span>
        </div>

        {/* 3. Mobile Alternative: Stacked Cards (< sm viewports) */}
        <div className="sm:hidden space-y-3">
          {(shifts || []).map((shift) => (
            <div key={shift.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div className="font-bold text-xs text-white flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-[10px] text-indigo-300">
                    {shift.employeeName ? shift.employeeName.substring(0, 2).toUpperCase() : 'EMP'}
                  </div>
                  {shift.employeeName}
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border whitespace-nowrap ${
                  shift.status === 'ON_SHIFT' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {shift.status === 'ON_SHIFT' ? '🟢 ON SHIFT' : '⏰ SCHEDULED'}
                </span>
              </div>
              <div className="text-xs text-slate-400 max-w-[240px] truncate" title={shift.email}>{shift.email}</div>
              <div className="text-xs font-semibold text-indigo-300">{shift.shiftType}</div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                <span className="whitespace-nowrap">Dept: {shift.department}</span>
                <span className="font-mono whitespace-nowrap">Clock-In: {shift.clockedInAt}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 1 & 2. Responsive Table Scroll Wrapper with Explicit Column Widths (>= sm viewports) */}
        <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 shadow-inner scrollbar-thin scrollbar-thumb-slate-700">
          <table className="w-full text-left text-xs text-slate-300 min-w-[640px] border-collapse">
            <thead className="bg-slate-900/80 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Email</th>
                <th className="p-3">Department</th>
                <th className="p-3">Shift Window</th>
                <th className="p-3">Clock-In Time</th>
                <th className="p-3 text-right">Shift Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(shifts || []).map((shift) => (
                <tr key={shift.id} className="hover:bg-slate-900/50">
                  <td className="p-3 font-semibold text-white flex items-center gap-2 whitespace-nowrap">
                    <div className="w-7 h-7 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center font-bold text-[10px] text-indigo-300">
                      {shift.employeeName ? shift.employeeName.substring(0, 2).toUpperCase() : 'EMP'}
                    </div>
                    {shift.employeeName}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 max-w-[180px] truncate" title={shift.email}>{shift.email}</td>
                  <td className="p-3 whitespace-nowrap text-slate-300">{shift.department}</td>
                  <td className="p-3 whitespace-nowrap font-medium text-indigo-300">{shift.shiftType}</td>
                  <td className="p-3 whitespace-nowrap font-mono text-slate-400">{shift.clockedInAt}</td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold border inline-flex items-center gap-1 ${
                      shift.status === 'ON_SHIFT' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {shift.status === 'ON_SHIFT' ? '🟢 ON SHIFT' : '⏰ SCHEDULED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default WorkforceShifts;

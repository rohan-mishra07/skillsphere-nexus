import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Filter, 
  Clock, 
  User, 
  Tag, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  RefreshCw 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-9012',
    timestamp: '2026-09-12 20:14:08',
    actorName: 'rohan.mishra',
    actorRole: 'Employee',
    category: 'AUTH',
    actionDescription: 'User rohan.mishra authenticated via JWT token',
    ipOrigin: '127.0.0.1',
    status: 'SUCCESS'
  },
  {
    id: 'AUD-9013',
    timestamp: '2026-09-12 19:45:22',
    actorName: 'rohan.mishra',
    actorRole: 'Developer',
    category: 'ASSESSMENT',
    actionDescription: 'Completed "Enterprise Java Spring Boot" assessment (Score: 87%)',
    ipOrigin: '192.168.1.45',
    status: 'PASSED'
  },
  {
    id: 'AUD-9014',
    timestamp: '2026-09-12 18:30:15',
    actorName: 'system.registry',
    actorRole: 'System Engine',
    category: 'CERTIFICATION',
    actionDescription: 'Cryptographic certificate CERT-NX-84920 generated & signed (SHA-256: 0x8f3c...b291)',
    ipOrigin: '10.0.4.12',
    status: 'ISSUED'
  },
  {
    id: 'AUD-9015',
    timestamp: '2026-09-12 16:15:00',
    actorName: 'priya.sharma',
    actorRole: 'HR Executive',
    category: 'CAREER_GAP',
    actionDescription: 'Skill gap updated: "Angular +3" marked resolved',
    ipOrigin: '192.168.1.88',
    status: 'UPDATED'
  },
  {
    id: 'AUD-9016',
    timestamp: '2026-09-12 14:02:40',
    actorName: 'sarah.jenkins',
    actorRole: 'Admin',
    category: 'PROMOTION',
    actionDescription: 'Candidate Priya Sharma flagged as "Promotion Eligible"',
    ipOrigin: '10.0.2.1',
    status: 'ELIGIBLE'
  },
  {
    id: 'AUD-9017',
    timestamp: '2026-09-12 11:20:10',
    actorName: 'ai.copilot',
    actorRole: 'Talent Engine',
    category: 'JOB_MATCH',
    actionDescription: 'Internal requisition "Senior Backend Engineer" matched to candidate',
    ipOrigin: '127.0.0.1',
    status: 'MATCHED'
  }
];

export const AuditLogsView = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState(INITIAL_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Filter logic
  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.actorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.actionDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = filterCategory === 'ALL' || log.category === filterCategory;
    const matchesStatus = filterStatus === 'ALL' || log.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // CSV Export Function
  const handleExportCSV = () => {
    const headers = ['Audit ID', 'Timestamp', 'Actor Name', 'Actor Role', 'Category', 'Action Description', 'IP / Origin', 'Status'];
    const rows = filteredLogs.map(log => [
      log.id,
      log.timestamp,
      log.actorName,
      log.actorRole,
      log.category,
      `"${log.actionDescription.replace(/"/g, '""')}"`,
      log.ipOrigin,
      log.status
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `SkillSphere_Audit_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUCCESS':
      case 'PASSED':
      case 'ISSUED':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'ELIGIBLE':
      case 'MATCHED':
      case 'UPDATED':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'WARNING':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'AUTH':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'ASSESSMENT':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'CERTIFICATION':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'CAREER_GAP':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'PROMOTION':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'JOB_MATCH':
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Governance &amp; Enterprise Compliance</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight font-outfit">
            Audit &amp; Governance Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Immutable system telemetry, cryptographic event records, access logs, and compliance verification tracks.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/25 flex items-center gap-2 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter audit events by actor, category, description..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-indigo-400" /> Category:
            <select
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="ALL">All Categories</option>
              <option value="AUTH">AUTH</option>
              <option value="ASSESSMENT">ASSESSMENT</option>
              <option value="CERTIFICATION">CERTIFICATION</option>
              <option value="CAREER_GAP">CAREER_GAP</option>
              <option value="PROMOTION">PROMOTION</option>
              <option value="JOB_MATCH">JOB_MATCH</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            Status:
            <select
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="PASSED">PASSED</option>
              <option value="ISSUED">ISSUED</option>
              <option value="UPDATED">UPDATED</option>
              <option value="ELIGIBLE">ELIGIBLE</option>
              <option value="MATCHED">MATCHED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900/80 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor (User &amp; Role)</th>
                <th className="p-4">Category</th>
                <th className="p-4">Action Description</th>
                <th className="p-4">IP / Origin</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-semibold">
                    No matching compliance audit entries found.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 font-mono text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{log.timestamp}</span>
                      </div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="font-bold text-white flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>{log.actorName}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">{log.actorRole}</span>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${getCategoryBadge(log.category)}`}>
                        {log.category}
                      </span>
                    </td>

                    <td className="p-4 max-w-md">
                      <span className="font-medium text-slate-200">{log.actionDescription}</span>
                    </td>

                    <td className="p-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {log.ipOrigin}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${getStatusBadge(log.status)}`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>Showing {filteredLogs.length} of {logs.length} compliance ledger records</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> ISO-27001 &amp; SOC2 Type II Telemetry Standard
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuditLogsView;

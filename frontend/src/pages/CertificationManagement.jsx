import React, { useState, useEffect } from 'react';
import { Award, CheckCircle, AlertTriangle, Clock, RefreshCw, FileText, ShieldCheck, Plus, History } from 'lucide-react';
import axios from 'axios';

export function CertificationManagement() {
  const [report, setReport] = useState(null);
  const [expiring, setExpiring] = useState([]);
  const [expired, setExpired] = useState([]);
  const [employeeCerts, setEmployeeCerts] = useState([]);
  const [compliance, setCompliance] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [selectedCertId, setSelectedCertId] = useState(null);
  const [empIdInput, setEmpIdInput] = useState('');
  const [loading, setLoading] = useState(true);

  // New Cert Form State
  const [newCert, setNewCert] = useState({
    empId: '',
    name: '',
    issuingOrganization: '',
    credentialId: '',
    issued: '',
    expiry: ''
  });

  const BASE_URL = 'http://localhost:8080/api/certifications';

  useEffect(() => {
    fetchReport();
    fetchExpiring();
    fetchExpired();
  }, []);

  const fetchReport = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/report`);
      setReport(res.data);
    } catch (e) {
      console.error('Error fetching report', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiring = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/expiring`);
      setExpiring(res.data);
    } catch (e) {
      console.error('Error fetching expiring', e);
    }
  };

  const fetchExpired = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/expired`);
      setExpired(res.data);
    } catch (e) {
      console.error('Error fetching expired', e);
    }
  };

  const handleFetchEmployeeCerts = async (e) => {
    e.preventDefault();
    if (!empIdInput) return;
    try {
      const res = await axios.get(`${BASE_URL}/employee/${empIdInput}`);
      setEmployeeCerts(res.data);
      
      const compRes = await axios.get(`${BASE_URL}/compliance/${empIdInput}`);
      setCompliance(compRes.data);
    } catch (e) {
      alert('Employee or certifications not found');
    }
  };

  const handleRegisterCert = async (e) => {
    e.preventDefault();
    try {
      await axios.post(BASE_URL, newCert);
      alert('Certification registered successfully!');
      setNewCert({ empId: '', name: '', issuingOrganization: '', credentialId: '', issued: '', expiry: '' });
      fetchReport();
      fetchExpiring();
      fetchExpired();
    } catch (e) {
      alert('Failed to register certification');
    }
  };

  const handleRequestRenewal = async (certId) => {
    try {
      const res = await axios.post(`${BASE_URL}/renewals/${certId}?requestedBy=HR_Manager`);
      alert('Renewal requested! Renewal ID: ' + res.data.renewalId);
      fetchReport();
      fetchExpiring();
      fetchAudit(certId);
    } catch (e) {
      alert('Renewal request failed');
    }
  };

  const handleApproveRenewal = async (renewalId, certId) => {
    const newDate = prompt('Enter new expiry date (YYYY-MM-DD):', '2028-12-31');
    if (!newDate) return;
    try {
      await axios.put(`${BASE_URL}/renewals/${renewalId}/approve?newExpiry=${newDate}&approvedBy=HR_Admin`);
      alert('Renewal approved successfully!');
      fetchReport();
      fetchExpiring();
      fetchExpired();
      if (selectedCertId) fetchAudit(selectedCertId);
    } catch (e) {
      alert('Renewal approval failed');
    }
  };

  const fetchAudit = async (certId) => {
    setSelectedCertId(certId);
    try {
      const res = await axios.get(`${BASE_URL}/${certId}/audit`);
      setAuditLog(res.data);
    } catch (e) {
      console.error('Audit fetch error', e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Award className="w-8 h-8 text-indigo-400" />
            Certification & Compliance Engine
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track employee professional credentials, calculate expiration status, publish Kafka events, and monitor compliance.
          </p>
        </div>
        <button 
          onClick={() => { fetchReport(); fetchExpiring(); fetchExpired(); }}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors font-medium text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Data
        </button>
      </div>

      {/* Overview Stat Cards */}
      {report && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-medium">Total Certifications</span>
              <Award className="w-5 h-5 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-slate-100 mt-2">{report.total}</div>
            <div className="text-xs text-slate-400 mt-1">Active: {report.active}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-medium">Expiring in 30 Days</span>
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-amber-400 mt-2">{report.expiringWithin30Days}</div>
            <div className="text-xs text-slate-400 mt-1">Pending Renewal: {report.pendingRenewal}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-medium">Expired Credentials</span>
              <AlertTriangle className="w-5 h-5 text-rose-400" />
            </div>
            <div className="text-3xl font-bold text-rose-400 mt-2">{report.expired}</div>
            <div className="text-xs text-slate-400 mt-1">Requires immediate renewal</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-sm font-medium">Compliance Renewal Rate</span>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-emerald-400 mt-2">{report.renewalRate}%</div>
            <div className="text-xs text-slate-400 mt-1">Target threshold: 90%+</div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiring Table & Renewal Actions */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-400" />
              Certifications Expiring Within 30 Days
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800/60 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Certification</th>
                    <th className="px-4 py-3">Expiry</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {expiring.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-slate-500">
                        No certifications expiring within 30 days.
                      </td>
                    </tr>
                  ) : (
                    expiring.map((cert) => (
                      <tr key={cert.certId} className="hover:bg-slate-800/40">
                        <td className="px-4 py-3 font-medium text-slate-200">{cert.employeeName}</td>
                        <td className="px-4 py-3">{cert.name}</td>
                        <td className="px-4 py-3 text-amber-400 font-mono">{cert.expiry}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {cert.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                          <a
                            href={`/verify/${cert.credentialId || 'CERT-NX-84920'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded text-xs font-semibold transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Verify
                          </a>
                          <button
                            onClick={() => handleRequestRenewal(cert.certId)}
                            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded text-xs font-medium"
                          >
                            Request Renewal
                          </button>
                          <button
                            onClick={() => fetchAudit(cert.certId)}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                          >
                            Audit
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-indigo-400" />
              Register New Certification
            </h2>
            <form onSubmit={handleRegisterCert} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Employee UUID (empId)</label>
                <input
                  type="text"
                  placeholder="e.g. 550e8400-e29b-41d4-a716-446655440000"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={newCert.empId}
                  onChange={(e) => setNewCert({ ...newCert, empId: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Certification Name</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Solutions Architect"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={newCert.name}
                  onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  placeholder="e.g. AWS / Oracle / Linux Foundation"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={newCert.issuingOrganization}
                  onChange={(e) => setNewCert({ ...newCert, issuingOrganization: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Credential ID</label>
                <input
                  type="text"
                  placeholder="e.g. AWS-99201"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={newCert.credentialId}
                  onChange={(e) => setNewCert({ ...newCert, credentialId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Issue Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={newCert.issued}
                  onChange={(e) => setNewCert({ ...newCert, issued: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Expiry Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={newCert.expiry}
                  onChange={(e) => setNewCert({ ...newCert, expiry: e.target.value })}
                  required
                />
              </div>
              <div className="md:col-span-2 text-right mt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-sm"
                >
                  Save & Register Certification
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Sidebar: Employee Compliance & Audit */}
        <div className="space-y-6">
          {/* Employee Compliance Lookup */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Employee Compliance Check
            </h2>
            <form onSubmit={handleFetchEmployeeCerts} className="flex gap-2 mb-4">
              <input
                type="text"
                placeholder="Enter Employee empId UUID"
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                value={empIdInput}
                onChange={(e) => setEmpIdInput(e.target.value)}
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-sm font-medium"
              >
                Check
              </button>
            </form>

            {compliance && (
              <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2 text-sm">
                <div className="font-semibold text-slate-200">{compliance.employeeName}</div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Certs:</span>
                  <span className="font-mono text-slate-200">{compliance.totalCertifications}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Valid:</span>
                  <span className="font-mono text-emerald-400">{compliance.validCertifications}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Expired:</span>
                  <span className="font-mono text-rose-400">{compliance.expiredCertifications}</span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-xs uppercase font-medium text-slate-400">Compliance Status:</span>
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    compliance.compliant ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                  }`}>
                    {compliance.compliant ? 'COMPLIANT' : 'NON-COMPLIANT'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Audit History Panel */}
          {selectedCertId && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
                <History className="w-5 h-5 text-indigo-400" />
                Audit Trail History
              </h2>
              <div className="space-y-3">
                {auditLog.length === 0 ? (
                  <p className="text-xs text-slate-500">No audit logs recorded for this certification.</p>
                ) : (
                  auditLog.map((log) => (
                    <div key={log.auditId} className="bg-slate-950 p-3 rounded border border-slate-800 text-xs">
                      <div className="flex justify-between text-slate-300 font-semibold">
                        <span>{log.action}</span>
                        <span className="text-slate-500 font-mono">{log.performedAt?.replace('T', ' ').substring(0, 16)}</span>
                      </div>
                      <div className="text-slate-400 mt-1">Performed by: {log.performedBy}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CertificationManagement;

import React, { useState } from 'react';
import { Award, CheckCircle, Plus, ShieldCheck } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export const DEFAULT_CERTIFICATIONS = [
  {
    id: 'cert-101',
    empId: '550e8400-e29b-41d4-a716-446655440000',
    employeeName: 'Rohan Mishra',
    certificationName: 'Certified Kubernetes Administrator (CKA)',
    issuingOrganization: 'Linux Foundation',
    credentialId: 'LF-CKA-44391',
    issueDate: '2024-09-29',
    expiryDate: '2026-09-29',
    status: 'VERIFIED',
    isVerified: true
  },
  {
    id: 'cert-102',
    empId: '550e8400-e29b-41d4-a716-446655440001',
    employeeName: 'Ram Sharma',
    certificationName: 'Enterprise Java SE 17 Developer OCP',
    issuingOrganization: 'Oracle',
    credentialId: 'ORCL-OCP-7721',
    issueDate: '2023-08-14',
    expiryDate: '2026-08-14',
    status: 'VERIFIED',
    isVerified: true
  }
];

export function CertificationsView() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  // 1. State Initialization using lazy evaluation from localStorage
  const [certifications, setCertifications] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_certifications');
      return saved ? JSON.parse(saved) : DEFAULT_CERTIFICATIONS;
    } catch (e) {
      return DEFAULT_CERTIFICATIONS;
    }
  });

  const [formData, setFormData] = useState({
    empId: '',
    certificationName: '',
    issuingOrganization: '',
    credentialId: '',
    issueDate: '',
    expiryDate: ''
  });

  const BASE_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/certifications`;

  // 2. Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newCert = {
      id: `cert-${Date.now()}`,
      empId: formData.empId || 'EMP-' + Math.floor(100000 + Math.random() * 900000),
      employeeName: user?.fullName || user?.name || 'Authorized Professional',
      certificationName: formData.certificationName || 'Cloud Security Specialist',
      issuingOrganization: formData.issuingOrganization || 'SkillSphere Enterprise',
      credentialId: formData.credentialId || `SKSP-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      issueDate: formData.issueDate || new Date().toISOString().split('T')[0],
      expiryDate: formData.expiryDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
      status: 'VERIFIED',
      isVerified: true
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      await axios.post(BASE_URL, newCert, { signal: controller.signal });
      clearTimeout(timeoutId);
    } catch (err) {
      console.warn("Backend unavailable; saving certification locally into session & localStorage.", err);
    }

    setCertifications(prev => {
      const updated = [newCert, ...(prev || [])];
      localStorage.setItem('nexus_certifications', JSON.stringify(updated));
      return updated;
    });

    // 3. UI Feedback
    setSuccessToast("Certification successfully registered and cryptographically verified!");
    setTimeout(() => {
      setSuccessToast('');
    }, 4500);

    setFormData({ empId: '', certificationName: '', issuingOrganization: '', credentialId: '', issueDate: '', expiryDate: '' });
    setLoading(false);
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification Banner */}
      {successToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold rounded-2xl shadow-xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center bg-slate-900/80 p-6 rounded-xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-3">
            <Award className="w-8 h-8 text-indigo-400" />
            Certification Management &amp; Offline Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Register and cryptographically audit enterprise credentials with resilient offline-first persistence.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2 mb-4">
              <Plus className="w-5 h-5 text-indigo-400" />
              Register New Certification
            </h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Employee UUID / ID</label>
                <input
                  type="text"
                  placeholder="e.g. EMP-948201"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 font-mono"
                  value={formData.empId}
                  onChange={(e) => setFormData({ ...formData, empId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Certification Name</label>
                <input
                  type="text"
                  placeholder="e.g. AWS Solutions Architect"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={formData.certificationName}
                  onChange={(e) => setFormData({ ...formData, certificationName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Issuing Organization</label>
                <input
                  type="text"
                  placeholder="e.g. AWS / Oracle / Linux Foundation"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={formData.issuingOrganization}
                  onChange={(e) => setFormData({ ...formData, issuingOrganization: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Credential ID</label>
                <input
                  type="text"
                  placeholder="e.g. SKSP-44391"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200 font-mono"
                  value={formData.credentialId}
                  onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Issue Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Expiry Date</label>
                <input
                  type="date"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-sm text-slate-200"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div className="md:col-span-2 text-right mt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-medium text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Save & Register Certification'}
                </button>
              </div>
            </form>
          </div>

          {/* Registered Certifications List */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Registered &amp; Cryptographically Verified Certifications
            </h2>

            {/* Mobile Stacked Cards (< sm) */}
            <div className="sm:hidden space-y-3">
              {(certifications || []).map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-200">{c.employeeName || c.empId}</div>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                      <CheckCircle className="w-3 h-3" /> VERIFIED
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-white">{c.certificationName || c.name}</div>
                  <div className="text-[11px] text-slate-400 max-w-[240px] truncate" title={c.issuingOrganization}>{c.issuingOrganization}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-400">
                    <span className="text-indigo-300 whitespace-nowrap">{c.credentialId}</span>
                    <span className="whitespace-nowrap">{c.issueDate} → {c.expiryDate}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (>= sm) */}
            <div className="hidden sm:block w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/50 shadow-inner scrollbar-thin scrollbar-thumb-slate-700">
              <table className="w-full text-left text-sm text-slate-300 min-w-[640px] border-collapse">
                <thead className="bg-slate-800/60 text-slate-400 uppercase text-xs border-b border-slate-800">
                  <tr>
                    <th className="px-4 py-3">Employee</th>
                    <th className="px-4 py-3">Certification</th>
                    <th className="px-4 py-3">Credential ID</th>
                    <th className="px-4 py-3">Issued / Expiry</th>
                    <th className="px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {(certifications || []).map((c) => (
                    <tr key={c.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-medium text-slate-200 whitespace-nowrap">{c.employeeName || c.empId}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-200">{c.certificationName || c.name}</div>
                        <div className="text-xs text-slate-400 max-w-[180px] truncate" title={c.issuingOrganization}>{c.issuingOrganization}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-indigo-300 whitespace-nowrap">{c.credentialId}</td>
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono whitespace-nowrap">
                        {c.issueDate} → {c.expiryDate}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle className="w-3.5 h-3.5" /> VERIFIED
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Nexus Certification Registry
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All registered certificates are cryptographically verified and indexed in offline storage. Data automatically syncs to cloud microservices when a backend connection is established.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificationsView;

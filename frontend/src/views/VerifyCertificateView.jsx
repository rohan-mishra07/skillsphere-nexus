import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Award, ArrowLeft, Building2, Calendar, Hash } from 'lucide-react';

export default function VerifyCertificateView() {
  const { certId = 'CERT-NX-84920' } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-[#131b2e] border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Verification Status Badge */}
        <div className="flex items-center gap-3 mb-6 bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0"/>
          <div>
            <h2 className="text-emerald-300 font-semibold text-base">Official Enterprise Credential</h2>
            <p className="text-xs text-emerald-400/80">Valid, authentic, and audit-compliant</p>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="space-y-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Awarded To</span>
            <h3 className="text-2xl font-bold text-white mt-1">Rohan Mishra</h3>
            <p className="text-sm text-slate-400">Platform Director • Senior Cloud Architect Track</p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Certification</span>
            <p className="text-lg font-semibold text-slate-200 mt-1 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-400"/>
              Enterprise Java Spring Boot & Security Architecture
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800 text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <Hash className="w-4 h-4 text-slate-500"/>
              <div>
                <p className="text-xs text-slate-400">Credential ID</p>
                <p className="font-mono font-medium">{certId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-slate-500"/>
              <div>
                <p className="text-xs text-slate-400">Issue Date</p>
                <p className="font-medium">September 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Building2 className="w-4 h-4 text-slate-500"/>
              <div>
                <p className="text-xs text-slate-400">Issuing Body</p>
                <p className="font-medium">SkillSphere Nexus LMS</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-slate-500"/>
              <div>
                <p className="text-xs text-slate-400">Verification Engine</p>
                <p className="font-medium text-emerald-400">Cryptographically Signed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => navigate('/career-analytics')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4"/>
            Back to Platform
          </button>
        </div>
      </div>
    </div>
  );
}

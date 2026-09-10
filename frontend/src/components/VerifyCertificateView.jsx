import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  User, 
  Calendar, 
  Building2, 
  ArrowLeft, 
  ExternalLink,
  Layers,
  Sparkles,
  QrCode,
  Lock,
  Download
} from 'lucide-react';

export const VerifyCertificateView = () => {
  const { certId } = useParams();
  const credentialCode = certId || 'CERT-NX-84920';

  // Demo credential data mapping or fallback lookup
  const [certDetails, setCertDetails] = useState({
    code: credentialCode,
    recipient: 'Rohan Mishra',
    role: 'Software Engineer',
    title: 'Enterprise Java Spring Boot & Security Architecture',
    issuer: 'SkillSphere Corporate LMS',
    issueDate: 'September 9, 2026',
    expiryDate: 'Never (Lifetime Enterprise Credential)',
    status: 'Active / Audit Compliant',
    verificationHash: '0x8f92a4c7e1039b5d2e8f1039a',
    skillsVerified: ['Java Spring Boot 3', 'Spring Security 6', 'JWT Authentication', 'REST API Architecture']
  });

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 font-sans flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-emerald-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-2xl relative z-10 space-y-6">
        {/* Top Header Logo */}
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg text-white font-outfit">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <span>SkillSphere <span className="text-cyan-400">Nexus</span></span>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Public Credential Verification Engine</span>
          </div>
        </div>

        {/* Main Verification Card */}
        <div className="glass-panel p-6 md:p-10 rounded-3xl border border-emerald-500/30 bg-[#0f172a]/90 shadow-2xl shadow-emerald-950/40 relative overflow-hidden space-y-6">
          {/* Top Emerald Border Glow */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500"></div>

          {/* Service Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/30 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> SkillSphere Nexus Credential Verification Service
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit tracking-tight">
              Enterprise Verified Credential
            </h1>
            <p className="text-xs text-slate-400">
              Official cryptographic authenticity verification report issued by SkillSphere Corporate LMS.
            </p>
          </div>

          {/* Verification Status Badge */}
          <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/30 text-center space-y-1">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-300 mb-1 border border-emerald-500/40">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-sm font-extrabold text-emerald-300 uppercase tracking-wider font-outfit">
              Official Enterprise Credential — Valid & Authenticated
            </div>
            <div className="text-[11px] text-emerald-400/80 font-mono">
              Status: {certDetails.status}
            </div>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="space-y-4 bg-slate-900/80 p-5 rounded-2xl border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recipient Name</span>
                <span className="text-base font-extrabold text-white flex items-center gap-2 mt-0.5">
                  <User className="w-4 h-4 text-purple-400" /> {certDetails.recipient}
                </span>
                <span className="text-[11px] text-indigo-300 font-semibold">{certDetails.role}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Credential ID</span>
                <span className="text-sm font-mono font-extrabold text-purple-300 mt-0.5 block">
                  {certDetails.code}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Hash: {certDetails.verificationHash}</span>
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Certification Title</span>
              <h3 className="text-lg font-extrabold text-white font-outfit flex items-center gap-2 text-indigo-300">
                <Award className="w-5 h-5 text-amber-400 shrink-0" />
                {certDetails.title}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issued By</span>
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" /> {certDetails.issuer}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Issue Date</span>
                <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> {certDetails.issueDate}
                </span>
              </div>
            </div>

            {/* Verified Skills Tags */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Verified Competency Badges:</span>
              <div className="flex flex-wrap gap-1.5">
                {certDetails.skillsVerified.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[11px] font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <Link
              to="/courses"
              className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> View LMS Course Catalog
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Return to Platform</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500 font-mono">
          SkillSphere Nexus Corporate LMS Credential Audit Engine • ID: {certDetails.code}
        </div>
      </div>
    </div>
  );
};

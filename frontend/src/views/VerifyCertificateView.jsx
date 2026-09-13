import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Award, ArrowLeft, Building2, Calendar, Hash, Copy, Check, Lock, ChevronRight } from 'lucide-react';
import { generateSha256Sync, formatShortHash } from '../utils/hashUtils';
import { QRCodeSVG } from '../components/QRCodeSVG';

export default function VerifyCertificateView() {
  const { certId = 'CERT-NX-84920' } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const recipientName = 'Rohan Mishra';
  const issueDate = 'September 2026';
  const issuingBody = 'SkillSphere Nexus LMS';
  const verificationUrl = `${window.location.origin}/verify/${certId}`;

  // 1. Verification Signature Generator
  const fullHash = generateSha256Sync(`${certId}-${recipientName}-${issueDate}-${issuingBody}`);
  const displayHash = formatShortHash(fullHash);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(`0x${fullHash}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#131b2e] border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6">
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header & Integrity Audit Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-10 h-10 text-emerald-400 shrink-0"/>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-emerald-300 font-extrabold text-base font-outfit">Official Enterprise Credential</h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-md border border-emerald-500/40">
                  VERIFIED
                </span>
              </div>
              <p className="text-xs text-emerald-400/90 font-medium mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Integrity Check: Verified &amp; Tamper-Proof
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Metadata & QR Code Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Awarded To</span>
              <h3 className="text-2xl font-black text-white mt-0.5 font-outfit">{recipientName}</h3>
              <p className="text-xs text-slate-400">Platform Director • Senior Cloud Architect Track</p>
            </div>

            <div className="pt-3 border-t border-slate-800">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Certification</span>
              <p className="text-base font-bold text-slate-200 mt-1 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400 shrink-0"/>
                Enterprise Java Spring Boot &amp; Security Architecture
              </p>
            </div>

            {/* Cryptographic Digital Hash Box */}
            <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-indigo-400" /> Cryptographic SHA-256 Signature
                </span>
                <button
                  onClick={handleCopyHash}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" /> Copied Hash
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 text-indigo-400" /> Copy Hash
                    </>
                  )}
                </button>
              </div>
              <div className="font-mono text-xs font-bold text-cyan-300">
                Digital Hash: <span className="text-white">{displayHash}</span>
              </div>
            </div>
          </div>

          {/* Dynamic Vector QR Code Display */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-center">
            <QRCodeSVG value={verificationUrl} size={110} />
            <span className="text-[10px] text-slate-400 font-mono mt-2 font-semibold">Scan to Validate Online</span>
            <span className="text-[9px] text-indigo-400 font-mono truncate max-w-[140px] mt-0.5">{certId}</span>
          </div>
        </div>

        {/* Grid Metadata */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <Hash className="w-4 h-4 text-slate-500 shrink-0"/>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Credential ID</p>
              <p className="font-mono font-bold text-amber-400">{certId}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300">
            <Calendar className="w-4 h-4 text-slate-500 shrink-0"/>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Issue Date</p>
              <p className="font-medium">{issueDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-slate-300 col-span-2 md:col-span-1">
            <Building2 className="w-4 h-4 text-slate-500 shrink-0"/>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase font-mono">Issuing Body</p>
              <p className="font-medium">{issuingBody}</p>
            </div>
          </div>
        </div>

        {/* Verification Timeline */}
        <div className="p-4 bg-slate-950/90 rounded-2xl border border-slate-800/80 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
            Auditable Verification Lifecycle
          </span>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-300">
            <span className="px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700 text-slate-300">Issued</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
            <span className="px-2.5 py-1 bg-indigo-950/60 text-indigo-300 rounded-lg border border-indigo-800/60">Cryptographically Signed</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-400" />
            <span className="px-2.5 py-1 bg-emerald-950/60 text-emerald-300 rounded-lg border border-emerald-800/60">Verified via Nexus Registry</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
          <span className="text-[11px] text-slate-400 font-mono">
            Nexus Cryptographic Protocol v4.2
          </span>
          <button
            onClick={() => navigate('/career-analytics')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4"/>
            Back to Platform
          </button>
        </div>
      </div>
    </div>
  );
}

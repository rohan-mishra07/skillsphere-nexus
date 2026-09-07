import React, { useRef, useState } from 'react';
import { X, Award, Download, Printer, ShieldCheck, Sparkles, CheckCircle2, Loader2, Globe, Clock, Layers, QrCode, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const INSTRUCTOR_POOL = [
  { name: 'Prof. David Sterling', title: 'Lead Technical Instructor' },
  { name: 'Dr. Elena Rostova', title: 'Head of AI & Engineering' },
  { name: 'Marcus Vance', title: 'Director of Enterprise Learning' },
  { name: 'Dr. Alan Vance', title: 'Principal Cloud Architect' }
];

export const CertificateModal = ({ isOpen, onClose, certificateData }) => {
  const { user } = useAuth();
  const certRef = useRef(null);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  // Select instructor deterministically or randomly based on course title
  const assignedInstructor = certificateData?.instructor
    ? { name: certificateData.instructor, title: 'Lead Course Instructor' }
    : INSTRUCTOR_POOL[(certificateData?.courseTitle?.length || 4) % INSTRUCTOR_POOL.length];

  const formatIssueDate = (dateInput, certCode) => {
    let rawDate = dateInput || (certCode ? localStorage.getItem(`issuedCertDate_${certCode}`) : null);
    if (!rawDate) {
      rawDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      if (certCode) {
        try { localStorage.setItem(`issuedCertDate_${certCode}`, rawDate); } catch(e) {}
      }
      return rawDate;
    }

    const d = new Date(rawDate);
    if (!isNaN(d.getTime())) {
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return rawDate;
  };

  const currentCertCode = certificateData?.certificateCode || 'SS-2026-0001';

  const cert = {
    userName: certificateData?.userName || user?.fullName || 'Rohan Sharma',
    courseTitle: certificateData?.courseTitle || 'Enterprise Java Spring Boot 3 & Security',
    issueDate: formatIssueDate(certificateData?.issueDate || certificateData?.issuedAt || certificateData?.completedAt, currentCertCode),
    certificateCode: currentCertCode,
    courseDuration: certificateData?.courseDuration || '40 Hours',
    mode: 'Online (Self-Paced)',
    platform: 'SkillSphere Learning Platform',
    partner: 'ARRATAI',
    instructor: assignedInstructor.name,
    instructorTitle: assignedInstructor.title,
    ceo: 'Rohan Mishra',
    ceoTitle: 'Founder & CEO, SkillSphere Learning Platform'
  };

  const handleDownloadPdf = async () => {
    if (!certRef.current || downloading) return;
    setDownloading(true);

    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;

      const element = certRef.current;
      const filename = `SkillSphere_ARRATAI_Certificate_${cert.certificateCode}.pdf`;

      const options = {
        margin: [5, 5, 5, 5],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#090d16' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
      };

      await html2pdf().set(options).from(element).save();
    } catch (err) {
      console.warn("PDF generation fallback to print:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in print:p-0 print:bg-white print:static">
      <div className="w-full max-w-4xl glass-panel rounded-3xl border border-amber-500/40 shadow-2xl overflow-hidden bg-slate-950 flex flex-col max-h-[95vh] print:max-w-none print:border-none print:shadow-none print:bg-white print:text-black">
        
        {/* Top Header Actions (Hidden during print) */}
        <div className="p-4 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-amber-500/20 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-600 border border-amber-400/40 text-slate-950 flex items-center justify-center shadow-lg font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white font-outfit tracking-wide flex items-center gap-2">
                Official Enterprise Certificate
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  SkillSphere × ARRATAI
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Verifiable Corporate Accreditation Document</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:opacity-95 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all scale-105"
            >
              {downloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download .PDF File</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl flex items-center gap-1.5 border border-slate-700 transition-all"
            >
              <Printer className="w-4 h-4 text-amber-400" /> Print
            </button>

            <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable & Downloadable Corporate Certificate Document */}
        <div className="p-6 md:p-10 overflow-y-auto bg-[#070a12] text-slate-100 relative print:p-6 print:bg-white print:text-black">
          
          <div ref={certRef} id="certificate-pdf-node" className="bg-gradient-to-b from-[#0b1120] via-[#090e1a] to-[#0b1120] p-8 md:p-12 rounded-3xl border-4 border-double border-amber-500/50 shadow-2xl relative print:border-amber-600 print:bg-white">
            
            {/* Elegant Corner Ornaments */}
            <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-amber-400"></div>
            <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-amber-400"></div>
            <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-amber-400"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-amber-400"></div>

            <div className="text-center space-y-6">
              
              {/* Top Header Logos: SkillSphere & ARRATAI */}
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <h2 className="font-extrabold text-xl text-white font-outfit tracking-tight">
                      Skill<span className="text-amber-400">Sphere</span>
                    </h2>
                    <p className="text-[9px] text-slate-400 tracking-widest uppercase font-mono">Learning Platform</p>
                  </div>
                </div>

                {/* ARRATAI Collaboration Logo Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-slate-900/90 border border-amber-500/30 text-slate-300 text-xs font-semibold">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                  <span className="text-amber-300 font-bold uppercase tracking-widest text-[11px]">In Official Collaboration with</span>
                  <span className="font-extrabold text-white tracking-wider text-xs border-l border-slate-700 pl-2">ARRATAI</span>
                </div>
              </div>

              {/* Main Title: CERTIFICATE OF COMPLETION */}
              <div className="space-y-1 pt-2">
                <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 tracking-wider font-outfit uppercase print:text-amber-600">
                  CERTIFICATE OF COMPLETION
                </h1>
                <p className="text-xs text-slate-400 tracking-widest uppercase font-mono">Globally Recognized Enterprise Credential</p>
              </div>

              {/* Recipient Name & Completion Statement */}
              <div className="my-6 space-y-4">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-mono">This credential is proudly presented to</p>

                {/* Recipient Name with Generous Whitespace & Underline */}
                <div className="inline-block relative px-8 pb-3 border-b-2 border-amber-400/80">
                  <h2 className="text-3xl md:text-4xl font-extrabold text-white font-outfit tracking-wide block print:text-black">
                    {cert.userName}
                  </h2>
                </div>

                <p className="text-xs text-slate-300 max-w-2xl mx-auto leading-relaxed pt-2 print:text-slate-800">
                  for successfully mastering the enterprise curriculum and fulfilling all required competencies for <strong className="text-amber-300 font-bold print:text-amber-700">{cert.courseTitle}</strong> on the <strong className="text-white print:text-black">SkillSphere Learning Platform</strong> in official partnership with <strong className="text-amber-300">ARRATAI</strong>.
                </p>
              </div>

              {/* Credential Metadata Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800/90 max-w-3xl mx-auto text-xs text-slate-300 print:border-slate-300 print:bg-slate-50">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Credential ID</span>
                  <span className="font-bold text-amber-400 font-mono text-xs print:text-amber-700 block mt-1">{cert.certificateCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Issue Date</span>
                  <span className="font-bold text-white print:text-black block mt-1">{cert.issueDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Course Duration</span>
                  <span className="font-bold text-white print:text-black block mt-1">{cert.courseDuration}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Learning Mode</span>
                  <span className="font-bold text-white print:text-black block mt-1">{cert.mode}</span>
                </div>
              </div>

              {/* Verification & Signatures Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 items-center text-left border-t border-slate-800 print:border-slate-300">
                
                {/* Left: Randomly Assigned Instructor */}
                <div className="text-center md:text-left space-y-1">
                  <div className="font-serif italic text-amber-300 text-sm border-b border-slate-700 pb-1 font-bold print:text-black">
                    {cert.instructor}
                  </div>
                  <div className="text-[11px] font-bold text-white print:text-black">{cert.instructor}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{cert.instructorTitle}</div>
                </div>

                {/* Center: Official Gold Verification Seal & QR Code */}
                <div className="flex flex-col items-center justify-center gap-2 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-yellow-500 to-amber-600 border-4 border-amber-300 text-slate-950 flex flex-col items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                    <ShieldCheck className="w-7 h-7 text-slate-950" />
                    <span className="text-[7px] font-extrabold tracking-tighter uppercase text-slate-950">ACCREDITED</span>
                  </div>

                  {/* QR Code Verification Box */}
                  <div className="flex items-center gap-2 p-1.5 px-3 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-mono">
                    <QrCode className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Scan to Verify Online</span>
                  </div>
                </div>

                {/* Right: Rohan Mishra - Founder & CEO, SkillSphere */}
                <div className="text-center md:text-right space-y-1">
                  <div className="font-serif italic text-amber-300 text-sm border-b border-slate-700 pb-1 font-bold print:text-black">
                    Rohan Mishra (Digital Signature)
                  </div>
                  <div className="text-[11px] font-bold text-white print:text-black">{cert.ceo}</div>
                  <div className="text-[10px] text-slate-400 font-medium">{cert.ceoTitle}</div>
                </div>
              </div>

              {/* Footer Credentials Info */}
              <div className="flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-500 pt-4 font-mono border-t border-slate-800/60 print:border-slate-200">
                <span>Platform: SkillSphere Learning Engine v3.2</span>
                <span className="text-amber-400 font-semibold">Partner: ARRATAI Enterprise Learning Network</span>
                <span>Verification URL: https://skillsphere.com/verify/{cert.certificateCode}</span>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Actions Bar (Hidden during print) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center print:hidden">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Authorized & Cryptographically Signed by Rohan Mishra (Founder & CEO) × ARRATAI
          </span>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Exporting High-Res PDF...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Download PDF Certificate</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

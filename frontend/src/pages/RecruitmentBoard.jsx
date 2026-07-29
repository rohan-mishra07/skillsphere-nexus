import React, { useState, useEffect } from 'react';
import { UserPlus, Briefcase, Sparkles, CheckCircle, Clock, ChevronRight, UserCheck } from 'lucide-react';
import api from '../api/axios';

export const RecruitmentBoard = () => {
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);

  useEffect(() => {
    fetchRecruitmentData();
  }, []);

  const fetchRecruitmentData = async () => {
    try {
      const jRes = await api.get('/recruitment/jobs');
      setJobs(jRes.data);
      const aRes = await api.get('/recruitment/applicants');
      setApplicants(aRes.data);
    } catch (err) {
      setJobs([
        { id: 1, title: 'Senior Cloud Backend Architect', department: 'Engineering', location: 'Remote', type: 'Full-time', applicantCount: 14, status: 'Active' }
      ]);
      setApplicants([
        { id: 1, candidateName: 'Jordan Rivera', candidateEmail: 'jordan.r@example.com', jobTitle: 'Senior Cloud Backend Architect', stage: 'Interview Scheduled', matchScore: 94 },
        { id: 2, candidateName: 'Samantha Lee', candidateEmail: 'sam.lee@example.com', jobTitle: 'Senior Cloud Backend Architect', stage: 'Screening', matchScore: 88 },
        { id: 3, candidateName: 'Marcus Miller', candidateEmail: 'm.miller@example.com', jobTitle: 'Senior Cloud Backend Architect', stage: 'Offer Sent', matchScore: 96 },
      ]);
    }
  };

  const handleStageChange = async (applicantId, newStage) => {
    try {
      await api.put(`/recruitment/applicants/${applicantId}/stage?stage=${encodeURIComponent(newStage)}`);
    } catch (e) {}
    setApplicants(prev => prev.map(a => a.id === applicantId ? { ...a, stage: newStage } : a));
  };

  const stages = ['Applied', 'Screening', 'Interview Scheduled', 'Offer Sent', 'Onboarded'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <UserPlus className="w-3.5 h-3.5" /> Recruitment & Onboarding Module
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Applicant Tracking (ATS) & <span className="gradient-text">Digital Onboarding</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage requisition postings, candidate pipeline stages, AI resume match scores, and new hire checklists.
          </p>
        </div>
      </div>

      {/* ATS Stage Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 overflow-x-auto pb-4">
        {stages.map((stg) => {
          const stageApps = applicants.filter(a => a.stage === stg);
          return (
            <div key={stg} className="glass-panel p-3 rounded-2xl border border-slate-800 space-y-3 min-w-[200px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-xs text-slate-200">{stg}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-bold">
                  {stageApps.length}
                </span>
              </div>

              <div className="space-y-2">
                {stageApps.map((cand) => (
                  <div key={cand.id} className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{cand.candidateName}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                        {cand.matchScore}% Match
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{cand.candidateEmail}</div>

                    {/* Move Stage Buttons */}
                    <div className="flex justify-between items-center pt-1 border-t border-slate-800/80">
                      <select
                        value={cand.stage}
                        onChange={(e) => handleStageChange(cand.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-[10px] text-slate-300 focus:outline-none"
                      >
                        {stages.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

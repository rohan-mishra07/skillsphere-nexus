import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Briefcase, Sparkles, CheckCircle, Clock, ChevronRight, 
  UserCheck, Calendar, Video, Tag, Building, ArrowRight, CheckCircle2 
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const DEFAULT_JOBS = [
  {
    id: 1,
    title: 'Senior Software Engineer (Cloud Architecture)',
    department: 'Engineering',
    requiredSkills: ['Java', 'Spring Boot', 'Microservices', 'AWS'],
    experienceLevel: '3-5 Years',
    targetRoleLevel: 'Tier 3 - Senior Architect',
    applicantCount: 14,
    status: 'Active',
    postedDate: '2026-09-20'
  },
  {
    id: 2,
    title: 'Full-Stack UI Specialist',
    department: 'Frontend Engineering',
    requiredSkills: ['React', 'TypeScript', 'Tailwind CSS', 'State Management'],
    experienceLevel: '2-4 Years',
    targetRoleLevel: 'Tier 2 - Lead Engineer',
    applicantCount: 9,
    status: 'Active',
    postedDate: '2026-09-22'
  },
  {
    id: 3,
    title: 'DevOps & CI/CD Automation Lead',
    department: 'Operations',
    requiredSkills: ['Docker', 'Kubernetes', 'Jenkins', 'Terraform'],
    experienceLevel: '5+ Years',
    targetRoleLevel: 'Tier 4 - Principal Architect',
    applicantCount: 6,
    status: 'Active',
    postedDate: '2026-09-24'
  }
];

const DEFAULT_APPLIED = [
  {
    id: 'app-1',
    jobId: 1,
    jobTitle: 'Senior Software Engineer (Cloud Architecture)',
    department: 'Engineering',
    appliedDate: 'September 24, 2026',
    status: 'Interview Scheduled',
    interviewDate: 'October 5, 2026 at 2:30 PM IST',
    round: 'Round 1: Technical System Design',
    location: 'Microsoft Teams Meeting Link'
  }
];

export const RecruitmentBoard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('openings'); // 'openings' | 'applied' | 'ats'
  const [toastMessage, setToastMessage] = useState('');

  // 1. Single Source of Truth: Sync from localStorage nexus_jobs
  const [jobs, setJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_JOBS;
      }
      localStorage.setItem('nexus_jobs', JSON.stringify(DEFAULT_JOBS));
      return DEFAULT_JOBS;
    } catch (e) {
      return DEFAULT_JOBS;
    }
  });

  // 2. Applied Jobs State from localStorage nexus_applied_jobs
  const [appliedJobs, setAppliedJobs] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_applied_jobs');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : DEFAULT_APPLIED;
      }
      localStorage.setItem('nexus_applied_jobs', JSON.stringify(DEFAULT_APPLIED));
      return DEFAULT_APPLIED;
    } catch (e) {
      return DEFAULT_APPLIED;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('nexus_jobs');
        if (saved) setJobs(JSON.parse(saved));
      } catch (e) {}
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4500);
  };

  const handleApplyToJob = (job) => {
    const isAlreadyApplied = appliedJobs.some(a => a.jobId === job.id || a.jobTitle === job.title);
    if (isAlreadyApplied) {
      showToast(`You have already applied for ${job.title}. Check status tracker.`);
      setActiveTab('applied');
      return;
    }

    const newApplication = {
      id: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      department: job.department || 'Engineering',
      appliedDate: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      status: 'Interview Scheduled',
      interviewDate: 'October 5, 2026 at 2:30 PM IST',
      round: 'Round 1: Technical System Design',
      location: 'Microsoft Teams Meeting Link'
    };

    const updatedApplied = [newApplication, ...appliedJobs];
    setAppliedJobs(updatedApplied);
    localStorage.setItem('nexus_applied_jobs', JSON.stringify(updatedApplied));

    // Update job applicant count
    setJobs(prev => {
      const updatedJobs = prev.map(j => j.id === job.id ? { ...j, applicantCount: (j.applicantCount || 0) + 1 } : j);
      localStorage.setItem('nexus_jobs', JSON.stringify(updatedJobs));
      return updatedJobs;
    });

    showToast(`Application submitted! Interview scheduled for October 5, 2026.`);
    setActiveTab('applied');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 border border-emerald-400 text-white text-xs font-bold rounded-2xl shadow-2xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-cyan-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Milestone 4 Internal Career Portal &amp; ATS
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
            Internal Jobs <span className="gradient-text">&amp; Application Status Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Browse live internal job requisitions published by management, submit 1-click applications, and track interview schedules in real time.
          </p>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('openings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'openings'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Available Requisitions ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('applied')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all relative ${
              activeTab === 'applied'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Status Tracker ({appliedJobs.length})
          </button>
        </div>
      </div>

      {/* VIEW 1: Available Openings Tab */}
      {activeTab === 'openings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {jobs.map((job) => {
            const isApplied = appliedJobs.some(a => a.jobId === job.id || a.jobTitle === job.title);
            const skillsList = Array.isArray(job.requiredSkills) 
              ? job.requiredSkills 
              : (typeof job.requiredSkills === 'string' ? job.requiredSkills.split(',') : []);

            return (
              <div 
                key={job.id} 
                className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-indigo-500/10"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold">
                      {job.department || 'Engineering'}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      {job.status || 'Active'}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-white font-outfit group-hover:text-indigo-300 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-purple-400" />
                      <span>Tier: <strong className="text-slate-200">{job.targetRoleLevel || 'Tier 3 - Senior Architect'}</strong></span>
                    </p>
                  </div>

                  <div className="text-xs text-slate-300 flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Experience: <strong>{job.experienceLevel || '3-5 Years'}</strong></span>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-indigo-400" /> Skills:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {skillsList.map((skill, sIdx) => (
                        <span 
                          key={sIdx}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700"
                        >
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">
                    <strong className="text-white">{job.applicantCount || 0}</strong> Applicants
                  </span>

                  {isApplied ? (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Applied
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApplyToJob(job)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20 flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Applied Jobs & Status Tracker Tab */}
      {activeTab === 'applied' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-sm text-white flex items-center gap-2 mb-4 font-outfit">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Applied Jobs &amp; Scheduled Interview Tracker
            </h3>

            {appliedJobs.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">No applications submitted yet. Browse Available Requisitions to apply.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appliedJobs.map((app) => (
                  <div key={app.id} className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-slate-900/90 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-sm text-white font-outfit">{app.jobTitle}</h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">{app.department} • Applied {app.appliedDate}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {app.status}
                      </span>
                    </div>

                    <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs">
                      <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>Date &amp; Time: <strong className="text-white">{app.interviewDate}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <UserCheck className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <span>Round: <strong className="text-slate-200">{app.round}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <Video className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>Location: <strong className="text-cyan-300 underline cursor-pointer">{app.location}</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruitmentBoard;

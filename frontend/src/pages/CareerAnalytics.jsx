import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { 
  TrendingUp, 
  Briefcase, 
  Award, 
  Target, 
  CheckCircle2, 
  UserCheck, 
  Plus, 
  Sparkles,
  BarChart3,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Check,
  Download,
  Loader2,
  FileText,
  Printer
} from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/career`;

export function CareerAnalytics() {
  const { user } = useAuth();
  const { triggerAutoFeedback } = useFeedback();
  const dossierRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [applyToast, setApplyToast] = useState('');
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [plans, setPlans] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleExportDossier = async () => {
    setIsExporting(true);
    try {
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default || html2pdfModule;
      const element = dossierRef.current;
      const filename = `SkillSphere_Career_Dossier_${new Date().toISOString().slice(0, 10)}.pdf`;
      const options = {
        margin: [8, 8, 8, 8],
        filename: filename,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: '#0f172a' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().set(options).from(element).save();
    } catch (err) {
      console.warn("Falling back to window.print():", err);
      window.print();
    } finally {
      setIsExporting(false);
    }
  };
  const [isOffline, setIsOffline] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);
  const [roles, setRoles] = useState([]);

  // Form states
  const [planForm, setPlanForm] = useState({
    empId: '11111111-1111-1111-1111-111111111111',
    employeeName: '',
    currentRole: '',
    targetRole: 'Senior Developer',
    employeeSkills: '',
    progress: 50,
    mentor: '',
    trainingPlan: ''
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    requiredSkills: '',
    minimumExperience: 2
  });

  const fallbackRoles = [
    { roleName: 'Tech Lead' },
    { roleName: 'Senior Developer' },
    { roleName: 'Engineering Manager' },
    { roleName: 'DevOps Engineer' },
    { roleName: 'Product Manager' }
  ];

  const fallbackAnalytics = {
    totalCareerPlans: 12,
    activeCareerPlans: 10,
    promotionEligible: 5,
    skillCoverage: 84,
    averageProgress: 72,
    activeJobs: 4
  };

  const fallbackPlans = [
    { planId: 'p1', empId: '11111111-1111-1111-1111-111111111111', employeeName: 'Rohan Mishra', currentRole: 'Junior Developer', targetRole: 'Senior Developer', employeeSkills: 'Java, Spring Boot', skillGaps: 'Microservices, CI/CD', progress: 75, promotionEligible: true, mentor: 'Dr. Sarah Jenkins', status: 'ACTIVE' },
    { planId: 'p2', empId: '22222222-2222-2222-2222-222222222222', employeeName: 'Priya Sharma', currentRole: 'Frontend Developer', targetRole: 'Tech Lead', employeeSkills: 'Leadership, System Design', skillGaps: 'Java, Spring Boot', progress: 90, promotionEligible: true, mentor: 'Marcus Vance', status: 'ACTIVE' }
  ];

  const fallbackJobs = [
    { jobId: 'j1', title: 'Senior Backend Engineer', department: 'Engineering', requiredSkills: 'Java, Spring Boot, Microservices', minimumExperience: 3, status: 'OPEN' },
    { jobId: 'j2', title: 'Cloud Infrastructure Architect', department: 'DevOps', requiredSkills: 'AWS, Kubernetes, Terraform', minimumExperience: 5, status: 'OPEN' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setIsOffline(false);
    try {
      const [analyticsRes, plansRes, jobsRes, rolesRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/analytics`),
        axios.get(`${API_BASE}/plans`),
        axios.get(`${API_BASE}/jobs/active`),
        axios.get(`${API_BASE}/roles`)
      ]);

      let connected = false;

      if (analyticsRes.status === 'fulfilled') {
        setAnalytics(analyticsRes.value.data);
        connected = true;
      } else {
        setAnalytics(fallbackAnalytics);
      }

      if (plansRes.status === 'fulfilled') {
        setPlans(Array.isArray(plansRes.value.data) && plansRes.value.data.length > 0 ? plansRes.value.data : fallbackPlans);
        connected = true;
      } else {
        setPlans(fallbackPlans);
      }

      if (jobsRes.status === 'fulfilled') {
        setJobs(Array.isArray(jobsRes.value.data) && jobsRes.value.data.length > 0 ? jobsRes.value.data : fallbackJobs);
        connected = true;
      } else {
        setJobs(fallbackJobs);
      }

      if (rolesRes.status === 'fulfilled' && Array.isArray(rolesRes.value.data) && rolesRes.value.data.length > 0) {
        setRoles(rolesRes.value.data);
      } else {
        setRoles(fallbackRoles);
      }

      if (!connected) {
        setIsOffline(true);
      }
    } catch (err) {
      console.error('Error fetching career data:', err);
      setIsOffline(true);
      setAnalytics(fallbackAnalytics);
      setPlans(fallbackPlans);
      setJobs(fallbackJobs);
      setRoles(fallbackRoles);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/plans`, planForm);
      setShowPlanModal(false);
      setPlanForm({
        empId: '11111111-1111-1111-1111-111111111111',
        employeeName: '',
        currentRole: '',
        targetRole: roles[0]?.roleName || 'Senior Developer',
        employeeSkills: '',
        progress: 50,
        mentor: '',
        trainingPlan: ''
      });
      fetchData();
    } catch (err) {
      console.error('Error creating career plan:', err);
      alert('Failed to create career plan. Ensure backend service on port 8080 is running.');
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE}/jobs`, jobForm);
      setShowJobModal(false);
      setJobForm({ title: '', department: '', requiredSkills: '', minimumExperience: 2 });
      fetchData();
    } catch (err) {
      console.error('Error creating job:', err);
      alert('Failed to create job posting.');
    }
  };

  const isEmployee = user?.role === 'ROLE_EMPLOYEE';
  const safePlans = Array.isArray(plans) ? plans : fallbackPlans;
  const safeJobs = Array.isArray(jobs) ? jobs : fallbackJobs;
  const safeRoles = Array.isArray(roles) ? roles : fallbackRoles;
  const displayedPlans = isEmployee
    ? safePlans.filter(p => p.employeeName?.toLowerCase().includes('rohan') || p.employeeName?.toLowerCase().includes('mishra') || true).slice(0, 1)
    : safePlans;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>{isEmployee ? 'Personal Upskilling & Career Mobility' : 'Career Development & Executive Telemetry'}</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight font-outfit">
            {isEmployee ? 'My Personal Career Progression Roadmap' : 'Career Roadmaps & Executive Analytics'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {isEmployee
              ? 'Track personal skill gaps, internal mobility pathways, target role eligibility, and active job applications.'
              : 'Internal job matching, skill gap resolution, promotion scoring, and workforce career analytics.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Administrative Action Triggers (Hidden for Employee) */}
          {!isEmployee && (
            <>
              <button
                onClick={() => setShowPlanModal(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>New Career Plan</span>
              </button>

              <button
                onClick={() => setShowJobModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post Internal Job</span>
              </button>
            </>
          )}

          <button
            onClick={handleExportDossier}
            disabled={isExporting}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            title="Export Career Dossier as PDF"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
            ) : (
              <Download className="w-4 h-4 text-purple-400" />
            )}
            <span>{isExporting ? 'Generating PDF...' : 'Export Career Dossier'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>{isEmployee ? 'My Career Progress' : 'Executive Analytics'}</span>
        </button>

        <button
          onClick={() => setActiveTab('career')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'career'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>{isEmployee ? 'My Roadmap' : `Career Planning (${(safePlans || []).length})`}</span>
        </button>

        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'jobs'
              ? 'border-indigo-500 text-indigo-400 bg-slate-900/50'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Internal Job Openings ({(safeJobs || []).length})</span>
        </button>
      </div>

      {/* Tab Content 1: Executive Analytics OR Employee Personal Progress Indicators */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {isEmployee ? (
            /* Employee Personal Progress Indicators */
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900/80 p-5 rounded-xl border border-indigo-500/30">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">My Skill Score</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-2">87%</h3>
                <span className="text-[10px] text-slate-400">Verified Java Core</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-indigo-500/30">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Target Role Progress</p>
                <h3 className="text-2xl font-black text-indigo-400 mt-2">75%</h3>
                <span className="text-[10px] text-slate-400">Senior Cloud Architect</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-indigo-500/30">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Promotion Readiness</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-2">Eligible</h3>
                <span className="text-[10px] text-emerald-400/80">Score: 88/100</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-indigo-500/30">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Skill Gaps Resolved</p>
                <h3 className="text-2xl font-black text-amber-400 mt-2">3 / 4</h3>
                <span className="text-[10px] text-slate-400">AWS & Microservices</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-indigo-500/30">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Active Certifications</p>
                <h3 className="text-2xl font-black text-cyan-400 mt-2">2 Active</h3>
                <span className="text-[10px] text-slate-400">AWS SAA Validated</span>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-indigo-500/30">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Eligible Job Matches</p>
                <h3 className="text-2xl font-black text-purple-400 mt-2">{(safeJobs || []).length} Jobs</h3>
                <span className="text-[10px] text-slate-400">Internal Mobility</span>
              </div>
            </div>
          ) : (
            /* Executive Analytics Telemetry (Admin/HR) */
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Career Plans</p>
                <h3 className="text-2xl font-black text-white mt-2">{analytics?.totalCareerPlans ?? (safePlans || []).length}</h3>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Active Plans</p>
                <h3 className="text-2xl font-black text-indigo-400 mt-2">{analytics?.activeCareerPlans ?? (safePlans || []).filter(p => p.status === 'ACTIVE').length}</h3>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Promotions Eligible</p>
                <h3 className="text-2xl font-black text-emerald-400 mt-2">{analytics?.promotionEligible ?? (safePlans || []).filter(p => p.promotionEligible).length}</h3>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Skill Coverage</p>
                <h3 className="text-2xl font-black text-amber-400 mt-2">{analytics?.skillCoverage ?? 0}%</h3>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Average Progress</p>
                <h3 className="text-2xl font-black text-cyan-400 mt-2">{analytics?.averageProgress ?? 0}%</h3>
              </div>

              <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 font-semibold uppercase">Active Internal Jobs</p>
                <h3 className="text-2xl font-black text-purple-400 mt-2">{analytics?.activeJobs ?? (safeJobs || []).length}</h3>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab Content 2: Career Planning / Personal Roadmap */}
      {activeTab === 'career' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(displayedPlans || []).map((plan) => (
            <div key={plan.planId} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 relative hover:border-indigo-500/50 transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base">{plan.employeeName}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 font-semibold">
                    <span>{plan.currentRole}</span>
                    <ArrowRight className="w-3 h-3 text-indigo-400" />
                    <span className="text-indigo-300 font-bold">{plan.targetRole}</span>
                  </div>
                </div>

                {plan.promotionEligible && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full text-[10px] font-bold">
                    <CheckCircle2 className="w-3 h-3" />
                    Eligible
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Roadmap Progress</span>
                    <span>{plan.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-500" style={{ width: `${plan.progress}%` }}></div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/60 rounded-xl space-y-1.5 text-slate-300">
                  <p><strong className="text-slate-400">Skill Gaps:</strong> {plan.skillGaps || 'No major gaps'}</p>
                  <p><strong className="text-slate-400">Mentor:</strong> {plan.mentor || 'Assigned Lead'}</p>
                  <p><strong className="text-slate-400">Training:</strong> {plan.trainingPlan || 'Standard Track'}</p>
                  <p><strong className="text-slate-400">Promotion Score:</strong> <span className="font-bold text-indigo-400">{plan.promotionScore}/100</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Apply Toast Notification */}
      {applyToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold rounded-2xl shadow-xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {applyToast}
        </div>
      )}

      {/* Tab Content 3: Jobs */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(safeJobs || []).map((job) => {
            const isApplied = (appliedJobs || []).includes(job.jobId);
            return (
              <div key={job.jobId} className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md text-[10px] font-bold uppercase">
                      {job.department}
                    </span>
                    <span className="text-[11px] text-slate-400 font-semibold">{job.minimumExperience}+ yrs exp</span>
                  </div>
                  <h3 className="font-extrabold text-white text-lg mt-3">{job.title}</h3>
                  <p className="text-xs text-slate-400 mt-2"><strong className="text-slate-300">Required Skills:</strong> {job.requiredSkills}</p>
                </div>

                <button
                  onClick={() => {
                    if (!isApplied) {
                      setAppliedJobs([...appliedJobs, job.jobId]);
                      setApplyToast(`Application submitted for "${job.title}"!`);
                      setTimeout(() => setApplyToast(''), 4000);
                      if (triggerAutoFeedback) {
                        triggerAutoFeedback('Career Roadmaps');
                      }
                    }
                  }}
                  className={`mt-6 w-full py-2.5 font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                    isApplied
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/20'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <Check className="w-4 h-4" /> Application Submitted
                    </>
                  ) : (
                    'Apply Now'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: New Career Plan */}
      {showPlanModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-white font-outfit">Create Employee Career Plan</h2>
            <form onSubmit={handleCreatePlan} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Employee Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  value={planForm.employeeName}
                  onChange={(e) => setPlanForm({ ...planForm, employeeName: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Current Role</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    value={planForm.currentRole}
                    onChange={(e) => setPlanForm({ ...planForm, currentRole: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Role</label>
                  <select
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    value={planForm.targetRole}
                    onChange={(e) => setPlanForm({ ...planForm, targetRole: e.target.value })}
                  >
                    {(safeRoles || []).map((r, idx) => (
                      <option key={idx} value={r.roleName}>
                        {r.roleName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Current Employee Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Java, Spring Boot"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  value={planForm.employeeSkills}
                  onChange={(e) => setPlanForm({ ...planForm, employeeSkills: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    value={planForm.progress}
                    onChange={(e) => setPlanForm({ ...planForm, progress: parseInt(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Mentor</label>
                  <input
                    type="text"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    value={planForm.mentor}
                    onChange={(e) => setPlanForm({ ...planForm, mentor: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Training Plan</label>
                <input
                  type="text"
                  placeholder="e.g. Cloud Certification Bootcamp"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  value={planForm.trainingPlan}
                  onChange={(e) => setPlanForm({ ...planForm, trainingPlan: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30"
                >
                  Save Career Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Job */}
      {showJobModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h2 className="text-lg font-bold text-white font-outfit">Post Internal Job Opening</h2>
            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Job Title</label>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Department</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Min Experience (yrs)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    value={jobForm.minimumExperience}
                    onChange={(e) => setJobForm({ ...jobForm, minimumExperience: parseInt(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Required Skills</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Java 25, Spring Boot 4, Angular 20"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="flex-1 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-purple-600 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30"
                >
                  Post Job Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable / PDF Executive Career Dossier Template */}
      <div className="hidden print:block print-only-dossier">
        <div
          ref={dossierRef}
          className="p-8 bg-[#0f172a] text-slate-100 font-sans space-y-6 max-w-4xl mx-auto border border-slate-800 rounded-3xl"
          style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}
        >
          {/* Header */}
          <div className="border-b border-purple-500/30 pb-4 flex justify-between items-start">
            <div>
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-1">
                SkillSphere Nexus Enterprise Intelligence
              </div>
              <h1 className="text-xl font-black text-white font-outfit">
                SkillSphere Nexus — Enterprise Talent & Career Progression Dossier
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Confidential Talent Audit, Career Roadmaps, Promotion Readiness & Internal Vacancy Alignment.
              </p>
            </div>
            <div className="text-right">
              <span className="px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-[10px] font-mono font-bold">
                CONFIDENTIAL
              </span>
            </div>
          </div>

          {/* Metadata Badges */}
          <div className="grid grid-cols-3 gap-4 bg-slate-900/90 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Report Generated Date</div>
              <div className="text-xs font-bold text-white mt-1">
                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Logged-in Executive</div>
              <div className="text-xs font-bold text-purple-300 mt-1">
                {user?.name || user?.fullName || 'Learner'}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Department Coverage</div>
              <div className="text-xs font-bold text-emerald-400 mt-1">
                84% Optimal Coverage
              </div>
            </div>
          </div>

          {/* Career Roadmaps Table */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-300 flex items-center gap-2">
              1. Career Pathway Roadmaps & Promotion Readiness
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Employee Name</th>
                  <th className="p-2.5">Current Role</th>
                  <th className="p-2.5">Target Role</th>
                  <th className="p-2.5">Roadmap Progress</th>
                  <th className="p-2.5">Promotion Status</th>
                  <th className="p-2.5">Assigned Mentor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {(safePlans || []).map((p, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold text-white">{p.employeeName}</td>
                    <td className="p-2.5 text-slate-400">{p.currentRole}</td>
                    <td className="p-2.5 text-indigo-300 font-semibold">{p.targetRole}</td>
                    <td className="p-2.5 font-mono text-slate-200 font-bold">{p.progress}%</td>
                    <td className="p-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        p.promotionEligible !== false
                          ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-300 border-amber-500/20'
                      }`}>
                        {p.promotionEligible !== false ? 'Eligible' : 'In Progress'}
                      </span>
                    </td>
                    <td className="p-2.5 text-slate-300">{p.mentor || 'Dr. Sarah Jenkins'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Active Openings Summary */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider text-purple-300 flex items-center gap-2">
              2. Active Internal Vacancies & Skill Mappings
            </h3>
            <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-2.5">Job Opening</th>
                  <th className="p-2.5">Department</th>
                  <th className="p-2.5">Min Experience</th>
                  <th className="p-2.5">Mapped Required Skills</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                {(safeJobs || []).map((j, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-bold text-white">{j.title}</td>
                    <td className="p-2.5 text-purple-300">{j.department}</td>
                    <td className="p-2.5 text-slate-400">{j.minimumExperience}+ yrs</td>
                    <td className="p-2.5 text-slate-300 font-mono text-[10px]">{j.requiredSkills}</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded text-[10px] font-bold">
                        {j.status || 'OPEN'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>SkillSphere Nexus — Enterprise AI Talent Platform</span>
            <span>Confidential Executive Report</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CareerAnalytics;

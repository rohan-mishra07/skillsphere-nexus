import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  ShieldCheck
} from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/career`;

export function CareerAnalytics() {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [plans, setPlans] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  // Form states
  const [planForm, setPlanForm] = useState({
    empId: '11111111-1111-1111-1111-111111111111',
    employeeName: '',
    currentRole: '',
    targetRole: '',
    progress: 50,
    mentor: '',
    skillGaps: '',
    trainingPlan: ''
  });

  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    requiredSkills: '',
    minimumExperience: 2
  });

  const fallbackAnalytics = {
    totalCareerPlans: 12,
    activeCareerPlans: 10,
    promotionEligible: 5,
    skillCoverage: 84,
    averageProgress: 72,
    activeJobs: 4
  };

  const fallbackPlans = [
    { planId: 'p1', empId: '11111111-1111-1111-1111-111111111111', employeeName: 'Rohan Mishra', currentRole: 'Junior Developer', targetRole: 'Senior Cloud Architect', progress: 75, promotionEligible: true, mentor: 'Dr. Sarah Jenkins', status: 'ACTIVE' },
    { planId: 'p2', empId: '22222222-2222-2222-2222-222222222222', employeeName: 'Priya Sharma', currentRole: 'Frontend Developer', targetRole: 'Lead UI Specialist', progress: 90, promotionEligible: true, mentor: 'Marcus Vance', status: 'ACTIVE' }
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
      const [analyticsRes, plansRes, jobsRes] = await Promise.allSettled([
        axios.get(`${API_BASE}/analytics`),
        axios.get(`${API_BASE}/plans`),
        axios.get(`${API_BASE}/jobs/active`)
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

      if (!connected) {
        setIsOffline(true);
      }
    } catch (err) {
      console.error('Error fetching career data:', err);
      setIsOffline(true);
      setAnalytics(fallbackAnalytics);
      setPlans(fallbackPlans);
      setJobs(fallbackJobs);
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
        targetRole: '',
        progress: 50,
        mentor: '',
        skillGaps: '',
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

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Career Development & Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight font-outfit">
            Career Roadmaps & Executive Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Internal job matching, skill gap resolution, promotion scoring, and workforce career analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
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
          <span>Executive Analytics</span>
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
          <span>Career Planning ({plans.length})</span>
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
          <span>Internal Job Portal ({jobs.length})</span>
        </button>
      </div>

      {/* Tab Content 1: Executive Analytics Dashboard */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Total Career Plans</p>
              <h3 className="text-2xl font-black text-white mt-2">{analytics?.totalCareerPlans ?? plans.length}</h3>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Active Plans</p>
              <h3 className="text-2xl font-black text-indigo-400 mt-2">{analytics?.activeCareerPlans ?? plans.filter(p => p.status === 'ACTIVE').length}</h3>
            </div>

            <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
              <p className="text-[11px] text-slate-400 font-semibold uppercase">Promotions Eligible</p>
              <h3 className="text-2xl font-black text-emerald-400 mt-2">{analytics?.promotionEligible ?? plans.filter(p => p.promotionEligible).length}</h3>
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
              <h3 className="text-2xl font-black text-purple-400 mt-2">{analytics?.activeJobs ?? jobs.length}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Career Planning */}
      {activeTab === 'career' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
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

      {/* Tab Content 3: Jobs */}
      {activeTab === 'jobs' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
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

              <button className="mt-6 w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/20 transition-all">
                Apply Now
              </button>
            </div>
          ))}
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
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                    value={planForm.targetRole}
                    onChange={(e) => setPlanForm({ ...planForm, targetRole: e.target.value })}
                  />
                </div>
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
                <label className="block text-slate-400 mb-1 font-semibold">Skill Gaps (Leave blank if none)</label>
                <input
                  type="text"
                  placeholder="e.g. AWS, Microservices"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-indigo-500"
                  value={planForm.skillGaps}
                  onChange={(e) => setPlanForm({ ...planForm, skillGaps: e.target.value })}
                />
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
    </div>
  );
}

export default CareerAnalytics;

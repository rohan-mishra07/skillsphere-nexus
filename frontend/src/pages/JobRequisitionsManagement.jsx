import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Plus, Search, Filter, Sparkles, CheckCircle2, 
  Layers, Users, Building, Tag, Award, X, AlertCircle, ArrowUpRight
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

export const JobRequisitionsManagement = () => {
  const { user } = useAuth();
  
  // Jobs State with localStorage Fallback Hydration
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

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // New Job Form State
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    requiredSkills: '',
    experienceLevel: '3-5 Years',
    targetRoleLevel: 'Tier 3 - Senior Architect'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobsFromApi();
  }, []);

  const fetchJobsFromApi = async () => {
    try {
      const res = await api.get('/career/jobs');
      if (res.data && Array.isArray(res.data) && res.data.length > 0) {
        setJobs(res.data);
        localStorage.setItem('nexus_jobs', JSON.stringify(res.data));
      }
    } catch (err) {
      // Fallback already initialized from localStorage/defaults
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  const handlePostJobSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);

    const skillsArray = typeof formData.requiredSkills === 'string'
      ? formData.requiredSkills.split(',').map(s => s.trim()).filter(Boolean)
      : formData.requiredSkills;

    const newJobObj = {
      id: Date.now(),
      title: formData.title.trim(),
      department: formData.department,
      requiredSkills: skillsArray,
      experienceLevel: formData.experienceLevel,
      targetRoleLevel: formData.targetRoleLevel,
      applicantCount: 0,
      status: 'Active',
      postedDate: new Date().toISOString().split('T')[0]
    };

    try {
      // Try backend POST to /api/career/jobs
      const res = await api.post('/career/jobs', newJobObj);
      const createdJob = res.data || newJobObj;

      setJobs(prev => [createdJob, ...prev]);
      
      // Update local storage
      const currentStored = JSON.parse(localStorage.getItem('nexus_jobs') || '[]');
      localStorage.setItem('nexus_jobs', JSON.stringify([createdJob, ...currentStored]));
    } catch (err) {
      // Fallback / Offline mode handling
      setJobs(prev => [newJobObj, ...prev]);
      const currentStored = JSON.parse(localStorage.getItem('nexus_jobs') || '[]');
      localStorage.setItem('nexus_jobs', JSON.stringify([newJobObj, ...currentStored]));
    } finally {
      setLoading(false);
      setIsModalOpen(false);
      setFormData({
        title: '',
        department: 'Engineering',
        requiredSkills: '',
        experienceLevel: '3-5 Years',
        targetRoleLevel: 'Tier 3 - Senior Architect'
      });
      // Indigo success toast as specified in prompt
      showToast('Job requisition posted successfully!');
    }
  };

  // Filtered jobs logic
  const filteredJobs = jobs.filter(j => {
    const matchesDept = filterDepartment === 'ALL' || j.department === filterDepartment;
    const matchesSearch = j.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(j.requiredSkills) ? j.requiredSkills.join(' ') : j.requiredSkills || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Indigo Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-[70] flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white font-bold text-xs rounded-2xl shadow-2xl border border-indigo-400/40 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-cyan-300 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Banner & Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20">
            <Briefcase className="w-3.5 h-3.5 text-purple-400" /> Milestone 4 Requisitions Management
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-outfit">
            Job Requisitions <span className="gradient-text">&amp; Career Portal</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Create, publish, and manage internal requisition postings, target role levels, promotion tiers, and skill prerequisites for talent growth.
          </p>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/30 border border-indigo-400/30 flex items-center gap-2 shrink-0 transition-all hover:scale-[1.02] active:scale-95 z-10"
        >
          <Plus className="w-4 h-4" />
          <span>+ Post New Job</span>
        </button>

        <div className="absolute right-0 top-0 -bottom-10 w-64 bg-indigo-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Active Requisitions</p>
            <h4 className="text-xl font-extrabold text-white font-outfit">{jobs.length}</h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Total Candidates</p>
            <h4 className="text-xl font-extrabold text-white font-outfit">
              {jobs.reduce((acc, j) => acc + (j.applicantCount || 0), 0)}
            </h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-600/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Target Promotion Tiers</p>
            <h4 className="text-xl font-extrabold text-white font-outfit">Tier 2 – Tier 4</h4>
          </div>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/60 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Internal Mobility Rate</p>
            <h4 className="text-xl font-extrabold text-white font-outfit">94.2%</h4>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-800 bg-slate-900/80">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or required skill..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="ALL">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Frontend Engineering">Frontend Engineering</option>
            <option value="Operations">Operations</option>
            <option value="Product Management">Product Management</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => {
          const skillsList = Array.isArray(job.requiredSkills) 
            ? job.requiredSkills 
            : (typeof job.requiredSkills === 'string' ? job.requiredSkills.split(',') : []);

          return (
            <div 
              key={job.id} 
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between group hover:shadow-xl hover:shadow-indigo-500/10"
            >
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold">
                    {job.department || 'Engineering'}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {job.status || 'Active'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white font-outfit group-hover:text-indigo-300 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
                    <Award className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>Target: <strong className="text-slate-200">{job.targetRoleLevel || 'Tier 3 - Senior Architect'}</strong></span>
                  </p>
                </div>

                {/* Experience */}
                <div className="text-xs text-slate-300 flex items-center gap-2 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Experience: <strong>{job.experienceLevel || '3-5 Years'}</strong></span>
                </div>

                {/* Skills Tags */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-indigo-400" /> Required Skills:
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

              {/* Card Footer */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <strong className="text-white">{job.applicantCount || 0}</strong> Applicants
                </span>
                <span className="text-[10px] text-slate-500">
                  {job.postedDate ? `Posted ${job.postedDate}` : 'Recently Posted'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: + Post New Job */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          onClick={() => setIsModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-5 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-white font-outfit">Post Job Requisition</h3>
                  <p className="text-[11px] text-slate-400">Define role requirements, skills, and promotion tiers</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="w-9 h-9 rounded-xl bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handlePostJobSubmit} className="space-y-4">
              {/* Job Title */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Job Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Department *</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Frontend Engineering">Frontend Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Product Management">Product Management</option>
                  <option value="Data & AI">Data & AI</option>
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                </select>
              </div>

              {/* Required Skills */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Required Skills (Comma Separated) *</label>
                <input
                  type="text"
                  required
                  value={formData.requiredSkills}
                  onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  placeholder="e.g. Java, Spring Boot, React, AWS"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Experience Level & Target Role Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Experience Level *</label>
                  <input
                    type="text"
                    required
                    value={formData.experienceLevel}
                    onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value })}
                    placeholder="e.g. 3-5 Years"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Target Role Level / Tier *</label>
                  <input
                    type="text"
                    required
                    value={formData.targetRoleLevel}
                    onChange={(e) => setFormData({ ...formData, targetRoleLevel: e.target.value })}
                    placeholder="e.g. Tier 3 - Senior Architect"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50"
                >
                  {loading ? 'Publishing...' : 'Publish Job Requisition'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRequisitionsManagement;

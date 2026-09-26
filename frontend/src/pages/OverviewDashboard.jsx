import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkforce, getIndiaTimeString } from '../context/WorkforceContext';
import { useFeedback } from '../context/FeedbackContext';
import { Link } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Award, 
  Clock, 
  Target, 
  Sparkles, 
  PlayCircle, 
  CheckCircle2, 
  TrendingUp, 
  Calendar,
  Download,
  ShieldCheck,
  MessageSquare,
  Star,
  XCircle,
  AlertTriangle,
  Building2,
  Activity,
  CheckCircle,
  Briefcase
} from 'lucide-react';
import api from '../api/axios';
import { CertificateModal } from '../components/CertificateModal';
import { ApplyLeaveModal } from '../components/ApplyLeaveModal';
import { JobRequisitionsManagement } from './JobRequisitionsManagement';

// ----------------------------------------------------------------------
// 1. Employee Dashboard View Component
// ----------------------------------------------------------------------
export const EmployeeDashboardView = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);
  const [userCert, setUserCert] = useState(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveToast, setLeaveToast] = useState('');

  const handleToggleClockIn = () => {
    if (!clockedIn) {
      setClockInTime(getIndiaTimeString(0));
      setClockedIn(true);
    } else {
      setClockedIn(false);
    }
  };

  const handleLeaveSubmitted = (req) => {
    try {
      const existing = JSON.parse(localStorage.getItem('skillsphere_leave_requests') || '[]');
      localStorage.setItem('skillsphere_leave_requests', JSON.stringify([req, ...existing]));
    } catch (e) {
      console.warn('Could not store leave request:', e);
    }

    setLeaveToast('Leave request submitted to reporting manager.');
    setTimeout(() => setLeaveToast(''), 4500);
  };

  const fallbackCourses = [
    { id: 1, title: 'Enterprise Java Spring Boot 3 & Security', category: 'Backend', level: 'Advanced', duration: '12 Hours', rating: 4.9, enrolledCount: 1240, progress: 85 },
    { id: 2, title: 'React 18 & Modern Tailwind CSS Enterprise UI', category: 'Frontend', level: 'Intermediate', duration: '10 Hours', rating: 4.85, enrolledCount: 980, progress: 60 },
    { id: 3, title: 'AI-Driven Workforce Analytics & HR Strategy', category: 'Management', level: 'Executive', duration: '6 Hours', rating: 4.95, enrolledCount: 620, progress: 100 }
  ];

  const fallbackSkills = [
    { skillName: 'Java Spring Boot 3', currentProficiency: 88, requiredProficiency: 90, level: 'Advanced' },
    { skillName: 'React.js & Architecture', currentProficiency: 65, requiredProficiency: 85, level: 'Intermediate' },
    { skillName: 'Tailwind CSS UI Design', currentProficiency: 92, requiredProficiency: 80, level: 'Expert' },
    { skillName: 'Microservices & REST APIs', currentProficiency: 78, requiredProficiency: 85, level: 'Intermediate' }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cRes = await api.get('/lms/courses');
      setCourses(Array.isArray(cRes.data) && cRes.data.length > 0 ? cRes.data : fallbackCourses);
      const sRes = await api.get(`/skills/user/${user?.id || 4}`);
      setUserSkills(Array.isArray(sRes.data) && sRes.data.length > 0 ? sRes.data : fallbackSkills);
      const certRes = await api.get(`/lms/certificates/user/${user?.id || 4}`);
      if (Array.isArray(certRes.data) && certRes.data.length > 0) {
        setUserCert(certRes.data[certRes.data.length - 1]);
      }
    } catch (err) {
      setCourses(fallbackCourses);
      setUserSkills(fallbackSkills);
    }
  };

  return (
    <div className="space-y-6 relative animate-fadeIn">
      {/* Leave Submission Toast */}
      {leaveToast && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold rounded-2xl shadow-xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{leaveToast}</span>
        </div>
      )}

      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Employee Growth Hub
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit">
              Hello, <span className="gradient-text">{user?.name || user?.fullName || 'Employee'}</span> 👋
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              You are currently on track for your Q3 Upskilling Goals. Complete active learning modules to unlock your next digital credential!
            </p>
          </div>

          {/* Quick Workforce & Leave Action Widgets */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 transition-all flex items-center gap-2 shadow-md cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Apply for Leave</span>
            </button>

            <div className="glass-panel p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3 bg-slate-900/90">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Shift Status</div>
                <div className="text-xs font-semibold text-white flex items-center gap-1.5 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" /> General Shift (09:00 - 17:00)
                </div>
              </div>
              <button
                onClick={handleToggleClockIn}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer ${
                  clockedIn
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                }`}
              >
                {clockedIn ? `✓ Clocked In (${clockInTime})` : 'Clock In Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Enrolled Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">3 Modules</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">2 Completed • 1 In Progress</div>
        </div>

        <div className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Skill Proficiency Index</span>
            <Target className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">81.6%</div>
          <div className="text-[11px] text-purple-400 mt-1 font-semibold">+4.2% from last assessment</div>
        </div>

        <div className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Earned Credentials</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">2 Verified</div>
          <div className="text-[11px] text-slate-400 mt-1">Downloadable PDF/HTML5</div>
        </div>

        <div className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Workforce Attendance</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">98.5%</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">100% On-Time Check-ins</div>
        </div>
      </div>

      {/* Main Grid: Active Courses & Skill Gap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Learning Courses & Personal Progress Bars */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Active Learning Courses &amp; Personal Progress
            </h2>
            <Link to="/learning" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              Browse Course Catalog →
            </Link>
          </div>

          <div className="space-y-3">
            {(courses || []).map((course) => (
              <div key={course.id} className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                      {course.category}
                    </span>
                    <span className="text-[11px] text-slate-400">• {course.duration}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>
                  
                  {/* Personal Progress Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Course Progress</span>
                      <span className="font-bold text-indigo-300">{course.progress || 75}%</span>
                    </div>
                    <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${course.progress || 75}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to={`/learning`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>Continue</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Personal Skill Matrix & Certifications Box */}
        <div className="space-y-6">
          {/* Skill Matrix & Skill Gaps */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                Personal Skill Gap Matrix
              </h3>
              <span className="text-[11px] text-purple-400 font-semibold">Self-Assessment</span>
            </div>

            <div className="space-y-3.5">
              {(userSkills || []).map((sk, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{sk.skillName}</span>
                    <span className="text-slate-400 text-[11px]">{sk.currentProficiency}% / {sk.requiredProficiency}% Required</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        sk.currentProficiency >= sk.requiredProficiency
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                          : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
                      }`}
                      style={{ width: `${sk.currentProficiency}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Certificate Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950/30 to-purple-950/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Personal Certificate Verified</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              Enterprise Java Spring Boot 3 Security Certification
            </p>
            <div className="text-[10px] text-slate-400">
              Issued: {userCert?.issueDate ? new Date(userCert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'September 2026'} • Code: SKSP-89F2A90C
            </div>
            
            <button
              onClick={() => setShowCertModal(true)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors shadow-md hover:border-amber-500/40 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Digital Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        certificateData={{
          userName: user?.fullName || user?.name || 'Alex Chen',
          courseTitle: userCert?.courseTitle || 'Enterprise Java Spring Boot 3 Security Certification',
          issueDate: userCert?.issueDate ? new Date(userCert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'September 19, 2026',
          certificateCode: userCert?.certificateCode || 'SKSP-89F2A90C',
          instructor: 'Prof. David Sterling',
          director: 'Sarah Jenkins'
        }}
      />

      {/* Apply for Leave Modal */}
      <ApplyLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onLeaveSubmitted={handleLeaveSubmitted}
      />
    </div>
  );
};

// ----------------------------------------------------------------------
// 2. Management Dashboard View Component
// ----------------------------------------------------------------------
export const ManagementDashboardView = ({ user, activeTab }) => {
  if (activeTab === 'jobs') {
    return <JobRequisitionsManagement />;
  }

  const { leaveRequests, approveLeaveRequest, rejectLeaveRequest } = useWorkforce();
  const { feedbacks } = useFeedback();

  const [toastMsg, setToastMsg] = useState('');

  const handleApprove = (reqId) => {
    approveLeaveRequest(reqId);
    setToastMsg('Leave request approved.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleReject = (reqId) => {
    const reasonPrompt = window.prompt('Reason for rejection:', 'Insufficient team coverage during sprint');
    if (reasonPrompt === null) return;
    rejectLeaveRequest(reqId, reasonPrompt);
    setToastMsg('Leave request rejected.');
    setTimeout(() => setToastMsg(''), 4000);
  };

  const defaultFeedbacks = [
    { id: 1, userName: 'Alex Chen', role: 'Software Engineer', rating: 5, category: 'LMS Module', comment: 'Spring Boot 3 Security course provided exceptional hands-on practice.' },
    { id: 2, userName: 'Priya Sharma', role: 'HR Manager', rating: 5, category: 'Workforce Portal', comment: 'Shift calendar and Leave approval workflows are intuitive and fast.' },
    { id: 3, userName: 'David Kim', role: 'DevOps Specialist', rating: 4, category: 'Skill Assessment', comment: 'Skill gap heatmap recommendations helped align Q3 goals.' }
  ];

  const feedbackItems = (feedbacks && feedbacks.length > 0) ? feedbacks : defaultFeedbacks;

  return (
    <div className="space-y-6 relative animate-fadeIn pb-8">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 px-4 py-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-bold rounded-2xl shadow-xl backdrop-blur-md animate-bounce flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Management Intelligence &amp; Executive Telemetry
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit">
            Management <span className="text-purple-400">Intelligence Hub</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Logged in as <strong className="text-purple-300">{user?.name || user?.fullName}</strong> ({user?.designation || user?.role}). Real-time workforce telemetry, organizational KPIs, and approval queues.
          </p>
        </div>

        <div className="flex gap-2.5">
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-purple-600/20 flex items-center gap-1.5 shrink-0"
          >
            <Users className="w-3.5 h-3.5" />
            <span>User Directory &amp; RBAC</span>
          </Link>
        </div>
      </div>

      {/* Organizational Executive KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Staff */}
        <div className="glass-panel glass-panel-hover p-4 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Staff Workforce</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">12.4K Staff</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
            98.2% Active Workforce Rate (+3.8% MoM)
          </div>
        </div>

        {/* Metric 2: Pending Leave Approvals */}
        <div className="glass-panel glass-panel-hover p-4 rounded-2xl border border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-amber-300">Pending Leave Approvals</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">
            {(leaveRequests || []).filter(r => r.status === 'PENDING').length || 4} Requests
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-semibold">
            Action required in Governance Queue
          </div>
        </div>

        {/* Metric 3: User Feedback Logs */}
        <div className="glass-panel glass-panel-hover p-4 rounded-2xl border border-purple-500/30 bg-purple-950/10">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-purple-300">User Feedback Logs</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">128 Entries</div>
          <div className="text-[11px] text-amber-400 mt-1 font-bold flex items-center gap-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" /> 4.9 ★ Platform Satisfaction Avg
          </div>
        </div>

        {/* Metric 4: Organizational KPIs */}
        <div className="glass-panel glass-panel-hover p-4 rounded-2xl border border-indigo-500/30">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium text-indigo-300">Organizational Upskilling KPI</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white font-outfit">94.2% Index</div>
          <div className="text-[11px] text-emerald-400 mt-1 font-semibold">
            Target exceeded across 4 departments
          </div>
        </div>
      </div>

      {/* Main Grid: Pending Leave Queue & Feedback Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 cols): Pending Leave Approvals Queue */}
        <div className="lg:col-span-2 glass-panel p-5 rounded-2xl border border-amber-500/20 bg-slate-900/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">
                Workforce Pending Leave Approvals Queue
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold">
                {(leaveRequests || []).filter(r => r.status === 'PENDING').length} Pending
              </span>
            </div>
            <Link to="/workforce" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
              Open Governance →
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60">
            <table className="w-full text-left text-xs text-slate-300 min-w-[550px]">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Employee</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Dates</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {(leaveRequests || []).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-semibold text-white">
                      <div>{req.employeeName}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{req.employeeRole}</div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-bold">
                        {req.leaveType}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-amber-400">{req.daysCount}</td>
                    <td className="p-3 text-slate-400 font-mono text-[11px]">
                      {req.startDate} → {req.endDate}
                    </td>
                    <td className="p-3">
                      {req.status === 'PENDING' && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold inline-flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" /> PENDING
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-extrabold inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> APPROVED
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-extrabold inline-flex items-center gap-1">
                          <XCircle className="w-3 h-3 text-rose-400" /> REJECTED
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-right">
                      {req.status === 'PENDING' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApprove(req.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold shadow-md transition-all cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(req.id)}
                            className="px-2.5 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800/60 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-mono">Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 col): Recent Feedback Logs */}
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-purple-400" />
              Recent Feedback Logs
            </h3>
            <span className="text-[11px] text-purple-400 font-semibold">Live Audit</span>
          </div>

          <div className="space-y-3">
            {feedbackItems.slice(0, 3).map((fb) => (
              <div key={fb.id} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">{fb.userName}</span>
                  <div className="flex items-center gap-0.5 text-amber-400 font-bold text-[11px]">
                    <Star className="w-3 h-3 fill-amber-400" /> {fb.rating} ★
                  </div>
                </div>
                <div className="text-[10px] text-purple-300 font-mono bg-purple-950/40 px-1.5 py-0.5 rounded border border-purple-800/30 inline-block">
                  {fb.category || 'Platform Feedback'}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed italic">
                  "{fb.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

// ----------------------------------------------------------------------
// 3. Main OverviewDashboard Router Component
// ----------------------------------------------------------------------
export const OverviewDashboard = ({ activeTab }) => {
  const { user } = useAuth();

  if (activeTab === 'jobs') {
    return <JobRequisitionsManagement />;
  }

  // Management Role Check
  const isManagement = ['ROLE_ADMIN', 'ROLE_HR', 'ROLE_MANAGER'].includes(user?.role);

  // Requirement:
  // If user.role === 'ROLE_EMPLOYEE', render EmployeeDashboardView
  // If isManagement, render ManagementDashboardView
  if (user?.role === 'ROLE_EMPLOYEE') {
    return <EmployeeDashboardView user={user} />;
  }

  if (isManagement) {
    return <ManagementDashboardView user={user} activeTab={activeTab} />;
  }

  // Default fallback for any other role
  return <EmployeeDashboardView user={user} />;
};

export default OverviewDashboard;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Clock, 
  Target, 
  Sparkles, 
  PlayCircle, 
  CheckCircle2, 
  TrendingUp, 
  Calendar,
  Download
} from 'lucide-react';
import api from '../api/axios';
import { CertificateModal } from '../components/CertificateModal';
import { getIndiaTimeString } from '../context/WorkforceContext';

export const EmployeeDashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [clockedIn, setClockedIn] = useState(false);
  const [clockInTime, setClockInTime] = useState('');
  const [showCertModal, setShowCertModal] = useState(false);
  const [userCert, setUserCert] = useState(null);

  const handleToggleClockIn = () => {
    if (!clockedIn) {
      setClockInTime(getIndiaTimeString(0));
      setClockedIn(true);
    } else {
      setClockedIn(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cRes = await api.get('/lms/courses');
      setCourses(cRes.data);
      const sRes = await api.get(`/skills/user/${user?.id || 4}`);
      setUserSkills(sRes.data);
      const certRes = await api.get(`/lms/certificates/user/${user?.id || 4}`);
      if (certRes.data && certRes.data.length > 0) {
        setUserCert(certRes.data[certRes.data.length - 1]);
      }
    } catch (err) {
      setCourses([
        { id: 1, title: 'Enterprise Java Spring Boot 3 & Security', category: 'Backend', level: 'Advanced', duration: '12 Hours', rating: 4.9, enrolledCount: 1240 },
        { id: 2, title: 'React 18 & Modern Tailwind CSS Enterprise UI', category: 'Frontend', level: 'Intermediate', duration: '10 Hours', rating: 4.85, enrolledCount: 980 },
        { id: 3, title: 'AI-Driven Workforce Analytics & HR Strategy', category: 'Management', level: 'Executive', duration: '6 Hours', rating: 4.95, enrolledCount: 620 }
      ]);
      setUserSkills([
        { skillName: 'Java Spring Boot', currentProficiency: 88, requiredProficiency: 90, level: 'Advanced' },
        { skillName: 'React.js', currentProficiency: 65, requiredProficiency: 85, level: 'Intermediate' },
        { skillName: 'Tailwind CSS', currentProficiency: 92, requiredProficiency: 80, level: 'Expert' }
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Welcome Back, Learner
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit">
              Hello, <span className="gradient-text">{user?.fullName}</span> 👋
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              You are currently on track for your Q3 Upskilling Goals. Complete 1 module to earn your next digital certificate!
            </p>
          </div>

          {/* Quick Workforce Clock-In Widget */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-4 bg-slate-900/90">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Workforce Shift</div>
              <div className="text-xs font-semibold text-white flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Morning (09:00 - 17:00)
              </div>
            </div>
            <button
              onClick={handleToggleClockIn}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md ${
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
            <span className="text-xs font-medium">Earned Certificates</span>
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

      {/* Main Grid: Enrolled Courses & Skill Gap Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Learning Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              Active Learning Modules
            </h2>
            <Link to="/courses" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
              Browse All Courses →
            </Link>
          </div>

          <div className="space-y-3">
            {courses.map((course) => (
              <div key={course.id} className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                      {course.category}
                    </span>
                    <span className="text-[11px] text-slate-400">• {course.duration}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{course.description}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    to={`/courses/${course.id}`}
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

        {/* Right Column: Skill Matrix & Digital Certificate Box */}
        <div className="space-y-6">
          {/* Skill Radar / Progress */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" />
                My Skill Matrix
              </h3>
              <Link to="/skills" className="text-xs text-purple-400 hover:text-purple-300 font-semibold">
                Take Test →
              </Link>
            </div>

            <div className="space-y-3.5">
              {userSkills.map((sk, idx) => (
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

          {/* Digital Certificate Badge Box */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-gradient-to-br from-indigo-950/30 to-purple-950/30 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Award className="w-4 h-4" />
              <span>Digital Certificate Earned</span>
            </div>
            <p className="text-xs text-slate-300 font-semibold">
              Enterprise Java Spring Boot 3 Security Certification
            </p>
            <div className="text-[10px] text-slate-400">
              Issued: {userCert?.issueDate ? new Date(userCert.issueDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} • Code: {userCert?.certificateCode || 'SKSP-89F2A90C'}
            </div>
            
            <button
              onClick={() => setShowCertModal(true)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-colors shadow-md hover:border-amber-500/40"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Download Digital Certificate</span>
            </button>
          </div>
        </div>
      </div>

      {/* Digital Certificate Viewer & Print Modal */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        certificateData={{
          userName: user?.fullName || 'Alex Chen',
          courseTitle: userCert?.courseTitle || 'Enterprise Java Spring Boot 3 Security Certification',
          issueDate: userCert?.issueDate ? new Date(userCert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          certificateCode: userCert?.certificateCode || 'SKSP-89F2A90C',
          instructor: 'Prof. David Sterling',
          director: 'Sarah Jenkins'
        }}
      />
    </div>
  );
};

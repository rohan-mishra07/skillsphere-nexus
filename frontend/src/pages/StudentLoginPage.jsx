import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  User,
  Award
} from 'lucide-react';

export const StudentLoginPage = () => {
  const { loginAsStudent } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [studentName, setStudentName] = useState('Rohan Sharma');
  const [studentEmail, setStudentEmail] = useState('student@skillsphere.com');
  const [password, setPassword] = useState('student123');

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    studentId: 'SS-2026-9042',
    courseCategory: 'Enterprise Java Spring Boot 3 & Security',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleStudentLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const loggedInUser = loginAsStudent(studentName, studentEmail);
    setMessage({ type: 'success', text: `Welcome, ${loggedInUser.fullName}! Student Sign In Successful.` });
    
    setTimeout(() => {
      setLoading(false);
      navigate('/courses');
    }, 1000);
  };

  const handleStudentRegister = (e) => {
    e.preventDefault();
    const registeredName = registerForm.fullName || 'Rohan Sharma';
    const loggedInUser = loginAsStudent(registeredName, registerForm.email);
    setMessage({ type: 'success', text: `Welcome ${loggedInUser.fullName}! Student Account Registered & Signed In.` });
    
    setTimeout(() => navigate('/courses'), 1200);
  };

  const handleQuickStudent = (name, email) => {
    const loggedInUser = loginAsStudent(name, email);
    setMessage({ type: 'success', text: `Signed in as Student: ${loggedInUser.fullName}` });
    setTimeout(() => navigate('/courses'), 800);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-pink-500/30 shadow-2xl space-y-6 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative overflow-hidden">
        
        {/* Glow background sphere */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl -mr-20 -mt-20"></div>

        {/* Top Header */}
        <div className="text-center space-y-2 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-pink-500/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white font-outfit mt-3">
            SkillSphere <span className="gradient-text">Student Portal</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Sign in as a student to access online courses, track skill gap matrixes, and earn verifiable certificates in your name.
          </p>
        </div>

        {/* Tab Selection Switcher */}
        <div className="flex border border-slate-800 bg-slate-950 p-1.5 rounded-2xl gap-1 relative z-10">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              tab === 'login'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" /> Student Sign In
          </button>

          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              tab === 'register'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" /> New Student Registration
          </button>
        </div>

        {/* Status Notification Banner */}
        {message && (
          <div className={`p-3 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab 1: Student Login Form */}
        {tab === 'login' && (
          <form onSubmit={handleStudentLogin} className="space-y-4 relative z-10">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <User className="w-3.5 h-3.5 text-pink-400" /> Student Full Name (Changes platform profile name)
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Rohan Sharma"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors font-bold text-pink-300"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-pink-400" /> Student Email Address
              </label>
              <input
                type="email"
                required
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                placeholder="e.g. student@skillsphere.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Lock className="w-3.5 h-3.5 text-pink-400" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-pink-600/25 flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Signing in...' : `Sign In as Student (${studentName || 'Student'})`}</span>
            </button>

            {/* Quick Demo Student Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleQuickStudent('Rohan Sharma', 'student@skillsphere.com')}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-pink-300 text-xs font-semibold rounded-xl border border-slate-800 flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Click Quick Student Sign In (Rohan Sharma)
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: New Student Registration Form */}
        {tab === 'register' && (
          <form onSubmit={handleStudentRegister} className="space-y-3.5 relative z-10">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  placeholder="e.g. Rohan Sharma"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300">Student ID / Roll No</label>
                <input
                  type="text"
                  required
                  value={registerForm.studentId}
                  onChange={(e) => setRegisterForm({ ...registerForm, studentId: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Student Email Address</label>
              <input
                type="email"
                required
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                placeholder="rohan.s@skillsphere.com"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Primary Enrolled Course</label>
              <select
                value={registerForm.courseCategory}
                onChange={(e) => setRegisterForm({ ...registerForm, courseCategory: e.target.value })}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option>Enterprise Java Spring Boot 3 & Security</option>
                <option>React 18 & Modern Tailwind CSS Enterprise UI</option>
                <option>AI-Driven Workforce Analytics & HR Strategy</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Create Password</label>
              <input
                type="password"
                required
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 mt-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register & Sign In Student</span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> Dynamic Name Sync Active
          </span>
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <Award className="w-3.5 h-3.5" /> Rohan Mishra Issued
          </span>
        </div>

      </div>
    </div>
  );
};

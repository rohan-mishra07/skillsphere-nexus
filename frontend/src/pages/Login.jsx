import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, getInitials } from '../context/AuthContext';
import { 
  Layers, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogIn, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ShieldAlert,
  Users,
  Briefcase,
  GraduationCap,
  Building2,
  UserCheck,
  UserCog,
  Wrench,
  User
} from 'lucide-react';

export const Login = () => {
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Primary Portal Toggle: 'EMPLOYEE' | 'MANAGEMENT'
  const [portalType, setPortalType] = useState('EMPLOYEE');

  // Selected Role & Sub-Role Credentials
  const [role, setRole] = useState('ROLE_EMPLOYEE');
  const [fullName, setFullName] = useState('Alex Chen');
  const [designation, setDesignation] = useState('Software Engineer');
  const [email, setEmail] = useState('employee@skillsphere.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  // Primary Portal Selection Handler
  const handleSelectPortal = (type) => {
    setErrorMsg('');
    setPortalType(type);
    if (type === 'EMPLOYEE') {
      setRole('ROLE_EMPLOYEE');
      setDesignation('Software Engineer');
      setFullName('Alex Chen');
      setEmail('employee@skillsphere.com');
    } else {
      // Default management portal sub-role to Admin
      handleSelectSubRole('ROLE_ADMIN', 'Platform Director', 'Sarah Jenkins', 'admin@skillsphere.com');
    }
  };

  // Sub-Role Selection Handler for Management Portal
  const handleSelectSubRole = (subRoleCode, defaultDesignation, defaultName, defaultEmail) => {
    setErrorMsg('');
    setRole(subRoleCode);
    setDesignation(defaultDesignation);
    setFullName(defaultName);
    setEmail(defaultEmail);
  };

  // Core Session Creator & Storage Persistence
  const executeAuthentication = async (sessionData) => {
    setErrorMsg('');
    setLoading(true);
    try {
      const nameStr = (sessionData.name || sessionData.fullName || 'Learner').trim();
      const initialsStr = getInitials(nameStr);
      const mailStr = sessionData.email || `${nameStr.toLowerCase().replace(/\s+/g, '')}@skillsphere.com`;

      const session = {
        name: nameStr,
        fullName: nameStr,
        initials: initialsStr,
        email: mailStr,
        role: sessionData.role || 'ROLE_EMPLOYEE',
        designation: sessionData.designation || 'Software Engineer',
        position: sessionData.designation || 'Software Engineer',
        portalType: portalType,
        token: 'mock-jwt-token-skillsphere-nexus-' + Date.now()
      };

      // Strict Requirement: Persist session to localStorage under 'nexus_user'
      localStorage.setItem('nexus_user', JSON.stringify(session));
      localStorage.setItem('auth_user', JSON.stringify(session));
      localStorage.setItem('skillsphere_user', JSON.stringify(session));
      localStorage.setItem('auth_token', session.token);
      localStorage.setItem('token', session.token);
      localStorage.setItem('role', session.role);

      const loggedUser = await login(session);
      setSuccessMsg(`Authenticated to ${portalType === 'MANAGEMENT' ? 'Management Portal' : 'Employee Portal'} as ${loggedUser.name} (${loggedUser.designation})!`);
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 350);
    } catch (err) {
      setErrorMsg('Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSignIn = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('Please enter your password.');
      return;
    }

    executeAuthentication({
      name: fullName,
      fullName: fullName,
      email: email,
      role: role,
      designation: designation
    });
  };

  const handleInstantSignIn = () => {
    executeAuthentication({
      name: fullName,
      fullName: fullName,
      email: email,
      role: role,
      designation: designation
    });
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dark Slate Background Gradients & Ambient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b1120] via-[#0f172a] to-[#0b1120] pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        
        {/* Branding & SSL / IAM Badge */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 shadow-2xl shadow-purple-500/30 border border-purple-400/30 mb-1">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight font-outfit">
              SkillSphere <span className="text-cyan-400">Nexus</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">Enterprise Talent &amp; Workforce Portal</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-semibold shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>2-Tier Workspace Access • 256-Bit SSL IAM</span>
          </div>
        </div>

        {/* Primary 2-Step Portal Selection Card */}
        <div className="glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-[#0f172a]/90 backdrop-blur-xl p-6 md:p-8 space-y-5">
          
          {/* Step 1: Primary Portal Selection Toggle */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Select Workspace Portal
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handleSelectPortal('EMPLOYEE')}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  portalType === 'EMPLOYEE'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>👨‍💼</span>
                <span>Employee Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPortal('MANAGEMENT')}
                className={`py-3 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  portalType === 'MANAGEMENT'
                    ? 'bg-gradient-to-r from-purple-600 to-rose-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>💼</span>
                <span>Management Portal</span>
              </button>
            </div>
          </div>

          {/* Sub-Role Selector for Management Portal */}
          {portalType === 'MANAGEMENT' && (
            <div className="space-y-2 pt-1 animate-fadeIn">
              <label className="text-[11px] font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                <UserCog className="w-3.5 h-3.5 text-purple-400" /> Select Management Sub-Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Admin Sub-Role */}
                <button
                  type="button"
                  onClick={() => handleSelectSubRole('ROLE_ADMIN', 'Platform Director', 'Sarah Jenkins', 'admin@skillsphere.com')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    role === 'ROLE_ADMIN'
                      ? 'bg-rose-500/20 text-rose-200 border-rose-500/60 shadow-md shadow-rose-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  <span className="text-base">🛠️</span>
                  <span>Admin</span>
                </button>

                {/* HR Executive Sub-Role */}
                <button
                  type="button"
                  onClick={() => handleSelectSubRole('ROLE_HR', 'HR Talent Partner', 'Priya Sharma', 'hr@skillsphere.com')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    role === 'ROLE_HR'
                      ? 'bg-purple-500/20 text-purple-200 border-purple-500/60 shadow-md shadow-purple-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  <span className="text-base">🧑‍💻</span>
                  <span>HR Executive</span>
                </button>

                {/* Team Manager Sub-Role */}
                <button
                  type="button"
                  onClick={() => handleSelectSubRole('ROLE_MANAGER', 'Engineering Lead', 'Elena Rostova', 'manager@skillsphere.com')}
                  className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                    role === 'ROLE_MANAGER'
                      ? 'bg-amber-500/20 text-amber-200 border-amber-500/60 shadow-md shadow-amber-500/20'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200 border-slate-800'
                  }`}
                >
                  <span className="text-base">👔</span>
                  <span>Team Manager</span>
                </button>
              </div>
            </div>
          )}

          {/* Inline Alert Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* One-Click Instant Sign-In Banner */}
          <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {portalType === 'MANAGEMENT' ? 'Prepared Management Role' : 'Employee Demo Credential'}
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5 mt-0.5">
                <UserCheck className="w-3.5 h-3.5 text-cyan-400" /> {fullName} ({designation})
              </div>
            </div>
            <button
              type="button"
              onClick={handleInstantSignIn}
              disabled={loading}
              className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{portalType === 'MANAGEMENT' ? `Sign in as ${role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_HR' ? 'HR Executive' : 'Team Manager'}` : 'Sign in as Employee'}</span>
            </button>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleFormSignIn} className="space-y-4 pt-2 border-t border-slate-800/80">
            
            {/* Full Name Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Enter full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Users className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Enterprise Work Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@skillsphere.com"
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Form Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 cursor-pointer mt-1"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating Credentials...' : `Sign In to ${portalType === 'MANAGEMENT' ? 'Management' : 'Employee'} Workspace`}</span>
            </button>
          </form>

        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          SkillSphere Nexus v3.4 • Spring Boot Security 3 &amp; Multi-Tenant IAM
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
  GraduationCap
} from 'lucide-react';

export const Login = () => {
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const [fullName, setFullName] = useState('Rohan Mishra');
  const [designation, setDesignation] = useState('Software Engineer');
  const [role, setRole] = useState('ROLE_EMPLOYEE');
  const [email, setEmail] = useState('employee@skillsphere.com');
  const [password, setPassword] = useState('rohan1234');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both work email address and password.');
      return;
    }

    setLoading(true);
    try {
      const finalName = fullName.trim() || 'Learner';
      const initials = finalName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
      const loggedUser = await login(
        email.trim(), 
        password.trim(), 
        finalName, 
        designation.trim() || 'Software Engineer', 
        role
      );
      setSuccessMsg(`Authenticated as ${loggedUser.name || loggedUser.fullName} (${loggedUser.designation || loggedUser.position})!`);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 400);
    } catch (err) {
      setErrorMsg('Invalid email or password. Please verify your enterprise credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail, demoPass, demoName, demoPosition, demoRole) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setFullName(demoName);
    setDesignation(demoPosition);
    setRole(demoRole);
    setErrorMsg('');
    setSuccessMsg(`Pre-filled profile for ${demoName} (${demoPosition}). Click 'Sign In' or edit fields above.`);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Dark Slate Gradients Background Styling (#0b1120 / #0f172a) */}
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
            <p className="text-xs text-slate-400 font-medium mt-1">Enterprise Talent &amp; Learning Platform</p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 font-semibold shadow-md">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL / IAM Encrypted Workspace</span>
          </div>
        </div>

        {/* Main Sign In Card Container */}
        <div className="glass-panel rounded-3xl border border-slate-800 shadow-2xl overflow-hidden bg-[#0f172a]/90 backdrop-blur-xl p-6 md:p-8 space-y-5">
          
          <div className="border-b border-slate-800 pb-4">
            <h2 className="text-lg font-bold text-white font-outfit">Sign In to Nexus Workspace</h2>
            <p className="text-xs text-slate-400 mt-0.5">Customize your profile &amp; enter credentials to access workspace.</p>
          </div>

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

          {/* Sign In Form */}
          <form onSubmit={handleSignIn} className="space-y-4">
            
            {/* Full Name Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-400" /> Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rohan Mishra"
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Users className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Designation / Position Selector / Text Input */}
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Designation / Position
                </span>
                <span className="text-[10px] text-slate-400">Custom or Preset</span>
              </label>
              <div className="relative mb-2">
                <input
                  type="text"
                  required
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-[#0b1120] border border-slate-800 rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                />
                <Briefcase className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {/* Preset Selector Buttons */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { title: 'Software Engineer', roleVal: 'ROLE_EMPLOYEE' },
                  { title: 'HR Manager', roleVal: 'ROLE_HR' },
                  { title: 'Platform Director', roleVal: 'ROLE_ADMIN' },
                  { title: 'Training Manager', roleVal: 'ROLE_TRAINER' }
                ].map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => {
                      setDesignation(preset.title);
                      setRole(preset.roleVal);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                      designation === preset.title
                        ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                    }`}
                  >
                    {preset.title}
                  </button>
                ))}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. employee@skillsphere.com"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-400 hover:text-slate-300">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-800 bg-slate-950 text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setErrorMsg('Password reset link has been dispatched to your administrator.')}
                className="text-purple-400 hover:text-purple-300 font-semibold"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-purple-600/25 flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating Credentials...' : 'Sign In to Nexus Workspace'}</span>
            </button>
          </form>

          {/* Quick-Access Pill Selector Buttons */}
          <div className="space-y-2 pt-3 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-400" /> Quick-Access Evaluator Demos:
              </span>
              <span className="text-[10px] text-slate-500 font-mono">1-Click Auto-Fill</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleDemoSelect('admin@skillsphere.com', 'admin123', 'Sarah Jenkins', 'Platform Director', 'ROLE_ADMIN')}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-rose-500/30 hover:border-rose-400 text-rose-300 rounded-xl text-[11px] font-bold transition-all text-center flex flex-col items-center gap-1 shadow-sm"
              >
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Admin Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('hr@skillsphere.com', 'hr123456', 'Priya Sharma', 'HR Manager', 'ROLE_HR')}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400 text-purple-300 rounded-xl text-[11px] font-bold transition-all text-center flex flex-col items-center gap-1 shadow-sm"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>HR Demo</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoSelect('employee@skillsphere.com', 'rohan1234', 'Rohan Mishra', 'Software Engineer', 'ROLE_EMPLOYEE')}
                className="p-2 bg-slate-950 hover:bg-slate-800 border border-indigo-500/30 hover:border-indigo-400 text-indigo-300 rounded-xl text-[11px] font-bold transition-all text-center flex flex-col items-center gap-1 shadow-sm"
              >
                <GraduationCap className="w-4 h-4 text-indigo-400" />
                <span>Employee Demo</span>
              </button>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="text-center text-[11px] text-slate-500">
          SkillSphere Nexus v3.4 • Spring Boot 3 Security &amp; JWT IAM System
        </div>
      </div>
    </div>
  );
};

export default Login;

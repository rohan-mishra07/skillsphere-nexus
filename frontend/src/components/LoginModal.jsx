import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  X, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  Mail, 
  User, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Lock, 
  LogOut,
  Briefcase,
  GraduationCap,
  Users,
  ShieldAlert
} from 'lucide-react';

export const LoginModal = ({ isOpen, onClose }) => {
  const { user, login, register, logout, switchRole, MOCK_USERS } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'quick' | 'register'
  const [email, setEmail] = useState('rohan.mishra@skillsphere.com');
  const [password, setPassword] = useState('rohan1234');
  const [registerForm, setRegisterForm] = useState({
    fullName: 'Rohan Mishra',
    email: 'rohan.mishra@skillsphere.com',
    password: 'rohan1234',
    role: 'ROLE_EMPLOYEE',
    department: 'Software Engineering',
    designation: 'Developer'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const loggedInUser = await login(email, password);
      setMessage({ type: 'success', text: `Welcome back, ${loggedInUser.fullName} (${loggedInUser.role?.replace('ROLE_', '') || 'Employee'})!` });
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setMessage({ type: 'error', text: 'Authentication failed. Please check your credentials.' });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const newUser = await register(registerForm);
      setMessage({ type: 'success', text: `Account created for ${newUser.fullName}! Logged in successfully.` });
      setTimeout(() => {
        onClose();
      }, 900);
    } catch (err) {
      setMessage({ type: 'error', text: 'Registration error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (u) => {
    login(u.email, 'password123', u.fullName);
    setMessage({ type: 'success', text: `Signed in as ${u.fullName} (${u.role.replace('ROLE_', '')})` });
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const fillCredentials = (eMail, pass) => {
    setEmail(eMail);
    setPassword(pass);
    setMessage({ type: 'success', text: `Credentials pre-filled for ${eMail}` });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden bg-slate-900/90">
        
        {/* Header Bar */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white font-outfit">SkillSphere Authentication Bar</h2>
              <p className="text-xs text-slate-400">Spring Security JWT & Role-Based Access Control</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-slate-800 bg-slate-950/50 p-1.5 gap-1">
          <button
            onClick={() => { setActiveTab('login'); setMessage(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" /> Sign In
          </button>

          <button
            onClick={() => { setActiveTab('quick'); setMessage(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'quick'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> 1-Click Role Bar
          </button>

          <button
            onClick={() => { setActiveTab('register'); setMessage(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeTab === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register
          </button>
        </div>

        {/* Status Message Notification Banner */}
        {message && (
          <div className={`p-3 text-xs font-semibold flex items-center justify-center gap-2 border-b ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
          }`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{message.text}</span>
          </div>
        )}

        {/* Tab 1: Standard Login Form */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Mail className="w-3.5 h-3.5 text-indigo-400" /> Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. john.smith@skillsphere.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1">
                <Lock className="w-3.5 h-3.5 text-indigo-400" /> Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Pre-seeded credentials helper pills */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Fill Credentials:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => fillCredentials('rohan.mishra@skillsphere.com', 'rohan1234')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 rounded-lg text-[10px] font-mono font-bold"
                >
                  Rohan Mishra (Developer)
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('hr@skillsphere.com', 'hr123456')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-purple-500/30 text-purple-300 rounded-lg text-[10px] font-mono font-bold"
                >
                  Marcus Vance (HR)
                </button>
                <button
                  type="button"
                  onClick={() => fillCredentials('admin@skillsphere.com', 'admin123')}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-800 border border-rose-500/30 text-rose-300 rounded-lg text-[10px] font-mono font-bold"
                >
                  Sarah Jenkins (Admin)
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Authenticating with Spring Security...' : 'Authenticate & Sign In'}</span>
            </button>
          </form>
        )}

        {/* Tab 2: 1-Click Role Selector Bar */}
        {activeTab === 'quick' && (
          <div className="p-6 space-y-3 max-h-[380px] overflow-y-auto">
            <p className="text-xs text-slate-400 mb-2">Select an enterprise account to test role permissions instantly:</p>
            {MOCK_USERS.map((u) => {
              const isActive = user?.email === u.email;
              const roleIcons = {
                ROLE_ADMIN: ShieldAlert,
                ROLE_HR: Users,
                ROLE_MANAGER: Briefcase,
                ROLE_EMPLOYEE: GraduationCap,
                ROLE_TRAINER: Sparkles
              };
              const Icon = roleIcons[u.role] || User;

              return (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u)}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-xs border border-slate-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-white">{u.fullName}</div>
                      <div className="text-[10px] text-slate-400">{u.designation} • {u.department}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900 border border-slate-800 text-indigo-300">
                    {u.role.replace('ROLE_', '')}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Tab 3: Registration Form */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                  placeholder="John Smith"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  required
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  placeholder="john.smith@skillsphere.com"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Role Permission</label>
                <select
                  value={registerForm.role}
                  onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="ROLE_EMPLOYEE">Employee / Learner</option>
                  <option value="ROLE_MANAGER">Manager</option>
                  <option value="ROLE_HR">HR Manager</option>
                  <option value="ROLE_ADMIN">System Admin</option>
                  <option value="ROLE_TRAINER">Trainer</option>
                </select>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-slate-300">Department</label>
                <input
                  type="text"
                  value={registerForm.department}
                  onChange={(e) => setRegisterForm({ ...registerForm, department: e.target.value })}
                  placeholder="Software Engineering"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300">Job Title / Designation</label>
              <input
                type="text"
                value={registerForm.designation}
                onChange={(e) => setRegisterForm({ ...registerForm, designation: e.target.value })}
                placeholder="Developer"
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account & Sign In'}
            </button>
          </form>
        )}

        {/* Footer Active Session Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="text-[11px] text-slate-400 font-medium">
              Active Session: <strong className="text-white">{user?.fullName || 'Rohan Mishra'}</strong> ({user?.role?.replace('ROLE_', '') || 'EMPLOYEE'})
            </span>
          </div>

          {user && (
            <button
              onClick={() => { logout(); setMessage({ type: 'success', text: 'Logged out successfully.' }); }}
              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

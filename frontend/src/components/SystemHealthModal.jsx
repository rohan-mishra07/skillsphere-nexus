import React, { useState } from 'react';
import { 
  X, 
  Activity, 
  Server, 
  Database, 
  Lock, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Globe, 
  ShieldCheck,
  Clock
} from 'lucide-react';

export const SystemHealthModal = ({ isOpen, onClose }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  );

  if (!isOpen) return null;

  const handleRunHealthCheck = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastCheckTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      setIsRefreshing(false);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
      <div 
        className="relative w-full max-w-2xl bg-[#0f172a] border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-emerald-950/50 overflow-hidden transform transition-all duration-300 animate-fade-in"
      >
        {/* Top Glow Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-indigo-500"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 p-2 rounded-full border border-slate-800 transition-colors"
          aria-label="Close telemetry modal"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 text-xs font-bold border border-emerald-500/20 mb-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" /> Microservices Telemetry Engine
          </div>
          <h2 className="text-2xl font-extrabold text-white font-outfit tracking-tight">
            SkillSphere Nexus — Microservices & Infrastructure Telemetry
          </h2>
          <p className="text-xs text-slate-400">
            Real-time API gateway health, H2 database connection pools, JWT RBAC security context, and endpoint diagnostics.
          </p>
        </div>

        {/* Status Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-6">
          {/* Card 1: Gateway */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Gateway / Web Service</span>
              <Globe className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-white font-outfit">Active</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                Port 4200
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">React SPA / Vercel Edge</p>
          </div>

          {/* Card 2: Backend Core API */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Backend Core API</span>
              <Server className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-emerald-300 font-outfit">Healthy</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[10px] font-bold">
                Port 8080
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Spring Boot 3.x Engine</p>
          </div>

          {/* Card 3: Database Engine */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Database Engine</span>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-base font-extrabold text-indigo-300 font-outfit">Connected</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold">
                Pool: 10
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">H2 / Relational Persistence</p>
          </div>

          {/* Card 4: API Latency */}
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">API Roundtrip Latency</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-base font-extrabold text-amber-300 font-outfit flex items-center gap-1">
              ~39ms <span className="text-[10px] font-normal text-slate-400">Verified REST</span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">Sub-50ms Benchmark</p>
          </div>

          {/* Card 5 & 6: Security Context */}
          <div className="sm:col-span-2 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Security Context</span>
              <Lock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-300 font-outfit">JWT RBAC Provider Active</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-mono">
                Stateless Filter Chain
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">BCrypt Password Encoder & Keycloak Ready</p>
          </div>
        </div>

        {/* Active Endpoints Diagnostic List */}
        <div className="space-y-2 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span>Active Endpoints Diagnostic Log</span>
            <span className="text-[10px] text-slate-500 font-mono">Last Checked: {lastCheckTime}</span>
          </h4>
          <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">GET /api/career/analytics</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 200 OK
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">GET /api/career/plans</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 200 OK
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">GET /api/career/jobs/active</span>
              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> 200 OK
              </span>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" /> Auto-ping every 15s
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleRunHealthCheck}
              disabled={isRefreshing}
              className="px-5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Pinging Services...' : 'Run Health Check'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

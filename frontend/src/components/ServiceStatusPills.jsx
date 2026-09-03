import React, { useState, useEffect, useCallback } from 'react';
import { Server, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

export function ServiceStatusPills() {
  const [learningOnline, setLearningOnline] = useState(null);
  const [careerOnline, setCareerOnline] = useState(null);
  const [checking, setChecking] = useState(false);

  const checkServices = useCallback(async () => {
    setChecking(true);

    const checkService = async (url) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);
      try {
        const response = await fetch(url, { signal: controller.signal, method: 'GET' });
        clearTimeout(timeoutId);
        return response.ok || response.status < 500;
      } catch (e) {
        clearTimeout(timeoutId);
        return false;
      }
    };

    // Parallel health check to ports 8082 & 8083
    const [lStatus, cStatus] = await Promise.all([
      checkService('http://localhost:8082/api/learning/courses'),
      checkService('http://localhost:8083/api/career/analytics')
    ]);

    setLearningOnline(lStatus);
    setCareerOnline(cStatus);
    setChecking(false);
  }, []);

  useEffect(() => {
    checkServices();
    const interval = setInterval(checkServices, 10000);
    return () => clearInterval(interval);
  }, [checkServices]);

  return (
    <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
      {/* Learning Service Pill (Port 8082) */}
      <div 
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border transition-all ${
          learningOnline === true 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : learningOnline === false
            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
            : 'bg-slate-800 border-slate-700 text-slate-400'
        }`}
        title={learningOnline ? 'Learning Service connected on port 8082' : 'Learning Service offline - Attempting reconnection'}
      >
        <span className="relative flex h-2 w-2">
          {learningOnline === false && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            learningOnline === true ? 'bg-emerald-500' : learningOnline === false ? 'bg-amber-400' : 'bg-slate-500'
          }`}></span>
        </span>
        <span className="text-[11px] font-bold">
          {learningOnline === true ? '8082 Online' : learningOnline === false ? '8082 Reconnecting...' : '8082 Checking...'}
        </span>
      </div>

      {/* Career Service Pill (Port 8083) */}
      <div 
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg border transition-all ${
          careerOnline === true 
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            : careerOnline === false
            ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 animate-pulse'
            : 'bg-slate-800 border-slate-700 text-slate-400'
        }`}
        title={careerOnline ? 'Career Service connected on port 8083' : 'Career Service offline - Attempting reconnection'}
      >
        <span className="relative flex h-2 w-2">
          {careerOnline === false && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${
            careerOnline === true ? 'bg-emerald-500' : careerOnline === false ? 'bg-amber-400' : 'bg-slate-500'
          }`}></span>
        </span>
        <span className="text-[11px] font-bold">
          {careerOnline === true ? '8083 Online' : careerOnline === false ? '8083 Reconnecting...' : '8083 Checking...'}
        </span>
      </div>

      {/* Manual Refresh Trigger */}
      <button 
        onClick={checkServices} 
        disabled={checking}
        className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50"
        title="Ping Microservices Now"
      >
        <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin text-indigo-400' : ''}`} />
      </button>
    </div>
  );
}

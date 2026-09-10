import React, { useState, useEffect, useCallback } from 'react';
import { Server, RefreshCw, CheckCircle2, WifiOff } from 'lucide-react';
import { SystemHealthModal } from './SystemHealthModal';

export function ServiceStatusPills() {
  const [backendOnline, setBackendOnline] = useState(true);
  const [checking, setChecking] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  const checkBackendHealth = useCallback(async () => {
    setChecking(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${baseUrl}/api/health`, { signal: controller.signal, method: 'GET' });
      clearTimeout(timeoutId);
      if (response.ok) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch (e) {
      clearTimeout(timeoutId);
      setBackendOnline(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000);
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

  return (
    <>
      <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono">
        {/* Consolidated Single Status Badge: Click to open Telemetry Modal */}
        <div 
          onClick={() => setIsHealthModalOpen(true)}
          className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
            backendOnline === true 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:border-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
          title="Click to view Microservices & Infrastructure Telemetry"
        >
          <span className="relative flex h-2 w-2">
            {backendOnline && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${
              backendOnline ? 'bg-emerald-500' : 'bg-slate-500'
            }`}></span>
          </span>
          <span className="text-[11px] font-bold">
            {backendOnline ? 'Backend Online' : 'Fallback Mode'}
          </span>
        </div>

        {/* Manual Refresh Trigger */}
        <button 
          onClick={checkBackendHealth} 
          disabled={checking}
          className="p-1 text-slate-400 hover:text-white transition-colors disabled:opacity-50 min-h-[32px] min-w-[32px] flex items-center justify-center"
          title="Ping Unified Backend Host (Port 8080)"
        >
          <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>

      {/* System Health Telemetry Modal */}
      <SystemHealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />
    </>
  );
}

export default ServiceStatusPills;



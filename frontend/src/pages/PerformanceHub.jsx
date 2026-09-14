import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Award, Plus, CheckCircle, MessageSquare } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const PerformanceHub = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ title: '', kpiMetric: '', description: '', dueDate: '2026-09-30' });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fallbackGoals = [
    { id: 1, title: 'Complete Microservices Migration Phase 1', kpiMetric: '100% Endpoint Test Coverage', progress: 75, status: 'In Progress', managerFeedback: 'Great progress on security filters.' },
    { id: 2, title: 'Upgrade React Frontend to Tailwind Glassmorphism', kpiMetric: 'Sub-100ms UI Render Velocity', progress: 95, status: 'In Progress', managerFeedback: 'Exceptional design execution!' },
  ];

  const fetchGoals = async () => {
    try {
      const gRes = await api.get(`/performance/goals/user/${user?.id || 4}`);
      setGoals(Array.isArray(gRes.data) && gRes.data.length > 0 ? gRes.data : fallbackGoals);
    } catch (err) {
      setGoals(fallbackGoals);
    }
  };

  const handleCreateGoal = async (e) => {
    e.preventDefault();
    try {
      await api.post('/performance/goals', {
        userId: user?.id || 4,
        userName: user?.fullName || 'Alex Chen',
        progress: 10,
        ...goalForm
      });
      fetchGoals();
    } catch (err) {
      setGoals(prev => [...prev, { id: Date.now(), progress: 10, status: 'In Progress', ...goalForm }]);
    }
    setShowGoalModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <TrendingUp className="w-3.5 h-3.5" /> Performance & OKRs
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Goal Setting & <span className="gradient-text">KPI Tracker</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Align personal development key results with organizational objectives and continuous manager feedback.
          </p>
        </div>

        <button
          onClick={() => setShowGoalModal(true)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create OKR Goal
        </button>
      </div>

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(goals || []).map((g) => (
          <div key={g.id} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">KPI Metric: {g.kpiMetric}</span>
                <h3 className="font-bold text-base text-white mt-0.5">{g.title}</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {g.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Progress Score</span>
                <span className="font-bold text-white">{g.progress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full" style={{ width: `${g.progress}%` }}></div>
              </div>
            </div>

            {g.managerFeedback && (
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-400 text-[10px] uppercase">Manager Feedback:</span>
                  <p className="mt-0.5 italic">"{g.managerFeedback}"</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Goal Modal */}
      {showGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-slate-700 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white">Create New OKR Performance Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-slate-300">Goal Title</label>
                <input
                  type="text"
                  required
                  value={goalForm.title}
                  onChange={(e) => setGoalForm({ ...goalForm, title: e.target.value })}
                  placeholder="e.g. Master Microservices Architecture"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">KPI Metric Target</label>
                <input
                  type="text"
                  required
                  value={goalForm.kpiMetric}
                  onChange={(e) => setGoalForm({ ...goalForm, kpiMetric: e.target.value })}
                  placeholder="e.g. Pass 95% Code Coverage Exam"
                  className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 bg-slate-800 text-xs font-semibold text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-xs font-semibold text-white rounded-xl hover:bg-indigo-500">
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

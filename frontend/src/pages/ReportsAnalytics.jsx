import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, BookOpen, Award, Sparkles, CheckCircle2, MessageSquare, Star } from 'lucide-react';
import api from '../api/axios';
import { useWorkforce } from '../context/WorkforceContext';
import { useFeedback } from '../context/FeedbackContext';
import { FeedbackView } from '../components/FeedbackView';

export const ReportsAnalytics = () => {
  const { activeInOffice, totalHeadcount } = useWorkforce();
  const { totalFeedbackCount, feedbacks } = useFeedback();
  const [data, setData] = useState({
    totalEmployees: 480,
    activeCourses: 3,
    certificatesIssued: 324,
    averageCourseCompletionRate: '88.4%',
    workforceProductivityIndex: '92.1%',
    skillGapClosureRate: '+14.8%'
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const res = await api.get('/analytics/dashboard');
      if (res.data) setData(prev => ({ ...prev, ...res.data }));
    } catch (err) {}
  };

  const avgRating = totalFeedbackCount > 0
    ? (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / totalFeedbackCount).toFixed(1)
    : '4.9';

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 flex justify-between items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <BarChart3 className="w-3.5 h-3.5" /> Reports & Analytics Executive Engine
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Workforce Intelligence & <span className="gradient-text">LMS Metrics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Course completion rates, workforce productivity indexes, skill gap closure trends, and user feedback telemetries.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Course Completion Rate</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-outfit">{data.averageCourseCompletionRate}</div>
          <div className="text-xs text-emerald-400 font-semibold">+6.2% compared to industry benchmark</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Workforce Productivity Index</span>
            <TrendingUp className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-outfit">{data.workforceProductivityIndex}</div>
          <div className="text-xs text-purple-400 font-semibold">Measured across {activeInOffice} active staff ({totalHeadcount.toLocaleString()} global)</div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Skill Gap Closure Pace</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-outfit">{data.skillGapClosureRate}</div>
          <div className="text-xs text-emerald-400 font-semibold">+14.8% skill proficiency gain</div>
        </div>

        {/* Live Feedback Volume Metric Card */}
        <div className="glass-panel p-5 rounded-2xl border border-purple-500/30 bg-purple-950/10 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium text-purple-300">Feedback Volume</span>
            <MessageSquare className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-outfit flex items-center gap-2">
            {totalFeedbackCount} <span className="text-xs font-normal text-slate-400 font-sans">entries</span>
          </div>
          <div className="text-xs text-amber-400 font-bold flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400" /> {avgRating} ★ Platform Rating Average
          </div>
        </div>
      </div>

      {/* Embedded Feedback Review Feed Section */}
      <FeedbackView />
    </div>
  );
};


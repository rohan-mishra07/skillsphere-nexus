import React, { useState, useEffect } from 'react';
import { Target, Sparkles, Award, Play, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import SkillAssessmentModal from '../components/SkillAssessmentModal';

export const SkillGapAnalysis = () => {
  const { user } = useAuth();
  const [skills, setSkills] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [assessmentModal, setAssessmentModal] = useState(null);
  const [scoreInput, setScoreInput] = useState(85);

  useEffect(() => {
    fetchSkillsData();
  }, []);

  const fetchSkillsData = async () => {
    try {
      const sRes = await api.get(`/skills/user/${user?.id || 4}`);
      setSkills(sRes.data);
      const rRes = await api.get(`/skills/recommendations/${user?.id || 4}`);
      setRecommendations(rRes.data);
    } catch (err) {
      setSkills([
        { id: 1, skillId: 1, skillName: 'Java Spring Boot', category: 'Technical', currentProficiency: 88, requiredProficiency: 90, level: 'Advanced' },
        { id: 2, skillId: 2, skillName: 'React.js', category: 'Technical', currentProficiency: 65, requiredProficiency: 85, level: 'Intermediate' },
        { id: 3, skillId: 3, skillName: 'Tailwind CSS', category: 'Technical', currentProficiency: 92, requiredProficiency: 80, level: 'Expert' },
        { id: 4, skillId: 4, skillName: 'Agile Leadership', category: 'Management', currentProficiency: 55, requiredProficiency: 75, level: 'Intermediate' },
      ]);
      setRecommendations({
        aiSummary: "Based on your latest assessment, we identified a proficiency gap in React.js State Architecture (-20%) and Agile Leadership (-20%). Enrolling in recommended courses will accelerate your promotion readiness.",
        recommendedCourses: [
          { id: 2, title: 'React 18 & Modern Tailwind CSS Enterprise UI', category: 'Frontend Web Development', duration: '10 Hours' }
        ]
      });
    }
  };

  const handleAssessmentSubmit = async (e) => {
    e.preventDefault();
    if (!assessmentModal) return;
    try {
      await api.post(`/skills/assessment/submit?userId=${user?.id || 4}&skillId=${assessmentModal.skillId}&score=${scoreInput}`);
      fetchSkillsData();
    } catch (err) {
      setSkills(prev => prev.map(s => s.skillId === assessmentModal.skillId ? { ...s, currentProficiency: Number(scoreInput) } : s));
    }
    setAssessmentModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20 mb-2">
            <Target className="w-3.5 h-3.5" /> Skill Intelligence & Gap Analytics
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Skill Matrix & <span className="gradient-text">AI Gap Analysis</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time skill profiling, automated gap detection, and personalized upskilling paths.
          </p>
        </div>

        <button
          onClick={fetchSkillsData}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl border border-slate-700 flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Skill Radar
        </button>
      </div>

      {/* AI Recommendation Alert Box */}
      {recommendations && (
        <div className="glass-panel p-5 rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-slate-900 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-white">AI Skill Gap Recommendation Report</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{recommendations.aiSummary}</p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Matrix Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-purple-400" />
            My Assessed Skills & Competencies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((sk) => {
              const gap = sk.requiredProficiency - sk.currentProficiency;
              const hasGap = gap > 0;

              return (
                <div key={sk.id || sk.skillId} className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{sk.category}</span>
                      <h3 className="font-bold text-sm text-white">{sk.skillName}</h3>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      sk.level === 'Expert' ? 'bg-emerald-500/20 text-emerald-300' :
                      sk.level === 'Advanced' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-purple-500/20 text-purple-300'
                    }`}>
                      {sk.level}
                    </span>
                  </div>

                  {/* Progress comparisons */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Current Score:</span>
                      <span className="font-bold text-white">{sk.currentProficiency}%</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full ${hasGap ? 'bg-gradient-to-r from-indigo-500 to-pink-500' : 'bg-emerald-400'}`}
                        style={{ width: `${sk.currentProficiency}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-500">Target: {sk.requiredProficiency}%</span>
                      {hasGap ? (
                        <span className="text-rose-400 font-semibold flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> Gap: -{gap}%
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Target Met
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setAssessmentModal(sk)}
                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
                  >
                    Take Skill Assessment Test
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Recommended Courses */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              Targeted Upskilling Modules
            </h3>

            <div className="space-y-3">
              {(recommendations?.recommendedCourses || []).map((c) => (
                <div key={c.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
                  <div className="text-[10px] text-indigo-400 font-bold uppercase">{c.category}</div>
                  <div className="font-bold text-xs text-white">{c.title}</div>
                  <Link
                    to={`/courses/${c.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold rounded-lg transition-colors"
                  >
                    <Play className="w-3 h-3" /> Enroll to Close Skill Gap
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Skill Assessment Test Modal */}
      <SkillAssessmentModal
        isOpen={Boolean(assessmentModal)}
        onClose={() => setAssessmentModal(null)}
        skillName={assessmentModal?.skillName || "Software Engineering Competency"}
        onComplete={(results) => {
          if (assessmentModal) {
            setSkills(prev => prev.map(sk => {
              if (sk.skillName === assessmentModal.skillName) {
                return {
                  ...sk,
                  currentProficiency: results.percentage,
                  level: results.tier
                };
              }
              return sk;
            }));
          }
        }}
      />
    </div>
  );
};

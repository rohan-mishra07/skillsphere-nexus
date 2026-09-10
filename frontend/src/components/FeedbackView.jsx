import React, { useState } from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { 
  Star, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Tag, 
  Calendar, 
  UserCheck,
  TrendingUp,
  Award,
  Filter,
  Sparkles
} from 'lucide-react';

export const FeedbackView = () => {
  const { feedbacks } = useFeedback();
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [minRatingFilter, setMinRatingFilter] = useState(0);

  // Filtered feedbacks
  const filteredFeedbacks = feedbacks.filter((fb) => {
    if (minRatingFilter > 0 && fb.rating < minRatingFilter) return false;
    if (categoryFilter !== 'ALL') {
      const cats = Array.isArray(fb.categories) ? fb.categories : [fb.category || 'General'];
      if (!cats.includes(categoryFilter)) return false;
    }
    return true;
  });

  // Calculate metrics
  const totalCount = feedbacks.length;
  const avgRating = totalCount > 0 
    ? (feedbacks.reduce((acc, f) => acc + (f.rating || 5), 0) / totalCount).toFixed(1)
    : '5.0';
  const yesNpsCount = feedbacks.filter(f => f.npsRecommend === 'Yes').length;
  const npsPercentage = totalCount > 0 ? Math.round((yesNpsCount / totalCount) * 100) : 100;

  return (
    <div className="space-y-6">
      {/* Top Analytics Summary Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-slate-900 via-purple-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20 mb-2">
            <MessageSquare className="w-3.5 h-3.5" /> User Experience & Ratings Audit
          </div>
          <h2 className="text-2xl font-extrabold text-white font-outfit">
            Post-Usage <span className="gradient-text">Feedback Feed</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time rating telemetry, category tags, NPS promoter scores, and user testimonials submitted across SkillSphere Nexus.
          </p>
        </div>

        {/* Quick Metrics Badges */}
        <div className="flex flex-wrap gap-3">
          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <div className="text-lg font-black text-white font-outfit">{avgRating} / 5.0</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Avg Platform Rating</div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <MessageSquare className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-black text-white font-outfit">{totalCount}</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Total Feedbacks</div>
            </div>
          </div>

          <div className="bg-slate-900/90 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ThumbsUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-lg font-black text-emerald-400 font-outfit">{npsPercentage}%</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Peer Promoters</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-4 h-4 text-purple-400" /> Filter Feedback:
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['ALL', 'Assessment Quality', 'Platform Speed', 'Career Roadmaps', 'Learning Content', 'UI / UX Design'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                categoryFilter === cat
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFeedbacks.length > 0 ? (
          filteredFeedbacks.map((fb) => {
            const categoriesList = Array.isArray(fb.categories) 
              ? fb.categories 
              : [fb.category || 'General'];

            return (
              <div 
                key={fb.id}
                className="glass-panel p-6 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all duration-300 flex flex-col justify-between space-y-4 bg-slate-900/60 relative overflow-hidden"
              >
                {/* Accent Top Border Bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-emerald-400"></div>

                <div className="space-y-3">
                  {/* User Profile Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-purple-600/30">
                        {fb.userName ? fb.userName.substring(0, 2).toUpperCase() : 'RM'}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-white text-sm font-outfit">{fb.userName}</h4>
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[10px] font-bold">
                          {fb.userRole || 'Software Engineer'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {fb.date}
                    </span>
                  </div>

                  {/* Star Rating Display */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= fb.rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-700 fill-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-purple-300">
                      {fb.ratingLabel || `${fb.rating}/5`}
                    </span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 italic">
                    "{fb.comment || 'Great experience overall!'}"
                  </p>
                </div>

                {/* Category Chips & NPS Badge Footer */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1">
                    {categoriesList.map((cat, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] font-semibold"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>

                  {fb.npsRecommend && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border ${
                      fb.npsRecommend === 'Yes'
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-300 border-rose-500/20'
                    }`}>
                      {fb.npsRecommend === 'Yes' ? <ThumbsUp className="w-2.5 h-2.5" /> : <ThumbsDown className="w-2.5 h-2.5" />}
                      {fb.npsRecommend === 'Yes' ? 'Promoter' : 'Detractor'}
                    </span>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs">
            No feedback entries match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
};

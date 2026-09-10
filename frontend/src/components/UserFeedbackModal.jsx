import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { 
  Star, 
  X, 
  CheckCircle2, 
  Sparkles, 
  MessageSquarePlus, 
  ThumbsUp, 
  ThumbsDown,
  Loader2,
  Calendar,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

const RATING_LABELS = {
  1: 'Needs Improvement',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Exceptional Experience'
};

const CATEGORIES = [
  'Assessment Quality',
  'Platform Speed',
  'Career Roadmaps',
  'Learning Content',
  'UI / UX Design'
];

export const UserFeedbackModal = () => {
  const { user } = useAuth();
  const { isModalOpen, triggerCategory, closeFeedbackModal, submitFeedback } = useFeedback();

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [comment, setComment] = useState('');
  const [npsRecommend, setNpsRecommend] = useState('Yes'); // 'Yes' | 'No'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Pre-select category if passed via trigger
  useEffect(() => {
    if (triggerCategory && !selectedCategories.includes(triggerCategory)) {
      setSelectedCategories([triggerCategory]);
    }
  }, [triggerCategory]);

  // Reset form when modal opens
  useEffect(() => {
    if (isModalOpen) {
      setRating(0);
      setHoverRating(0);
      if (triggerCategory) {
        setSelectedCategories([triggerCategory]);
      } else {
        setSelectedCategories(['UI / UX Design']);
      }
      setComment('');
      setNpsRecommend('Yes');
      setIsSubmitting(false);
      setIsSubmittedSuccess(false);
    }
  }, [isModalOpen, triggerCategory]);

  if (!isModalOpen) return null;

  const activeUserName = user?.fullName || user?.name || 'Rohan Mishra';
  const activeUserRole = user?.designation || user?.position || user?.role?.replace('ROLE_', '') || 'Software Engineer';
  const currentDateFormatted = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  const toggleCategory = (cat) => {
    if (selectedCategories.includes(cat)) {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    } else {
      setSelectedCategories([...selectedCategories, cat]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setIsSubmitting(true);
    
    const feedbackPayload = {
      userName: activeUserName,
      userRole: activeUserRole,
      userEmail: user?.email || 'employee@skillsphere.com',
      rating,
      ratingLabel: RATING_LABELS[rating],
      categories: selectedCategories.length > 0 ? selectedCategories : ['General'],
      comment: comment.trim(),
      npsRecommend,
      date: currentDateFormatted
    };

    await submitFeedback(feedbackPayload);
    setIsSubmitting(false);
    setIsSubmittedSuccess(true);

    // Show checkmark animation for 1.5 seconds, then close modal
    setTimeout(() => {
      closeFeedbackModal(true);
      setIsSubmittedSuccess(false);
    }, 1500);
  };

  const handleDismiss = () => {
    closeFeedbackModal(true);
  };

  const currentDisplayRating = hoverRating || rating;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300">
      {/* Container with 1.2-second smooth fade-in animation */}
      <div 
        className="relative w-full max-w-lg bg-[#0f172a] border border-purple-500/30 rounded-3xl p-6 md:p-8 shadow-2xl shadow-purple-950/60 overflow-hidden transform transition-all duration-300"
        style={{
          animation: 'fadeInModal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards'
        }}
      >
        <style>{`
          @keyframes fadeInModal {
            0% {
              opacity: 0;
              transform: scale(0.94) translateY(12px);
            }
            100% {
              opacity: 1;
              transform: scale(1) translateY(0);
            }
          }
        `}</style>

        {/* Ambient Top Glow */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 p-2 rounded-full border border-slate-800 transition-colors z-10"
          aria-label="Close feedback modal"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmittedSuccess ? (
          /* Celebratory Success State */
          <div className="py-10 text-center space-y-4 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-xl shadow-emerald-500/30 ring-8 ring-emerald-500/10 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-extrabold text-white font-outfit">Thank you for your feedback!</h2>
            <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
              Your insights help us continuously elevate SkillSphere Nexus for enterprise professionals worldwide.
            </p>
          </div>
        ) : (
          /* Feedback Form */
          <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
            {/* Header & Contextual Title */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-semibold border border-purple-500/20 mb-3">
                <MessageSquarePlus className="w-3.5 h-3.5" /> Post-Usage Feedback Engine
              </div>
              <h2 className="text-2xl font-extrabold text-white font-outfit tracking-tight">
                How was your experience today?
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Hi <span className="text-purple-300 font-semibold">{activeUserName}</span>, your feedback helps us improve SkillSphere Nexus.
              </p>
            </div>

            {/* User Info (Read-only Badges) */}
            <div className="flex flex-wrap items-center gap-2 py-1">
              <div className="bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-slate-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                <span className="text-slate-400">User:</span> <strong className="text-white">{activeUserName}</strong>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-slate-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-slate-400">Role:</span> <strong className="text-indigo-300">{activeUserRole}</strong>
              </div>
              <div className="bg-slate-900/90 border border-slate-800 text-[11px] font-medium text-slate-300 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">{currentDateFormatted}</span>
              </div>
            </div>

            <hr className="border-slate-800/80" />

            {/* Interactive 5-Star Rating */}
            <div className="space-y-2 text-center bg-slate-900/50 p-4 rounded-2xl border border-slate-800/80">
              <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Rate your platform experience
              </span>
              <div className="flex items-center justify-center gap-2 py-1">
                {[1, 2, 3, 4, 5].map((starIndex) => {
                  const isFilled = currentDisplayRating >= starIndex;
                  return (
                    <button
                      key={starIndex}
                      type="button"
                      onClick={() => setRating(starIndex)}
                      onMouseEnter={() => setHoverRating(starIndex)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 focus:outline-none transition-transform duration-200 hover:scale-125 cursor-pointer"
                      aria-label={`Rate ${starIndex} star${starIndex > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`w-8 h-8 transition-colors duration-200 ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]'
                            : 'text-slate-700 fill-slate-800/40 hover:text-amber-400/60'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Text Display */}
              <div className="h-6 flex items-center justify-center">
                {currentDisplayRating > 0 ? (
                  <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-purple-300 animate-fade-in">
                    {RATING_LABELS[currentDisplayRating]}
                  </span>
                ) : (
                  <span className="text-[11px] text-slate-500 italic">Select 1 to 5 stars above</span>
                )}
              </div>
            </div>

            {/* Quick Category Tags (Selectable Chips) */}
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">
                Select Category Tags:
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/50 shadow-md shadow-purple-600/30 scale-[1.02]'
                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                      }`}
                    >
                      {cat} {isSelected && '✓'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Feedback Textarea */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300">Your Detailed Comment</label>
                <span className={`text-[11px] font-mono ${comment.length >= 300 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                  {comment.length} / 300
                </span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 300))}
                placeholder="Tell us what went well or what we can improve..."
                className="w-full h-24 bg-slate-900 border border-slate-800 focus:border-purple-500 rounded-2xl p-3.5 text-xs text-slate-100 placeholder-slate-500 resize-none outline-none transition-colors"
                maxLength={300}
              />
            </div>

            {/* NPS Question */}
            <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-slate-800 flex items-center justify-between gap-4">
              <span className="text-xs font-medium text-slate-300">
                Would you recommend this platform to peers?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNpsRecommend('Yes')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                    npsRecommend === 'Yes'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" /> Yes
                </button>
                <button
                  type="button"
                  onClick={() => setNpsRecommend('No')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all ${
                    npsRecommend === 'No'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-sm shadow-rose-500/20'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <ThumbsDown className="w-3.5 h-3.5" /> No
                </button>
              </div>
            </div>

            {/* Modal Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleDismiss}
                className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
              >
                Maybe Later
              </button>
              <button
                type="submit"
                disabled={rating === 0 || isSubmitting}
                className={`px-6 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all ${
                  rating > 0 && !isSubmitting
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30 hover:scale-[1.02]'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-purple-300" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React from 'react';
import { useFeedback } from '../context/FeedbackContext';
import { Star, MessageSquare } from 'lucide-react';

export const FeedbackFloatingPill = () => {
  const { openFeedbackModal } = useFeedback();

  return (
    <button
      onClick={() => openFeedbackModal()}
      className="fixed bottom-6 right-6 md:right-8 z-40 px-4 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-slate-900 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-full border border-purple-400/40 shadow-2xl shadow-purple-900/50 hover:shadow-purple-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-2 group cursor-pointer"
      title="Give platform feedback"
      aria-label="Open post-usage feedback modal"
    >
      <div className="relative">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400 group-hover:rotate-12 transition-transform duration-300" />
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
      </div>
      <span className="tracking-wide">Feedback</span>
      <span className="text-amber-300 font-extrabold">★</span>
    </button>
  );
};

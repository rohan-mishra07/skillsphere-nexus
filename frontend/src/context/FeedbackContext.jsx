import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const FeedbackContext = createContext();

const PRE_SEEDED_FEEDBACKS = [
  {
    id: 'fb-seeded-1',
    userName: 'Sarah Jenkins',
    userRole: 'Platform Director',
    userEmail: 'admin@skillsphere.com',
    rating: 5,
    ratingLabel: 'Exceptional Experience',
    categories: ['Assessment Quality', 'Career Roadmaps'],
    comment: 'The adaptive skill assessments and automated career pathway recommendations are top tier. Our engineering teams have accelerated upskilling by 40%!',
    npsRecommend: 'Yes',
    date: 'Sept 7, 2026',
    timestamp: '2026-09-07T14:30:00Z'
  },
  {
    id: 'fb-seeded-2',
    userName: 'Alex Chen',
    userRole: 'Senior Full Stack Engineer',
    userEmail: 'alex@skillsphere.com',
    rating: 4,
    ratingLabel: 'Very Good',
    categories: ['Platform Speed', 'UI / UX Design'],
    comment: 'Loving the modern glassmorphic interface and real-time auth speed. Would love to see additional micro-learning modules for Docker & Kubernetes.',
    npsRecommend: 'Yes',
    date: 'Sept 8, 2026',
    timestamp: '2026-09-08T10:15:00Z'
  },
  {
    id: 'fb-seeded-3',
    userName: 'Elena Rostova',
    userRole: 'Engineering Manager',
    userEmail: 'manager@skillsphere.com',
    rating: 5,
    ratingLabel: 'Exceptional Experience',
    categories: ['Learning Content', 'UI / UX Design'],
    comment: 'SkillSphere Nexus makes tracking team certifications and workforce productivity effortless. The live feedback and analytics dashboards are incredibly slick.',
    npsRecommend: 'Yes',
    date: 'Sept 9, 2026',
    timestamp: '2026-09-09T08:45:00Z'
  }
];

export const FeedbackProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [triggerCategory, setTriggerCategory] = useState('');
  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const stored = localStorage.getItem('skillsphere_user_feedbacks');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge seeded feedbacks if not present
          const seededIds = new Set(PRE_SEEDED_FEEDBACKS.map(f => f.id));
          const userOnly = parsed.filter(f => !seededIds.has(f.id));
          return [...userOnly, ...PRE_SEEDED_FEEDBACKS];
        }
      }
    } catch (e) {
      console.warn('Error reading stored feedbacks', e);
    }
    return PRE_SEEDED_FEEDBACKS;
  });

  // Save to localStorage when feedbacks change
  useEffect(() => {
    try {
      localStorage.setItem('skillsphere_user_feedbacks', JSON.stringify(feedbacks));
    } catch (e) {
      console.warn('Error persisting feedbacks', e);
    }
  }, [feedbacks]);

  // Open modal manually (bypasses session guard)
  const openFeedbackModal = (presetCategory = '') => {
    if (presetCategory) setTriggerCategory(presetCategory);
    setIsModalOpen(true);
  };

  // Close modal and set session guard if requested
  const closeFeedbackModal = (setSessionGuard = true) => {
    setIsModalOpen(false);
    if (setSessionGuard) {
      try {
        sessionStorage.setItem('hasGivenFeedbackThisSession', 'true');
      } catch (e) {}
    }
  };

  // Automatic Trigger Condition: Checks sessionStorage session guard
  const triggerAutoFeedback = (category = '') => {
    try {
      const hasGiven = sessionStorage.getItem('hasGivenFeedbackThisSession');
      if (hasGiven === 'true') {
        return; // Guard active, do not prompt automatically
      }
    } catch (e) {}

    // Delay slightly for natural UX transition
    setTimeout(() => {
      if (category) setTriggerCategory(category);
      setIsModalOpen(true);
    }, 600);
  };

  // Add new feedback submission
  const submitFeedback = async (newFeedback) => {
    const entry = {
      id: 'fb-' + Date.now(),
      ...newFeedback,
      timestamp: new Date().toISOString()
    };

    // 1. Update local state & localStorage
    setFeedbacks(prev => [entry, ...prev]);

    // 2. Set Session Guard so user is not prompted again this session
    try {
      sessionStorage.setItem('hasGivenFeedbackThisSession', 'true');
    } catch (e) {}

    // 3. Attempt POST request to /api/feedback (silent fallback)
    try {
      await api.post('/feedback', entry);
    } catch (err) {
      // Fallback silently if endpoint is not reachable
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8080';
        await fetch(`${baseUrl}/api/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(entry)
        });
      } catch (e) {
        // Silently handled - already saved in localStorage
      }
    }

    return entry;
  };

  return (
    <FeedbackContext.Provider
      value={{
        isModalOpen,
        triggerCategory,
        feedbacks,
        totalFeedbackCount: feedbacks.length,
        openFeedbackModal,
        closeFeedbackModal,
        triggerAutoFeedback,
        submitFeedback
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};

export default FeedbackContext;

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Send, Bot, User, Sparkles, Loader2, ArrowRight, Trash2, HelpCircle, ChevronDown, Minus 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Default courses for catalog searching when localStorage is not populated
const DEFAULT_COURSES = [
  { 
    id: 1, 
    title: 'Enterprise Java Spring Boot 4 & Security', 
    description: 'Master modern Spring Boot 4 RESTful APIs, Spring Security 6 with JWT tokens, Spring Data JPA, and Microservices Architecture.', 
    category: 'Backend Engineering', 
    rating: 4.9 
  },
  { 
    id: 2, 
    title: 'React 18 & Modern Tailwind CSS Enterprise UI', 
    description: 'Build high-performance web applications using React hooks, dynamic routing, state management, and custom glassmorphism design systems.', 
    category: 'Frontend Web Development', 
    rating: 4.85 
  },
  { 
    id: 3, 
    title: 'AWS Certified Solutions Architect & Cloud Native Strategy', 
    description: 'Designing fault-tolerant, highly available enterprise microservices on AWS Cloud infrastructure.', 
    category: 'Cloud & DevOps', 
    rating: 4.95 
  },
  { 
    id: 4, 
    title: 'AI-Driven Workforce Analytics & HR Strategy', 
    description: 'Leverage predictive AI models, skill gap matrixes, and performance KPIs to optimize enterprise talent development.', 
    category: 'Management & Leadership', 
    rating: 4.90 
  }
];

// Interactive Quick-Prompt Suggestion Chips required by specs
const QUICK_PROMPT_CHIPS = [
  { label: '📚 Recommend a Course', query: 'Find courses on Java and React' },
  { label: '💼 Open Job Openings', query: 'Find jobs / How do I apply?' },
  { label: '📜 Certification Policy', query: 'Check certification expiry' },
  { label: '📊 My Skill Radar', query: 'How to close my skill gap?' }
];

export const AiAssistantModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your SkillSphere AI Copilot & Interactive Platform Concierge. How can I assist you with course recommendations, active job openings, certification rules, or closing your skill gap today?',
      actions: [
        { label: '📖 Open in Course Portal', link: '/courses' },
        { label: 'View Skill Matrix', link: '/skills' }
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Keyboard Escape listener & body scroll management
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen && !isMinimized) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isMinimized, onClose]);

  // Reset minimized state on modal open
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  // Render minimized compact pill when user clicks minimize button
  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-5 right-5 z-[60] flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/50 text-white font-bold text-xs rounded-full shadow-2xl cursor-pointer hover:scale-105 transition-all animate-bounce"
        title="Expand AI Assistant"
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shrink-0">
          <Bot className="w-4 h-4" />
        </div>
        <span>SkillSphere AI Copilot</span>
        <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
      </div>
    );
  }

  // Rule-based Mock Engine & Intent Recognizer
  const parseRuleBasedIntent = (userPrompt) => {
    const lower = userPrompt.toLowerCase();

    // Helper: fetch current course catalog from localStorage or defaults
    const getCoursesFromCatalog = () => {
      try {
        const saved = localStorage.getItem('nexus_courses');
        if (saved) return JSON.parse(saved);
      } catch (e) {}
      return DEFAULT_COURSES;
    };

    // 1. Intent: Find courses on [topic] / Course Recommendations
    if (
      lower.includes('course') || 
      lower.includes('learn') || 
      lower.includes('catalog') || 
      lower.includes('class') || 
      lower.includes('training') || 
      lower.includes('find courses') ||
      lower.includes('recommend a course')
    ) {
      const catalog = getCoursesFromCatalog();
      
      let matchedCourses = catalog;
      const topicMatch = lower.match(/(?:find|search|show|get|recommend)?\s*courses?\s*(?:on|for|about|in)?\s*(.*)/i);
      const extractedTopic = topicMatch && topicMatch[1] ? topicMatch[1].trim() : '';
      
      if (extractedTopic && !extractedTopic.includes('recommend') && extractedTopic.length > 2) {
        matchedCourses = catalog.filter(c => 
          c.title.toLowerCase().includes(extractedTopic) || 
          c.category?.toLowerCase().includes(extractedTopic) ||
          (c.description && c.description.toLowerCase().includes(extractedTopic))
        );
      }

      if (matchedCourses.length > 0) {
        const topMatches = matchedCourses.slice(0, 3);
        const courseItemsText = topMatches
          .map((c, i) => `${i + 1}. **${c.title}** (${c.category || 'General'}) — ⭐ ${c.rating || 4.9}`)
          .join('\n');

        const actions = topMatches.map(c => ({
          label: `Open Course #${c.id}: ${c.title.split(' ')[0]} ${c.title.split(' ')[1] || ''}`,
          link: `/courses/${c.id}`
        }));
        actions.push({ label: '📖 Open in Course Portal', link: '/courses' });

        return {
          text: `🔍 **Matching LMS Courses Found:**\n\n${courseItemsText}\n\nSelect a course below to jump directly into the interactive player:`,
          actions
        };
      } else {
        return {
          text: `No specific courses found matching your query. Here are our top featured enterprise courses:`,
          actions: catalog.slice(0, 2).map(c => ({
            label: `Open Course #${c.id}: ${c.title}`,
            link: `/courses/${c.id}`
          })).concat([{ label: '📖 Open in Course Portal', link: '/courses' }])
        };
      }
    }

    // 2. Intent: Find jobs / How do I apply? / Job Openings
    if (
      lower.includes('job') || 
      lower.includes('career') || 
      lower.includes('apply') || 
      lower.includes('opening') || 
      lower.includes('vacancy') || 
      lower.includes('hiring') || 
      lower.includes('recruitment')
    ) {
      return {
        text: `💼 **Active Internal Job Openings & Career Portal**\n\nBased on your current profile and skill competencies, here are top matching requisition openings:\n\n1. **Senior Cloud Backend Architect** (Engineering - Remote) — *94% Skill Match*\n2. **Full-Stack UI Specialist (React/TS)** (Frontend - Hybrid) — *88% Skill Match*\n3. **DevOps & Cloud Automation Lead** (Operations - On-site) — *85% Skill Match*\n\nYou can submit 1-click internal applications and view pipeline stages directly in the Career Portal.`,
        actions: [
          { label: 'Explore Career Portal', link: '/jobs' },
          { label: 'View ATS & Recruitment Board', link: '/recruitment' }
        ]
      };
    }

    // 3. Intent: Check certification expiry / Certification Policy
    if (
      lower.includes('certif') || 
      lower.includes('expiry') || 
      lower.includes('expire') || 
      lower.includes('renew') || 
      lower.includes('badge') || 
      lower.includes('policy')
    ) {
      return {
        text: `📜 **Certification Expiry & 30-Day Renewal Policy**\n\n• **Validity Window:** Enterprise certificates are valid for **12 months** from issuance date.\n• **30-Day Expiry Notice:** Automated notifications trigger **30 days prior** to certificate expiration.\n• **Renewal Rule:** Complete at least 5 Continuing Professional Education (CPE) credits or achieve an 80%+ score on the updated recertification assessment to automatically renew validity for another year.\n\nView active certificates and verify digital badges below:`,
        actions: [
          { label: 'Go to Certifications', link: '/certifications' },
          { label: 'Verify Digital Credentials', link: '/verify' }
        ]
      };
    }

    // 4. Intent: How to close my skill gap? / Skill Radar
    if (
      lower.includes('skill') || 
      lower.includes('gap') || 
      lower.includes('radar') || 
      lower.includes('competency') || 
      lower.includes('roadmap') || 
      lower.includes('matrix')
    ) {
      return {
        text: `📊 **Skill Gap & Competency Analysis Summary**\n\n**Current Role Competencies:**\n• Java & Spring Boot: **88%** (Proficient)\n• React & Modern UI: **82%** (Advanced)\n• Cloud & AWS Infrastructure: **65%** (*Primary Skill Gap - 35% Delta*)\n• Enterprise Security & OAuth2: **60%** (*Secondary Skill Gap*)\n\n🎯 **Top Suggested Prerequisite Course to close your gap:**\n**AWS Certified Solutions Architect & Cloud Native Strategy** (Course #3).`,
        actions: [
          { label: 'Open Prerequisite Course (#3)', link: '/courses/3' },
          { label: 'View Skill Matrix & Radar', link: '/skills' }
        ]
      };
    }

    // 5. Intent: Mentorship / Coaching
    if (
      lower.includes('mentor') || 
      lower.includes('coach') || 
      lower.includes('advisor') || 
      lower.includes('guidance')
    ) {
      return {
        text: `🤝 **Enterprise Mentorship & Technical Coaching**\n\nOur AI matching engine pairs you with senior staff architects based on your target career roadmap and skill gap metrics. Connect 1-on-1 for bi-weekly coaching sessions.`,
        actions: [
          { label: 'Find a Technical Mentor', link: '/skills' }
        ]
      };
    }

    // 6. Intent: Leave / PTO / Time off
    if (
      lower.includes('leave') || 
      lower.includes('vacation') || 
      lower.includes('pto') || 
      lower.includes('time off')
    ) {
      return {
        text: `🌴 **Workforce Leave Policy**\n\nStandard employee leave balance is **14 annual PTO days**. Requests submitted via the Workforce portal undergo automated 24-hour manager routing and attendance calendar sync.`,
        actions: [
          { label: 'Apply for Leave in Workforce', link: '/workforce' }
        ]
      };
    }

    // Default Fallback
    return {
      text: `I've analyzed your request across enterprise modules. Here are direct deep-links to help you navigate:`,
      actions: [
        { label: '📖 Open in Course Portal', link: '/courses' },
        { label: 'View Career Portal', link: '/jobs' },
        { label: 'My Skill Radar', link: '/skills' }
      ]
    };
  };

  const sendMessage = async (userPrompt) => {
    if (!userPrompt.trim() || loading) return;

    const userMsg = userPrompt.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post('/analytics/ai-chatbot', { prompt: userMsg });
      
      let aiReply = res.data.response;
      let actions = [];

      if (res.data.actions && Array.isArray(res.data.actions)) {
        actions = res.data.actions;
      } else if (res.data.actionLink) {
        actions = [{ label: res.data.actionLabel || 'Navigate', link: res.data.actionLink }];
      }

      if (!aiReply || actions.length === 0) {
        const enriched = parseRuleBasedIntent(userMsg);
        aiReply = aiReply || enriched.text;
        actions = actions.length > 0 ? actions : enriched.actions;
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply, actions }]);
    } catch (err) {
      const fallbackResponse = parseRuleBasedIntent(userMsg);
      setMessages(prev => [
        ...prev, 
        { 
          sender: 'ai', 
          text: fallbackResponse.text, 
          actions: fallbackResponse.actions 
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendForm = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleActionClick = (link) => {
    if (link) {
      onClose();
      navigate(link);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="AI Assistant Concierge"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <style>{`
        @keyframes aiSlideUp {
          from { transform: translateY(40px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes aiFadeScale {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .ai-slide-up  { animation: aiSlideUp   0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .ai-fade-in   { animation: aiFadeScale  0.22s ease-out forwards; }
      `}</style>

      {/* Main Responsive Dialog Panel */}
      <div
        className="ai-slide-up sm:ai-fade-in w-full sm:max-w-xl flex flex-col
                   bg-slate-900/95 border border-slate-700 shadow-2xl overflow-hidden
                   rounded-t-3xl sm:rounded-3xl
                   h-[88vh] sm:h-[620px] sm:max-h-[90vh]
                   relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag bar */}
        <div
          className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-slate-600 sm:hidden z-[60]"
          aria-hidden="true"
        />

        {/* ── Sticky Header ─────────────────────────────────────────────────── */}
        <div className="sticky top-0 z-50 flex items-center justify-between p-3.5 bg-slate-900/95 border-b border-slate-700/60 backdrop-blur-md shrink-0 pt-6 sm:pt-3.5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2 font-outfit">
                SkillSphere AI Copilot
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30 font-medium">
                  <Sparkles className="w-2.5 h-2.5 text-indigo-400" /> AI Guide
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Navigational Deep-Links, Skill Gap &amp; Career Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setMessages([])}
              className="hidden sm:flex items-center justify-center p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Clear conversation"
              aria-label="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            {/* Minimize Toggle Button */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors cursor-pointer"
              title="Minimize Assistant"
              aria-label="Minimize AI Assistant"
            >
              <ChevronDown className="w-5 h-5" />
            </button>

            {/* High Contrast Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-rose-600 transition-colors cursor-pointer"
              title="Close (Esc)"
              aria-label="Close AI Assistant"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Message Thread (max-h-[60vh] overflow-y-auto pr-2) ──────────── */}
        <div className="flex-1 min-h-0 p-4 overflow-y-auto max-h-[60vh] pr-2 space-y-4 bg-slate-950/50 overscroll-contain">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs shrink-0 shadow-md mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-2 max-w-[85%]">
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                      : 'glass-panel text-slate-200 border border-slate-800/80 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {/* Direct Action Deep-Links / Buttons */}
                {m.sender === 'ai' && m.actions && m.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.actions.map((act, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleActionClick(act.link)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-bold rounded-xl border border-indigo-500/40 hover:border-indigo-500 transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <span>{act.label}</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-white text-xs shrink-0 border border-slate-700 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-center text-xs text-indigo-400 glass-panel p-3 rounded-xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>Analyzing intent &amp; searching platform catalog...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* ── Interactive Quick-Prompt Suggestion Chips ───────────────────── */}
        <div className="p-2 px-3 bg-slate-950/80 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none shrink-0">
          <span className="text-[10px] font-bold text-indigo-400 shrink-0 flex items-center gap-1 uppercase tracking-wider pl-1">
            <HelpCircle className="w-3 h-3" /> Quick Prompts:
          </span>
          {QUICK_PROMPT_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(chip.query)}
              className="px-2.5 py-1 rounded-full bg-slate-800/90 hover:bg-indigo-600/40 hover:border-indigo-400 text-slate-200 hover:text-white text-[11px] font-medium border border-slate-700/80 shrink-0 transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              {chip.label}
            </button>
          ))}
        </div>

        {/* ── Prompt Input Form ────────────────────────────────────────────── */}
        <form
          onSubmit={handleSendForm}
          className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2 shrink-0"
          style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about courses, jobs, cert rules, or skill gaps..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500 text-sm"
            style={{ fontSize: '16px' }}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-indigo-600/20 disabled:opacity-50 shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default AiAssistantModal;

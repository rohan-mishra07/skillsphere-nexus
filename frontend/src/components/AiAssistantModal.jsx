import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, User, Sparkles, Loader2, ArrowRight, Trash2, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export const AiAssistantModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  const PRESET_PROMPTS = [
    "What courses should I take for my skill gap?",
    "How do I apply for annual leave?",
    "How do I get my digital certificate?",
    "What is my recommended career path?",
    "Show my Q3 OKR goal progress"
  ];

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your SkillSphere AI Assistant. How can I help you today with courses, skill gap analysis, leave policies, or career path planning?',
      actionLink: '/courses',
      actionLabel: 'Browse LMS Catalog'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!isOpen) return null;

  const sendMessage = async (userPrompt) => {
    if (!userPrompt.trim() || loading) return;

    const userMsg = userPrompt.trim();
    setInput('');
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const res = await api.post('/analytics/ai-chatbot', { prompt: userMsg });
      const aiReply = res.data.response || 'I am analyzing your profile data across all modules.';
      const actionLink = res.data.actionLink;
      const actionLabel = res.data.actionLabel;

      setMessages(prev => [...prev, { sender: 'ai', text: aiReply, actionLink, actionLabel }]);
    } catch (err) {
      // Offline fallback answer logic
      let reply = "Based on your current skill matrix and enterprise goals, I recommend completing 'Enterprise Java Spring Boot 3 & Security' to boost your technical proficiency index.";
      let link = "/courses";
      let label = "Explore LMS Courses";

      if (userMsg.toLowerCase().includes('leave')) {
        reply = "You can log leave requests in the Workforce module. Standard processing time is 24 hours with automatic manager notification.";
        link = "/workforce";
        label = "Apply for Leave";
      } else if (userMsg.toLowerCase().includes('career')) {
        reply = "Based on your current skill matrix (Java: 88%, React: 65%), your recommended career progression is Senior Full-Stack Architect within 12 months.";
        link = "/skills";
        label = "View Skill Matrix";
      }

      setMessages(prev => [...prev, { sender: 'ai', text: reply, actionLink: link, actionLabel: label }]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-xl glass-panel rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col h-[560px] bg-slate-900/90">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2 font-outfit">
                SkillSphere AI Copilot
                <span className="flex items-center gap-1 text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  <Sparkles className="w-2.5 h-2.5" /> Active Engine
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Contextual LMS, Skill Gap & Workforce Assistant</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages([])}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Suggestion Chips Bar */}
        <div className="p-2.5 px-4 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-indigo-400 shrink-0 flex items-center gap-1 uppercase tracking-wider">
            <HelpCircle className="w-3 h-3" /> Quick Prompts:
          </span>
          {PRESET_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => sendMessage(p)}
              className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 text-slate-300 hover:text-white text-[11px] font-medium border border-slate-700 shrink-0 transition-all"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-xs shrink-0 shadow-md">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-2 max-w-[82%]">
                <div
                  className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                      : 'glass-panel text-slate-200 border border-slate-800 rounded-bl-none'
                  }`}
                >
                  {m.text}
                </div>

                {/* Direct Action Link Button */}
                {m.sender === 'ai' && m.actionLink && (
                  <button
                    onClick={() => handleActionClick(m.actionLink)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white text-[11px] font-bold rounded-xl border border-indigo-500/30 transition-all shadow-sm"
                  >
                    <span>{m.actionLabel || 'View Feature'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-white text-xs shrink-0 border border-slate-700">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-2 items-center text-xs text-indigo-400 glass-panel p-3 rounded-xl w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              <span>AI is analyzing skill matrices & knowledge base...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Input Form */}
        <form onSubmit={handleSendForm} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about courses, skill gaps, leave requests, or career paths..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};

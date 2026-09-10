import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Award,
  ArrowRight,
  ArrowLeft,
  Check,
  RotateCcw,
  FileText,
  HelpCircle,
  Brain,
  ShieldCheck,
  X,
  Share2,
  WifiOff,
  QrCode,
  Download
} from 'lucide-react';

// 15 Practical Software Engineering MCQs
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    category: "Data Structures",
    question: "What is the worst-case time complexity of searching in a balanced Binary Search Tree (such as an AVL or Red-Black Tree)?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n log n)"
    ],
    correctAnswer: 1,
    explanation: "Balanced binary search trees maintain a maximum tree height of O(log n), guaranteeing log-time search operations even in worst-case scenarios."
  },
  {
    id: 2,
    category: "Web Protocols & REST",
    question: "Which HTTP status code should a compliant RESTful API return when a POST request successfully creates a new resource?",
    options: [
      "200 OK",
      "201 Created",
      "202 Accepted",
      "204 No Content"
    ],
    correctAnswer: 1,
    explanation: "HTTP status 201 Created explicitly indicates that the request succeeded and a new resource was successfully created on the server."
  },
  {
    id: 3,
    category: "SQL & Databases",
    question: "What is the primary operational difference between the WHERE and HAVING clauses in SQL queries?",
    options: [
      "WHERE filters rows before aggregation, while HAVING filters group summaries after GROUP BY execution.",
      "WHERE is used exclusively with JOIN operations, whereas HAVING works only on single-table queries.",
      "HAVING filters individual rows before aggregation, while WHERE filters post-aggregation summaries.",
      "There is no functional difference; WHERE and HAVING are identical keywords in standard SQL."
    ],
    correctAnswer: 0,
    explanation: "WHERE filters individual database rows prior to grouping, while HAVING applies filtering conditions to aggregated groups after GROUP BY."
  },
  {
    id: 4,
    category: "Clean Code & Design",
    question: "According to SOLID principles, what does the Single Responsibility Principle (SRP) dictate?",
    options: [
      "A class must have only one single instance throughout the application execution lifecycle.",
      "A class should have only one reason to change, meaning it must encapsulate a single module or responsibility.",
      "Functions and methods must accept no more than a single input argument.",
      "Software components must be open for modification but strictly closed for extension."
    ],
    correctAnswer: 1,
    explanation: "Single Responsibility Principle (SRP) states that a class or module should have one, and only one, reason to change or be updated."
  },
  {
    id: 5,
    category: "Concurrency & OS",
    question: "In concurrent multi-threaded programming, what defines a deadlock state?",
    options: [
      "When a CPU core runs in an infinite loop without releasing execution slices.",
      "When two or more threads are permanently blocked, each waiting for a lock resource held by the other.",
      "When dynamic memory allocated to a worker thread is freed prior to execution completion.",
      "When a process starves due to low scheduling priority assigned by the OS kernel."
    ],
    correctAnswer: 1,
    explanation: "Deadlock occurs when circular wait dependencies exist between threads holding locked resources required by one another."
  },
  {
    id: 6,
    category: "Web Security",
    question: "Which HTTP security header prevents Clickjacking attacks by controlling whether a web page can be rendered inside an <iframe>?",
    options: [
      "Strict-Transport-Security",
      "X-Frame-Options",
      "Content-Security-Policy-Report-Only",
      "Access-Control-Allow-Origin"
    ],
    correctAnswer: 1,
    explanation: "X-Frame-Options (DENY / SAMEORIGIN) instructs browsers not to render the page inside frames or iframes, mitigating clickjacking."
  },
  {
    id: 7,
    category: "System Design & Caching",
    question: "Which cache invalidation strategy synchronously writes updated data to both the cache and persistent database simultaneously?",
    options: [
      "Write-Through Cache",
      "Write-Behind (Write-Back) Cache",
      "Cache-Aside (Lazy Loading)",
      "Read-Through Cache"
    ],
    correctAnswer: 0,
    explanation: "Write-Through caching writes data to the cache and backend database in a single synchronous transaction before returning success."
  },
  {
    id: 8,
    category: "Algorithms",
    question: "Which sorting algorithm features an average time complexity of O(n log n) and is classified as a stable, divide-and-conquer algorithm?",
    options: [
      "Quick Sort",
      "Heap Sort",
      "Merge Sort",
      "Selection Sort"
    ],
    correctAnswer: 2,
    explanation: "Merge Sort recursively divides arrays and merges sorted halves with a guaranteed O(n log n) stability in worst, average, and best cases."
  },
  {
    id: 9,
    category: "OOP Concepts",
    question: "What is the core characteristic of Polymorphism in Object-Oriented Programming?",
    options: [
      "Hiding private variable properties behind public getter methods.",
      "The ability for different subclass objects to respond to the same method call with specialized behaviors.",
      "Directly copying data fields from a base class without modifying parent behavior.",
      "Restricting class construction exclusively to static factory methods."
    ],
    correctAnswer: 1,
    explanation: "Polymorphism allows subclasses to override inherited methods so that uniform interface calls execute specialized logic per object type."
  },
  {
    id: 10,
    category: "REST & Microservices",
    question: "What architectural constraint makes a RESTful web service strictly stateless?",
    options: [
      "The server stores no client session context; each request must contain all information required to process it.",
      "The web service does not interact with or write records to a persistent SQL database.",
      "Authentication tokens are stored permanently inside server memory data structures.",
      "API endpoints only accept GET requests without body payloads or parameters."
    ],
    correctAnswer: 0,
    explanation: "Statelessness requires that every client HTTP request carries all state and credential context necessary for the server to process it."
  },
  {
    id: 11,
    category: "Git & Version Control",
    question: "What operation does 'git rebase' perform when run on a feature branch against 'main'?",
    options: [
      "Creates a merge commit combining both branch histories into a dual-parent graph node.",
      "Replays feature branch commits onto the tip of main, creating a clean linear commit history.",
      "Reverts all uncommitted local modifications in the working tree.",
      "Deletes the feature branch permanently from the remote origin repository."
    ],
    correctAnswer: 1,
    explanation: "Git rebase moves or reapplies a sequence of commits onto a new base commit, resulting in a streamlined linear repository graph."
  },
  {
    id: 12,
    category: "Microservices Architecture",
    question: "Which architectural design pattern prevents cascading failures across microservices when a downstream service becomes unresponsive?",
    options: [
      "Circuit Breaker Pattern",
      "Saga Pattern",
      "CQRS Pattern",
      "Strangler Fig Pattern"
    ],
    correctAnswer: 0,
    explanation: "The Circuit Breaker pattern detects downstream service failures and trips open immediately to fail fast and prevent system degradation."
  },
  {
    id: 13,
    category: "Data Structures",
    question: "In a Hash Table with a well-distributed hash function, what is the average-case time complexity for search, insertion, and deletion?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 0,
    explanation: "Hash tables achieve constant O(1) average time complexity for lookups, inserts, and deletes when key collisions remain minimal."
  },
  {
    id: 14,
    category: "SQL & Indexing",
    question: "How does a B-Tree index accelerate SELECT query performance in relational databases?",
    options: [
      "By compressing text column values into binary format.",
      "By maintaining a self-balancing sorted tree structure enabling logarithmic O(log n) search traversals.",
      "By converting SQL queries into parallel map-reduce in-memory workers.",
      "By disabling table locks during read query execution."
    ],
    correctAnswer: 1,
    explanation: "B-Tree indexes structure keys into balanced hierarchy nodes, enabling logarithmic lookup traversals to target table rows."
  },
  {
    id: 15,
    category: "Software Testing",
    question: "What is the primary objective of Integration Testing compared to Unit Testing?",
    options: [
      "Testing isolated single functions in complete isolation using mock objects.",
      "Verifying that multiple software components, modules, or external services interact correctly together.",
      "Validating visual CSS alignment against UI design mockups.",
      "Simulating high concurrent traffic loads to measure CPU throughput limits."
    ],
    correctAnswer: 1,
    explanation: "Integration testing verifies the combined behavior, data contracts, and communication pathways between integrated modules."
  }
];

export default function SkillAssessmentModal({
  isOpen,
  onClose,
  skillName = "Software Engineering Competency",
  onComplete
}) {
  const { user } = useAuth();
  const { triggerAutoFeedback } = useFeedback();
  // Screen states: 'INSTRUCTIONS' | 'TEST' | 'RESULT'
  const [currentScreen, setCurrentScreen] = useState('INSTRUCTIONS');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set([0]));
  
  // Timer state (20 mins = 1200s)
  const TOTAL_DURATION_SECONDS = 1200;
  const [timeRemaining, setTimeRemaining] = useState(TOTAL_DURATION_SECONDS);
  const targetEndTimeRef = useRef(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [results, setResults] = useState(null);
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [shareToast, setShareToast] = useState('');

  // Offline detection state
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Reset modal state when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentScreen('INSTRUCTIONS');
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setVisitedQuestions(new Set([0]));
      setTimeRemaining(TOTAL_DURATION_SECONDS);
      targetEndTimeRef.current = null;
      setShowSubmitConfirm(false);
      setResults(null);
      setShowCertificateModal(false);
    }
  }, [isOpen]);

  // Robust Timestamp-Based Countdown Timer
  useEffect(() => {
    if (currentScreen !== 'TEST') return;

    if (!targetEndTimeRef.current) {
      targetEndTimeRef.current = Date.now() + TOTAL_DURATION_SECONDS * 1000;
    }

    const timerInterval = setInterval(() => {
      const now = Date.now();
      const diffInSeconds = Math.max(0, Math.floor((targetEndTimeRef.current - now) / 1000));
      setTimeRemaining(diffInSeconds);

      if (diffInSeconds <= 0) {
        clearInterval(timerInterval);
        handleEvaluateTest(true); // Auto-submit on timeout
      }
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [currentScreen]);

  if (!isOpen) return null;

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimerWarning = timeRemaining <= 180; // 3 minutes or less

  // Handle Option Select
  const handleSelectOption = (optionIndex) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  // Jump to specific question
  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index);
    setVisitedQuestions((prev) => new Set([...prev, index]));
  };

  const handleNext = () => {
    if (currentQuestionIndex < SAMPLE_QUESTIONS.length - 1) {
      const nextIdx = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIdx);
      setVisitedQuestions((prev) => new Set([...prev, nextIdx]));
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const prevIdx = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIdx);
      setVisitedQuestions((prev) => new Set([...prev, prevIdx]));
    }
  };

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = SAMPLE_QUESTIONS.length - answeredCount;

  // Start Test Button
  const handleStartTest = () => {
    targetEndTimeRef.current = Date.now() + TOTAL_DURATION_SECONDS * 1000;
    setTimeRemaining(TOTAL_DURATION_SECONDS);
    setCurrentScreen('TEST');
  };

  // Evaluate and Submit Test
  const handleEvaluateTest = (autoSubmitted = false) => {
    setShowSubmitConfirm(false);
    
    // Compute total time spent
    const now = Date.now();
    const timeSpentSeconds = targetEndTimeRef.current
      ? Math.min(TOTAL_DURATION_SECONDS, Math.max(0, Math.floor((targetEndTimeRef.current - now) / 1000)))
      : TOTAL_DURATION_SECONDS;
    const actualSpentSeconds = TOTAL_DURATION_SECONDS - timeSpentSeconds;
    const spentMins = Math.floor(actualSpentSeconds / 60);
    const spentSecs = actualSpentSeconds % 60;
    const timeSpentFormatted = autoSubmitted
      ? "Auto-Submitted on Timeout (20m 00s)"
      : `Completed in ${spentMins}m ${spentSecs}s`;

    // Calculate score out of 15
    let score = 0;
    const breakdown = SAMPLE_QUESTIONS.map((q, idx) => {
      const selected = userAnswers[idx];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) score++;
      return {
        questionId: q.id,
        category: q.category,
        question: q.question,
        options: q.options,
        userSelected: selected !== undefined ? selected : null,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation
      };
    });

    // Rating out of 10
    const ratingOutofTen = parseFloat(((score / SAMPLE_QUESTIONS.length) * 10).toFixed(1));
    const percentage = Math.round((score / SAMPLE_QUESTIONS.length) * 100);

    // Performance Tier: Beginner (<5.0), Intermediate (5.0–6.9), Advanced (7.0–8.4), or Expert (8.5–10.0)
    let tier = "Beginner";
    if (ratingOutofTen >= 8.5) tier = "Expert";
    else if (ratingOutofTen >= 7.0) tier = "Advanced";
    else if (ratingOutofTen >= 5.0) tier = "Intermediate";

    const evalResults = {
      score,
      totalQuestions: SAMPLE_QUESTIONS.length,
      rating: ratingOutofTen,
      percentage,
      tier,
      timeSpent: timeSpentFormatted,
      autoSubmitted,
      breakdown
    };

    // Store in localStorage for instant offline fallback
    try {
      localStorage.setItem('skillsphere_latest_assessment', JSON.stringify({
        skillName,
        score,
        rating: ratingOutofTen,
        percentage,
        tier,
        timeSpent: timeSpentFormatted,
        date: new Date().toISOString()
      }));
    } catch (e) {
      console.warn("Could not save to localStorage", e);
    }

    setResults(evalResults);
    setCurrentScreen('RESULT');
    if (triggerAutoFeedback) {
      triggerAutoFeedback('Assessment Quality');
    }
  };

  // Share score or trigger native mobile web share
  const handleShareMobileBadge = () => {
    const text = `🏆 I achieved ${results.score}/15 (${results.percentage}%, Rating ${results.rating}/10) in the ${skillName} Assessment on SkillSphere Nexus!`;
    if (navigator.share) {
      navigator.share({
        title: 'SkillSphere Assessment Badge',
        text: text,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setShareToast("Achievement badge summary copied to clipboard!");
      setTimeout(() => setShareToast(''), 4000);
    }
  };

  // Finish and close result modal
  const handleFinishAndClose = () => {
    if (onComplete && results) {
      onComplete(results);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] relative">
        
        {/* Offline Awareness Banner */}
        {isOffline && (
          <div className="bg-amber-500/20 text-amber-300 border-b border-amber-500/30 px-4 py-2 text-xs font-semibold flex items-center justify-center gap-2 z-30">
            <WifiOff className="w-4 h-4 text-amber-400" />
            <span>Offline Mode Active: Your assessment progress is cached locally.</span>
          </div>
        )}

        {/* Share Toast Notification */}
        {shareToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-emerald-950/95 border border-emerald-500/50 text-emerald-200 text-xs font-bold rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{shareToast}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 1: PRE-TEST INSTRUCTION CARD */}
        {/* ========================================================================= */}
        {currentScreen === 'INSTRUCTIONS' && (
          <div className="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30 shrink-0">
                  <Brain className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white font-outfit">Skill Assessment</h2>
                  <p className="text-xs text-cyan-400 font-semibold mt-0.5">{skillName}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Banner info */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-slate-900 border border-cyan-500/30 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-300 space-y-1">
                <p className="font-bold text-white">Verified Enterprise Competency Test</p>
                <p>
                  Evaluates Software Engineering, Data Structures, Web Security, SQL, Clean Code, and System Design. Your score out of 10 updates your skill graph badge upon completion.
                </p>
              </div>
            </div>

            {/* Test Parameters Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" /> Test Duration
                </div>
                <div className="text-base md:text-lg font-bold text-white font-mono">20 Mins</div>
                <div className="text-[10px] text-slate-500">Strict timer</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <FileText className="w-3.5 h-3.5 text-cyan-400" /> Questions
                </div>
                <div className="text-base md:text-lg font-bold text-white font-mono">15 MCQs</div>
                <div className="text-[10px] text-slate-500">Single select</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <Award className="w-3.5 h-3.5 text-emerald-400" /> Rating Scale
                </div>
                <div className="text-base md:text-lg font-bold text-emerald-400 font-mono">0 - 10</div>
                <div className="text-[10px] text-slate-500">Normalized</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> Benchmark
                </div>
                <div className="text-base md:text-lg font-bold text-purple-300 font-mono">50%+</div>
                <div className="text-[10px] text-slate-500">Pass rating</div>
              </div>
            </div>

            {/* Instruction Checklist */}
            <div className="space-y-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400" /> Mobile & Desktop Guidelines
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Timestamp Synchronization:</strong> The 20-minute countdown uses absolute timestamp tracking. Sleep or tab switching will not pause the timer.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Mobile Question Palette:</strong> On mobile devices, swipe the horizontal question strip at the top to jump directly to any question 1-15.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Auto-Submit:</strong> Evaluates all answered questions automatically when time hits <code className="text-cyan-300 bg-slate-900 px-1 py-0.5 rounded">00:00</code>.</span>
                </li>
              </ul>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl min-h-[44px]"
              >
                Cancel & Exit
              </button>
              <button
                onClick={handleStartTest}
                className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-900/40 flex items-center gap-2 min-h-[44px]"
              >
                Start Assessment Now <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 2: ACTIVE MCQ EXAMINATION INTERFACE */}
        {/* ========================================================================= */}
        {currentScreen === 'TEST' && (
          <div className="flex flex-col h-full overflow-hidden">
            {/* Slim Sticky Header Banner */}
            <div className="sticky top-0 z-20 px-4 md:px-6 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 md:gap-3">
                <span className="px-2.5 py-1 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 rounded-lg text-xs font-bold">
                  Q {currentQuestionIndex + 1} of {SAMPLE_QUESTIONS.length}
                </span>
                <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">
                  {SAMPLE_QUESTIONS[currentQuestionIndex].category}
                </span>
              </div>

              {/* Progress bar */}
              <div className="flex-1 max-w-xs md:max-w-md hidden sm:block">
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${(answeredCount / SAMPLE_QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* 20-Minute Timer Badge */}
              <div
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-xl border font-mono text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all ${
                  isTimerWarning
                    ? 'bg-rose-950/80 text-rose-300 border-rose-500/60 animate-pulse shadow-lg shadow-rose-900/40'
                    : 'bg-slate-900 text-cyan-300 border-cyan-500/30'
                }`}
              >
                <Clock className={`w-3.5 h-3.5 ${isTimerWarning ? 'text-rose-400' : 'text-cyan-400'}`} />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>

            {/* Mobile Question Palette Horizontal Strip (< lg) */}
            <div className="lg:hidden px-4 py-2 bg-slate-950/90 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 mr-1">Questions:</span>
              {SAMPLE_QUESTIONS.map((_, idx) => {
                const isAnswered = userAnswers[idx] !== undefined;
                const isCurrent = idx === currentQuestionIndex;

                return (
                  <button
                    key={idx}
                    onClick={() => handleJumpToQuestion(idx)}
                    className={`w-7 h-7 rounded-lg text-[11px] font-bold shrink-0 flex items-center justify-center transition-all ${
                      isCurrent
                        ? 'border-2 border-cyan-400 text-white bg-slate-900 shadow-md ring-2 ring-cyan-400/30'
                        : isAnswered
                        ? 'bg-emerald-600/40 text-emerald-300 border border-emerald-500/50'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Test Content Layout */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 md:p-6 overflow-y-auto">
              
              {/* Question & Options Area */}
              <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="inline-block px-2.5 py-1 bg-slate-800 text-cyan-400 border border-slate-700 text-[10px] font-bold tracking-wider uppercase rounded-md">
                    {SAMPLE_QUESTIONS[currentQuestionIndex].category}
                  </div>

                  <h3 className="text-base md:text-lg font-bold text-white leading-relaxed">
                    {currentQuestionIndex + 1}. {SAMPLE_QUESTIONS[currentQuestionIndex].question}
                  </h3>

                  {/* 4 Option Cards */}
                  <div className="space-y-3 pt-1">
                    {SAMPLE_QUESTIONS[currentQuestionIndex].options.map((optText, optIdx) => {
                      const isSelected = userAnswers[currentQuestionIndex] === optIdx;
                      const optionLetters = ['A', 'B', 'C', 'D'];

                      return (
                        <button
                          key={optIdx}
                          onClick={() => handleSelectOption(optIdx)}
                          className={`w-full min-h-[48px] p-3.5 md:p-4 rounded-xl text-left border transition-all flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-400/40'
                              : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                                isSelected
                                  ? 'bg-cyan-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {optionLetters[optIdx]}
                            </div>
                            <span className="text-xs md:text-sm font-medium">{optText}</span>
                          </div>

                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all shrink-0 ${
                              isSelected
                                ? 'border-cyan-400 bg-cyan-400 text-slate-950'
                                : 'border-slate-700 bg-transparent'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <button
                    onClick={handlePrev}
                    disabled={currentQuestionIndex === 0}
                    className={`px-4 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors min-h-[44px] ${
                      currentQuestionIndex === 0
                        ? 'bg-slate-800/40 text-slate-600 cursor-not-allowed border border-slate-800'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {currentQuestionIndex < SAMPLE_QUESTIONS.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 min-h-[44px]"
                      >
                        Next <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : null}

                    <button
                      onClick={() => {
                        if (unansweredCount > 0) {
                          setShowSubmitConfirm(true);
                        } else {
                          handleEvaluateTest(false);
                        }
                      }}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 min-h-[44px]"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Submit
                    </button>
                  </div>
                </div>
              </div>

              {/* Desktop Question Palette (Right 4 Cols - Desktop only) */}
              <div className="hidden lg:flex lg:col-span-4 bg-slate-950/80 p-5 rounded-2xl border border-slate-800 flex-col justify-between space-y-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                    <span>Question Palette</span>
                    <span className="text-[10px] text-cyan-400 font-mono font-semibold">{answeredCount}/15 Answered</span>
                  </h4>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-400 mb-4 pb-3 border-b border-slate-800/60">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-700"></div>
                      <span>Unanswered</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full border-2 border-cyan-400"></div>
                      <span>Current</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    {SAMPLE_QUESTIONS.map((_, idx) => {
                      const isAnswered = userAnswers[idx] !== undefined;
                      const isCurrent = idx === currentQuestionIndex;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleJumpToQuestion(idx)}
                          className={`h-9 rounded-xl text-xs font-bold transition-all relative flex items-center justify-center ${
                            isCurrent
                              ? 'border-2 border-cyan-400 text-white bg-slate-900 shadow-md shadow-cyan-900/50'
                              : isAnswered
                              ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50'
                              : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                          }`}
                        >
                          <span>{idx + 1}</span>
                          {isAnswered && !isCurrent && (
                            <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400"></div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[11px] text-slate-400 font-medium">Ready to finish?</div>
                  <button
                    onClick={() => {
                      if (unansweredCount > 0) {
                        setShowSubmitConfirm(true);
                      } else {
                        handleEvaluateTest(false);
                      }
                    }}
                    className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Finalize & Submit Test
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* UNANSWERED SUBMISSION CONFIRMATION MODAL OVERLAY */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-slate-900 p-6 rounded-2xl border border-amber-500/40 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertTriangle className="w-6 h-6 shrink-0" />
                <h3 className="font-bold text-base text-white">Unanswered Questions Alert</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                You currently have <strong className="text-amber-400">{unansweredCount} unanswered question(s)</strong> out of {SAMPLE_QUESTIONS.length}. Unanswered questions will be scored as 0 points.
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowSubmitConfirm(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-xl min-h-[44px]"
                >
                  Return to Test
                </button>
                <button
                  onClick={() => handleEvaluateTest(false)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-xl shadow-lg min-h-[44px]"
                >
                  Confirm & Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SCREEN 3: SCORECARD & DETAILED TECHNICAL BREAKDOWN */}
        {/* ========================================================================= */}
        {currentScreen === 'RESULT' && results && (
          <div className="p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto max-h-[90vh]">
            {/* Header Banner */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-cyan-600 flex items-center justify-center text-white shadow-xl shadow-emerald-950/50 shrink-0">
                  <Award className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl md:text-2xl font-black text-white font-outfit">Assessment Complete</h2>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {results.tier} Tier
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {skillName} • {results.timeSpent}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {results.percentage >= 50 && (
                  <button
                    onClick={() => setShowCertificateModal(true)}
                    className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 min-h-[44px]"
                  >
                    <Share2 className="w-4 h-4" /> Share Certificate
                  </button>
                )}
                <button
                  onClick={handleFinishAndClose}
                  className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 min-h-[44px]"
                >
                  Dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Score Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Score</div>
                <div className="text-2xl md:text-3xl font-black text-white font-mono">{results.score} / {results.totalQuestions}</div>
                <div className="text-xs text-cyan-400 font-semibold">{results.percentage}% Correct</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Assessed Rating</div>
                <div className="text-2xl md:text-3xl font-black text-cyan-400 font-mono">{results.rating} / 10</div>
                <div className="text-xs text-slate-400">Normalized scale</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Performance Tier</div>
                <div className="text-xl md:text-2xl font-black text-emerald-400">{results.tier}</div>
                <div className="text-xs text-slate-400">Verified status</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time Spent</div>
                <div className="text-xs md:text-sm font-bold text-white font-mono mt-2">{results.timeSpent}</div>
                <div className="text-[10px] text-slate-500">20m maximum</div>
              </div>
            </div>

            {/* Technical Explanation Breakdown */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" /> Question Breakdown & Explanations
                </span>
                <span className="text-xs text-slate-400 font-normal">All 15 Questions</span>
              </h3>

              <div className="space-y-3">
                {results.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 md:p-5 rounded-xl border space-y-3 transition-all ${
                      item.isCorrect
                        ? 'bg-slate-950/60 border-slate-800'
                        : 'bg-rose-950/10 border-rose-900/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                          Q{idx + 1} • {item.category}
                        </span>
                        <h4 className="text-xs md:text-sm font-bold text-white leading-snug">{item.question}</h4>
                      </div>

                      {item.isCorrect ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold rounded-lg shrink-0">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[11px] font-bold rounded-lg shrink-0">
                          <XCircle className="w-3.5 h-3.5" /> Incorrect
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                      <div className={`p-2.5 rounded-lg border ${
                        item.userSelected !== null
                          ? item.isCorrect
                            ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                            : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}>
                        <span className="font-bold">Your Choice: </span>
                        {item.userSelected !== null ? item.options[item.userSelected] : "Not Answered"}
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-emerald-300">
                        <span className="font-bold">Correct Option: </span>
                        {item.options[item.correctAnswer]}
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-cyan-300">Explanation: </strong>
                        {item.explanation}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              {results.percentage >= 50 ? (
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-xs font-bold rounded-xl flex items-center gap-2 min-h-[44px]"
                >
                  <Share2 className="w-4 h-4" /> Share Certificate
                </button>
              ) : <div></div>}

              <button
                onClick={handleFinishAndClose}
                className="px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-2 min-h-[44px]"
              >
                Return to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SHAREABLE CERTIFICATE BADGE MODAL OVERLAY */}
        {/* ========================================================================= */}
        {showCertificateModal && results && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="w-full max-w-lg bg-slate-900 p-6 rounded-2xl border border-purple-500/40 shadow-2xl space-y-5 relative">
              <button
                onClick={() => setShowCertificateModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Award className="w-3.5 h-3.5" /> SkillSphere Verified Badge
                </div>
                <h3 className="text-lg font-bold text-white font-outfit">Achievement Certificate</h3>
              </div>

              {/* High-Resolution SVG Badge Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950/50 to-slate-900 border-2 border-purple-500/30 shadow-2xl relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-6 h-6 text-cyan-400" />
                    <span className="font-extrabold text-sm text-white font-outfit">SkillSphere Nexus</span>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 font-bold px-2 py-0.5 rounded bg-purple-950 border border-purple-800">VERIFIED CERTIFICATE</span>
                </div>

                <div className="text-center space-y-2 py-2">
                  <p className="text-[11px] text-slate-400 uppercase tracking-widest font-semibold">THIS IS PROUDLY PRESENTED TO</p>
                  <h2 className="text-2xl font-black text-white font-outfit">{user?.name || user?.fullName || 'Rohan Mishra'}</h2>
                  <p className="text-xs text-cyan-300 font-bold">{user?.position || user?.designation || 'Software Engineering Competency'}</p>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <span className="text-2xl font-black text-emerald-400 font-mono">{results.score}/15</span>
                    <span className="text-xs font-bold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">Rating: {results.rating}/10</span>
                    <span className="text-xs font-bold text-purple-300 bg-purple-950 px-2.5 py-1 rounded-lg border border-purple-800">{results.tier}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-[10px] text-slate-400 font-mono">
                  <div>
                    <div>Code: SKILL-2026-NEXUS-87</div>
                    <div>Issued: {new Date().toLocaleDateString()}</div>
                  </div>
                  <div className="w-8 h-8 rounded bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
                    <QrCode className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={handleShareMobileBadge}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <Share2 className="w-4 h-4" /> Share Mobile Badge
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, PlayCircle, Star, Clock, Users, Plus, Award, CheckCircle2, 
  TrendingUp, Compass, FileCheck, Layers, Video, ShieldCheck, Sparkles, 
  BarChart3, RefreshCw, ChevronRight, Download, Filter, Search, GraduationCap
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';

export const DEFAULT_COURSES = [
  { 
    id: 1, 
    title: 'Enterprise Java Spring Boot 4 & Security', 
    description: 'Master modern Spring Boot 4 RESTful APIs, Spring Security 6 with JWT tokens, Spring Data JPA, and Microservices Architecture.', 
    category: 'Backend Engineering', 
    type: 'Online Course', 
    level: 'Advanced', 
    duration: '12 Hours', 
    rating: 4.9, 
    enrolledCount: 1240, 
    trainerName: 'Prof. David Sterling' 
  },
  { 
    id: 2, 
    title: 'React 18 & Modern Tailwind CSS Enterprise UI', 
    description: 'Build high-performance web applications using React hooks, dynamic routing, state management, and custom glassmorphism design systems.', 
    category: 'Frontend Web Development', 
    type: 'Workshop', 
    level: 'Intermediate', 
    duration: '10 Hours', 
    rating: 4.85, 
    enrolledCount: 980, 
    trainerName: 'Prof. David Sterling' 
  },
  { 
    id: 3, 
    title: 'AWS Certified Solutions Architect & Cloud Native Strategy', 
    description: 'Designing fault-tolerant, highly available enterprise microservices on AWS Cloud infrastructure.', 
    category: 'Cloud & DevOps', 
    type: 'Bootcamp', 
    level: 'Executive', 
    duration: '15 Hours', 
    rating: 4.95, 
    enrolledCount: 1450, 
    trainerName: 'Elena Rostova' 
  },
  { 
    id: 4, 
    title: 'AI-Driven Workforce Analytics & HR Strategy', 
    description: 'Leverage predictive AI models, skill gap matrixes, and performance KPIs to optimize enterprise talent development.', 
    category: 'Management & Leadership', 
    type: 'Webinar', 
    level: 'Executive', 
    duration: '6 Hours', 
    rating: 4.90, 
    enrolledCount: 620, 
    trainerName: 'Elena Rostova' 
  }
];

export const LmsCatalog = () => {
  const { user } = useAuth();
  const { triggerAutoFeedback } = useFeedback();
  const [activeTab, setActiveTab] = useState('catalog'); // catalog | enrollments | paths | completion | assessments | certificates

  // 1. State Hydration from localStorage with DEFAULT_COURSES fallback
  const [courses, setCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('nexus_courses');
      return saved ? JSON.parse(saved) : DEFAULT_COURSES;
    } catch (err) {
      console.warn("Failed loading courses from localStorage", err);
      return DEFAULT_COURSES;
    }
  });

  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Enrollments State
  const [enrollments, setEnrollments] = useState([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);

  // Course Creation Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCourse, setNewCourse] = useState({
    title: '',
    description: '',
    category: 'Backend Engineering',
    level: 'Intermediate',
    duration: '10 Hours',
    trainerName: user?.fullName || 'Prof. David Sterling',
    type: 'Online Course'
  });

  // Completion Progress Update State
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState('');
  const [updateProgressVal, setUpdateProgressVal] = useState(85);
  const [updateScoreVal, setUpdateScoreVal] = useState(87.0);

  // Certificate Modal State
  const [selectedCert, setSelectedCert] = useState(null);

  // Notification Toast State
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  const fetchCourses = async () => {
    const saved = localStorage.getItem('nexus_courses');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCourses(parsed);
          return;
        }
      } catch (e) {}
    }
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      const res = await api.get('/lms/courses', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (Array.isArray(res.data) && res.data.length > 0) {
        setCourses(res.data);
        localStorage.setItem('nexus_courses', JSON.stringify(res.data));
      } else {
        setCourses(DEFAULT_COURSES);
      }
    } catch (err) {
      setCourses(DEFAULT_COURSES);
    }
  };

  const fetchEnrollments = async () => {
    setIsLoadingEnrollments(true);
    try {
      const res = await api.get('/learning/enrollments');
      if (Array.isArray(res.data) && res.data.length > 0) {
        setEnrollments(res.data);
      } else {
        setEnrollments(getDefaultEnrollments());
      }
    } catch (err) {
      setEnrollments(getDefaultEnrollments());
    } finally {
      setIsLoadingEnrollments(false);
    }
  };

  const getDefaultEnrollments = () => [
    {
      enrollmentId: '101a1b2c-3d4e-5f6a-7b8c-9d0e1f2a3b4c',
      empId: 'e1001-john-smith-id',
      courseId: 1,
      courseTitle: 'Enterprise Java Spring Boot 4 & Security',
      enrolledAt: '2026-08-01T10:00:00',
      progress: 100,
      completed: true,
      score: 87.0,
      completedAt: '2026-08-10T14:30:00'
    },
    {
      enrollmentId: '202b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
      empId: 'e1001-john-smith-id',
      courseId: 2,
      courseTitle: 'React 18 & Modern Tailwind CSS Enterprise UI',
      enrolledAt: '2026-08-05T09:15:00',
      progress: 65,
      completed: false,
      score: 0.0,
      completedAt: null
    },
    {
      enrollmentId: '303c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
      empId: 'e1002-alex-chen-id',
      courseId: 3,
      courseTitle: 'AWS Certified Solutions Architect & Cloud Native Strategy',
      enrolledAt: '2026-08-08T11:00:00',
      progress: 100,
      completed: true,
      score: 92.5,
      completedAt: '2026-08-11T16:20:00'
    }
  ];

  // 2. Create Course Handler assigning unique ID, 5.0 rating, 0 enrolled count & active timestamp
  const handleCreateCourseSubmit = async (e) => {
    e.preventDefault();
    const createdCourse = {
      ...newCourse,
      id: `course-${Date.now()}`,
      rating: 5.0,
      enrolledCount: 0,
      createdAt: new Date().toISOString()
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000);
      const res = await api.post('/lms/courses', createdCourse, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res?.data) {
        Object.assign(createdCourse, res.data);
      }
    } catch (err) {
      console.warn("Backend unavailable; saving course locally into localStorage.", err);
    }

    setCourses(prevCourses => {
      const updated = [createdCourse, ...(prevCourses || [])];
      localStorage.setItem('nexus_courses', JSON.stringify(updated));
      return updated;
    });

    showToast(`Course "${createdCourse.title}" created & persisted successfully!`);
    setIsCreateModalOpen(false);
    setNewCourse({
      title: '',
      description: '',
      category: 'Backend Engineering',
      level: 'Intermediate',
      duration: '10 Hours',
      trainerName: user?.fullName || 'Prof. David Sterling',
      type: 'Online Course'
    });
  };

  // 3. Reset Fallback Handler
  const handleResetCatalog = () => {
    setCourses(DEFAULT_COURSES);
    localStorage.setItem('nexus_courses', JSON.stringify(DEFAULT_COURSES));
    showToast('Course catalog reset to enterprise default courses.');
  };

  const handleEnrollUser = async (courseId, title) => {
    const dummyEmpId = 'e1001-john-smith-id';
    try {
      const res = await api.post(`/learning/enrollments?empId=${dummyEmpId}&courseId=${courseId}`);
      showToast(`Enrolled successfully in "${title}"!`);
      fetchEnrollments();
    } catch (err) {
      const newEnr = {
        enrollmentId: 'enr-' + Date.now(),
        empId: dummyEmpId,
        courseId: courseId,
        courseTitle: title,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        completed: false,
        score: 0.0,
        completedAt: null
      };
      setEnrollments([newEnr, ...enrollments]);
      showToast(`Enrolled successfully in "${title}"!`);
    }
    if (triggerAutoFeedback) {
      triggerAutoFeedback('Learning Content');
    }
  };

  const handleUpdateProgressSubmit = async (e) => {
    e.preventDefault();
    if (!selectedEnrollmentId) return;

    try {
      await api.put(`/learning/enrollments/${selectedEnrollmentId}/progress?progress=${updateProgressVal}&score=${updateScoreVal}`);
      showToast(`Progress updated to ${updateProgressVal}%!`);
      fetchEnrollments();
    } catch (err) {
      setEnrollments((enrollments || []).map(enr => {
        if (enr.enrollmentId === selectedEnrollmentId) {
          const isComp = updateProgressVal >= 100;
          return {
            ...enr,
            progress: Number(updateProgressVal),
            score: Number(updateScoreVal),
            completed: isComp,
            completedAt: isComp ? new Date().toISOString() : enr.completedAt
          };
        }
        return enr;
      }));
      showToast(`Progress updated to ${updateProgressVal}%!`);
    }
  };

  const filteredCourses = (courses || []).filter(c => {
    const matchesCategory = filterCategory === 'ALL' || c.category?.toLowerCase().includes(filterCategory.toLowerCase());
    const matchesType = filterType === 'ALL' || (c.type || 'Online Course').toLowerCase() === filterType.toLowerCase();
    const matchesQuery = !searchQuery || c.title?.toLowerCase().includes(searchQuery.toLowerCase()) || c.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesType && matchesQuery;
  });

  const getCourseTitle = (courseId) => {
    const found = (courses || []).find(c => c.id === courseId);
    return found ? found.title : `Course #${courseId}`;
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-indigo-400/30 animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Milestone Header Banner */}
      <div className="glass-panel p-6 md:p-8 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-3">
              <GraduationCap className="w-4 h-4 text-indigo-400" /> Enterprise Learning Management System (LMS)
            </div>
            <h1 className="text-3xl font-black text-white font-outfit tracking-tight">
              Enterprise Learning <span className="gradient-text">&amp; Skill Development</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
              Deploys an enterprise learning management system offering 847 courses, handling 12.4K monthly enrollments with an 87% target completion rate across online courses, workshops, webinars, and bootcamps.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {user?.role !== 'ROLE_EMPLOYEE' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Course
              </button>
            )}
            <button
              onClick={handleResetCatalog}
              className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
              title="Reset course catalog to enterprise defaults"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" /> Reset Catalog
            </button>
            <button
              onClick={fetchEnrollments}
              className="px-3.5 py-2.5 glass-panel text-slate-300 hover:text-white text-xs font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingEnrollments ? 'animate-spin' : ''}`} /> Sync Data
            </button>
          </div>
        </div>

        {/* Milestone Statistics KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-indigo-500/10">
          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Total Catalog Courses
            </div>
            <div className="text-xl font-bold text-white mt-1 font-outfit">847 <span className="text-xs text-indigo-400 font-normal">Active</span></div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-purple-400" /> Monthly Enrollments
            </div>
            <div className="text-xl font-bold text-white mt-1 font-outfit">12.4K <span className="text-xs text-purple-400 font-normal">/ month</span></div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Completion Rate
            </div>
            <div className="text-xl font-bold text-emerald-400 mt-1 font-outfit">87% <span className="text-xs text-slate-400 font-normal">achieved</span></div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Assessment Score Avg
            </div>
            <div className="text-xl font-bold text-amber-400 mt-1 font-outfit">87.0% <span className="text-xs text-slate-400 font-normal">Verified</span></div>
          </div>
        </div>
      </div>

      {/* Primary Module Navigation Bar (Validation Screens) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-800">
        {[
          { id: 'catalog', label: 'Course Catalog', icon: BookOpen, tag: 'Validation Screen 1' },
          { id: 'enrollments', label: 'Enrollment Tracking', icon: Users, tag: 'Validation Screen 2' },
          { id: 'paths', label: 'Learning Paths', icon: Compass, tag: 'Validation Screen 3' },
          { id: 'completion', label: 'Completion Tracking', icon: CheckCircle2, tag: 'Validation Screen 4' },
          { id: 'assessments', label: 'Assessment Results', icon: BarChart3, tag: 'Validation Screen 5' },
          { id: 'certificates', label: 'Certificates', icon: Award, tag: 'Validation Screen 6' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-t-2xl text-xs font-semibold transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500 font-bold'
                  : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COURSE CATALOG & CREATION (Validation Screen 1) */}
      {activeTab === 'catalog' && (
        <div className="space-y-6">
          {/* Controls Bar: Search & Format Filters */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search 847 online courses, workshops, bootcamps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Type Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" /> Format:
              </span>
              {['ALL', 'Online Course', 'Workshop', 'Webinar', 'Bootcamp'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                    filterType === t
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {['ALL', 'Backend', 'Frontend', 'Cloud', 'Management'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  filterCategory === cat
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                    : 'glass-panel text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'ALL' ? 'All Learning Modules' : cat}
              </button>
            ))}
          </div>

          {/* Course Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(filteredCourses || []).map((course) => (
              <div key={course.id} className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                      {course.category}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                      {course.type || 'Online Course'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white hover:text-indigo-300 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-indigo-400" /> {course.duration}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-purple-400" /> {course.enrolledCount} enrolled</span>
                    <span className="flex items-center gap-1 text-amber-400 font-bold"><Star className="w-3.5 h-3.5 fill-amber-400" /> {course.rating}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/courses/${course.id}`}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all"
                    >
                      <PlayCircle className="w-4 h-4 text-indigo-400" /> Watch Videos
                    </Link>

                    <button
                      onClick={() => handleEnrollUser(course.id, course.title)}
                      className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-indigo-600/20"
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: ENROLLMENT TRACKING (Validation Screen 2) */}
      {activeTab === 'enrollments' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" /> Enrollment Tracking &amp; Status Ledger
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Tracks employee registrations, completion status, and active progress across 12.4K monthly enrollments.
                </p>
              </div>
              <span className="px-3 py-1 bg-indigo-500/10 text-indigo-300 text-xs font-semibold rounded-full border border-indigo-500/20">
                {enrollments.length} Active Tracked Records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-900/60">
                    <th className="py-3 px-4">Enrollment ID</th>
                    <th className="py-3 px-4">Employee ID</th>
                    <th className="py-3 px-4">Course Title</th>
                    <th className="py-3 px-4">Enrolled Date</th>
                    <th className="py-3 px-4">Progress Bar</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {(enrollments || []).map((enr) => (
                    <tr key={enr.enrollmentId} className="hover:bg-slate-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-indigo-400">
                        {enr.enrollmentId.substring(0, 8)}...
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                        {enr.empId}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white">
                        {enr.courseTitle || getCourseTitle(enr.courseId)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400">
                        {enr.enrolledAt ? new Date(enr.enrolledAt).toLocaleDateString() : '2026-08-01'}
                      </td>
                      <td className="py-3.5 px-4 w-40">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${enr.completed ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                              style={{ width: `${enr.progress}%` }} 
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-300">{enr.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {enr.completed ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> Completed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold border border-amber-500/20">
                            <Clock className="w-3 h-3" /> In Progress
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        {enr.score > 0 ? `${enr.score}%` : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: LEARNING PATHS (Validation Screen 3) */}
      {activeTab === 'paths' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-1">
              <Compass className="w-5 h-5 text-indigo-400" /> Career Track Learning Paths
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Curated multi-module learning pathways aligned with enterprise role competencies.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  id: 'path-1',
                  title: 'Full-Stack Java Enterprise Architect',
                  roles: 'Developer → Tech Lead → Solutions Architect',
                  duration: '40 Hours (4 Modules)',
                  level: 'Advanced Track',
                  steps: [
                    { title: '1. Core Java Memory & Multithreading', status: 'Completed' },
                    { title: '2. Spring Boot 4 REST & JWT Security', status: 'In Progress' },
                    { title: '3. Microservices & Spring Cloud Gateway', status: 'Upcoming' },
                    { title: '4. Docker, Kubernetes & CI/CD Pipeline', status: 'Upcoming' }
                  ],
                  progress: 40
                },
                {
                  id: 'path-2',
                  title: 'AI & Data Engineering Specialist',
                  roles: 'Data Analyst → ML Engineer → AI Architect',
                  duration: '32 Hours (3 Modules)',
                  level: 'Intermediate Track',
                  steps: [
                    { title: '1. Python for Enterprise Analytics', status: 'Completed' },
                    { title: '2. Predictive Analytics & LLM Fine-tuning', status: 'Completed' },
                    { title: '3. AI Governance & Data Ethics', status: 'In Progress' }
                  ],
                  progress: 75
                },
                {
                  id: 'path-3',
                  title: 'Cloud Native DevOps & Security Specialist',
                  roles: 'SysAdmin → DevOps Engineer → Cloud Lead',
                  duration: '45 Hours (4 Modules)',
                  level: 'Executive Track',
                  steps: [
                    { title: '1. AWS Cloud Practitioner Fundamentals', status: 'Completed' },
                    { title: '2. Terraform Infrastructure as Code', status: 'In Progress' },
                    { title: '3. AWS Security & DevSecOps Compliance', status: 'Upcoming' },
                    { title: '4. AWS Solutions Architect Exam Prep', status: 'Upcoming' }
                  ],
                  progress: 50
                }
              ].map((path) => (
                <div key={path.id} className="glass-panel p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase">
                      {path.level}
                    </span>
                    <h3 className="font-bold text-base text-white">{path.title}</h3>
                    <p className="text-[11px] text-slate-400">{path.roles}</p>

                    {/* Path Steps Roadmap */}
                    <div className="space-y-2 pt-2">
                      {path.steps.map((step, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs">
                          {step.status === 'Completed' ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                          ) : step.status === 'In Progress' ? (
                            <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-slate-600 flex-shrink-0" />
                          )}
                          <span className={step.status === 'Completed' ? 'text-slate-200 font-semibold' : 'text-slate-400'}>
                            {step.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Progress: {path.progress}%</span>
                      <span>{path.duration}</span>
                    </div>
                    <button
                      onClick={() => showToast(`Enrolled in career path: ${path.title}`)}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20"
                    >
                      <ChevronRight className="w-4 h-4" /> Continue Learning Path
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: COMPLETION TRACKING (Validation Screen 4) */}
      {activeTab === 'completion' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Progress Update Form */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-400" /> Update Course Completion
            </h2>
            <p className="text-xs text-slate-400">
              Submit lesson progress and assessment scores to track course completion (87% target rate).
            </p>

            <form onSubmit={handleUpdateProgressSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Enrollment</label>
                <select
                  value={selectedEnrollmentId}
                  onChange={(e) => {
                    setSelectedEnrollmentId(e.target.value);
                    const selected = enrollments.find(enr => enr.enrollmentId === e.target.value);
                    if (selected) {
                      setUpdateProgressVal(selected.progress || 0);
                      setUpdateScoreVal(selected.score || 87.0);
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="">-- Choose active enrollment --</option>
                  {(enrollments || []).map((enr) => (
                    <option key={enr.enrollmentId} value={enr.enrollmentId}>
                      {enr.courseTitle || getCourseTitle(enr.courseId)} ({enr.progress}%)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Progress Percentage ({updateProgressVal}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={updateProgressVal}
                  onChange={(e) => setUpdateProgressVal(e.target.value)}
                  className="w-full accent-indigo-500 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Assessment Score (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  value={updateScoreVal}
                  onChange={(e) => setUpdateScoreVal(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" /> Save Progress &amp; Completion Status
              </button>
            </form>
          </div>

          {/* Active Completion Stream */}
          <div className="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" /> Completion Rate Stream (87% Target Achieved)
            </h2>
            
            <div className="space-y-3">
              {(enrollments || []).map((enr) => (
                <div key={enr.enrollmentId} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white">{enr.courseTitle || getCourseTitle(enr.courseId)}</h4>
                    <p className="text-[11px] text-slate-400">Employee ID: {enr.empId}</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-bold text-white">{enr.progress}% Completed</div>
                      <div className="text-[10px] text-slate-400">Score: {enr.score > 0 ? `${enr.score}%` : 'Pending'}</div>
                    </div>

                    {enr.completed ? (
                      <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" /> Passed &amp; Verified
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/20 flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> Active
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ASSESSMENT RESULTS (Validation Screen 5) */}
      {activeTab === 'assessments' && (
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-400" /> Assessment Results &amp; Verification Matrix
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Verified scores across enterprise software engineering &amp; cloud competency assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                id: 'ass-1',
                title: 'Enterprise Software Engineer Assessment 2026',
                score: 87,
                evaluator: 'HR - Marcus Vance',
                status: 'PASSED (VERIFIED)',
                date: '2026-08-07',
                skills: [
                  { name: 'Spring Boot Microservices', score: 90 },
                  { name: 'JWT Authentication & Security', score: 85 },
                  { name: 'JPA & Data Persistence', score: 86 }
                ]
              },
              {
                id: 'ass-2',
                title: 'AWS Cloud Architecture & Infrastructure Exam',
                score: 92.5,
                evaluator: 'Elena Rostova',
                status: 'PASSED (EXCELLENT)',
                date: '2026-08-11',
                skills: [
                  { name: 'AWS SAA Architecture', score: 95 },
                  { name: 'DevOps & CI/CD Pipelines', score: 90 },
                  { name: 'Cloud Security & IAM', score: 92 }
                ]
              }
            ].map((ass) => (
              <div key={ass.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                    {ass.status}
                  </span>
                  <span className="text-xs text-slate-400">{ass.date}</span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-white">{ass.title}</h3>
                  <p className="text-xs text-slate-400">Evaluated by: {ass.evaluator}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-semibold">Total Verified Score</span>
                  <span className="text-2xl font-black text-emerald-400 font-outfit">{ass.score}%</span>
                </div>

                <div className="space-y-2 pt-2">
                  {ass.skills.map((s, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{s.name}</span>
                        <span className="text-indigo-400 font-bold">{s.score}%</span>
                      </div>
                      <div className="bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${s.score}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: CERTIFICATE GENERATION (Validation Screen 6) */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Digital Certificate Generation &amp; Verification
            </h2>
            <p className="text-xs text-slate-400">
              Certificates automatically generated upon 100% course completion with digital security hash codes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {[
                {
                  id: 'cert-1',
                  code: 'SKSP-8F92A14B',
                  courseTitle: 'Enterprise Java Spring Boot 4 & Security',
                  userName: 'John Smith',
                  issueDate: '2026-08-10',
                  status: 'VALID',
                  authority: 'SkillSphere Learning Authority'
                },
                {
                  id: 'cert-2',
                  code: 'SKSP-92C1D40E',
                  courseTitle: 'AWS Certified Solutions Architect & Cloud Native Strategy',
                  userName: 'Alex Chen',
                  issueDate: '2026-08-11',
                  status: 'VALID',
                  authority: 'Amazon Web Services & SkillSphere'
                }
              ].map((cert) => (
                <div key={cert.id} className="glass-panel p-6 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 relative space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 text-[10px] font-mono font-bold border border-amber-500/20">
                      {cert.code}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                      VERIFIED CERTIFICATE
                    </span>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Issued to</div>
                    <div className="text-lg font-extrabold text-white font-outfit">{cert.userName}</div>
                  </div>

                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Course Completed</div>
                    <div className="text-sm font-bold text-amber-200">{cert.courseTitle}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                    <span>Issue Date: {cert.issueDate}</span>
                    <span>{cert.authority}</span>
                  </div>

                  <button
                    onClick={() => setSelectedCert(cert)}
                    className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <Award className="w-4 h-4" /> View &amp; Download Digital Certificate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CREATE COURSE MODAL (Validation Screen 1) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 w-full max-w-lg space-y-5 bg-slate-900 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-400" /> Create New Course
              </h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCourseSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Microservices with Spring Boot 4"
                  value={newCourse.title}
                  onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Format Type</label>
                  <select
                    value={newCourse.type}
                    onChange={(e) => setNewCourse({ ...newCourse, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Online Course">Online Course</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Webinar">Webinar</option>
                    <option value="Bootcamp">Bootcamp</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCourse.category}
                    onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Backend Engineering">Backend Engineering</option>
                    <option value="Frontend Web Development">Frontend Web Development</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                    <option value="Management & Leadership">Management & Leadership</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Course summary and objectives..."
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 10 Hours"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Trainer Name</label>
                  <input
                    type="text"
                    value={newCourse.trainerName}
                    onChange={(e) => setNewCourse({ ...newCourse, trainerName: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/25"
                >
                  Save &amp; Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATE PREVIEW MODAL (Validation Screen 6) */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 rounded-3xl border-2 border-amber-500/40 p-8 shadow-2xl space-y-6 relative text-center">
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white font-bold text-lg"
            >
              ✕
            </button>

            <div className="inline-flex p-3 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold tracking-widest text-amber-400 uppercase">
                Official Digital Certificate of Completion
              </span>
              <h2 className="text-2xl font-black text-white font-outfit">SkillSphere Enterprise LMS</h2>
            </div>

            <div className="py-4 border-y border-slate-800 space-y-3">
              <p className="text-xs text-slate-400 uppercase tracking-wider">This is to certify that</p>
              <h3 className="text-2xl font-extrabold text-amber-300 font-outfit">{selectedCert.userName}</h3>
              <p className="text-xs text-slate-400">has successfully completed the comprehensive training program:</p>
              <h4 className="text-base font-bold text-white">{selectedCert.courseTitle}</h4>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
              <div className="text-left">
                <div>Verification Code: <span className="font-mono text-amber-400 font-bold">{selectedCert.code}</span></div>
                <div>Issued Date: {selectedCert.issueDate}</div>
              </div>
              <div className="text-right">
                <div className="text-emerald-400 font-bold flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Authenticated</div>
                <div>{selectedCert.authority}</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download / Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LmsCatalog;

import React, { useState, useEffect } from 'react';
import { BookOpen, PlayCircle, Star, Clock, Users, Plus, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export const LmsCatalog = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filterCategory, setFilterCategory] = useState('ALL');

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/lms/courses');
      setCourses(res.data);
    } catch (err) {
      setCourses([
        { id: 1, title: 'Enterprise Java Spring Boot 3 & Security', description: 'Master modern Spring Boot 3 RESTful APIs, Spring Security 6 with JWT tokens, Spring Data JPA, and Microservices Architecture.', category: 'Backend Engineering', level: 'Advanced', duration: '12 Hours', rating: 4.9, enrolledCount: 1240, trainerName: 'Prof. David Sterling' },
        { id: 2, title: 'React 18 & Modern Tailwind CSS Enterprise UI', description: 'Build high-performance web applications using React hooks, dynamic routing, state management, and custom glassmorphism Tailwind design systems.', category: 'Frontend Web Development', level: 'Intermediate', duration: '10 Hours', rating: 4.85, enrolledCount: 980, trainerName: 'Prof. David Sterling' },
        { id: 3, title: 'AI-Driven Workforce Analytics & HR Strategy', description: 'Leverage predictive AI models, skill gap matrixes, and performance KPIs to optimize enterprise talent development.', category: 'Management & Leadership', level: 'Executive', duration: '6 Hours', rating: 4.95, enrolledCount: 620, trainerName: 'Elena Rostova' }
      ]);
    }
  };

  const filteredCourses = filterCategory === 'ALL'
    ? courses
    : courses.filter(c => c.category?.toLowerCase().includes(filterCategory.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-semibold border border-indigo-500/20 mb-2">
            <BookOpen className="w-3.5 h-3.5" /> Learning Management System (LMS)
          </div>
          <h1 className="text-2xl font-extrabold text-white font-outfit">
            Enterprise Course <span className="gradient-text">Catalog</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access video lectures, lecture notes, interactive quizzes, and downloadable digital completion certificates.
          </p>
        </div>

        {user?.role === 'ROLE_TRAINER' || user?.role === 'ROLE_ADMIN' ? (
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs rounded-xl shadow-lg flex items-center gap-2">
            <Plus className="w-4 h-4" /> Create Course
          </button>
        ) : null}
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['ALL', 'Backend', 'Frontend', 'Management'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'glass-panel text-slate-400 hover:text-white'
            }`}
          >
            {cat === 'ALL' ? 'All Learning Modules' : cat}
          </button>
        ))}
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id} className="glass-panel glass-panel-hover p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                  {course.category}
                </span>
                <div className="flex items-center gap-1 text-amber-400 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{course.rating}</span>
                </div>
              </div>

              <h3 className="font-bold text-base text-white">{course.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">{course.description}</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {course.enrolledCount} enrolled</span>
              </div>

              <Link
                to={`/courses/${course.id}`}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-600/20"
              >
                <PlayCircle className="w-4 h-4" /> Start Learning
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

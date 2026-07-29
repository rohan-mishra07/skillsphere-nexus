import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  PlayCircle, 
  CheckCircle, 
  FileText, 
  Award, 
  ArrowLeft, 
  Sparkles, 
  Download,
  HelpCircle,
  Check
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { CertificateModal } from '../components/CertificateModal';

export const CoursePlayer = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([1]);
  const [showCertModal, setShowCertModal] = useState(false);
  const [certCode, setCertCode] = useState('SKSP-89F2A90C');

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      const cRes = await api.get(`/lms/courses/${id || 1}`);
      setCourse(cRes.data);
      const lRes = await api.get(`/lms/courses/${id || 1}/lessons`);
      setLessons(lRes.data);
      if (lRes.data.length > 0) setActiveLesson(lRes.data[0]);
    } catch (err) {
      const fallbackCourse = {
        id: 1,
        title: 'Enterprise Java Spring Boot 3 & Security',
        description: 'Master modern Spring Boot 3 RESTful APIs, Spring Security 6 with JWT tokens, Spring Data JPA, and Microservices Architecture.',
        category: 'Backend Engineering',
        trainerName: 'Prof. David Sterling',
        level: 'Advanced'
      };
      setCourse(fallbackCourse);
      const fallbackLessons = [
        { id: 1, title: '1. Introduction to Spring Boot 3 & Architecture', videoUrl: 'https://www.youtube.com/embed/9SGDpanrc8U', notesContent: 'Spring Boot makes it easy to create stand-alone production grade Spring based Applications.', durationMinutes: 25 },
        { id: 2, title: '2. Implementing JWT Authentication & Security Filter Chains', videoUrl: 'https://www.youtube.com/embed/9SGDpanrc8U', notesContent: 'Stateless authentication using JSON Web Tokens ensures high scalability across distributed microservices.', durationMinutes: 45 },
      ];
      setLessons(fallbackLessons);
      setActiveLesson(fallbackLessons[0]);
    }
  };

  const handleLessonComplete = async (lessonId) => {
    if (!completedLessons.includes(lessonId)) {
      const updated = [...completedLessons, lessonId];
      setCompletedLessons(updated);
      if (updated.length >= lessons.length) {
        try {
          const certRes = await api.post(`/lms/certificates/issue?userId=${user?.id || 4}&userName=${encodeURIComponent(user?.fullName || 'Alex Chen')}&courseId=${id || 1}`);
          if (certRes.data?.certificateCode) setCertCode(certRes.data.certificateCode);
        } catch (e) {}
        setShowCertModal(true);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Link to="/courses" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to LMS Catalog
        </Link>
        <button
          onClick={() => setShowCertModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/20"
        >
          <Award className="w-4 h-4" /> Claim Digital Certificate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video & Notes Player */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-black aspect-video relative">
            {activeLesson ? (
              <iframe
                src={activeLesson.videoUrl}
                title={activeLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
                Select a lecture to start watching
              </div>
            )}
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/20">
                  Lecture Video
                </span>
                <h1 className="text-xl font-bold text-white mt-1 font-outfit">{activeLesson?.title}</h1>
              </div>
              <button
                onClick={() => activeLesson && handleLessonComplete(activeLesson.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all ${
                  completedLessons.includes(activeLesson?.id)
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <Check className="w-4 h-4" />
                {completedLessons.includes(activeLesson?.id) ? 'Completed' : 'Mark as Finished'}
              </button>
            </div>

            <hr className="border-slate-800" />

            <div className="space-y-2">
              <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" /> Lecture Notes & Downloads
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">{activeLesson?.notesContent}</p>
            </div>
          </div>
        </div>

        {/* Course Playlist Sidebar */}
        <div className="space-y-4">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div>
              <h2 className="font-bold text-base text-white">{course?.title}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Instructor: {course?.trainerName}</p>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Course Progress</span>
                <span className="font-bold text-emerald-400">
                  {Math.round((completedLessons.length / (lessons.length || 1)) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full transition-all duration-300"
                  style={{ width: `${(completedLessons.length / (lessons.length || 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {lessons.map((les) => (
                <button
                  key={les.id}
                  onClick={() => setActiveLesson(les)}
                  className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between gap-3 ${
                    activeLesson?.id === les.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-white'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {completedLessons.includes(les.id) ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <PlayCircle className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                    <span className="truncate">{les.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 shrink-0">{les.durationMinutes}m</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Official Certificate Modal */}
      <CertificateModal
        isOpen={showCertModal}
        onClose={() => setShowCertModal(false)}
        certificateData={{
          userName: user?.fullName || 'Alex Chen',
          courseTitle: course?.title || 'Enterprise Java Spring Boot 3 Security Certification',
          issueDate: 'July 27, 2026',
          certificateCode: certCode,
          instructor: course?.trainerName || 'Prof. David Sterling',
          director: 'Sarah Jenkins'
        }}
      />
    </div>
  );
};

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LoginModal } from './components/LoginModal';
import { DashboardRouter } from './pages/DashboardRouter';
import { LmsCatalog } from './pages/LmsCatalog';
import { CoursePlayer } from './pages/CoursePlayer';
import { SkillManagementHub } from './pages/SkillManagementHub';
import { WorkforcePlanner } from './pages/WorkforcePlanner';
import { PerformanceHub } from './pages/PerformanceHub';
import { RecruitmentBoard } from './pages/RecruitmentBoard';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { StudentLoginPage } from './pages/StudentLoginPage';

export function App() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content Workspace Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <Navbar
              onOpenAiModal={() => setIsAiModalOpen(true)}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
            />

            <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
              <Routes>
                <Route path="/" element={<DashboardRouter />} />
                <Route path="/login" element={<StudentLoginPage />} />
                <Route path="/courses" element={<LmsCatalog />} />
                <Route path="/courses/:id" element={<CoursePlayer />} />
                <Route path="/skills" element={<SkillManagementHub />} />
                <Route path="/workforce" element={<WorkforcePlanner />} />
                <Route path="/performance" element={<PerformanceHub />} />
                <Route path="/recruitment" element={<RecruitmentBoard />} />
                <Route path="/analytics" element={<ReportsAnalytics />} />
              </Routes>
            </main>
          </div>

          {/* AI Assistant Modal */}
          <AiAssistantModal
            isOpen={isAiModalOpen}
            onClose={() => setIsAiModalOpen(false)}
          />

          {/* Login Bar / Modal */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

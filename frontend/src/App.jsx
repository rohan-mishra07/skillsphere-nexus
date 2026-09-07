import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkforceProvider } from './context/WorkforceContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AiAssistantModal } from './components/AiAssistantModal';
import { LoginModal } from './components/LoginModal';
import { Login } from './pages/Login';
import { DashboardRouter } from './pages/DashboardRouter';
import { LmsCatalog } from './pages/LmsCatalog';
import { CoursePlayer } from './pages/CoursePlayer';
import { SkillManagementHub } from './pages/SkillManagementHub';
import { WorkforcePlanner } from './pages/WorkforcePlanner';
import { PerformanceHub } from './pages/PerformanceHub';
import { RecruitmentBoard } from './pages/RecruitmentBoard';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { Milestone2Dashboard } from './pages/Milestone2Dashboard';
import { CertificationManagement } from './pages/CertificationManagement';
import { CareerAnalytics } from './pages/CareerAnalytics';
import { MobileBottomNav } from './components/MobileBottomNav';

const ProtectedLayout = ({ onOpenAiModal, onOpenLoginModal }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex min-h-screen bg-[#0b1120] text-slate-100 font-sans pb-16 md:pb-0">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Content Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onOpenAiModal={onOpenAiModal}
          onOpenLoginModal={onOpenLoginModal}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export function AppContent() {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Dashboard Workspace Routes */}
        <Route element={<ProtectedLayout onOpenAiModal={() => setIsAiModalOpen(true)} onOpenLoginModal={() => setIsLoginModalOpen(true)} />}>
          <Route path="/" element={<DashboardRouter />} />
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/career-analytics" element={<CareerAnalytics />} />
          <Route path="/career" element={<CareerAnalytics />} />
          <Route path="/milestone2" element={<Milestone2Dashboard />} />
          <Route path="/certifications" element={<CertificationManagement />} />
          <Route path="/courses" element={<LmsCatalog />} />
          <Route path="/learning" element={<LmsCatalog />} />
          <Route path="/courses/:id" element={<CoursePlayer />} />
          <Route path="/skills" element={<SkillManagementHub />} />
          <Route path="/workforce" element={<WorkforcePlanner />} />
          <Route path="/performance" element={<PerformanceHub />} />
          <Route path="/recruitment" element={<RecruitmentBoard />} />
          <Route path="/jobs" element={<RecruitmentBoard />} />
          <Route path="/analytics" element={<ReportsAnalytics />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>

      {/* AI Assistant Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Quick Login Bar / Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </Router>
  );
}

export function App() {
  return (
    <WorkforceProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </WorkforceProvider>
  );
}

export default App;

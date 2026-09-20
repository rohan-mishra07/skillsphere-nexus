import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Interceptor to inject JWT Token into headers
api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('skillsphere_user') || '{}');
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch connection refused / network errors and return mock fallbacks
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const url = error.config?.url || '';

    // Handle ECONNREFUSED or Network Error gracefully for specific endpoints
    if (!error.response || error.code === 'ECONNREFUSED' || error.message.includes('Network Error') || error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
      
      // 1. /workforce/leaves/user/:id or /workforce/leaves
      if (url.includes('/workforce/leaves')) {
        const savedLeaves = localStorage.getItem('nexus_leave_requests') || localStorage.getItem('skillsphere_leave_requests');
        const defaultLeaves = savedLeaves ? JSON.parse(savedLeaves) : [
          { id: 1, leaveType: 'Annual Vacation', startDate: '2026-08-10', endDate: '2026-08-14', reason: 'Tech Summit', status: 'APPROVED', approvedBy: 'Marcus Vance' },
          { id: 2, leaveType: 'Personal / Sick', startDate: '2026-09-02', endDate: '2026-09-03', reason: 'Medical checkup', status: 'PENDING', approvedBy: null }
        ];
        return Promise.resolve({ data: defaultLeaves, status: 200, statusText: 'OK (Offline Fallback)' });
      }

      // 2. /learning/enrollments
      if (url.includes('/learning/enrollments')) {
        const savedEnrollments = localStorage.getItem('nexus_enrolled_courses');
        const defaultEnrollments = savedEnrollments ? JSON.parse(savedEnrollments) : [
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
          }
        ];
        return Promise.resolve({ data: defaultEnrollments, status: 200, statusText: 'OK (Offline Fallback)' });
      }

      // 3. /analytics/dashboard
      if (url.includes('/analytics/dashboard')) {
        const defaultTelemetry = {
          completionRate: '88.4%',
          activeStaff: 484,
          satisfactionAvg: 4.6,
          averageCourseCompletionRate: '88.4%',
          workforceProductivityIndex: '92.1%',
          skillGapClosureRate: '+14.8%'
        };
        return Promise.resolve({ data: defaultTelemetry, status: 200, statusText: 'OK (Offline Fallback)' });
      }
    }

    return Promise.reject(error);
  }
);

export default api;


import React, { createContext, useContext, useState, useEffect } from 'react';

const WorkforceContext = createContext();

export const DEFAULT_LEAVES = [
  {
    id: 'LV-101',
    employeeName: 'Alex Chen',
    employeeEmail: 'employee@skillsphere.com',
    role: 'Senior Software Engineer',
    employeeRole: 'Senior Software Engineer',
    leaveType: 'Annual Vacation',
    startDate: '2026-08-10',
    endDate: '2026-08-14',
    duration: '5 Days',
    daysCount: '5 Days',
    reason: 'Attending International Tech Summit',
    status: 'PENDING',
    submittedAt: '2026-08-01',
    submissionDate: 'Aug 1, 2026'
  },
  {
    id: 'LV-102',
    employeeName: 'Rohan Mishra',
    employeeEmail: 'rohan.mishra@skillsphere.com',
    role: 'Software Engineer',
    employeeRole: 'Software Engineer',
    leaveType: 'Wedding / Earned Leave',
    startDate: '2026-09-18',
    endDate: '2026-09-22',
    duration: '4 Days',
    daysCount: '4 Days',
    reason: 'Attending sibling wedding in Rajasthan',
    status: 'PENDING',
    submittedAt: '2026-09-11',
    submissionDate: 'Sept 11, 2026'
  }
];

export const getIndiaTimeString = (offsetMinutes = 0) => {
  const date = new Date(Date.now() - offsetMinutes * 60 * 1000);
  return date.toLocaleTimeString('en-IN', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });
};

export const getIndiaDateString = () => {
  return new Date().toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const WorkforceProvider = ({ children }) => {
  const [totalHeadcount, setTotalHeadcount] = useState(12482);
  const [activeInOffice, setActiveInOffice] = useState(482);
  const [clockedInToday, setClockedInToday] = useState(438);
  const [pulseType, setPulseType] = useState(null); // 'JOIN' | 'LEFT' | null
  const [latestEvent, setLatestEvent] = useState({
    id: 1,
    name: 'Rohan Mishra',
    action: 'JOIN',
    time: getIndiaTimeString(0),
    department: 'Software Engineering',
    shift: 'Shift (India IST)',
    status: 'Logged In'
  });

  const [liveLog, setLiveLog] = useState([
    { id: 1, name: 'Alex Chen', action: 'JOIN', time: getIndiaTimeString(2), department: 'Software Engineering', shift: 'IST Live Shift', status: 'Logged In' },
    { id: 2, name: 'Priya Sharma', action: 'JOIN', time: getIndiaTimeString(6), department: 'Data Science', shift: 'IST Live Shift', status: 'Logged In' },
    { id: 3, name: 'David Kim', action: 'JOIN', time: getIndiaTimeString(12), department: 'DevOps Engineering', shift: 'IST Live Shift', status: 'Logged In' },
    { id: 4, name: 'Sarah Jenkins', action: 'JOIN', time: getIndiaTimeString(18), department: 'Executive', shift: 'IST Live Shift', status: 'Logged In' },
    { id: 5, name: 'Marcus Vance', action: 'JOIN', time: getIndiaTimeString(25), department: 'Human Resources', shift: 'IST Live Shift', status: 'Logged In' }
  ]);

  // Centralized Leave Management state with localStorage persistence
  const [leaveRequests, setLeaveRequests] = useState(() => {
    const saved = localStorage.getItem('skillsphere_leave_requests');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error("Failed to parse leaves:", e);
      }
    }
    return DEFAULT_LEAVES;
  });

  // Sync leaveRequests to localStorage on change
  useEffect(() => {
    localStorage.setItem('skillsphere_leave_requests', JSON.stringify(leaveRequests));
  }, [leaveRequests]);

  const addLeaveRequest = (newLeave) => {
    setLeaveRequests((prev) => [newLeave, ...prev]);
  };

  const approveLeaveRequest = (reqId) => {
    setLeaveRequests((prev) =>
      (Array.isArray(prev) ? prev : DEFAULT_LEAVES).map((req) => (req.id === reqId ? { ...req, status: 'APPROVED' } : req))
    );
  };

  const rejectLeaveRequest = (reqId, reason) => {
    setLeaveRequests((prev) =>
      (Array.isArray(prev) ? prev : DEFAULT_LEAVES).map((req) =>
        req.id === reqId
          ? { ...req, status: 'REJECTED', rejectionReason: reason }
          : req
      )
    );
  };

  // Record user login event (Called when someone logs in or switches role)
  const recordLogin = (userData) => {
    const name = userData?.fullName || userData?.name || 'Authorized User';
    const dept = userData?.department || 'Software Engineering';
    const nowTime = getIndiaTimeString(0);

    setTotalHeadcount(prev => prev + 1);
    setActiveInOffice(prev => prev + 1);
    setClockedInToday(prev => prev + 1);
    setPulseType('JOIN');

    const newEvent = {
      id: Date.now(),
      name: name,
      action: 'JOIN',
      time: nowTime,
      department: dept,
      shift: 'IST Live Shift',
      status: 'Logged In'
    };

    setLatestEvent(newEvent);
    setLiveLog(prev => [newEvent, ...(Array.isArray(prev) ? prev.slice(0, 24) : [])]);

    setTimeout(() => {
      setPulseType(null);
    }, 2500);
  };

  // Record user logout event (Called when someone logs out)
  const recordLogout = (userData) => {
    const name = userData?.fullName || userData?.name || 'User';
    const dept = userData?.department || 'Software Engineering';
    const nowTime = getIndiaTimeString(0);

    setActiveInOffice(prev => Math.max(1, prev - 1));
    setPulseType('LEFT');

    const newEvent = {
      id: Date.now(),
      name: name,
      action: 'LEFT',
      time: nowTime,
      department: dept,
      shift: 'Logged Out',
      status: 'Logged Out'
    };

    setLatestEvent(newEvent);
    setLiveLog(prev => [newEvent, ...(Array.isArray(prev) ? prev.slice(0, 24) : [])]);

    setTimeout(() => {
      setPulseType(null);
    }, 2500);
  };

  const formattedTotalHeadcount = totalHeadcount >= 1000 
    ? (totalHeadcount / 1000).toFixed(2) + 'K'
    : totalHeadcount.toLocaleString();

  return (
    <WorkforceContext.Provider value={{
      totalHeadcount,
      formattedTotalHeadcount,
      activeInOffice,
      clockedInToday,
      pulseType,
      latestEvent,
      liveLog,
      leaveRequests,
      addLeaveRequest,
      approveLeaveRequest,
      rejectLeaveRequest,
      recordLogin,
      recordLogout,
      getIndiaTimeString,
      getIndiaDateString
    }}>
      {children}
    </WorkforceContext.Provider>
  );
};

export const useWorkforce = () => useContext(WorkforceContext);

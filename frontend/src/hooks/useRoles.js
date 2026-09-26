import { useAuth } from '../context/AuthContext';

/**
 * Centralised role-checking hook.
 *
 * All role comparisons in the UI and action handlers go through this hook
 * so permission logic lives in exactly one place.
 *
 * Usage in components:
 *   const { canCreateCourse, canCreateJob } = useRoles();
 *   {canCreateCourse && <button>+ Create Course</button>}
 *
 * Usage in action handlers (offline guard):
 *   const { assertCanCreateCourse } = useRoles();
 *   const err = assertCanCreateCourse();
 *   if (err) { showToast(err, 'error'); return; }
 */
export function useRoles() {
  const { user } = useAuth();
  const role = user?.role ?? '';

  /** True for ROLE_ADMIN */
  const isAdmin = role === 'ROLE_ADMIN';

  /** True for ROLE_TRAINER (maps to "Training Manager" in the Role enum) */
  const isTrainer = role === 'ROLE_TRAINER';

  /** True for ROLE_HR */
  const isHR = role === 'ROLE_HR';

  /** True for ROLE_MANAGER */
  const isManager = role === 'ROLE_MANAGER';

  /** True for ROLE_EMPLOYEE */
  const isEmployee = role === 'ROLE_EMPLOYEE';

  /** True for ROLE_STUDENT */
  const isStudent = role === 'ROLE_STUDENT';

  // ── Derived capability flags ──────────────────────────────────────────────

  /**
   * Course creation / upload:
   *   ADMIN  → full platform authority
   *   TRAINER → content author / training manager equivalent
   */
  const canCreateCourse = isAdmin || isTrainer;

  /**
   * Course catalog reset (destructive admin utility):
   *   ADMIN only.
   */
  const canResetCatalog = isAdmin;

  /**
   * Course catalog upload / sync content:
   *   ADMIN or TRAINER.
   */
  const canUploadContent = isAdmin || isTrainer;

  /**
   * Job posting creation:
   *   ADMIN only — mirrors backend @PreAuthorize("hasRole('ADMIN')").
   */
  const canCreateJob = isAdmin;

  /**
   * Career plan creation (management action):
   *   ADMIN, HR, MANAGER.
   */
  const canCreateCareerPlan = isAdmin || isHR || isManager;

  /**
   * Course enrollment — all authenticated roles.
   * (Routes are behind ProtectedLayout so user is always non-null here.)
   */
  const canEnrollCourse = !!role;

  /**
   * Job application — all authenticated roles.
   */
  const canApplyToJob = !!role;

  const canReadCourses = !!role;

  // ── Imperative guard helpers (for use inside async action handlers) ───────
  //
  // These return an error message string when the user lacks permission,
  // or null when the action is allowed.  Handlers call them at the very top
  // before touching any state or localStorage, mirroring the server-side
  // @PreAuthorize check in offline / demo mode.

  /**
   * Guard for course creation.
   * Returns null if allowed; error message string if forbidden.
   *
   * Mirror of: @PreAuthorize("hasAnyRole('ADMIN','TRAINER')")
   */
  const assertCanCreateCourse = () =>
    canCreateCourse
      ? null
      : 'Unauthorized: Only Admins and Training Managers can publish courses.';

  /**
   * Guard for catalog reset.
   * Mirror of: @PreAuthorize("hasRole('ADMIN')")
   */
  const assertCanResetCatalog = () =>
    canResetCatalog
      ? null
      : 'Unauthorized: Only Admins can reset the course catalog.';

  /**
   * Guard for job posting creation.
   * Mirror of: @PreAuthorize("hasRole('ADMIN')")
   */
  const assertCanCreateJob = () =>
    canCreateJob
      ? null
      : 'Unauthorized: Only Admins can post new job openings.';

  /**
   * Guard for career plan creation.
   * Mirror of: @PreAuthorize("hasAnyRole('ADMIN','HR','MANAGER')")
   */
  const assertCanCreateCareerPlan = () =>
    canCreateCareerPlan
      ? null
      : 'Unauthorized: Only Admins, HR, and Managers can create career plans.';

  /**
   * Guard for course enrollment.
   * Mirror of: @PreAuthorize("hasAnyRole('ADMIN','TRAINER','MANAGER','EMPLOYEE','HR','STUDENT')")
   */
  const assertCanEnroll = () =>
    canEnrollCourse ? null : 'Unauthorized: You must be logged in to enroll in courses.';

  /**
   * Guard for job application.
   * Mirror of: @PreAuthorize("hasAnyRole(...all roles...)")
   */
  const assertCanApplyToJob = () =>
    canApplyToJob ? null : 'Unauthorized: You must be logged in to apply for jobs.';

  return {
    role,
    isAdmin,
    isTrainer,
    isHR,
    isManager,
    isEmployee,
    isStudent,
    // Capability flags (use in JSX conditional rendering)
    canCreateCourse,
    canResetCatalog,
    canUploadContent,
    canCreateJob,
    canCreateCareerPlan,
    canEnrollCourse,
    canApplyToJob,
    canReadCourses,
    // Imperative guards (use in async handlers before localStorage/state writes)
    assertCanCreateCourse,
    assertCanResetCatalog,
    assertCanCreateJob,
    assertCanCreateCareerPlan,
    assertCanEnroll,
    assertCanApplyToJob,
  };
}


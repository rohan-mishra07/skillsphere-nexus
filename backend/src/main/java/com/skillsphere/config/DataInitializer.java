package com.skillsphere.config;

import com.skillsphere.model.*;
import com.skillsphere.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Component("coreDataInitializer")
@SuppressWarnings("null")
public class DataInitializer implements CommandLineRunner {

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private LessonRepository lessonRepository;

        @Autowired
        private SkillRepository skillRepository;

        @Autowired
        private UserSkillRepository userSkillRepository;

        @Autowired
        private AttendanceRepository attendanceRepository;

        @Autowired
        private LeaveRequestRepository leaveRequestRepository;

        @Autowired
        private PerformanceGoalRepository performanceGoalRepository;

        @Autowired
        private JobPostingRepository jobPostingRepository;

        @Autowired
        private ApplicantRepository applicantRepository;

        @Autowired
        private AssessmentRepository assessmentRepository;

        @Autowired
        private CertificateRepository certificateRepository;

        @Autowired
        private CompetencyFrameworkRepository competencyFrameworkRepository;

        @Autowired
        private EmployeeRepository employeeRepository;

        @Autowired
        private EnrollmentRepository enrollmentRepository;

        @Autowired
        private LearningPathRepository learningPathRepository;

        @Autowired
        private CourseContentRepository courseContentRepository;

        @Autowired
        private AssessmentResultRepository assessmentResultRepository;

        @Autowired
        private LearningCertificateRepository learningCertificateRepository;

        @Autowired
        private com.skillsphere.skillservice.repository.CertificationRepository certificationRepository;

        @Autowired
        private PasswordEncoder encoder;

        @Override
        @SuppressWarnings("null")
        public void run(String... args) throws Exception {
                if (userRepository.count() > 0) {
                        return;
                }

                System.out.println("--> Seeding SkillSphere Platform Initial Data (Milestone 1)...");

                // 1. Seed Users (Admin, HR, Manager, Employee - John Smith & Alex Chen)
                User admin = User.builder()
                                .fullName("Sarah Jenkins")
                                .email("admin@skillsphere.com")
                                .password(encoder.encode("admin123"))
                                .role(Role.ROLE_ADMIN)
                                .department("Executive Management")
                                .designation("Platform Director")
                                .active(true)
                                .build();

                User hr = User.builder()
                                .fullName("Marcus Vance")
                                .email("hr@skillsphere.com")
                                .password(encoder.encode("hr123456"))
                                .role(Role.ROLE_HR)
                                .department("Human Resources")
                                .designation("Head of People Operations")
                                .active(true)
                                .build();

                User manager = User.builder()
                                .fullName("Elena Rostova")
                                .email("manager@skillsphere.com")
                                .password(encoder.encode("manager123"))
                                .role(Role.ROLE_MANAGER)
                                .department("Engineering & IT")
                                .designation("Engineering Manager")
                                .active(true)
                                .build();

                // Milestone 1 Featured Employee: Rohan Mishra
                User johnSmith = User.builder()
                                .fullName("Rohan Mishra")
                                .email("rohan.mishra@skillsphere.com")
                                .password(encoder.encode("rohan1234"))
                                .role(Role.ROLE_EMPLOYEE)
                                .department("Software Engineering")
                                .designation("Developer")
                                .active(true)
                                .build();

                User employee = User.builder()
                                .fullName("Alex Chen")
                                .email("employee@skillsphere.com")
                                .password(encoder.encode("user1234"))
                                .role(Role.ROLE_EMPLOYEE)
                                .department("Engineering & IT")
                                .designation("Senior Full Stack Engineer")
                                .active(true)
                                .build();

                userRepository.saveAll(Arrays.asList(admin, hr, manager, johnSmith, employee));

                Employee emp1 = Employee.builder()
                                .empId(java.util.UUID.randomUUID())
                                .id(johnSmith.getId())
                                .name("Rohan Mishra")
                                .email("rohan.mishra@skillsphere.com")
                                .role(Employee.Role.DEVELOPER)
                                .department("Software Engineering")
                                .designation("Developer")
                                .build();

                Employee emp2 = Employee.builder()
                                .empId(java.util.UUID.randomUUID())
                                .id(employee.getId())
                                .name("Alex Chen")
                                .email("employee@skillsphere.com")
                                .role(Employee.Role.DEVELOPER)
                                .department("Engineering & IT")
                                .designation("Senior Full Stack Engineer")
                                .build();

                List<Employee> savedEmployees = employeeRepository.saveAll(Arrays.asList(emp1, emp2));
                Employee targetEmp = savedEmployees.get(0);

                // 2. Seed Courses
                Course course1 = Course.builder()
                                .title("Enterprise Java Spring Boot 4 & Security")
                                .description("Master modern Spring Boot 4 RESTful APIs, Spring Security with JWT tokens, Spring Data JPA, and Microservices Architecture.")
                                .duration(12)
                                .type(Course.CourseType.ONLINE)
                                .instructor("Prof. David Sterling")
                                .rating(4.9)
                                .active(true)
                                .build();

                Course course2 = Course.builder()
                                .title("React 18 & Modern Web Enterprise UI")
                                .description("Build high-performance web applications using React hooks, dynamic routing, state management, and enterprise design systems.")
                                .duration(10)
                                .type(Course.CourseType.WORKSHOP)
                                .instructor("Prof. David Sterling")
                                .rating(4.85)
                                .active(true)
                                .build();

                Course course3 = Course.builder()
                                .title("AWS Certified Solutions Architect & Cloud Native Strategy")
                                .description("Designing fault-tolerant, highly available enterprise microservices on AWS Cloud infrastructure.")
                                .duration(15)
                                .type(Course.CourseType.BOOTCAMP)
                                .instructor("Elena Rostova")
                                .rating(4.95)
                                .active(true)
                                .build();

                courseRepository.saveAll(Arrays.asList(course1, course2, course3));

                // 3. Seed Lessons
                Lesson l1 = Lesson.builder()
                                .courseId(course1.getId())
                                .title("1. Introduction to Spring Boot 4 Architecture")
                                .videoUrl("https://www.youtube.com/embed/9SGDpanrc8U")
                                .notesContent("Spring Boot makes it easy to create stand-alone, production-grade Spring based Applications.")
                                .durationMinutes(25)
                                .sequenceOrder(1)
                                .build();

                Lesson l2 = Lesson.builder()
                                .courseId(course1.getId())
                                .title("2. Implementing JWT Authentication & RBAC Filters")
                                .videoUrl("https://www.youtube.com/embed/9SGDpanrc8U")
                                .notesContent("Stateless authentication using JSON Web Tokens ensures high scalability across microservices.")
                                .durationMinutes(45)
                                .sequenceOrder(2)
                                .build();

                lessonRepository.saveAll(Arrays.asList(l1, l2));

                // 4. Seed Skills Catalog across Technical, Domain, and Soft Categories
                Skill s1 = Skill.builder().name("Java").category("Technical")
                                .description("Core Java Programming Language & Memory Management").build();
                Skill s2 = Skill.builder().name("Spring Boot").category("Technical")
                                .description("Enterprise Microservices Framework").build();
                Skill s3 = Skill.builder().name("AWS Cloud Infrastructure").category("Technical")
                                .description("Amazon Web Services Cloud Architecture").build();
                Skill s4 = Skill.builder().name("React.js").category("Technical")
                                .description("Frontend JavaScript Library").build();
                Skill s5 = Skill.builder().name("Banking & Financial Systems").category("Domain")
                                .description("Domain expertise in core banking & fintech workflows").build();
                Skill s6 = Skill.builder().name("Healthcare Data Compliance").category("Domain")
                                .description("HIPAA and HL7 medical data standard management").build();
                Skill s7 = Skill.builder().name("Agile Leadership & Collaboration").category("Soft")
                                .description("Cross-functional sprint facilitation and team leading").build();
                Skill s8 = Skill.builder().name("Strategic Problem Solving").category("Soft")
                                .description("Enterprise analytical thinking and dispute resolution").build();

                skillRepository.saveAll(Arrays.asList(s1, s2, s3, s4, s5, s6, s7, s8));

                // 5. Seed John Smith Skills (Java 8/10, Spring Boot 7/10, etc.)
                UserSkill js1 = UserSkill.builder().userId(johnSmith.getId()).skillId(s1.getId()).skillName("Java")
                                .category("Technical").currentProficiency(80).requiredProficiency(90).ratingScore(8)
                                .level("Advanced").verified(true).build();
                UserSkill js2 = UserSkill.builder().userId(johnSmith.getId()).skillId(s2.getId())
                                .skillName("Spring Boot").category("Technical").currentProficiency(70)
                                .requiredProficiency(85).ratingScore(7).level("Intermediate").verified(true).build();
                UserSkill js3 = UserSkill.builder().userId(johnSmith.getId()).skillId(s3.getId())
                                .skillName("AWS Cloud Infrastructure").category("Technical").currentProficiency(85)
                                .requiredProficiency(80).ratingScore(8).level("Expert").verified(true).build();
                UserSkill js4 = UserSkill.builder().userId(johnSmith.getId()).skillId(s5.getId())
                                .skillName("Banking & Financial Systems").category("Domain").currentProficiency(90)
                                .requiredProficiency(80).ratingScore(9).level("Expert").verified(true).build();
                UserSkill js5 = UserSkill.builder().userId(johnSmith.getId()).skillId(s7.getId())
                                .skillName("Agile Leadership & Collaboration").category("Soft").currentProficiency(75)
                                .requiredProficiency(70).ratingScore(7).level("Intermediate").verified(true).build();

                UserSkill us1 = UserSkill.builder().userId(employee.getId()).skillId(s1.getId()).skillName("Java")
                                .category("Technical").currentProficiency(88).requiredProficiency(90).ratingScore(9)
                                .level("Advanced").verified(true).build();
                UserSkill us2 = UserSkill.builder().userId(employee.getId()).skillId(s4.getId()).skillName("React.js")
                                .category("Technical").currentProficiency(65).requiredProficiency(85).ratingScore(6)
                                .level("Intermediate").verified(false).build();

                userSkillRepository.saveAll(Arrays.asList(js1, js2, js3, js4, js5, us1, us2));

                // 6. Seed Certifications for John Smith (AWS SAA Valid, Java OCP Expired)
                Certificate cert1 = Certificate.builder()
                                .userId(johnSmith.getId())
                                .userName("Rohan Mishra")
                                .courseId(course3.getId())
                                .courseTitle("AWS Certified Solutions Architect Associate")
                                .certificateCode("AWS SAA")
                                .issueDate("2025-01-15")
                                .expiryDate("2028-01-15")
                                .status("VALID")
                                .issuingAuthority("Amazon Web Services")
                                .verified(true)
                                .build();

                Certificate cert2 = Certificate.builder()
                                .userId(johnSmith.getId())
                                .userName("Rohan Mishra")
                                .courseId(course1.getId())
                                .courseTitle("Oracle Certified Professional: Java SE Developer")
                                .certificateCode("Java OCP")
                                .issueDate("2023-03-10")
                                .expiryDate("2026-03-10")
                                .status("EXPIRED")
                                .issuingAuthority("Oracle Corporation")
                                .verified(true)
                                .build();

                certificateRepository.saveAll(Arrays.asList(cert1, cert2));

                // 7. Seed Assessment for Rohan Mishra (87%)
                Assessment ass1 = Assessment.builder()
                                .userId(johnSmith.getId())
                                .userName("Rohan Mishra")
                                .skillId(s1.getId())
                                .skillName("Java & Spring Boot Core Competency")
                                .score(87)
                                .status("VERIFIED")
                                .testName("Enterprise Software Engineer Assessment 2026")
                                .evaluatedBy("HR - Marcus Vance")
                                .testDate(LocalDate.now().minusDays(5).toString())
                                .build();

                assessmentRepository.save(ass1);

                // 8. Seed Competency Frameworks
                CompetencyFramework cf1 = CompetencyFramework.builder()
                                .roleTitle("Developer")
                                .department("Software Engineering")
                                .skillCategory("Technical")
                                .requiredSkillName("Java")
                                .targetProficiency(80)
                                .competencyLevel("Advanced")
                                .verificationRequirement("Assessment (80%+) + Active Cert")
                                .build();

                CompetencyFramework cf2 = CompetencyFramework.builder()
                                .roleTitle("Developer")
                                .department("Software Engineering")
                                .skillCategory("Technical")
                                .requiredSkillName("Spring Boot")
                                .targetProficiency(75)
                                .competencyLevel("Intermediate")
                                .verificationRequirement("Assessment (70%+)")
                                .build();

                CompetencyFramework cf3 = CompetencyFramework.builder()
                                .roleTitle("Developer")
                                .department("Software Engineering")
                                .skillCategory("Domain")
                                .requiredSkillName("Banking & Financial Systems")
                                .targetProficiency(70)
                                .competencyLevel("Intermediate")
                                .verificationRequirement("Domain Project Experience")
                                .build();

                competencyFrameworkRepository.saveAll(Arrays.asList(cf1, cf2, cf3));

                // 9. Seed Attendance, Performance & Recruitment
                Attendance att1 = Attendance.builder()
                                .userId(johnSmith.getId())
                                .userName(johnSmith.getFullName())
                                .date(LocalDate.now())
                                .checkInTime("08:55")
                                .status("Present")
                                .shift("Morning Shift (09:00 - 17:00)")
                                .build();
                attendanceRepository.save(att1);

                LeaveRequest leave1 = LeaveRequest.builder()
                                .userId(johnSmith.getId())
                                .userName(johnSmith.getFullName())
                                .leaveType("Annual Vacation")
                                .startDate(LocalDate.now().plusDays(10))
                                .endDate(LocalDate.now().plusDays(14))
                                .reason("Attending International Cloud Summit")
                                .status("APPROVED")
                                .approvedBy("Marcus Vance")
                                .build();
                leaveRequestRepository.save(leave1);

                PerformanceGoal goal1 = PerformanceGoal.builder()
                                .userId(johnSmith.getId())
                                .userName(johnSmith.getFullName())
                                .title("Spring Boot 4 Microservices & AWS Migration")
                                .description("Migrate legacy monolith modules to Spring Boot 4 stateless microservices.")
                                .kpiMetric("87% Assessment Score & AWS SAA Certification")
                                .progress(85)
                                .status("In Progress")
                                .dueDate("2026-09-01")
                                .managerFeedback(
                                                "Exceptional score on Java assessment (87%). Focus on renewing Java OCP cert.")
                                .build();
                performanceGoalRepository.save(goal1);

                JobPosting job1 = JobPosting.builder()
                                .title("Senior Cloud Backend Architect")
                                .department("Engineering")
                                .location("Remote / New York")
                                .type("Full-time")
                                .description("Seeking a Java & AWS Cloud architect to lead enterprise platform expansion.")
                                .status("Active")
                                .applicantCount(14)
                                .build();
                jobPostingRepository.save(job1);

                Applicant app1 = Applicant.builder()
                                .jobId(job1.getId())
                                .jobTitle(job1.getTitle())
                                .candidateName("Jordan Rivera")
                                .candidateEmail("jordan.r@example.com")
                                .phone("+1 555-0198")
                                .stage("Interview Scheduled")
                                .matchScore(94)
                                .build();
                applicantRepository.save(app1);

                // 10. Seed Milestone 2 LMS Enrollments
                Enrollment enr1 = Enrollment.builder()
                                .empId(emp1.getEmpId())
                                .course(course1)
                                .enrolledAt(java.time.LocalDateTime.now().minusDays(20))
                                .progress(100)
                                .completed(true)
                                .score(87.0f)
                                .completedAt(java.time.LocalDateTime.now().minusDays(2))
                                .build();

                Enrollment enr2 = Enrollment.builder()
                                .empId(emp1.getEmpId())
                                .course(course2)
                                .enrolledAt(java.time.LocalDateTime.now().minusDays(10))
                                .progress(65)
                                .completed(false)
                                .score(0.0f)
                                .build();

                Enrollment enr3 = Enrollment.builder()
                                .empId(emp2.getEmpId())
                                .course(course3)
                                .enrolledAt(java.time.LocalDateTime.now().minusDays(5))
                                .progress(100)
                                .completed(true)
                                .score(92.5f)
                                .completedAt(java.time.LocalDateTime.now().minusDays(1))
                                .build();

                enrollmentRepository.saveAll(Arrays.asList(enr1, enr2, enr3));

                // 11. Seed Milestone 3 M3 Professional Certifications
                com.skillsphere.skillservice.entity.Certification m3Cert1 = com.skillsphere.skillservice.entity.Certification
                                .builder()
                                .employee(targetEmp)
                                .name("AWS Solutions Architect Professional")
                                .issuingOrganization("Amazon Web Services")
                                .credentialId("AWS-SAP-98124")
                                .issued(LocalDate.now().minusYears(1))
                                .expiry(LocalDate.now().plusYears(2))
                                .status(com.skillsphere.skillservice.entity.Certification.Status.VALID)
                                .build();

                com.skillsphere.skillservice.entity.Certification m3Cert2 = com.skillsphere.skillservice.entity.Certification
                                .builder()
                                .employee(targetEmp)
                                .name("Java SE 17 Developer OCP")
                                .issuingOrganization("Oracle Corporation")
                                .credentialId("ORCL-OCP-7721")
                                .issued(LocalDate.now().minusYears(3))
                                .expiry(LocalDate.now().minusMonths(1))
                                .status(com.skillsphere.skillservice.entity.Certification.Status.EXPIRED)
                                .build();

                com.skillsphere.skillservice.entity.Certification m3Cert3 = com.skillsphere.skillservice.entity.Certification
                                .builder()
                                .employee(targetEmp)
                                .name("Certified Kubernetes Administrator (CKA)")
                                .issuingOrganization("Linux Foundation")
                                .credentialId("LF-CKA-44391")
                                .issued(LocalDate.now().minusYears(2).plusDays(15))
                                .expiry(LocalDate.now().plusDays(15))
                                .status(com.skillsphere.skillservice.entity.Certification.Status.PENDING_RENEWAL)
                                .build();

                certificationRepository.saveAll(Arrays.asList(m3Cert1, m3Cert2, m3Cert3));

                System.out.println(
                                "--> SkillSphere Platform Seed Data Created Successfully (Milestones 1, 2 LMS & M3 Certification Management)!");
        }
}

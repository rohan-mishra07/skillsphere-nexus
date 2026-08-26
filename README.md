# SkillSphere Learning & Workforce Management Platform

A unified enterprise-grade digital platform integrating Learning Management (LMS), Skill Gap Analysis & Matrix, Workforce Management (Attendance, Shifts, Leaves), Performance Reviews & KPIs, Recruitment & Onboarding, and AI-driven Recommendations & Analytics.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js (v18 + Vite)
- **Styling**: Tailwind CSS (Glassmorphism, custom design system, HSL color tokens, Inter & Outfit Google Fonts)
- **Icons**: Lucide React
- **HTTP Client**: Axios (with automatic JWT authentication interceptor)
- **Routing**: React Router v6 (Protected routes & dynamic role-based UI switching)

### Backend
- **Framework**: Java 17+ / Spring Boot 3.2.3
- **Security**: Spring Security 6 (Stateless JWT token authentication, BCrypt password hashing, RBAC)
- **Database**: H2 In-Memory Database (Pre-seeded with zero-setup sample data for instant execution out of the box) + MySQL setup configuration (`application.properties`)
- **ORM / Data**: Spring Data JPA & Hibernate ORM

---

## 🚀 Main Modules Implemented

1. **User Management & Role-Based Access Control (RBAC)**
   - Role switcher toolbar for testing Admin, HR, Manager, Employee, and Trainer views.
   - User directory with department and role permissions.

2. **Learning Management System (LMS)**
   - Interactive video lecture player with playlist sidebar.
   - Downloadable lecture notes.
   - Automatic Digital Certificate generation with code verification upon module completion.

3. **Skill Management & AI Gap Analysis**
   - Skill matrix with current vs. required proficiency tracking.
   - Assessment test runner to update skill scores.
   - AI recommendation engine suggesting targeted upskilling courses.

4. **Workforce Management**
   - Live clock-in and clock-out tracking.
   - Shift calendar schedules (Morning, Evening, Night).
   - Leave application submission & HR/Manager approval workflow.

5. **Performance Management**
   - OKR goal creation with KPI metric tracking.
   - Progress bar indicators and manager 360-degree feedback log.

6. **Recruitment & Digital Onboarding**
   - Job posting creation and requisition tracking.
   - Kanban-style Applicant Tracking System (ATS) pipeline (Applied → Screening → Interview → Offer → Onboarded).
   - Candidate AI match score calculation.

7. **AI Copilot & Assistant**
   - Floating interactive AI chatbot modal for course suggestions, leave policy queries, and career path recommendations.

8. **Reports & Analytics Dashboard**
   - Real-time metrics: Course completion rates, workforce productivity index, skill gap closure rate, active headcount.

---

## 💻 How to Run Locally

### ⚡ Option 1: 1-Click Run in VS Code
- **Keyboard Shortcut**: Press `Ctrl + Shift + B` (or `Cmd + Shift + B` on macOS) -> Select **`Start Full Stack (Backend + Frontend)`**.
- **VS Code Menu**: Go to `Terminal` -> `Run Task...` -> Select **`Start Full Stack (Backend + Frontend)`**.
- **Run & Debug Panel**: Press `F5` or go to `Run and Debug` sidebar (`Ctrl + Shift + D`) and click **`Run Full Stack (Debug Backend + Frontend)`**.

### 🧠 Option 2: IntelliJ IDEA Setup & Run
1. **Open Project**: Open IntelliJ IDEA -> `File` -> `Open` -> Select the `infosys` root folder.
2. **Maven Sync**: IntelliJ will automatically detect [user-service/pom.xml](file:///c:/Users/mishr/OneDrive/Desktop/infosys/user-service/pom.xml). If prompted, click **"Load Maven Project"** or right-click `user-service/pom.xml` -> **Maven** -> **Reload Project**.
3. **Run Configurations**:
   - In the top right toolbar run dropdown, select **`SkillSphereApplication`** and click **Run** (or `Shift + F10`).
   - Select **`Frontend - npm dev`** to run the frontend server directly inside IntelliJ.
4. **Lombok Support**: Ensure Lombok plugin is enabled and **Enable Annotation Processing** is checked under `Settings` -> `Build, Execution, Deployment` -> `Compiler` -> `Annotation Processors`.

### 🛠️ Option 3: Run via Terminal

#### 1. Run Backend (Java Spring Boot)
```powershell
cd user-service
.\mvnw.cmd spring-boot:run
```
- REST APIs will run on: `http://localhost:8080/api`
- H2 Console available at: `http://localhost:8080/h2-console`

#### 2. Run Frontend (React + Vite + Tailwind CSS)
```bash
cd frontend
npm run dev
```
- Frontend Web Application will run on: `http://localhost:5173`

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@skillsphere.com` | `admin123` |
| **HR Manager** | `hr@skillsphere.com` | `hr123456` |
| **Engineering Manager** | `manager@skillsphere.com` | `manager123` |
| **Employee / Learner** | `employee@skillsphere.com` | `user1234` |
| **Trainer / Instructor** | `trainer@skillsphere.com` | `trainer123` |

> *Tip: Use the top-right **Role Switcher** badge in the navbar to test different views instantly with one click!*

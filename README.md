# 🌐 SkillSphere Nexus — Enterprise Learning & Workforce Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?logo=openjdk&logoColor=white)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2-6DB33F?logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Spring Security](https://img.shields.io/badge/Spring_Security-6.0-6DB33F?logo=springsecurity&logoColor=white)](https://spring.io/projects/spring-security)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_Demo-000000?logo=vercel&logoColor=white)](https://skillsphere-nexus-platform.vercel.app)

> **SkillSphere Nexus** is an enterprise-grade web platform integrating an interactive Learning Management System (LMS), skill-gap matrix analytics, workforce management (attendance, shifts, leaves), digital certificate verification, and an AI copilot.

🚀 **Production Live Demo:** [https://skillsphere-nexus-platform.vercel.app](https://skillsphere-nexus-platform.vercel.app)

---

## ⏱️ 1. Evaluator Quick Start & Demo Credentials

Designed for rapid technical evaluation. You can test the live deployment immediately or launch locally within **2 minutes**.

### 🔑 Test Persona Credentials
Use these credentials or click the **Role Switcher** badge in the top navigation bar to dynamically swap authorization contexts:

| Role | Email | Password | Workspace Tier | Scope & Key Permissions |
|---|---|---|---|---|
| **System Admin** | `admin@skillsphere.com` | `admin123` | Management Console | System Configuration, Global Analytics, RBAC Management |
| **HR Manager** | `hr@skillsphere.com` | `hr123456` | Management Console | Workforce Operations, ATS Recruitment Pipeline, Leave Approvals |
| **Engineering Manager** | `manager@skillsphere.com` | `manager123` | Management Console | Skill Gap Matrix, OKRs, Performance Appraisals |
| **Employee / Learner** | `employee@skillsphere.com` | `user1234` | Employee Workspace | LMS Course Catalog & Player, Certificates, Shift Roster, Leaves |
| **Trainer / Instructor** | `trainer@skillsphere.com` | `trainer123` | Employee Workspace | Course Uploads, Module Analytics, Student Progress Tracking |

---

### ⚡ 2-Minute Local Launch Options

#### Option A: VS Code 1-Click Task (Recommended)
1. Clone & Open: `git clone https://github.com/rohan-mishra07/infosys.git` then `code infosys`
2. Launch: Press `Ctrl + Shift + B` (macOS: `Cmd + Shift + B`) -> Select **`Start Full Stack (Backend + Frontend)`**.
3. Access: Frontend on `http://localhost:5173` | Backend REST API on `http://localhost:8080/api`

#### Option B: Terminal Execution
```bash
# Terminal 1 - Start Spring Boot 3 Backend
cd user-service
./mvnw spring-boot:run     # Windows: .\mvnw.cmd spring-boot:run

# Terminal 2 - Start React 18 + Vite Frontend
cd frontend
npm install && npm run dev
```

#### Option C: IntelliJ IDEA
1. Open root folder `infosys` in IntelliJ IDEA (Maven imports `user-service/pom.xml` automatically).
2. Enable Annotation Processing (`Settings` -> `Build, Execution, Deployment` -> `Compiler` -> `Annotation Processors`).
3. Run `SkillSphereApplication` class and execute `npm run dev` in the integrated terminal.

---

## 🏛️ 2. Architectural Decisions & Engineering Rationale

### 🔒 1. Two-Tier Role-Based Access Control (RBAC) Segregation
* **Decoupled Workspaces**: Enforces explicit separation between **Employee Workspace** (self-service, LMS, personal rosters) and **Management Console** (administrative controls, workforce planning, recruitment ATS, team skill matrices).
* **Defense in Depth**: Access control is validated at two distinct boundaries:
  1. **Client-Side Navigation**: React Router guards dynamically check user roles before resolving lazy-loaded tier bundles.
  2. **Server-Side API Security**: Spring Security 6 inspects stateless JWT claims on every incoming HTTP request using `@PreAuthorize("hasRole('ADMIN')")` annotations, ensuring zero unauthorized data access even if client-side state is tampered with.

### 🌐 2. Offline-First Fault Tolerance & State Synchronization
* **Resilient Client Architecture**: Axios client interceptors detect network failure or backend unavailability (`ERR_CONNECTION_REFUSED` / 5xx HTTP responses) and automatically fall back to structured `localStorage` persistence.
* **Seamless State Sync**: Critical state changes (e.g., course progress, leave drafts, user preferences) are stored locally and seamlessly synchronized upon backend re-connection, preventing user workflow interruption during network degradation.

### 🛡️ 3. Session Isolation & Token Invalidation on Logout
* **Stateless JWT Lifecycle**: Authentication tokens are stored securely in-memory and client-side session state.
* **Deterministic Logout Routine**: Triggering logout executes a mandatory cleanup procedure:
  1. Invalidation of client-side authentication headers.
  2. Total purge of user-scoped `localStorage` keys and cached application state.
  3. Reset of global React Context state to prevent state leaking between sequential persona logins.

---

## 🏗️ 3. System Architecture & Access Control Flow

```
                     +-------------------------------------------------------+
                     |                 USER / CLIENT BROWSER                 |
                     |           (React 18 + Vite + Tailwind CSS)            |
                     +-------------------------------------------------------+
                                                 |
                                     [ Axios HTTP Interceptor ]
                                                 |
                                                 v
                     +-------------------------------------------------------+
                     |         OFFLINE RESILIENCE & LOCAL STORAGE LAYER      |
                     | (Catches network failures & syncs cached data state)  |
                     +-------------------------------------------------------+
                                                 |
                                     [ Bearer Token: JWT Header ]
                                                 |
                                                 v
                     +-------------------------------------------------------+
                     |            API GATEWAY / SPRING SECURITY 6            |
                     |    (Stateless JWT Filter, CORS & RBAC Enforcement)    |
                     +-------------------------------------------------------+
                                  /                             \
     [ Scope: ROLE_EMPLOYEE / ROLE_TRAINER ]           [ Scope: ROLE_ADMIN / ROLE_HR / ROLE_MANAGER ]
                                /                                 \
                               v                                   v
    +---------------------------------------+   +---------------------------------------+
    |       TIER 1: EMPLOYEE WORKSPACE       |   |       TIER 2: MANAGEMENT CONSOLE      |
    +---------------------------------------+   +---------------------------------------+
    |  • LMS Course Catalog & Player        |   |  • Workforce & Shift Roster Control   |
    |  • Verifiable Digital Certifications  |   |  • Skill Gap Matrix & Team Analytics  |
    |  • Self-Service Leave Submissions     |   |  • Candidate Recruitment & ATS        |
    |  • Interactive AI Copilot Modal       |   |  • OKR Performance Tracking & KPIs    |
    |  • Individual Progress Dashboard      |   |  • Enterprise Headcount Analytics     |
    +---------------------------------------+   +---------------------------------------+
                                \                                 /
                                 \                               /
                                  v                             v
                     +-------------------------------------------------------+
                     |             SPRING BOOT 3 REST SERVICE LAYER          |
                     |    (User-Service, Learning-Service, Security Module)  |
                     +-------------------------------------------------------+
                                                 |
                                       [ Spring Data JPA ]
                                                 |
                                                 v
                     +-------------------------------------------------------+
                     |           DATABASE PERSISTENCE ENGINE                 |
                     |  (H2 In-Memory Zero-Setup  /  MySQL Enterprise DB)    |
                     +-------------------------------------------------------+
```

---

## 🛠️ 4. Full Technical Stack

| Layer | Core Technology | Version | Engineering Rationale |
|---|---|---|---|
| **Frontend Framework** | **React.js** | `v18.2` | Component-based UI with concurrent rendering capabilities |
| **Build & HMR Tooling** | **Vite** | `v5.0` | ESM-native build setup providing fast HMR and lightweight production bundles |
| **Styling Architecture** | **Tailwind CSS** | `v3.4` | Enterprise glassmorphism system using standardized HSL design tokens |
| **HTTP & Offline Client** | **Axios** | `v1.6` | Interceptor pipeline handling JWT injection, error normalization, and offline fallbacks |
| **Backend Framework** | **Spring Boot** | `v3.2.3` | Production-grade Java framework providing rapid REST controller assembly |
| **Runtime & Language** | **Java OpenJDK** | `v17` | Standardized LTS runtime leveraging modern language features |
| **Security & Auth** | **Spring Security** | `v6.0` | Stateless JWT authentication, BCrypt password hashing, and method-level security |
| **Persistence / ORM** | **Spring Data JPA** | `v3.2` | Abstraction over Hibernate ORM minimizing boilerplate SQL execution |
| **Databases** | **H2 / MySQL** | `v2.2 / v8.0` | Pre-seeded zero-setup H2 database for testing; production MySQL connectivity profile |
| **Cloud Deployment** | **Vercel** | SPA | Continuous deployment pipeline for frontend asset delivery |

---

## ✨ 5. Core Feature Modules

### 📚 1. Learning Management System (LMS) & Video Console
* Custom video player with sequential module tracking and downloadable learning artifacts.
* Dynamic calculation of course completion metrics persisted to user profiles.

### 🏆 2. Verifiable Digital Certifications
* Instant cryptographic certificate generation upon course completion.
* Built-in public verification portal allowing verification of certificate authenticity via unique serial codes.

### ⏱️ 3. Workforce Management & Roster Scheduling
* Real-time attendance clock-in/clock-out tracking with total session duration logging.
* Shift calendar viewer mapping employees across Morning, Evening, and Night rotations.
* Multi-level leave application workflow supporting manager approval/rejection actions.

### 🔍 4. Global Search & Offline Data Synchronization
* Real-time search engine operating across learning modules, employee records, and skills.
* Offline state sync engine maintaining data integrity during network loss.

### 🤖 5. Context-Aware AI Copilot
* Embedded interactive modal available across all workspace tiers.
* Handles natural language queries regarding leave policies, shift rules, and personalized skill recommendations.

---

## 📄 6. License & Contribution Guidelines

### 📜 License
This software is distributed under the **MIT License**. See [LICENSE](LICENSE) for details.

```text
MIT License

Copyright (c) 2026 SkillSphere Nexus Engineering Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<p align="center">
  <sub>SkillSphere Nexus Enterprise Platform — Technical Documentation</sub>
</p>

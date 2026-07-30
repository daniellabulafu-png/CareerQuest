# CareerQuest 🚀

> A gamified, privacy-first career readiness web application built for Lewis & Clark College students.

[![Lewis & Clark College](https://img.shields.io/badge/Lewis_%26_Clark-Otters-E35205)](https://www.lclark.edu)
[![WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG_2.1_AA-blue)](https://www.w3.org/TR/WCAG21/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Live Demo:** [https://careerquest-app.base44.app/](https://careerquest-app.base44.app/)

---

## 📌 Overview

**CareerQuest** bridges the gap between academic exploration and post-graduation career success for Lewis & Clark College students. Designed with a privacy-first architecture, multi-disciplinary customization, and NACE-aligned skill tracking, CareerQuest turns career preparation into an engaging, structured journey across all majors—from Biology and Computer Science to International Affairs and English.

## 🎭 Demo State & Seed Data

To give judges and reviewers an immediate, full-featured experience without requiring a 30-minute onboarding process, CareerQuest loads with **Pre-populated Demo Data**:

- **Demo Identity (`Alex Chen`):** Pre-loaded with XP, an active Computer Science skill tree path, sample applications, and CRM contacts to showcase active user workflows.
- **Dual-Role Navigation (Student + Faculty):** Both student questing views and faculty cohort analytics views are accessible directly within the demo header. This allows reviewers to evaluate both sides of the FERPA-conscious advising portal without needing separate account logins.

---

## ✨ Key Features

### 🎓 L&C Otter Identity & Customizable UI Themes
- **Institutional Branding:** Integrated L&C Otter logo and campus aesthetic.
- **Student Choice Palettes:** 5 pre-configured, WCAG AA compliant theme palettes:
  - **Otter Spirit:** Official L&C Orange (`#E35205`) & Slate *(Default)*
  - **PNW Forest:** Deep Evergreen (`#1B4332`) & Sage (`#74C69D`)
  - **Midnight Cyber:** Deep Indigo (`#0F172A`) & Electric Cyan (`#06B6D4`)
  - **Palatine Sunset:** Warm Terracotta (`#C85A32`) & Gold
  - **High-Contrast Accessible:** Black, White, & High-Contrast Blue/Yellow

### 🛡️ Privacy-First Faculty Portal & Advising Queue
- **FERPA Compliant:** Student career data remains completely private by default.
- **Opt-In Queue:** Students can explicitly toggle advising access to share their profile, skill gaps, and active applications with L&C career advisors for 1-on-1 prep.
- **Anonymized Department Analytics:** Faculty view aggregated skill gap heatmaps and engagement metrics without accessing individual student profiles without permission.

### 🌳 Interactive Skill Tree & NACE Alignment
- **Central Liberal Arts Trunk:** Core competencies including Critical Thinking, Written Communication, Research, and Global Engagement.
- **Disciplinary Branches:** Customized node pathways for STEM, Humanities, Social Sciences, and Creative Arts.
- **NACE Badging:** Automatic tagging aligned with National Association of Colleges and Employers (NACE) standards.

### 🤖 Disciplinary AI Interview "Battle Bots"
Major-specific interview practice bots tailored to different academic fields:
- **STEM Bot:** Lab methodologies, technical problem-solving, and data interpretation.
- **Humanities & Arts Bot:** Portfolio reviews, creative process, and writing sample defenses.
- **Social Sciences Bot:** Qualitative research, policy analysis, and behavioral scenarios.
- **Business/Econ Bot:** Market analysis, strategy, and quantitative reasoning.

### 💼 Networking CRM & "Unfreeze" Workflow
- Contact cards with dynamic temperature tracking (**Hot** vs. **Frozen** after 30+ days inactive).
- One-click **"Unfreeze"** action generating tailored 2-sentence follow-up templates.

### ♿ Accessibility (WCAG 2.1 AA Compliant)
- Minimum 4.5:1 color contrast ratio across all dynamic themes.
- Non-color-reliant UI indicators (icons and text labels paired with state colors).
- Full keyboard navigation and ARIA screen reader labels.
- **Reduce Animations** toggle for motion sensitivity and performance optimization.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React, Tailwind CSS, Lucide Icons, Shadcn UI
- **Build Tool:** Vite
- **Backend & Data Layer:** Base44 Native Entity Layer
- **State & Context:** React Context API (Auth, Settings, Theme)
- **Deployment:** Base44 Cloud Platform

---

## 🗄️ Base44 Data Entity Schema

The application uses Base44's native entity backend structure:

- `User`: Handles student/faculty authentication, profiles, role-based access control (RBAC), and theme preferences.
- `StudentProfile`: Tracks XP, level, active major/minor, and pillar progression.
- `Quest`: Stores 25+ disciplinary quests across Guidance, Experience, Connections, and Applications.
- `SkillNode`: Maps unlocked and locked nodes on the interactive Skill Tree.
- `BusinessCard`: Manages networking contacts, follow-up dates, and temperature states.
- `Application`: Tracks internship and job applications through Kanban pipeline stages.
- `AdvisingRequest`: Manages opt-in requests between students and faculty advisors.

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR-USERNAME/career-quest.git](https://github.com/YOUR-USERNAME/career-quest.git)
   cd career-quest
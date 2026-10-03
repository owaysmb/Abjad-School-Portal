[Abjad-README.md](https://github.com/user-attachments/files/33001215/Abjad-README.md)
# Abjad School Portal

A full-stack school management system built for a real learning difficulties school. The portal serves administrators, teachers, students, and parents with role-specific dashboards and features tailored for special education environments.

**Live:** [https://abjad-school-frontend.onrender.com](https://abjad-school-frontend.onrender.com)

---

## Features

### Role-Based Access
Four distinct user roles, each with their own dashboard and permissions:

| Role | Capabilities |
|------|-------------|
| **Admin** | Manage students, teachers, parents, classes — full CRUD, password resets, activity log |
| **Teacher** | Mark attendance, add grades, write feedback, log student mood, view own activity |
| **Student** | View personal grades and attendance |
| **Parent** | Monitor children's attendance, grades, feedback feed, and mood history |

### Core Modules
- **Authentication** — JWT with httpOnly cookies, bcrypt password hashing, login rate limiting (5 attempts → 15-minute lockout)
- **Student Management** — Create students with class assignment, link to parents
- **Teacher Management** — Create teachers, assign to classes with subjects
- **Attendance** — Daily attendance marking per student, editable by teacher
- **Grades** — Subject grades with score/maxScore/term, editable by teacher
- **Feedback Feed** — Teacher writes qualitative notes about each student, parents see a chronological feed
- **Mood Tracking** — Daily mood logging (focused, tired, anxious, hyperactive, happy) with visual badges for parents
- **Parent-Child Linking** — Assign one or more children to a parent account

### Specialized for Learning Difficulties
The feedback and mood tracking system was built specifically for this school's needs — parents can monitor not just grades and attendance but their child's daily behavioral and emotional state, which is critical for students with learning difficulties.

---

## Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript (via `tsx`)
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT, bcrypt, httpOnly cookies
- **Other:** cors, cookie-parser, dotenv

### Frontend
- **Framework:** React
- **Language:** TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios (with 401 interceptor)
- **Icons:** React Icons

### DevOps
- **Containerization:** Docker + Docker Compose (PostgreSQL in development)
- **Deployment:** Render (Web Service + managed PostgreSQL + Static Site)
- **Version Control:** Git + GitHub

---

## Getting Started

### Prerequisites
- Node.js 20+
- Docker + Docker Compose
- Git

### Clone the repo
```bash
git clone https://github.com/owaysmb/Abjad-School-Portal.git
cd Abjad-School-Portal
```


## Deployment

The application is deployed on [Render](https://render.com):

- **Backend** — Web Service (Node.js, `tsx src/index.ts`)
- **Database** — Managed PostgreSQL
- **Frontend** — Static Site (Vite build, `dist/`)

Environment variables are set in the Render dashboard. Migrations are run against the production database using the external connection string.



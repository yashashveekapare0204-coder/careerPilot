# CareerPilot AI — Campus Placement Preparation Platform

CareerPilot AI is an AI-powered placement preparation platform designed for college students to systematically prepare for campus placements through:

- **AI Resume Corrector**: ATS scoring, skill detection, formatting check, and improvement suggestions.
- **AI Mock Interview**: Voice-enabled and text mock technical and HR rounds personalized to student resume projects and target roles.
- **Interview Analyzer**: Objective scoring, strengths, missing points, and model answers for every response.
- **Placement Readiness Index**: Formula-weighted readiness score based on verified assessments.
- **Skill Gap Finder**: Real-time hiring bar comparison across DSA, DBMS, OOP, Operating Systems, Networks, and Communication.
- **Career Roadmap**: Weekly structured study goals and milestones with direct status updates.
- **Progress Tracking & Activity Streak**: Recharts visual analytics and streak tracking based only on meaningful actions.

---

## Minimalist Black & White Design System
- Complete **Light Mode** and **Dark Mode** support.
- Theme preference persisted in `localStorage` without page flash or reload.
- High-contrast, clean typography, rounded cards, and smooth transitions.
- Strictly labeled **Home** everywhere instead of "Dashboard".

---

## Getting Started

### 1. Prerequisites
- Node.js (v18+ or v20+)
- npm (v9+)

### 2. Environment Variables
Copy `.env.example` to `.env` or configure:
```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

*(Note: If API credentials are not yet configured, CareerPilot AI includes fallback engines for all routes, ensuring frictionless first-time testing and zero broken screens).*

### 3. Run Development Servers
Run both the React frontend (Vite) and Express backend concurrently:
```bash
npm run dev
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

---

## Route Map & Navigation Architecture

| Route | Page | Description | Access |
|---|---|---|---|
| `/` | Landing Page | Hero, Features, Popular Tools, Reviews, How It Works | Public |
| `/login` | Login Page | Split-screen login with email/password & theme toggle | Public |
| `/signup` | Sign-Up Page | Split-screen registration with benefits panel | Public |
| `/home` | Home Page | Readiness gauge, score cards, Next Best Step, Activity Streak | Protected |
| `/resume` | Resume Corrector | PDF upload, ATS scoring, resume audit | Protected |
| `/interview` | AI Mock Interview | Speech / Text interview session runner | Protected |
| `/interview-results` | Interview Results | Question-by-question scoring and feedback | Protected |
| `/readiness` | Placement Readiness | Documented formula breakdown & gauge | Protected |
| `/skills` | Skill Gap Analysis | Hiring bar benchmark and Add-to-Roadmap | Protected |
| `/roadmap` | Career Roadmap | Weekly task status management | Protected |
| `/progress` | Progress Tracking | Recharts line and bar analytics | Protected |
| `/profile` | Profile & Settings | Academic info, password reset, theme toggle | Protected |
| `*` | 404 Fallback | Friendly page with Return Home / Login navigation | All |

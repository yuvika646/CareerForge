# CareerForge

An AI-powered Resume Builder & Job Matching platform built with Next.js, TypeScript, Tailwind CSS, and Supabase. Candidates build ATS-optimized resumes with AI assistance, while recruiters post jobs and find talent through skills-based matching.

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?style=flat-square&logo=supabase)
![Groq](https://img.shields.io/badge/Groq-Llama_3.3-F55036?style=flat-square)

## Features

### Candidates
- **AI-Powered Resume Builder** — Create professional resumes with a live PDF preview
- **AI Enhancement** — Polish descriptions, summaries, and skills using Llama 3.3 via Groq
- **ATS Scoring** — Real-time Applicant Tracking System compatibility scores (0–100)
- **PDF Export** — Download resumes as cleanly formatted PDFs
- **Job Matching** — Discover jobs ranked by skill-match percentage
- **Skill Management** — Track technical and soft skills in one place

### Recruiters
- **Job Posting** — Create, edit, and manage job listings
- **Skills-Based Matching** — Define required skills for accurate candidate discovery
- **Dashboard** — At-a-glance stats for active, closed, and total postings

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router, Server Actions) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL + Row Level Security) |
| Auth | Supabase Auth with SSR (`@supabase/ssr`) |
| AI | Groq SDK — Llama 3.3 70B Versatile |
| PDF | `@react-pdf/renderer` |

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A [Supabase](https://supabase.com) account
- A [Groq](https://console.groq.com) API key

### 1. Clone & Install

```bash
git clone https://github.com/yuvika646/CareerForge.git
cd CareerForge
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Open the **SQL Editor** in your dashboard
3. Run the migration in `supabase/migrations/001_initial_schema.sql`

This creates the `profiles`, `resumes`, and `jobs` tables along with Row Level Security policies and triggers.

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

- Supabase credentials: **Project Settings → API**
- Groq API key: [console.groq.com/keys](https://console.groq.com/keys)

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
CareerForge/
├── actions/                  # Server Actions
│   ├── ai.ts                 #   Groq AI integrations
│   ├── auth.ts               #   Authentication
│   ├── jobs.ts               #   Job CRUD
│   └── resume.ts             #   Resume CRUD + ATS scoring
│
├── app/                      # Next.js App Router
│   ├── auth/callback/        #   OAuth callback
│   ├── candidate/            #   Candidate portal (dashboard, resume, jobs)
│   ├── recruiter/            #   Recruiter portal (dashboard, jobs, new)
│   ├── login/ & signup/      #   Auth pages
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx              #   Landing page
│
├── components/
│   ├── candidate/            # Candidate components (nav, resume builder, job list)
│   ├── recruiter/            # Recruiter components (nav, job form, job list)
│   └── ui/                   # shadcn/ui primitives
│
├── lib/
│   ├── supabase/             # Supabase client (browser + server)
│   ├── types/database.ts     # TypeScript types
│   ├── resume-defaults.ts    # Default resume template
│   └── utils.ts              # Utility functions
│
├── supabase/migrations/      # SQL migration scripts
├── middleware.ts              # Auth & role-based route protection
└── tailwind.config.ts        # Custom theme (color palette)
```

## Database Schema

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | `uuid` | Primary key → `auth.users` |
| email | `text` | User email |
| role | `text` | `candidate` or `recruiter` |
| full_name | `text` | Display name |
| skills | `text[]` | Skills array (candidates) |

### resumes
| Column | Type | Description |
|--------|------|-------------|
| id | `uuid` | Primary key |
| user_id | `uuid` | FK → profiles |
| content | `jsonb` | Full resume structure |
| ats_score | `integer` | ATS score (0–100) |

### jobs
| Column | Type | Description |
|--------|------|-------------|
| id | `uuid` | Primary key |
| recruiter_id | `uuid` | FK → profiles |
| title | `text` | Job title |
| company | `text` | Company name |
| description | `text` | Job description |
| required_skills | `text[]` | Required skills |
| status | `text` | `active`, `closed`, or `draft` |
| location | `text` | Location |
| salary_range | `text` | Salary range |

## How It Works

### Role-Based Routing
The middleware refreshes Supabase sessions on every request and enforces role boundaries — candidates cannot access `/recruiter` routes and vice versa.

### AI Enhancement
Server actions send text to Groq's Llama 3.3 70B model with role-specific prompts to produce polished resume descriptions, professional summaries, and targeted skill suggestions.

### ATS Scoring
A weighted algorithm evaluates resume completeness across six categories: personal info, summary quality, work experience detail, education, skills count, and projects/certifications.

### Job Matching
Skills are normalized and compared to compute a match percentage: `(matched skills / required skills) × 100`.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import the repo in [Vercel](https://vercel.com)
3. Add environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `GROQ_API_KEY`)
4. Deploy

## License

MIT

---

Built with ❤️ using Next.js, Supabase, and Groq

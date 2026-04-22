<div align="center">

# ✨ ResuMate

### AI-Powered Resume Builder That Lands Interviews

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white)](https://react.dev)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-8E75B2?style=flat-square&logo=googlegemini&logoColor=white)](https://ai.google.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Describe yourself in plain text → AI generates a complete, ATS-optimized resume in seconds.**

[🚀 Live Demo](https://resumate-ai.vercel.app) · [🐛 Report Bug](https://github.com/hxrshityadav/ResuMate/issues) · [💡 Request Feature](https://github.com/hxrshityadav/ResuMate/issues)

---

</div>

## 📋 Table of Contents

- [About](#-about)
- [Key Features](#-key-features)
- [Tech Stack](#%EF%B8%8F-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Resume Templates](#-resume-templates)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About

**ResuMate** is a full-stack AI resume builder that transforms a plain-text description of your background into a polished, recruiter-ready resume. Powered by **Google Gemini AI**, it generates structured resume content, scores it against ATS (Applicant Tracking Systems), and exports pixel-perfect PDFs — all for free.

### The Problem

Building a professional resume is tedious. You wrestle with formatting, second-guess your wording, and have no idea if your resume will survive ATS filters. Most builders charge monthly fees for basic features.

### The Solution

ResuMate eliminates that friction:

1. **Describe yourself** — type a few sentences about your experience and goals
2. **AI does everything** — Gemini generates a structured resume with bullet points, summaries, and skills
3. **Customize & download** — pick a template, tweak the content, check your ATS score, and export as PDF/DOCX/Markdown

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🤖 **AI Resume Generation** | Describe yourself in plain text — Gemini AI produces a complete, structured resume in ~10 seconds |
| 🎯 **Target Resume Builder** | Upload an existing resume + paste a job description → AI rewrites it to match the specific role |
| 🛡️ **ATS Score Checker** | Real-time ATS analysis with score breakdown, keyword detection, and improvement suggestions |
| ✍️ **AI Section Improver** | One-click rewrite of Summary, Experience, and Projects into strong, action-verb-led copy |
| 🖼️ **4 Premium Templates** | Harvard Classic · Academic Clean · Sidebar Pro · Timeline Pro — all ATS-safe and recruiter-approved |
| ✏️ **Full Inline Editing** | Edit every field directly, reorder sections via drag-and-drop, pick fonts and accent colors |
| 📄 **Multi-Format Export** | Download as pixel-perfect A4 PDF, Word (.docx), or Markdown — one click |
| 📤 **PDF Upload + OCR** | Upload a scanned PDF resume — Tesseract.js OCR extracts text even from image-based documents |
| 🔐 **Auth & Dashboard** | Supabase authentication with Google OAuth, personal dashboard, saved resumes, profile management |
| 🌗 **Dark Mode** | Polished dark/light theme toggle across the entire application |
| 📱 **Responsive Design** | Fully responsive across desktop, tablet, and mobile viewports |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **React 19** | UI framework with hooks and context API |
| **Vite 7** | Build tool and dev server |
| **Tailwind CSS 3.4** + **DaisyUI 5** | Utility-first styling with component presets |
| **shadcn/ui** (Radix) | Accessible, composable UI primitives |
| **Framer Motion** | Animations and micro-interactions |
| **React Router 7** | Client-side routing with protected routes |
| **React Hook Form** | Performant form state management |
| **Supabase JS** | Authentication and database client |
| **jsPDF** + **html-to-image** | Client-side PDF generation |
| **docx** | Word document generation |
| **Tesseract.js 7** | OCR engine for scanned PDF text extraction |
| **Axios** | HTTP client for backend API calls |
| **Lucide React** | Icon system |

### Backend

| Technology | Purpose |
|---|---|
| **Spring Boot 3.5** | REST API framework |
| **Java 17** | Language runtime |
| **Google Gemini API** | AI content generation (resume, ATS, improvements) |
| **Lombok** | Boilerplate reduction |
| **Maven** | Build and dependency management |
| **Docker** | Containerized deployment |

### Infrastructure

| Service | Role |
|---|---|
| **Vercel** | Frontend hosting (SPA with rewrites) |
| **Railway** | Backend hosting (Dockerized Spring Boot) |
| **Supabase** | PostgreSQL database + Auth (Google OAuth) |
| **Google AI Studio** | Gemini API key management |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│  React 19 + Vite · Tailwind CSS · shadcn/ui · Framer Motion    │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌───────────┐  ┌───────────┐  │
│  │ Landing  │  │ Create Page  │  │    ATS     │  │  Target   │  │
│  │  Page    │  │ (AI Generate)│  │  Checker   │  │  Resume   │  │
│  └──────────┘  └──────┬───────┘  └─────┬─────┘  └─────┬─────┘  │
│                       │                │              │         │
│  ┌──────────────────┐ │  ┌─────────────────────────┐  │         │
│  │Dashboard (Auth)  │ │  │  PDF Export / OCR Engine │  │         │
│  │ My Resumes       │ │  │  jsPDF · Tesseract.js   │  │         │
│  │ Profile/Settings │ │  └─────────────────────────┘  │         │
│  └────────┬─────────┘ │                               │         │
│           │           │                               │         │
│     Supabase SDK   Axios                           Axios        │
└───────────┼───────────┼───────────────────────────────┼─────────┘
            │           │                               │
    ┌───────▼───────┐   │    ┌──────────────────────────▼──────┐
    │   Supabase    │   │    │     Spring Boot Backend         │
    │  • Auth       │   │    │     /api/v1/resume/*            │
    │  • PostgreSQL │   │    │                                 │
    │  • Row-Level  │   └────►  POST /generate                 │
    │    Security   │        │  POST /ats-check                │
    └───────────────┘        │  POST /improve-section          │
                             │  POST /target-resume            │
                             │              │                  │
                             │      ┌───────▼────────┐         │
                             │      │  Gemini AI API │         │
                             │      │  (Flash Model) │         │
                             │      └────────────────┘         │
                             └─────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Download |
|---|---|---|
| **Node.js** | ≥ 18 | [nodejs.org](https://nodejs.org) |
| **Java JDK** | 17+ | [Adoptium](https://adoptium.net) |
| **Maven** | 3.9+ | [maven.apache.org](https://maven.apache.org) (or use included `mvnw`) |
| **Git** | Latest | [git-scm.com](https://git-scm.com) |

### 1. Clone the Repository

```bash
git clone https://github.com/hxrshityadav/ResuMate.git
cd ResuMate
```

### 2. Backend Setup

```bash
cd Backend

# Copy example properties and add your Gemini API key
cp src/main/resources/application-example.properties src/main/resources/application.properties
```

Edit `application.properties` and set your Gemini API key:

```properties
spring.application.name=AI_RESUME_BUILDER
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration
gemini.api.key=YOUR_GEMINI_API_KEY
gemini.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent
```

> 💡 Get a free Gemini API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

Start the backend server:

```bash
./mvnw spring-boot:run
# Server starts on http://localhost:8080
```

### 3. Frontend Setup

```bash
cd Frontend

# Copy environment template
cp .env.example .env
```

Edit `.env` with your credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BACKEND_URL=http://localhost:8080
```

Install dependencies and start:

```bash
npm install
npm run dev
# App opens on http://localhost:5173
```

### 4. Supabase Setup (for Auth & Resume Storage)

1. Create a project at [supabase.com](https://supabase.com)
2. Create a `resumes` table:

```sql
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Users can only access their own resumes
CREATE POLICY "Users manage own resumes" ON resumes
  FOR ALL USING (auth.uid() = user_id);
```

3. Enable **Google OAuth** in Supabase Dashboard → Authentication → Providers

---

## 🔐 Environment Variables

### Frontend (`Frontend/.env`)

| Variable | Description | Required |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes (for auth) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes (for auth) |
| `VITE_BACKEND_URL` | Backend API base URL | Yes |

### Backend (`Backend/src/main/resources/application.properties`)

| Variable | Description | Required |
|---|---|---|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `frontend.url` | Frontend origin for CORS | Production only |

---

## 📡 API Reference

All endpoints are prefixed with `/api/v1/resume`

### Generate Resume

```http
POST /api/v1/resume/generate
Content-Type: application/json

{
  "userDescription": "I am a CS graduate with 2 years of experience in Java and React..."
}
```

**Response:** Complete structured resume JSON with personal info, summary, skills, experience, education, projects, certifications, achievements, languages, and interests.

### ATS Score Check

```http
POST /api/v1/resume/ats-check
Content-Type: application/json

{
  "resumeText": "Full resume text content...",
  "jobDescription": "Optional job description for targeted scoring..."
}
```

**Response:** Overall score, breakdown (keywords, formatting, skills, experience, education), strengths, improvements, detected/missing keywords.

### AI Section Improve

```http
POST /api/v1/resume/improve-section
Content-Type: application/json

{
  "sectionType": "summary",
  "content": "Current section content to improve..."
}
```

**Response:** AI-improved version of the specified section.

### Generate Targeted Resume

```http
POST /api/v1/resume/target-resume
Content-Type: application/json

{
  "resumeText": "Your existing resume text...",
  "jobDescription": "Full job description...",
  "targetRole": "Senior Software Engineer"
}
```

**Response:** Complete resume JSON tailored to the specific role and job description.

---

## 🖼 Resume Templates

<table>
<tr>
<td align="center" width="25%">

**Harvard Classic**<br>
<sub>Traditional & Professional</sub><br>
<code>ATS Score: ★★★★★</code>

</td>
<td align="center" width="25%">

**Academic Clean**<br>
<sub>Minimal & Elegant</sub><br>
<code>ATS Score: ★★★★★</code>

</td>
<td align="center" width="25%">

**Sidebar Pro**<br>
<sub>Modern Two-Column</sub><br>
<code>ATS Score: ★★★★☆</code>

</td>
<td align="center" width="25%">

**Timeline Pro**<br>
<sub>Creative Timeline Layout</sub><br>
<code>ATS Score: ★★★★☆</code>

</td>
</tr>
</table>

All templates support:
- 🎨 6 accent color presets + custom hex picker
- 🔤 6 font family options (System, Arial, Verdana, Trebuchet, Georgia, Times New Roman)
- 📏 3 font size presets (S / M / L)
- ↕️ Drag-and-drop section reordering
- 📄 A4 pixel-perfect PDF export

---

## 📂 Project Structure

```
ResuMate/
├── Backend/                          # Spring Boot API
│   ├── src/main/java/org/example/ai_resume_builder/
│   │   ├── controller/
│   │   │   └── ResumeController.java     # REST endpoints
│   │   ├── service/
│   │   │   ├── ResumeService.java        # Service interface
│   │   │   └── ResumeServiceimpl.java    # Gemini AI integration
│   │   ├── AtsRequest.java               # ATS check DTO
│   │   ├── ImproveSectionRequest.java    # AI improve DTO
│   │   ├── ResumeRequest.java            # Generation DTO
│   │   └── TargetResumeRequest.java      # Targeted resume DTO
│   ├── src/main/resources/
│   │   ├── application.properties        # App configuration
│   │   └── resume_prompt.txt             # Gemini prompt template
│   ├── Dockerfile                        # Multi-stage Docker build
│   ├── railway.toml                      # Railway deployment config
│   └── pom.xml                           # Maven dependencies
│
├── Frontend/                         # React SPA
│   ├── src/
│   │   ├── api/
│   │   │   ├── ResumeService.js          # Axios client + API calls
│   │   │   └── resumeApi.js              # Supabase CRUD operations
│   │   ├── components/
│   │   │   ├── ui/                       # shadcn/ui components
│   │   │   ├── Navbar.jsx                # Global navigation bar
│   │   │   ├── Resume.jsx                # Resume preview renderer
│   │   │   ├── Sidebar.jsx               # Dashboard sidebar
│   │   │   ├── ProtectedRoute.jsx        # Auth route guard
│   │   │   └── ThemeToggle.jsx           # Dark/light mode switch
│   │   ├── context/
│   │   │   ├── AuthContext.jsx           # Supabase auth state
│   │   │   └── ThemeContext.jsx          # Theme state management
│   │   ├── pages/
│   │   │   ├── landingPage.jsx           # Hero, features, testimonials
│   │   │   ├── Create.jsx                # AI resume creation workflow
│   │   │   ├── AtsChecker.jsx            # ATS scoring tool
│   │   │   ├── TargetResume.jsx          # Job-targeted resume builder
│   │   │   ├── Templates.jsx             # Template gallery
│   │   │   ├── Login.jsx                 # Supabase auth page
│   │   │   ├── DashboardLayout.jsx       # Dashboard shell
│   │   │   └── dashboard/
│   │   │       ├── DashboardHome.jsx     # Dashboard overview
│   │   │       ├── MyResume.jsx          # Saved resumes manager
│   │   │       ├── Profile.jsx           # User profile editor
│   │   │       └── Settings.jsx          # App preferences
│   │   ├── templates/
│   │   │   ├── HarvardClassic.jsx        # Template: Harvard Classic
│   │   │   ├── AcademicClean.jsx         # Template: Academic Clean
│   │   │   ├── SidebarPro.jsx            # Template: Sidebar Pro
│   │   │   └── TimelinePro.jsx           # Template: Timeline Pro
│   │   ├── utils/                        # Helpers (PDF extraction, etc.)
│   │   └── main.jsx                      # App entry + routing
│   ├── vercel.json                       # Vercel SPA rewrite config
│   ├── tailwind.config.js                # Tailwind configuration
│   └── package.json                      # Node dependencies
│
└── config/                           # Shared configuration module
```

---

## 🌐 Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from Frontend directory
cd Frontend
vercel --prod
```

The `vercel.json` is pre-configured with SPA rewrites.

### Backend → Railway

1. Connect your GitHub repo at [railway.app](https://railway.app)
2. Set the root directory to `Backend`
3. Add environment variables:
   - `GEMINI_API_KEY` — your Gemini API key
   - `frontend.url` — your Vercel frontend URL (for CORS)
4. Railway auto-detects the `Dockerfile` and `railway.toml`

### Docker (Self-Hosted Backend)

```bash
cd Backend
docker build -t resumate-backend .
docker run -p 8080:8080 -e GEMINI_API_KEY=your_key resumate-backend
```

---

## 🗺 Roadmap

- [x] AI resume generation via Gemini
- [x] 4 premium resume templates
- [x] ATS score checker with breakdown
- [x] Target resume builder (job-specific)
- [x] AI section improver
- [x] Multi-format export (PDF, DOCX, Markdown)
- [x] Supabase auth + resume storage
- [x] OCR support for scanned PDFs
- [x] Dark/light theme
- [x] Responsive design
- [ ] Multiple resume versions per save
- [ ] Resume analytics over time
- [ ] LinkedIn profile import
- [ ] Job board integrations
- [ ] Collaborative resume editing
- [ ] Cover letter generator
- [ ] Interview preparation module

---

## 🤝 Contributing

Contributions make this project better! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Development Guidelines

- Follow existing code style and patterns
- Write meaningful commit messages
- Test your changes locally before submitting
- Update documentation for new features

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

**Built with ❤️ by [Harshit Yadav](https://github.com/hxrshityadav)**

If ResuMate helped you land an interview, consider giving it a ⭐

[⬆ Back to Top](#-resumate)

</div>

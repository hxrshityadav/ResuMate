import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import "./career-atlas.css";
import { ResumeStudioPreview } from "./ResumeStudioPreview";

const Arrow = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Spark = ({ className = "" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2c.7 5.4 4.6 9.3 10 10-5.4.7-9.3 4.6-10 10-.7-5.4-4.6-9.3-10-10 5.4-.7 9.3-4.6 10-10Z" fill="currentColor" />
  </svg>
);

const Check = () => (
  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <path d="m4 10.5 3.5 3.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const navLinks = [
  ["process", "How it works", "anchor"],
  ["/ats-checker", "ATS Checker", "route"],
  ["/target-resume", "Target Resume", "route"],
  ["templates", "Templates", "anchor"],
];

const processSteps = [
  ["01", "Describe", "Tell ResuMate about your skills, experience, and goals in plain language."],
  ["02", "Generate", "AI creates a complete, structured resume in about 10 seconds."],
  ["03", "Customize", "Upload a PDF with OCR, target a job description, and export as PDF, DOCX, or Markdown."],
];

const templates = [
  { id: "harvard", label: "Traditional", light: "#e85d3f", dark: "#ff6a3d", title: "Harvard Classic" },
  { id: "academic", label: "Minimal", light: "#3b5b4f", dark: "#8faea4", title: "Academic Clean" },
  { id: "sidebar", label: "Modern", light: "#d1a337", dark: "#f0bf48", title: "Sidebar Pro" },
  { id: "timeline", label: "Creative", light: "#426a8c", dark: "#75a5c9", title: "Timeline Pro" },
];

const shortLines = [70, 90, 55, 75];
const longLines = [95, 82, 100, 66, 90];

export function CareerAtlasExperience({ isDark }) {
  const { toggle } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState("harvard");
  const [previewMode, setPreviewMode] = useState("after");

  const chosen = templates.find((item) => item.id === activeTemplate) || templates[0];
  const chosenColor = isDark ? chosen.dark : chosen.light;
  const goToBuilder = () => navigate("/create");
  const goToAccount = () => navigate(user ? "/dashboard" : "/login");

  return (
    <main className={`atlas-page min-h-screen w-full overflow-x-hidden transition-colors duration-300 ${
      isDark ? "bg-[#090a0c] text-[#f6efe3]" : "bg-[#f3efe6] text-[#25241f]"
    }`}>
      <header className="relative z-30 mx-auto flex w-full max-w-[1380px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link to="/" className="group flex items-center gap-3" aria-label="ResuMate home">
          <span className={`grid h-10 w-10 rotate-3 place-items-center rounded-[14px] transition-transform group-hover:-rotate-3 ${
            isDark ? "bg-[#f6efe3] text-[#10141a]" : "bg-[#25241f] text-[#f7f1e5]"
          }`}>
            <Spark className="h-5 w-5" />
          </span>
          <span className={`atlas-serif text-xl font-semibold tracking-[-0.03em] ${isDark ? "text-[#fff8ed]" : ""}`}>
            ResuMate
          </span>
        </Link>

        <nav className={`hidden items-center gap-8 text-sm font-semibold md:flex ${isDark ? "text-[#d8cbb9]" : ""}`} aria-label="Main navigation">
          {navLinks.map(([target, label, type]) => type === "route" ? (
            <Link key={target} className={`transition ${isDark ? "hover:text-[#ff6a3d]" : "hover:text-[#df5238]"}`} to={target}>{label}</Link>
          ) : (
            <a key={target} className={`transition ${isDark ? "hover:text-[#ff6a3d]" : "hover:text-[#df5238]"}`} href={`#${target}`}>{label}</a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className={`grid h-11 w-11 place-items-center rounded-full border transition ${
              isDark ? "border-white/20 text-[#fff4e6] hover:bg-white/10" : "border-black/15 hover:bg-black/5"
            }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isDark ? "text-[#efe2cf] hover:bg-white/10" : "hover:bg-black/5"
            }`}
            onClick={goToAccount}
          >
            {user ? "Dashboard" : "Sign in"}
          </button>
          <button
            type="button"
            className={`atlas-button rounded-full px-5 py-3 text-sm font-bold ${
              isDark
                ? "bg-[#ff6a3d] text-[#120b08] shadow-[0_0_28px_rgba(255,106,61,.28)]"
                : "bg-[#df5238] text-white"
            }`}
            onClick={goToBuilder}
          >
            Build my resume <Arrow className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
            className={`grid h-11 w-11 place-items-center rounded-full border ${
              isDark ? "border-white/20 text-[#fff4e6]" : "border-black/15"
            }`}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            className={`grid h-11 min-w-11 place-items-center rounded-full border px-3 ${
              isDark ? "border-white/20 text-[#fff4e6]" : "border-black/15"
            }`}
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span className="text-xs font-black uppercase tracking-[.12em]">{mobileOpen ? "X" : "Menu"}</span>
          </button>
        </div>
      </header>

      {mobileOpen && (
        <nav
          className={`relative z-20 mx-5 mb-4 grid gap-2 rounded-3xl border p-4 shadow-2xl md:hidden ${
            isDark ? "border-white/[.12] bg-[#121821] shadow-black/40" : "border-black/10 bg-[#fffaf0]"
          }`}
          aria-label="Mobile navigation"
        >
          {navLinks.map(([target, label, type]) => type === "route" ? (
            <Link
              key={target}
              to={target}
              className={`rounded-2xl px-4 py-3 font-semibold transition ${
                isDark ? "text-[#f6efe3] hover:bg-white/[.08]" : "hover:bg-black/5"
              }`}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ) : (
            <a key={target} href={`#${target}`} className={`rounded-2xl px-4 py-3 font-semibold transition ${isDark ? "text-[#f6efe3] hover:bg-white/[.08]" : "hover:bg-black/5"}`} onClick={() => setMobileOpen(false)}>{label}</a>
          ))}
          <button
            type="button"
            className={`mt-2 rounded-2xl px-4 py-3 font-bold ${isDark ? "bg-[#ff6a3d] text-[#120b08]" : "bg-[#df5238] text-white"}`}
            onClick={() => {
              setMobileOpen(false);
              goToBuilder();
            }}
          >
            Build my resume
          </button>
        </nav>
      )}

      <section id="top" className="relative mx-auto grid w-full max-w-[1380px] items-center gap-12 px-5 pb-20 pt-10 sm:px-8 lg:min-h-[760px] lg:grid-cols-[1.05fr_.95fr] lg:px-12 lg:pb-28 lg:pt-16">
        <div className="relative z-10 max-w-3xl">
          <div className={`mb-7 inline-flex -rotate-1 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${
            isDark
              ? "border-[#34404c] bg-[#111720] text-[#f5d4c7] shadow-[3px_3px_0_#ff6a3d]"
              : "border-[#d8cbb6] bg-[#fffaf0] shadow-[3px_3px_0_#d8cbb6]"
          }`}>
            <span className={`h-2 w-2 rounded-full ${isDark ? "bg-[#ff6a3d]" : "bg-[#df5238]"}`} />
            Modern AI resume builder
          </div>

          <h1 className={`atlas-serif text-[clamp(3.45rem,8vw,7.8rem)] font-semibold leading-[.84] tracking-[-0.065em] ${isDark ? "text-[#fff8ed]" : ""}`}>
            <span className="block">Build your</span>
            <span className={`relative inline-block ${isDark ? "text-[#ff6a3d]" : "text-[#df5238]"}`}>
              best resume.
              <svg className="absolute -bottom-3 left-0 h-5 w-full" viewBox="0 0 500 20" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 15C120 2 340 2 497 10" fill="none" stroke={isDark ? "#ff6a3d" : "#df5238"} strokeWidth="5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className={`mt-10 max-w-xl text-lg leading-8 sm:text-xl ${isDark ? "text-[#d7c9b7]" : "text-[#5e5a4f]"}`}>
            Describe yourself in plain text. ResuMate uses AI to create a complete, ATS-optimized
            resume in seconds - then you tailor, score, and download it.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className={`atlas-button justify-center rounded-full px-7 py-4 font-bold ${
                isDark
                  ? "bg-[#ff6a3d] text-[#120b08] shadow-[0_0_34px_rgba(255,106,61,.25)]"
                  : "bg-[#25241f] text-white"
              }`}
              onClick={goToBuilder}
            >
              Build my resume - free <Arrow className="h-5 w-5" />
            </button>
            <Link
              to="/ats-checker"
              className={`atlas-button justify-center rounded-full border px-7 py-4 font-bold ${
                isDark
                  ? "border-white/20 bg-white/[.04] text-[#fff8ed] backdrop-blur hover:bg-white/[.08]"
                  : "border-black/20 bg-[#fffaf0]"
              }`}
            >
              Check my ATS score
            </Link>
          </div>

          <div className={`mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm ${isDark ? "text-[#cbbca8]" : "text-[#6d675b]"}`}>
            {["AI-powered", "92% average ATS score", "PDF / DOCX / Markdown"].map((point) => (
              <span key={point} className="flex items-center gap-2"><Check /> {point}</span>
            ))}
          </div>
        </div>

        <ResumeStudioPreview
          isDark={isDark}
          previewMode={previewMode}
          setPreviewMode={setPreviewMode}
          accentColor={chosenColor}
        />
      </section>

      <section id="process" className={`border-y py-16 sm:py-20 ${
        isDark ? "border-white/10 bg-[#0f1318] text-[#f6efe3]" : "border-[#2b2a24] bg-[#292822] text-[#f5efe4]"
      }`}>
        <div className="mx-auto grid w-full max-w-[1380px] gap-8 px-5 sm:px-8 lg:grid-cols-[.8fr_1.2fr] lg:px-12">
          <div>
            <p className={`atlas-kicker ${isDark ? "text-[#ff9a78]" : "text-[#e9a18e]"}`}>Three steps. About ten seconds.</p>
            <h2 className={`atlas-serif mt-4 text-4xl font-semibold leading-tight sm:text-6xl ${isDark ? "text-[#fff8ed]" : ""}`}>
              From a blank page to an interview-ready resume.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            {processSteps.map(([num, title, copy]) => (
              <article key={num} className={`group rounded-3xl border p-6 transition hover:-translate-y-1 ${
                isDark ? "border-white/[.12] bg-white/[.045] hover:bg-white/[.08]" : "border-white/15 bg-white/[.04] hover:bg-white/[.08]"
              }`}>
                <p className={`text-xs font-black tracking-[.2em] ${isDark ? "text-[#ff9a78]" : "text-[#e9a18e]"}`}>{num}</p>
                <h3 className={`atlas-serif mt-10 text-3xl ${isDark ? "text-[#fff8ed]" : ""}`}>{title}</h3>
                <p className={`mt-3 text-sm leading-6 ${isDark ? "text-[#cfc4b5]" : "text-white/65"}`}>{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="templates" className="mx-auto w-full max-w-[1380px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className={`atlas-kicker ${isDark ? "text-[#ff875f]" : "text-[#df5238]"}`}>Four premium templates</p>
            <h2 className={`atlas-serif mt-3 max-w-2xl text-4xl font-semibold leading-tight sm:text-6xl ${isDark ? "text-[#fff8ed]" : ""}`}>
              ATS-safe layouts for every kind of career.
            </h2>
          </div>
          <p className={`max-w-sm text-sm leading-6 ${isDark ? "text-[#cbbca8]" : "text-[#6d675b]"}`}>
            Harvard Classic, Academic Clean, Sidebar Pro, and Timeline Pro export as pixel-perfect A4 PDFs.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template, index) => {
            const active = activeTemplate === template.id;
            const tone = isDark ? template.dark : template.light;
            return (
              <button
                type="button"
                key={template.id}
                onClick={() => setActiveTemplate(template.id)}
                aria-pressed={active}
                className={`group relative overflow-hidden rounded-[28px] border p-5 text-left transition-all duration-200 hover:-translate-y-1.5 ${
                  isDark
                    ? "border-white/15 bg-white/[.03] hover:border-white/35 hover:shadow-[9px_10px_0_#ff6a3d]"
                    : "border-black/15 hover:border-black/40 hover:shadow-[9px_10px_0_#292822]"
                }`}
              >
                <div className={`aspect-[4/3] rounded-2xl p-5 shadow-inner ${isDark ? "bg-[#111821] ring-1 ring-white/10" : "bg-[#fffdf7]"}`}>
                  <div className="h-4 w-2/3 rounded-full" style={{ background: tone }} />
                  <div className="mt-5 grid grid-cols-[.45fr_1fr] gap-4">
                    <div className="space-y-2">
                      {shortLines.map((width) => <div key={width} className={`h-1.5 rounded ${isDark ? "bg-[#44505b]" : "bg-[#ddd4c6]"}`} style={{ width: `${width}%` }} />)}
                    </div>
                    <div className="space-y-3">
                      {longLines.map((width) => <div key={width} className={`h-2 rounded ${isDark ? "bg-[#6f7c86]" : "bg-[#c6bcad]"}`} style={{ width: `${width}%` }} />)}
                    </div>
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-[.16em] ${isDark ? "text-[#aeb8b9]" : "text-[#7a7367]"}`}>
                      {!isDark && `0${index + 1} - `}{template.label}
                    </p>
                    <h3 className={`atlas-serif mt-1 text-2xl font-semibold ${isDark ? "text-[#fff8ed]" : ""}`}>{template.title}</h3>
                  </div>
                  <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition ${
                    isDark
                      ? "border-white/[.18] text-[#fff8ed] group-hover:bg-[#ff6a3d] group-hover:text-[#120b08]"
                      : "border-black/15 group-hover:bg-black group-hover:text-white"
                  }`}>
                    <Arrow className="h-4 w-4" />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section id="stories" className={`mx-5 mb-5 overflow-hidden rounded-[32px] sm:mx-8 lg:mx-12 ${isDark ? "bg-[#ff6a3d] text-[#120b08]" : "bg-[#df5238] text-white"}`}>
        <div className="mx-auto grid w-full max-w-[1280px] items-center gap-10 px-6 py-14 sm:px-10 lg:grid-cols-[1fr_auto] lg:py-20">
          <div>
            <p className={`text-xs font-black uppercase tracking-[.18em] ${isDark ? "text-[#4a1a0d]" : "text-white/70"}`}>Free AI resume builder</p>
            <h2 className="atlas-serif mt-3 max-w-3xl text-4xl font-semibold leading-[1.02] sm:text-6xl">
              Create, score, tailor, and export from one focused workspace.
            </h2>
          </div>
          <button
            type="button"
            className={`atlas-button w-full justify-center rounded-full px-7 py-4 font-black lg:w-auto ${isDark ? "bg-[#fff8ed] text-[#120b08]" : "bg-white text-[#25241f]"}`}
            onClick={goToBuilder}
          >
            Build my resume <Arrow className="h-5 w-5" />
          </button>
        </div>
      </section>

      <footer className={`mx-auto flex w-full max-w-[1380px] flex-col gap-3 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 ${isDark ? "text-[#b9ad9c]" : "text-[#716b60]"}`}>
        <p>(c) 2026 ResuMate. AI Resume Builder.</p>
        <div className="flex gap-5">
          <Link className={`transition ${isDark ? "hover:text-[#ff6a3d]" : "hover:text-[#df5238]"}`} to="/create">Create Resume</Link>
          <Link className={`transition ${isDark ? "hover:text-[#ff6a3d]" : "hover:text-[#df5238]"}`} to="/ats-checker">ATS Checker</Link>
          <Link className={`transition ${isDark ? "hover:text-[#ff6a3d]" : "hover:text-[#df5238]"}`} to="/target-resume">Target Resume</Link>
        </div>
      </footer>
    </main>
  );
}

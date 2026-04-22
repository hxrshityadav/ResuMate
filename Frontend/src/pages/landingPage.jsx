import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight, Sparkles, CheckCircle2, Zap, ShieldCheck,
    FileText, Download, Star, Bot,
    LayoutTemplate, PenLine, BarChart2, MousePointerClick,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/* ─── Animated counter hook ─────────────────────────── */
function useCounter(target, duration = 1800, start = false) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (ts) => {
            if (!startTime) startTime = ts;
            const progress = Math.min((ts - startTime) / duration, 1);
            setValue(Math.floor(progress * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, duration, start]);
    return value;
}

/* ─── Data ───────────────────────────────────────────── */
const STATS = [
    { value: 5000, suffix: "+", label: "Resumes Created" },
    { value: 4,    suffix: "",  label: "Premium Templates" },
    { value: 92,   suffix: "%", label: "Avg. ATS Score" },
    { value: 3,    suffix: "×", label: "Faster Than Manual" },
];

const FEATURES = [
    { icon: Bot,           title: "AI-Powered Generation",  desc: "Describe yourself in plain text. Gemini AI writes a complete, professional resume in under 10 seconds.", gradient: "from-violet-500 to-fuchsia-500", tag: "Core" },
    { icon: ShieldCheck,   title: "ATS Score Checker",      desc: "Paste any job description and instantly see how your resume scores. Get keyword suggestions to beat the bots.", gradient: "from-blue-500 to-cyan-500",    tag: "Free" },
    { icon: LayoutTemplate,title: "4 Premium Templates",    desc: "Harvard Classic, Academic Clean, Sidebar Pro, Timeline Pro — ATS-safe and recruiter-approved.", gradient: "from-emerald-500 to-teal-500",  tag: "Style" },
    { icon: PenLine,       title: "Inline Section Editor",  desc: "Edit every section directly — change text, reorder sections via drag-and-drop, pick fonts and accent colors.", gradient: "from-amber-500 to-orange-500", tag: "Edit" },
    { icon: Sparkles,      title: "AI Section Improver",    desc: "One click rewrites your Summary, Experience, and Projects into strong, action-verb-led copy.", gradient: "from-pink-500 to-rose-500",   tag: "AI" },
    { icon: Download,      title: "Multi-format Export",    desc: "Download your resume as a pixel-perfect A4 PDF, DOCX, or Markdown file with one click.", gradient: "from-indigo-500 to-violet-500",tag: "Export" },
];

const STEPS = [
    { number: "01", icon: PenLine,           title: "Describe Yourself",       desc: "Type a short paragraph about your skills, experience, and goals. No formatting needed.", c: "violet" },
    { number: "02", icon: Bot,               title: "AI Builds Your Resume",   desc: "Gemini AI generates a complete, structured resume with bullet points, skills, and summary.", c: "blue" },
    { number: "03", icon: MousePointerClick, title: "Customize & Download",    desc: "Pick a template, tweak colors and fonts, reorder sections, and export as PDF in one click.", c: "emerald" },
];

const STEP_COLORS = {
    violet:  { text: "text-violet-500",  bg: "bg-violet-500/10 dark:bg-violet-500/10",  border: "border-violet-500/25" },
    blue:    { text: "text-blue-500",    bg: "bg-blue-500/10 dark:bg-blue-500/10",      border: "border-blue-500/25" },
    emerald: { text: "text-emerald-500", bg: "bg-emerald-500/10 dark:bg-emerald-500/10",border: "border-emerald-500/25" },
};

const REVIEWS = [
    { name: "Priya Sharma",  role: "SDE Intern @ Amazon",         avatar: "PS", color: "from-violet-500 to-fuchsia-500", stars: 5, text: "I went from a blank page to a polished resume in literally 8 minutes. The AI nailed my Spring Boot experience and the ATS checker helped me hit 94%." },
    { name: "Rahul Verma",   role: "CS Graduate, IIT Delhi",      avatar: "RV", color: "from-blue-500 to-cyan-500",      stars: 5, text: "The Harvard Classic template looks so professional. Recruiters at 3 different companies commented on how clean my resume was." },
    { name: "Sneha Nair",    role: "Frontend Dev @ Flipkart",     avatar: "SN", color: "from-emerald-500 to-teal-500",   stars: 5, text: "The AI Improve feature rewrote my bullet points to be so much more impactful. My interview callbacks went up noticeably after using it." },
];

const TEMPLATES = [
    { name: "Harvard Classic", tag: "Traditional", accent: "#7c3aed" },
    { name: "Academic Clean",  tag: "Minimal",     accent: "#2563eb" },
    { name: "Sidebar Pro",     tag: "Modern",      accent: "#0891b2" },
    { name: "Timeline Pro",    tag: "Creative",    accent: "#059669" },
];

/* ─── Template mini-preview ─────────────────────────── */
function TemplateMini({ t, i }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-black/[0.06] h-full overflow-hidden">
            {/* Header strip */}
            <div className="h-1.5 w-full" style={{ background: t.accent }} />
            <div className="p-2.5 space-y-2">
                {i === 2 ? (
                    /* Sidebar layout */
                    <div className="flex gap-1.5 h-28">
                        <div className="w-1/3 rounded bg-slate-100 p-1.5 flex flex-col gap-1">
                            <div className="h-5 w-5 rounded-full mx-auto mb-1" style={{ background: t.accent + "40" }} />
                            {[70, 55, 80, 60].map((w, j) => <div key={j} className="h-1 rounded-full bg-slate-300" style={{ width: `${w}%` }} />)}
                        </div>
                        <div className="flex-1 flex flex-col gap-1 pt-0.5">
                            <div className="h-1.5 rounded bg-slate-800 w-4/5" />
                            <div className="h-1 rounded w-1/2 mt-0.5" style={{ background: t.accent }} />
                            <div className="h-px bg-slate-200 w-full my-0.5" />
                            {[90, 75, 85, 65, 80].map((w, j) => <div key={j} className="h-1 rounded bg-slate-200" style={{ width: `${w}%` }} />)}
                        </div>
                    </div>
                ) : (
                    /* Standard layout */
                    <div className="space-y-1.5">
                        <div className="pb-1.5 border-b" style={{ borderColor: t.accent + "40" }}>
                            <div className="h-2 rounded bg-slate-800 w-2/3 mb-1" />
                            <div className="h-1.5 rounded w-1/2" style={{ background: t.accent }} />
                        </div>
                        {[["SUMMARY", 95], ["EXPERIENCE", 80], ["SKILLS", 65]].map(([, w], j) => (
                            <div key={j} className="space-y-0.5">
                                <div className="h-1 rounded w-1/4 mb-0.5" style={{ background: t.accent }} />
                                {[w, w - 15, w - 25].map((ww, k) => (
                                    <div key={k} className="h-0.5 rounded bg-slate-200" style={{ width: `${ww}%` }} />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ─── Hero app mockup ────────────────────────────────── */
function HeroMockup({ isDark }) {
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        const t = setInterval(() => setActiveTab(i => (i + 1) % TEMPLATES.length), 2200);
        return () => clearInterval(t);
    }, []);

    const bg       = isDark ? "#0f0f18" : "#ffffff";
    const bg2      = isDark ? "#0a0a12" : "#f8fafc";
    const border   = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)";
    const textMid  = isDark ? "#71717a"  : "#94a3b8";
    const textDim  = isDark ? "#3f3f46"  : "#cbd5e1";

    return (
        <div className={`relative rounded-2xl overflow-hidden border`} style={{ background: bg, borderColor: border, boxShadow: isDark ? "0 32px 80px rgba(0,0,0,0.6)" : "0 32px 80px rgba(0,0,0,0.12)" }}>
            {/* Browser bar */}
            <div className={`flex items-center gap-2 px-4 py-3 border-b`} style={{ background: bg2, borderColor: border }}>
                <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-400/70" />
                    <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                    <div className="h-3 w-3 rounded-full bg-emerald-400/70" />
                </div>
                <div className={`flex-1 mx-3 h-6 rounded-lg flex items-center justify-center text-[11px]`} style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", color: textMid }}>
                    resumegenie.app/create
                </div>
                <div className="h-5 w-5 rounded-md bg-violet-500/20 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-violet-500" />
                </div>
            </div>

            {/* App layout */}
            <div className="flex h-[320px]">
                {/* Left: Editor panel */}
                <div className={`w-[160px] shrink-0 flex flex-col border-r p-3 gap-3`} style={{ background: bg2, borderColor: border }}>
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: textMid }}>Style</p>
                    {/* Template tabs */}
                    <div className="flex flex-col gap-1">
                        {TEMPLATES.map((t, i) => (
                            <button key={i} onClick={() => setActiveTab(i)}
                                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-[10px] font-semibold text-left transition-all`}
                                style={{
                                    background: activeTab === i ? t.accent + "20" : "transparent",
                                    color: activeTab === i ? t.accent : textMid,
                                    border: activeTab === i ? `1px solid ${t.accent}40` : "1px solid transparent",
                                }}>
                                <span className="h-2 w-2 rounded-sm shrink-0" style={{ background: activeTab === i ? t.accent : textDim }} />
                                {t.name.split(" ")[0]}
                            </button>
                        ))}
                    </div>
                    <div className={`h-px w-full`} style={{ background: border }} />
                    <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: textMid }}>AI Improve</p>
                    <div className="flex flex-col gap-1">
                        {["Summary", "Experience", "Projects"].map((s) => (
                            <div key={s} className="flex items-center justify-between px-2 py-1 rounded-md" style={{ background: isDark ? "rgba(124,58,237,0.1)" : "rgba(124,58,237,0.06)" }}>
                                <span className="text-[9px] text-violet-500 font-medium">{s}</span>
                                <Sparkles className="h-2.5 w-2.5 text-violet-400" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Resume preview */}
                <div className="flex-1 flex items-center justify-center p-4" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
                    <div className="w-full max-w-[220px] h-full transition-all duration-500">
                        <TemplateMini t={TEMPLATES[activeTab]} i={activeTab} />
                    </div>
                </div>
            </div>

            {/* Status bar */}
            <div className={`flex items-center justify-between px-4 py-2.5 border-t`} style={{ background: bg2, borderColor: border }}>
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px]" style={{ color: textMid }}>AI Generated in <span className="text-emerald-500 font-semibold">8s</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                        <ShieldCheck className="h-2.5 w-2.5 text-emerald-500" />
                        <span className="text-[10px] text-emerald-500 font-semibold">ATS 92%</span>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                        <Download className="h-2.5 w-2.5 text-violet-500" />
                        <span className="text-[10px] text-violet-500 font-semibold">Export</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── Stat item ──────────────────────────────────────── */
function StatItem({ stat, visible, isDark }) {
    const count = useCounter(stat.value, 1800, visible);
    return (
        <div className="flex flex-col items-center">
            <p className={`text-3xl lg:text-5xl font-black tabular-nums bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent`}>
                {count.toLocaleString()}{stat.suffix}
            </p>
            <p className={`text-sm mt-2 font-medium ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{stat.label}</p>
        </div>
    );
}

/* ─── Main component ─────────────────────────────────── */
export default function LandingPage() {
    const { isDark } = useTheme();

    /* Stats visibility */
    const [statsVisible, setStatsVisible] = useState(false);
    const statsRef = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.3 });
        if (statsRef.current) obs.observe(statsRef.current);
        return () => obs.disconnect();
    }, []);

    /* Derived classes */
    const bg       = isDark ? "bg-[#080810]"  : "bg-white";
    const bg2      = isDark ? "bg-[#0a0a12]"  : "bg-slate-50";
    const border   = isDark ? "border-white/[0.06]" : "border-black/[0.06]";
    const border2  = isDark ? "border-white/[0.04]" : "border-black/[0.04]";
    const text     = isDark ? "text-white"     : "text-slate-900";
    const text2    = isDark ? "text-zinc-400"  : "text-slate-500";
    const text3    = isDark ? "text-zinc-500"  : "text-slate-400";
    const card     = isDark ? "bg-[#0f0f1c] border-white/[0.08] hover:bg-[#13131f] hover:border-white/[0.14] shadow-lg shadow-black/30" : "bg-white border-black/[0.06] hover:border-violet-200 shadow-sm hover:shadow-md";

    return (
        <div className={`min-h-screen ${bg} ${text} overflow-x-hidden transition-colors duration-300`}>

            {/* ══ HERO ═════════════════════════════════════ */}
            <section className={`relative min-h-screen flex items-center pt-24 pb-8`}>
                {/* Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className={`absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] ${isDark ? "bg-violet-600/10" : "bg-violet-300/30"}`} />
                    <div className={`absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[120px] ${isDark ? "bg-fuchsia-600/10" : "bg-fuchsia-300/25"}`} />
                    <div className={`absolute inset-0 opacity-[0.03]`}
                        style={{ backgroundImage: "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                        {/* Left: copy */}
                        <div className="text-center lg:text-left">
                            {/* Badge */}
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm mb-8 ${isDark ? "border-violet-500/30 bg-violet-500/10 text-violet-300" : "border-violet-200 bg-violet-50 text-violet-600"}`}>
                                <Sparkles className="h-3.5 w-3.5" />
                                Powered by AI
                                <span className={`h-1 w-1 rounded-full ${isDark ? "bg-violet-400" : "bg-violet-400"}`} />
                                <span className={isDark ? "text-violet-400" : "text-violet-500"}>Free to use</span>
                            </div>

                            {/* Headline */}
                            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.06] tracking-tight mb-6 ${text}`}>
                                Build a Resume
                                <span className="block mt-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                                    That Lands Interviews
                                </span>
                            </h1>

                            <p className={`text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed mb-10 ${text2}`}>
                                Describe yourself in a few sentences. AI generates a complete, ATS-optimized resume in seconds — then you customize, score, and download it.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-10">
                                <Link to="/create"
                                    className="group flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-base transition-all shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5">
                                    <Sparkles className="h-4 w-4" />
                                    Start Building Free
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                                <Link to="/ats-checker"
                                    className={`flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border font-semibold text-base transition-all hover:-translate-y-0.5 ${
                                        isDark ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white" : "border-black/10 bg-black/[0.03] text-slate-600 hover:bg-black/[0.06] hover:text-slate-900"
                                    }`}>
                                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                                    Check ATS Score
                                </Link>
                            </div>

                            {/* Trust chips */}
                            <div className={`flex flex-wrap items-center justify-center lg:justify-start gap-5 text-sm ${text3}`}>
                                {["No credit card required", "ATS Optimized", "AI-Powered", "4 Templates"].map((t) => (
                                    <div key={t} className="flex items-center gap-1.5">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                        {t}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: App mockup */}
                        <div className="relative">
                            <div className={`absolute -inset-4 rounded-3xl blur-2xl ${isDark ? "bg-gradient-to-br from-violet-500/15 via-fuchsia-500/10 to-cyan-500/10" : "bg-gradient-to-br from-violet-200/50 via-fuchsia-200/30 to-cyan-200/30"}`} />
                            <div className="relative">
                                <HeroMockup isDark={isDark} />
                                {/* Floating badges */}
                                <div className={`absolute -top-3 -right-3 flex items-center gap-2 px-3 py-2 rounded-xl border font-semibold text-xs shadow-lg ${isDark ? "bg-[#0f0f14] border-white/10 text-emerald-400" : "bg-white border-black/10 text-emerald-600"}`}>
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    AI Ready
                                </div>
                                <div className={`absolute -bottom-3 -left-3 flex items-center gap-2 px-3 py-2 rounded-xl border font-semibold text-xs shadow-lg ${isDark ? "bg-[#0f0f14] border-white/10 text-violet-400" : "bg-white border-black/10 text-violet-600"}`}>
                                    <ShieldCheck className="h-3.5 w-3.5" />
                                    ATS Score: 92%
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ STATS ════════════════════════════════════ */}
            <section ref={statsRef} className={`border-y ${border2} ${bg2} transition-colors duration-300`}>
                <div className="max-w-5xl mx-auto px-5 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {STATS.map((s, i) => (
                        <StatItem key={i} stat={s} visible={statsVisible} isDark={isDark} />
                    ))}
                </div>
            </section>

            {/* ══ FEATURES ═════════════════════════════════ */}
            <section className={`py-24 lg:py-32 ${bg} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="text-center mb-16">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm mb-5 ${isDark ? "bg-violet-500/10 border-violet-500/20 text-violet-300" : "bg-violet-50 border-violet-200 text-violet-600"}`}>
                            <Zap className="h-3.5 w-3.5" />
                            Everything you need
                        </div>
                        <h2 className={`text-4xl lg:text-5xl font-black tracking-tight mb-4 ${text}`}>
                            Built for job seekers
                            <span className={`block font-bold text-3xl lg:text-4xl mt-1 ${text3}`}>who mean business</span>
                        </h2>
                        <p className={`max-w-2xl mx-auto ${text2}`}>
                            Every feature is designed to save you time and maximize your chances of getting an interview.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            return (
                                <div key={i} className={`group relative rounded-2xl border p-6 transition-all hover:-translate-y-1 ${card}`}>
                                    <div className={`inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${f.gradient} mb-5 shadow-lg`}>
                                        <Icon className="h-5 w-5 text-white" />
                                    </div>
                                    <span className={`absolute top-5 right-5 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-gradient-to-r ${f.gradient} text-white opacity-80`}>
                                        {f.tag}
                                    </span>
                                    <h3 className={`text-base font-bold mb-2 ${text}`}>{f.title}</h3>
                                    <p className={`text-sm leading-relaxed ${text2}`}>{f.desc}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══ HOW IT WORKS ═════════════════════════════ */}
            <section className={`py-24 lg:py-32 ${bg2} border-y ${border2} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="text-center mb-16">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm mb-5 ${isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-emerald-50 border-emerald-200 text-emerald-600"}`}>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Simple 3-step process
                        </div>
                        <h2 className={`text-4xl lg:text-5xl font-black tracking-tight mb-4 ${text}`}>
                            Resume ready in
                            <span className="bg-gradient-to-r from-violet-500 to-cyan-500 bg-clip-text text-transparent"> minutes</span>
                        </h2>
                        <p className={`max-w-xl mx-auto ${text2}`}>No templates to fill manually. No formatting headaches. Just describe and download.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting line between cards */}
                        <div className={`hidden md:block absolute top-[58px] left-[calc(33%+28px)] right-[calc(33%+28px)] h-px pointer-events-none ${isDark ? "bg-gradient-to-r from-violet-500/40 via-violet-500/15 to-violet-500/40" : "bg-gradient-to-r from-violet-300/60 via-violet-200/30 to-violet-300/60"}`} />

                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            const col = STEP_COLORS[step.c];
                            const cardBg = isDark
                                ? "bg-[#0f0f1c] border-white/[0.08] hover:border-white/[0.14] hover:bg-[#13131f] shadow-lg shadow-black/40"
                                : "bg-white border-black/[0.06] hover:border-violet-200 shadow-sm hover:shadow-lg";
                            return (
                                <div key={i} className={`relative rounded-2xl border p-8 text-center transition-all duration-300 group ${cardBg}`}>
                                    {/* Step number badge */}
                                    <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 h-7 px-3 rounded-full flex items-center justify-center border font-black text-[11px] tracking-wider ${isDark ? `bg-[#0a0a12] ${col.border} ${col.text}` : `bg-white ${col.border} ${col.text} shadow-sm`}`}>
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center h-16 w-16 rounded-2xl border mb-5 mt-2 transition-transform duration-300 group-hover:scale-110 ${col.bg} ${col.border}`}>
                                        <Icon className={`h-7 w-7 ${col.text}`} />
                                    </div>

                                    <h3 className={`text-lg font-bold mb-2.5 ${text}`}>{step.title}</h3>
                                    <p className={`text-sm leading-relaxed ${text2}`}>{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-12">
                        <Link to="/create"
                            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-lg shadow-violet-500/25 hover:-translate-y-0.5">
                            Try It Now — It's Free
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ TEMPLATES ════════════════════════════════ */}
            <section className={`py-24 lg:py-32 ${bg} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="text-center mb-16">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm mb-5 ${isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-300" : "bg-blue-50 border-blue-200 text-blue-600"}`}>
                            <LayoutTemplate className="h-3.5 w-3.5" />
                            4 Premium Templates
                        </div>
                        <h2 className={`text-4xl lg:text-5xl font-black tracking-tight mb-4 ${text}`}>Pick your style</h2>
                        <p className={`max-w-xl mx-auto ${text2}`}>Every template is ATS-safe, customizable and exports as pixel-perfect A4 PDF.</p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {TEMPLATES.map((t, i) => (
                            <Link to="/create" key={i}
                                className={`group rounded-2xl border overflow-hidden transition-all hover:-translate-y-1.5 hover:shadow-xl ${isDark ? "border-white/[0.06] hover:border-violet-500/40 bg-[#0f0f14]" : "border-black/[0.07] hover:border-violet-300 bg-white shadow-sm"}`}>
                                <div className="h-48 p-4">
                                    <TemplateMini t={t} i={i} />
                                </div>
                                <div className={`px-4 py-3 border-t ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm font-bold ${text}`}>{t.name}</p>
                                            <p className={`text-xs ${text3}`}>{t.tag}</p>
                                        </div>
                                        <div className="h-2 w-2 rounded-full group-hover:scale-150 transition-transform" style={{ background: t.accent }} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIALS ═════════════════════════════ */}
            <section className={`py-24 lg:py-32 ${bg2} border-y ${border2} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-5 lg:px-8">
                    <div className="text-center mb-16">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm mb-5 ${isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-300" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                            <Star className="h-3.5 w-3.5 fill-current" />
                            Loved by students & developers
                        </div>
                        <h2 className={`text-4xl lg:text-5xl font-black tracking-tight ${text}`}>Real results, real people</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {REVIEWS.map((r, i) => (
                            <div key={i} className={`rounded-2xl border p-6 transition-all ${card}`}>
                                <div className="flex gap-0.5 mb-4">
                                    {Array(r.stars).fill(0).map((_, j) => (
                                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className={`text-sm leading-relaxed mb-6 ${text2}`}>"{r.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                                        {r.avatar}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-semibold ${text}`}>{r.name}</p>
                                        <p className={`text-xs ${text3}`}>{r.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA ══════════════════════════════════════ */}
            <section className={`py-24 lg:py-32 relative overflow-hidden ${bg} transition-colors duration-300`}>
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[120px] ${isDark ? "bg-violet-600/10" : "bg-violet-200/50"}`} />
                    <div className="absolute inset-0 opacity-[0.02]"
                        style={{ backgroundImage: "linear-gradient(currentColor 1px,transparent 1px),linear-gradient(90deg,currentColor 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
                </div>

                <div className="max-w-3xl mx-auto px-5 text-center relative">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-8 shadow-2xl shadow-violet-500/30 mx-auto">
                        <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <h2 className={`text-4xl lg:text-6xl font-black tracking-tight mb-5 leading-tight ${text}`}>
                        Your next interview
                        <span className="block bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                            starts right here
                        </span>
                    </h2>
                    <p className={`text-lg mb-10 max-w-xl mx-auto ${text2}`}>
                        Join thousands of students and developers who built interview-winning resumes with ResuMate.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/create"
                            className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-lg transition-all shadow-xl shadow-violet-500/30 hover:-translate-y-0.5">
                            <Sparkles className="h-5 w-5" />
                            Build My Resume — Free
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link to="/ats-checker"
                            className={`inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border font-semibold text-lg transition-all hover:-translate-y-0.5 ${
                                isDark ? "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.07] hover:text-white" : "border-black/10 bg-black/[0.02] text-slate-600 hover:bg-black/[0.05] hover:text-slate-900"
                            }`}>
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                            Check ATS Score
                        </Link>
                    </div>
                    <p className={`mt-6 text-sm ${text3}`}>No account required to get started. Free forever.</p>
                </div>
            </section>

            {/* ══ FOOTER ═══════════════════════════════════ */}
            <footer className={`border-t ${border} ${bg2} transition-colors duration-300`}>
                <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                        <div className="max-w-xs">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <span className={`font-black ${text}`}>ResuMate</span>
                            </div>
                            <p className={`text-sm leading-relaxed ${text3}`}>
                                AI-powered resume builder that helps you land more interviews. Built for students and developers.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
                            <div>
                                <p className={`font-semibold mb-3 ${text}`}>Product</p>
                                <ul className={`space-y-2.5 ${text3}`}>
                                    <li><Link to="/create" className={`hover:text-violet-500 transition-colors`}>Create Resume</Link></li>
                                    <li><Link to="/ats-checker" className="hover:text-violet-500 transition-colors">ATS Checker</Link></li>
                                    <li><Link to="/target-resume" className="hover:text-violet-500 transition-colors">Target Resume</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className={`font-semibold mb-3 ${text}`}>Account</p>
                                <ul className={`space-y-2.5 ${text3}`}>
                                    <li><Link to="/login" className="hover:text-violet-500 transition-colors">Sign In</Link></li>
                                    <li><Link to="/dashboard" className="hover:text-violet-500 transition-colors">Dashboard</Link></li>
                                    <li><Link to="/dashboard/resumes" className="hover:text-violet-500 transition-colors">My Resumes</Link></li>
                                </ul>
                            </div>
                            <div>
                                <p className={`font-semibold mb-3 ${text}`}>Legal</p>
                                <ul className={`space-y-2.5 ${text3}`}>
                                    <li><span className="cursor-default">Privacy Policy</span></li>
                                    <li><span className="cursor-default">Terms of Use</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className={`mt-10 pt-6 border-t ${border2} flex flex-col sm:flex-row items-center justify-between gap-3`}>
                        <p className={`text-xs ${text3}`}>© 2026 ResuMate. All rights reserved.</p>
                        <p className={`text-xs ${text3}`}>Powered by <span className="text-violet-500">AI</span></p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

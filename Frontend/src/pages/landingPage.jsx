import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight, Sparkles, CheckCircle2, Zap, ShieldCheck,
    FileText, Download, Star, Bot,
    LayoutTemplate, PenLine, BarChart2, MousePointerClick,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import Hero1 from "../components/ui/hero-1";
import { Marquee } from "../components/ui/marquee";
import { BentoGrid, BentoCard } from "../components/ui/bento-grid";

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

/* ─── Scroll-triggered visibility hook ──────────────── */
function useScrollVisible(threshold = 0.3) {
    const [visible, setVisible] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setVisible(true); },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, visible];
}

/* ─── Data ───────────────────────────────────────────── */
const STATS = [
    { value: 5000, suffix: "+", label: "Resumes Created",   icon: "📄" },
    { value: 4,    suffix: "",  label: "Premium Templates",  icon: "🎨" },
    { value: 92,   suffix: "%", label: "Avg. ATS Score",     icon: "🎯" },
    { value: 3,    suffix: "×", label: "Faster Than Manual", icon: "⚡" },
];

const FEATURES = [
    { icon: Bot,           title: "AI-Powered Generation",  desc: "Describe yourself in plain text. AI writes a complete, professional resume in under 10 seconds.", color: "violet", size: "lg" },
    { icon: ShieldCheck,   title: "ATS Score Checker",      desc: "Paste any job description and instantly see how your resume scores against ATS filters.", color: "blue",   size: "sm" },
    { icon: LayoutTemplate,title: "4 Premium Templates",    desc: "Harvard Classic, Academic Clean, Sidebar Pro, Timeline Pro — all ATS-safe.", color: "emerald",size: "sm" },
    { icon: PenLine,       title: "Inline Section Editor",  desc: "Edit every section directly — reorder via drag-and-drop, pick fonts and accent colors.", color: "amber",  size: "sm" },
    { icon: Sparkles,      title: "AI Section Improver",    desc: "One click rewrites your Summary, Experience, and Projects into strong, action-verb-led copy.", color: "pink", size: "sm" },
    { icon: Download,      title: "Multi-format Export",    desc: "Download as pixel-perfect A4 PDF, DOCX, or Markdown with one click.", color: "cyan",   size: "lg" },
];

const FEATURE_COLORS = {
    violet:  { iconBg: "bg-violet-500/10 dark:bg-violet-500/15", iconText: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500" },
    blue:    { iconBg: "bg-blue-500/10 dark:bg-blue-500/15",     iconText: "text-blue-600 dark:text-blue-400",     dot: "bg-blue-500" },
    emerald: { iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15", iconText: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
    amber:   { iconBg: "bg-amber-500/10 dark:bg-amber-500/15",   iconText: "text-amber-600 dark:text-amber-400",   dot: "bg-amber-500" },
    pink:    { iconBg: "bg-pink-500/10 dark:bg-pink-500/15",     iconText: "text-pink-600 dark:text-pink-400",     dot: "bg-pink-500" },
    cyan:    { iconBg: "bg-cyan-500/10 dark:bg-cyan-500/15",     iconText: "text-cyan-600 dark:text-cyan-400",     dot: "bg-cyan-500" },
};

const STEPS = [
    { number: "01", icon: PenLine,           title: "Describe Yourself",       desc: "Type a short paragraph about your skills, experience, and goals. No formatting needed.", c: "violet" },
    { number: "02", icon: Bot,               title: "AI Builds Your Resume",   desc: "AI generates a complete, structured resume with bullet points, skills, and summary.", c: "blue" },
    { number: "03", icon: MousePointerClick, title: "Customize & Download",    desc: "Pick a template, tweak colors and fonts, reorder sections, and export as PDF in one click.", c: "emerald" },
];

const STEP_COLORS = {
    violet:  { text: "text-violet-500",  bg: "bg-violet-500/10",  border: "border-violet-500/25", ring: "ring-violet-500/20" },
    blue:    { text: "text-blue-500",    bg: "bg-blue-500/10",    border: "border-blue-500/25",   ring: "ring-blue-500/20" },
    emerald: { text: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/25", ring: "ring-emerald-500/20" },
};

const REVIEWS = [
    { name: "Priya Sharma",  role: "SDE Intern @ Amazon",         avatar: "PS", color: "from-violet-500 to-fuchsia-500", stars: 5, text: "I went from a blank page to a polished resume in literally 8 minutes. The AI nailed my Spring Boot experience and the ATS checker helped me hit 94%." },
    { name: "Rahul Verma",   role: "CS Graduate, IIT Delhi",      avatar: "RV", color: "from-blue-500 to-cyan-500",      stars: 5, text: "The Harvard Classic template looks so professional. Recruiters at 3 different companies commented on how clean my resume was." },
    { name: "Sneha Nair",    role: "Frontend Dev @ Flipkart",     avatar: "SN", color: "from-emerald-500 to-teal-500",   stars: 5, text: "The AI Improve feature rewrote my bullet points to be so much more impactful. My interview callbacks went up noticeably after using it." },
    { name: "Arjun Mehta",   role: "Data Analyst @ Razorpay",     avatar: "AM", color: "from-amber-500 to-orange-500",   stars: 5, text: "Best free resume tool I've found. The targeted resume feature helped me tailor my CV for every application. Got 2 offers in a month." },
    { name: "Kavya Reddy",   role: "ML Engineer @ Google",        avatar: "KR", color: "from-pink-500 to-rose-500",      stars: 5, text: "Clean templates, smart AI suggestions, and the ATS checker is actually useful — not just a gimmick. Highly recommend for tech roles." },
    { name: "Vikram Singh",  role: "Backend Dev @ Microsoft",     avatar: "VS", color: "from-indigo-500 to-violet-500",  stars: 5, text: "Switched from Overleaf to ResuMate and haven't looked back. The PDF export quality is excellent and the AI writes better bullet points than I do." },
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
            <div className="h-1.5 w-full" style={{ background: t.accent }} />
            <div className="p-2.5 space-y-2">
                {i === 2 ? (
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

/* ─── Review Card (for Marquee) ─────────────────────── */
function ReviewCard({ r, isDark }) {
    return (
        <div className={`w-[340px] shrink-0 rounded-2xl border p-5 flex flex-col justify-between ${
            isDark
                ? "bg-[#0f0f1c] border-white/[0.08]"
                : "bg-white border-black/[0.06] shadow-sm"
        }`}>
            <div>
                <div className="flex gap-0.5 mb-3">
                    {Array(r.stars).fill(0).map((_, j) => (
                        <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    ))}
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-slate-600"}`}>
                    "{r.text}"
                </p>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-black/[0.04] dark:border-white/[0.06]">
                <div className={`h-8 w-8 rounded-full bg-gradient-to-br ${r.color} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
                    {r.avatar}
                </div>
                <div>
                    <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>{r.name}</p>
                    <p className={`text-xs ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{r.role}</p>
                </div>
            </div>
        </div>
    );
}

/* ─── Stat Card ──────────────────────────────────────── */
function StatCard({ stat, visible, isDark }) {
    const count = useCounter(stat.value, 1800, visible);
    return (
        <div className={`relative rounded-2xl border p-6 text-center transition-all duration-300 ${
            isDark
                ? "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"
                : "bg-white border-black/[0.06] hover:border-black/[0.1] shadow-sm"
        }`}>
            <span className="text-2xl mb-2 block">{stat.icon}</span>
            <p className="text-3xl lg:text-4xl font-black tabular-nums text-violet-500 dark:text-violet-400">
                {count.toLocaleString()}{stat.suffix}
            </p>
            <p className={`text-xs mt-1.5 font-medium ${isDark ? "text-zinc-500" : "text-slate-400"}`}>
                {stat.label}
            </p>
        </div>
    );
}

/* ══════════════════════════════════════════════════════
   Main Landing Page
   ══════════════════════════════════════════════════════ */
export default function LandingPage() {
    const { isDark } = useTheme();
    const { user } = useAuth();

    /* Section visibility */
    const [statsRef, statsVisible] = useScrollVisible(0.3);
    const [featRef, featVisible] = useScrollVisible(0.15);
    const [stepsRef, stepsVisible] = useScrollVisible(0.15);

    /* Derived classes */
    const bg       = isDark ? "bg-[#080810]"  : "bg-white";
    const bg2      = isDark ? "bg-[#0a0a12]"  : "bg-slate-50";
    const border   = isDark ? "border-white/[0.06]" : "border-black/[0.06]";
    const border2  = isDark ? "border-white/[0.04]" : "border-black/[0.04]";
    const text     = isDark ? "text-white"     : "text-slate-900";
    const text2    = isDark ? "text-zinc-400"  : "text-slate-500";
    const text3    = isDark ? "text-zinc-500"  : "text-slate-400";

    return (
        <div className={`min-h-screen ${bg} ${text} overflow-x-hidden transition-colors duration-300`}>

            {/* ══ HERO ═════════════════════════════════════ */}
            <Hero1
                showHeader={false}
                headline={
                    <>
                        Build a Resume{" "}
                        <br />
                        <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                            That Lands Interviews
                        </span>
                    </>
                }
                ctaLabel="Start Building Free"
                ctaHref="/create"
                description={`Describe yourself in a few sentences. AI generates a complete, ATS-optimized resume in seconds — then you customize, score, and download it.`}
                socialLinks={[
                    { label: "GitHub", href: "https://github.com/hxrshityadav/ResuMate" },
                ]}
            />

            {/* ══ STATS ════════════════════════════════════ */}
            <section ref={statsRef} className={`border-y ${border2} ${bg2} transition-colors duration-300`}>
                <div className="max-w-5xl mx-auto px-5 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STATS.map((s, i) => (
                        <StatCard key={i} stat={s} visible={statsVisible} isDark={isDark} />
                    ))}
                </div>
            </section>

            {/* ══ FEATURES — Bento Grid ═══════════════════ */}
            <section ref={featRef} className={`py-24 lg:py-32 ${bg} transition-colors duration-300`}>
                <div className="max-w-6xl mx-auto px-5 lg:px-8">
                    {/* Section header — left aligned, not centered */}
                    <div className="mb-14 max-w-2xl">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-4 ${
                            isDark ? "bg-violet-500/10 border-violet-500/20 text-violet-300"
                                   : "bg-violet-50 border-violet-200 text-violet-600"
                        }`}>
                            <Zap className="h-3 w-3" />
                            Everything you need
                        </div>
                        <h2 className={`text-3xl lg:text-4xl font-bold tracking-tight ${text}`}>
                            Built for people who
                            <span className={`block ${text3}`}>actually want to get hired.</span>
                        </h2>
                    </div>

                    {/* Bento layout */}
                    <BentoGrid className={`gap-4 ${featVisible ? "stagger-children" : ""}`}>
                        {FEATURES.map((f, i) => {
                            const Icon = f.icon;
                            const colors = FEATURE_COLORS[f.color];
                            return (
                                <BentoCard
                                    key={i}
                                    colSpan={f.size === "lg" ? 2 : 1}
                                    glowColor={f.color}
                                    className={featVisible ? "animate-fade-in-up" : "opacity-0"}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${colors.iconBg}`}>
                                            <Icon className={`h-5 w-5 ${colors.iconText}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <h3 className={`text-sm font-semibold ${text}`}>{f.title}</h3>
                                                <div className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
                                            </div>
                                            <p className={`text-sm leading-relaxed ${text2}`}>{f.desc}</p>
                                        </div>
                                    </div>
                                </BentoCard>
                            );
                        })}
                    </BentoGrid>
                </div>
            </section>

            {/* ══ HOW IT WORKS ═════════════════════════════ */}
            <section ref={stepsRef} className={`py-24 lg:py-32 ${bg2} border-y ${border2} transition-colors duration-300`}>
                <div className="max-w-5xl mx-auto px-5 lg:px-8">
                    <div className="text-center mb-16">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-4 ${
                            isDark ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                                   : "bg-emerald-50 border-emerald-200 text-emerald-600"
                        }`}>
                            <CheckCircle2 className="h-3 w-3" />
                            Simple 3-step process
                        </div>
                        <h2 className={`text-3xl lg:text-4xl font-bold tracking-tight mb-3 ${text}`}>
                            Resume ready in minutes
                        </h2>
                        <p className={`max-w-lg mx-auto text-sm ${text2}`}>
                            No templates to fill manually. No formatting headaches. Just describe and download.
                        </p>
                    </div>

                    {/* Steps — horizontal with connecting line */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        {/* Connecting line */}
                        <div className={`hidden md:block absolute top-[52px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px ${
                            isDark ? "bg-gradient-to-r from-violet-500/30 via-blue-500/20 to-emerald-500/30"
                                   : "bg-gradient-to-r from-violet-300/50 via-blue-200/30 to-emerald-300/50"
                        }`} />

                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            const col = STEP_COLORS[step.c];
                            return (
                                <div
                                    key={i}
                                    className={`relative rounded-2xl border p-6 text-center transition-all duration-500 group ${
                                        isDark
                                            ? "bg-[#0f0f1c]/80 border-white/[0.06] hover:border-white/[0.12]"
                                            : "bg-white border-black/[0.06] hover:border-black/[0.1] shadow-sm"
                                    } ${stepsVisible ? "animate-fade-in-up" : "opacity-0"}`}
                                    style={{ animationDelay: `${i * 120}ms` }}
                                >
                                    {/* Step number */}
                                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 h-6 px-3 rounded-full flex items-center justify-center text-[10px] font-bold tracking-widest ${col.bg} ${col.text} ${col.border} border`}>
                                        {step.number}
                                    </div>

                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center h-14 w-14 rounded-2xl mb-4 mt-2 transition-transform duration-300 group-hover:scale-105 ${col.bg} ring-1 ${col.ring}`}>
                                        <Icon className={`h-6 w-6 ${col.text}`} />
                                    </div>

                                    <h3 className={`text-base font-semibold mb-2 ${text}`}>{step.title}</h3>
                                    <p className={`text-sm leading-relaxed ${text2}`}>{step.desc}</p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center mt-10">
                        <Link to="/create"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-lg shadow-violet-500/20 hover:-translate-y-0.5">
                            Try It Now — It's Free
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ══ TEMPLATES ════════════════════════════════ */}
            <section className={`py-24 lg:py-32 ${bg} transition-colors duration-300`}>
                <div className="max-w-6xl mx-auto px-5 lg:px-8">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
                        <div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-4 ${
                                isDark ? "bg-blue-500/10 border-blue-500/20 text-blue-300"
                                       : "bg-blue-50 border-blue-200 text-blue-600"
                            }`}>
                                <LayoutTemplate className="h-3 w-3" />
                                4 Premium Templates
                            </div>
                            <h2 className={`text-3xl lg:text-4xl font-bold tracking-tight ${text}`}>Pick your style</h2>
                            <p className={`mt-2 text-sm max-w-md ${text2}`}>Every template is ATS-safe, customizable and exports as pixel-perfect A4 PDF.</p>
                        </div>
                        <Link to="/create" className={`text-sm font-medium flex items-center gap-1.5 group ${isDark ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-500"}`}>
                            Browse all templates
                            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {TEMPLATES.map((t, i) => (
                            <Link to="/create" key={i}
                                className={`group rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
                                    isDark
                                        ? "border-white/[0.06] hover:border-violet-500/30 bg-[#0f0f14]"
                                        : "border-black/[0.07] hover:border-violet-300 bg-white shadow-sm"
                                }`}>
                                <div className="h-44 p-3">
                                    <TemplateMini t={t} i={i} />
                                </div>
                                <div className={`px-4 py-3 border-t ${isDark ? "border-white/[0.06]" : "border-black/[0.06]"}`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className={`text-sm font-semibold ${text}`}>{t.name}</p>
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

            {/* ══ TESTIMONIALS — Infinite Marquee ═════════ */}
            <section className={`py-20 lg:py-28 ${bg2} border-y ${border2} transition-colors duration-300 overflow-hidden`}>
                <div className="max-w-6xl mx-auto px-5 lg:px-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                        <div>
                            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium mb-4 ${
                                isDark ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                                       : "bg-amber-50 border-amber-200 text-amber-600"
                            }`}>
                                <Star className="h-3 w-3 fill-current" />
                                Loved by students & developers
                            </div>
                            <h2 className={`text-3xl lg:text-4xl font-bold tracking-tight ${text}`}>
                                Real results, real people
                            </h2>
                        </div>
                        <p className={`text-sm max-w-sm ${text2}`}>
                            Join thousands of students and professionals who've landed interviews with ResuMate.
                        </p>
                    </div>
                </div>

                {/* Marquee row 1 */}
                <Marquee speed={35} pauseOnHover className="mb-4">
                    {REVIEWS.slice(0, 3).map((r, i) => (
                        <ReviewCard key={i} r={r} isDark={isDark} />
                    ))}
                </Marquee>
                {/* Marquee row 2 — reverse direction */}
                <Marquee speed={30} pauseOnHover reverse>
                    {REVIEWS.slice(3, 6).map((r, i) => (
                        <ReviewCard key={i} r={r} isDark={isDark} />
                    ))}
                </Marquee>
            </section>

            {/* ══ CTA ══════════════════════════════════════ */}
            <section className={`py-24 lg:py-32 relative overflow-hidden ${bg} transition-colors duration-300`}>
                {/* Background texture */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] ${
                        isDark ? "bg-violet-600/8" : "bg-violet-200/40"
                    }`} />
                    <div className={`absolute inset-0 bg-dot-grid opacity-[0.015] ${isDark ? "text-white" : "text-black"}`} />
                </div>

                <div className="max-w-2xl mx-auto px-5 text-center relative">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 mb-6 shadow-xl shadow-violet-500/20 animate-glow-pulse">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className={`text-3xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight ${text}`}>
                        Your next interview{" "}
                        <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                            starts here
                        </span>
                    </h2>
                    <p className={`text-base mb-8 max-w-md mx-auto ${text2}`}>
                        Join thousands of students and developers who built interview-winning resumes with ResuMate.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/create"
                            className="group inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all shadow-lg shadow-violet-500/25 hover:-translate-y-0.5">
                            <Sparkles className="h-4 w-4" />
                            Build My Resume — Free
                            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                        <Link to="/ats-checker"
                            className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border font-semibold transition-all hover:-translate-y-0.5 ${
                                isDark ? "border-white/10 bg-white/[0.03] text-zinc-300 hover:bg-white/[0.06]"
                                       : "border-black/10 bg-black/[0.02] text-slate-600 hover:bg-black/[0.05]"
                            }`}>
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Check ATS Score
                        </Link>
                    </div>
                    <p className={`mt-5 text-xs ${text3}`}>No account required to get started. Free forever.</p>
                </div>
            </section>

            {/* ══ FOOTER ═══════════════════════════════════ */}
            <footer className={`border-t ${border} ${bg2} transition-colors duration-300`}>
                {/* Gradient divider line */}
                <div className="h-px w-full bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

                <div className="max-w-6xl mx-auto px-5 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                        <div className="max-w-xs">
                            <div className="flex items-center gap-2.5 mb-3">
                                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                    <Sparkles className="h-4 w-4 text-white" />
                                </div>
                                <span className={`font-bold ${text}`}>ResuMate</span>
                            </div>
                            <p className={`text-sm leading-relaxed ${text3}`}>
                                AI-powered resume builder that helps you land more interviews. Built for students and developers.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
                            <div>
                                <p className={`font-semibold mb-3 ${text}`}>Product</p>
                                <ul className={`space-y-2.5 ${text3}`}>
                                    <li><Link to="/create" className="hover:text-violet-500 transition-colors">Create Resume</Link></li>
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
                        <p className={`text-xs ${text3}`}><span className="text-violet-500">AI Resume Builder</span></p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

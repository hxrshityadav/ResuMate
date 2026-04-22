import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FileText, PlusCircle, TrendingUp, Clock,
    ShieldCheck, ArrowRight, Sparkles, Zap,
    BarChart2, ChevronRight, Loader2, Target,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { getResumes } from "../../api/resumeApi";

const QUICK_ACTIONS = [
    {
        icon: Sparkles,
        label: "Create Resume",
        desc: "Generate with AI in seconds",
        path: "/create",
        gradient: "from-violet-500 to-fuchsia-500",
        shadow: "shadow-violet-500/20",
        badge: "AI Powered",
        badgeBg: "from-violet-500 to-fuchsia-500",
        ring: "hover:ring-violet-200 dark:hover:ring-violet-500/30",
    },
    {
        icon: Target,
        label: "Target Resume",
        desc: "Tailor resume to a job description",
        path: "/target-resume",
        gradient: "from-orange-500 to-rose-500",
        shadow: "shadow-orange-500/20",
        badge: "New",
        badgeBg: "from-orange-500 to-rose-500",
        ring: "hover:ring-orange-200 dark:hover:ring-orange-500/30",
    },
    {
        icon: ShieldCheck,
        label: "ATS Checker",
        desc: "Score your resume against jobs",
        path: "/ats-checker",
        gradient: "from-blue-500 to-cyan-500",
        shadow: "shadow-blue-500/20",
        badge: "Free",
        badgeBg: "from-blue-500 to-cyan-500",
        ring: "hover:ring-blue-200 dark:hover:ring-blue-500/30",
    },
    {
        icon: FileText,
        label: "My Resumes",
        desc: "View and manage saved resumes",
        path: "/dashboard/resumes",
        gradient: "from-emerald-500 to-teal-500",
        shadow: "shadow-emerald-500/20",
        badge: null,
        ring: "hover:ring-emerald-200 dark:hover:ring-emerald-500/30",
    },
];

const TIPS = [
    { icon: "🎯", text: "Add quantifiable results — numbers make resumes 3× more impactful." },
    { icon: "🔑", text: "Mirror keywords from the job description to beat ATS filters." },
    { icon: "⚡", text: "Keep your resume to 1 page if you have under 10 years of experience." },
];

export default function DashboardHome() {
    const { user } = useAuth();
    const { isDark } = useTheme();
    const navigate   = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tipIdx,  setTipIdx]  = useState(0);

    const firstName = (
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "there"
    ).split(" ")[0];

    useEffect(() => {
        getResumes()
            .then(setResumes)
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const t = setInterval(() => setTipIdx((i) => (i + 1) % TIPS.length), 5000);
        return () => clearInterval(t);
    }, []);

    const lastUpdated = resumes.length
        ? (() => {
              const d = Math.floor(Math.abs(Date.now() - new Date(resumes[0].created_at).getTime()) / 86400000);
              return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d} days ago`;
          })()
        : "—";

    /* ── Derived style helpers ── */
    const card      = isDark
        ? "bg-[#0f0f1c] border-white/[0.08] hover:border-white/[0.14]"
        : "bg-white border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md";
    const subText   = isDark ? "text-zinc-500" : "text-slate-400";
    const bodyText  = isDark ? "text-zinc-300" : "text-slate-600";
    const headText  = isDark ? "text-white"    : "text-slate-900";
    const divider   = isDark ? "divide-white/[0.05]" : "divide-slate-100";
    const rowHover  = isDark ? "hover:bg-white/[0.03]" : "hover:bg-slate-50";

    const stats = [
        {
            icon: FileText,
            label: "Total Resumes",
            value: loading ? "—" : resumes.length,
            color: isDark ? "text-violet-400" : "text-violet-600",
            bg: isDark ? "bg-violet-500/10" : "bg-violet-50",
            border: isDark ? "border-violet-500/20" : "border-violet-100",
            valueColor: isDark ? "text-white" : "text-slate-900",
        },
        {
            icon: Clock,
            label: "Last Updated",
            value: loading ? "—" : lastUpdated,
            color: isDark ? "text-blue-400" : "text-blue-600",
            bg: isDark ? "bg-blue-500/10" : "bg-blue-50",
            border: isDark ? "border-blue-500/20" : "border-blue-100",
            valueColor: isDark ? "text-white" : "text-slate-900",
        },
        {
            icon: TrendingUp,
            label: "Avg. ATS Score",
            value: "—",
            color: isDark ? "text-emerald-400" : "text-emerald-600",
            bg: isDark ? "bg-emerald-500/10" : "bg-emerald-50",
            border: isDark ? "border-emerald-500/20" : "border-emerald-100",
            valueColor: isDark ? "text-white" : "text-slate-900",
        },
        {
            icon: BarChart2,
            label: "Profile Strength",
            value: resumes.length > 0 ? "Good" : "Start",
            color: isDark ? "text-amber-400" : "text-amber-600",
            bg: isDark ? "bg-amber-500/10" : "bg-amber-50",
            border: isDark ? "border-amber-500/20" : "border-amber-100",
            valueColor: resumes.length > 0
                ? isDark ? "text-amber-300" : "text-amber-600"
                : isDark ? "text-white" : "text-slate-900",
        },
    ];

    return (
        <div className="space-y-8">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">👋</span>
                        <p className={`text-sm font-medium ${subText}`}>Welcome back,</p>
                    </div>
                    <h1 className={`text-3xl lg:text-4xl font-black tracking-tight ${
                        isDark
                            ? "bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent"
                            : "text-slate-900"
                    }`}>
                        {firstName}
                    </h1>
                </div>
                <Link to="/create"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-md shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 self-start sm:self-auto">
                    <PlusCircle className="h-4 w-4" />
                    Create New Resume
                </Link>
            </div>

            {/* ── Stats ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                        <div key={i} className={`rounded-2xl border p-5 transition-all ${card} ${s.border}`}>
                            <div className={`inline-flex items-center justify-center h-10 w-10 rounded-xl mb-4 ${s.bg}`}>
                                <Icon className={`h-5 w-5 ${s.color}`} />
                            </div>
                            <p className={`text-xs font-medium mb-1.5 ${subText}`}>{s.label}</p>
                            <p className={`text-2xl font-bold ${s.valueColor}`}>
                                {loading
                                    ? <Loader2 className={`h-5 w-5 animate-spin ${subText}`} />
                                    : s.value}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* ── Quick Actions ── */}
            <div>
                <h2 className={`text-xs font-bold uppercase tracking-widest mb-4 ${subText}`}>
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {QUICK_ACTIONS.map((a) => {
                        const Icon = a.icon;
                        return (
                            <Link key={a.path} to={a.path}
                                className={`group relative rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 ring-2 ring-transparent ${card} ${a.ring} shadow-lg ${a.shadow}`}>
                                <div className={`inline-flex items-center justify-center h-11 w-11 rounded-xl bg-gradient-to-br ${a.gradient} mb-4 shadow-lg group-hover:scale-105 transition-transform`}>
                                    <Icon className="h-5 w-5 text-white" />
                                </div>
                                {a.badge && (
                                    <span className={`absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full text-white bg-gradient-to-r ${a.badgeBg}`}>
                                        {a.badge}
                                    </span>
                                )}
                                <h3 className={`font-bold text-sm mb-1 ${headText}`}>{a.label}</h3>
                                <p className={`text-xs ${subText}`}>{a.desc}</p>
                                <div className={`flex items-center gap-1 mt-3 text-xs font-semibold transition-colors ${isDark ? "text-zinc-500 group-hover:text-zinc-300" : "text-slate-400 group-hover:text-violet-600"}`}>
                                    Get started
                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* ── Recent Resumes + Tips ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Recent Resumes */}
                <div className={`lg:col-span-2 rounded-2xl border overflow-hidden ${isDark ? "bg-[#0f0f1c] border-white/[0.08]" : "bg-white border-slate-200 shadow-sm"}`}>
                    <div className={`flex items-center justify-between px-6 py-4 border-b ${isDark ? "border-white/[0.06]" : "border-slate-100"}`}>
                        <h2 className={`font-bold text-sm ${headText}`}>Recent Resumes</h2>
                        <Link to="/dashboard/resumes"
                            className={`text-xs font-semibold flex items-center gap-1 transition-colors ${isDark ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700"}`}>
                            View all <ChevronRight className="h-3 w-3" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-6 w-6 animate-spin text-violet-500" />
                        </div>
                    ) : resumes.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-3">
                            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${isDark ? "bg-violet-500/10" : "bg-violet-50"}`}>
                                <FileText className={`h-6 w-6 ${isDark ? "text-violet-400" : "text-violet-500"}`} />
                            </div>
                            <p className={`text-sm font-bold ${headText}`}>No resumes yet</p>
                            <p className={`text-xs max-w-[220px] ${subText}`}>Create your first resume and save it to see it here.</p>
                            <Link to="/create"
                                className={`mt-1 px-4 py-2 rounded-lg text-xs font-bold transition-all ${isDark ? "bg-violet-500/15 text-violet-300 hover:bg-violet-500/25" : "bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-200"}`}>
                                Create Resume →
                            </Link>
                        </div>
                    ) : (
                        <div className={`divide-y ${divider}`}>
                            {resumes.slice(0, 5).map((r) => (
                                <div key={r.id}
                                    className={`flex items-center gap-4 px-6 py-4 transition-all group cursor-pointer ${rowHover}`}
                                    onClick={() => navigate("/dashboard/resumes")}>
                                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${isDark ? "bg-violet-500/10" : "bg-violet-50"}`}>
                                        <FileText className={`h-[18px] w-[18px] ${isDark ? "text-violet-400" : "text-violet-500"}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold truncate ${headText}`}>{r.title}</p>
                                        <p className={`text-xs mt-0.5 ${subText}`}>
                                            {new Date(r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); navigate("/ats-checker"); }}
                                        className={`opacity-0 group-hover:opacity-100 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${isDark ? "bg-violet-500/15 text-violet-300 hover:bg-violet-500/25" : "bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-200"}`}>
                                        ATS Check
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Side cards */}
                <div className="flex flex-col gap-4">

                    {/* Tip carousel */}
                    <div className={`rounded-2xl border p-5 flex-1 ${
                        isDark
                            ? "border-violet-500/20 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5"
                            : "border-violet-200 bg-gradient-to-br from-violet-50 to-fuchsia-50/50"
                    }`}>
                        <div className="flex items-center gap-2 mb-4">
                            <Zap className={`h-4 w-4 ${isDark ? "text-violet-400" : "text-violet-500"}`} />
                            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-violet-300" : "text-violet-600"}`}>
                                Resume Tip
                            </p>
                        </div>
                        <div className="min-h-[72px] transition-all duration-500">
                            <p className="text-2xl mb-2">{TIPS[tipIdx].icon}</p>
                            <p className={`text-sm leading-relaxed ${isDark ? "text-zinc-300" : "text-violet-900/80"}`}>
                                {TIPS[tipIdx].text}
                            </p>
                        </div>
                        <div className="flex gap-1.5 mt-4">
                            {TIPS.map((_, i) => (
                                <button key={i} onClick={() => setTipIdx(i)}
                                    className={`h-1 rounded-full transition-all ${
                                        i === tipIdx
                                            ? isDark ? "w-6 bg-violet-400" : "w-6 bg-violet-500"
                                            : isDark ? "w-2 bg-white/20" : "w-2 bg-violet-200"
                                    }`} />
                            ))}
                        </div>
                    </div>

                    {/* ATS ready */}
                    <div className={`rounded-2xl border p-5 ${isDark ? "bg-[#0f0f1c] border-white/[0.08]" : "bg-white border-slate-200 shadow-sm"}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className={`h-4 w-4 ${isDark ? "text-emerald-400" : "text-emerald-500"}`} />
                            <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? "text-emerald-300" : "text-emerald-600"}`}>
                                ATS Ready?
                            </p>
                        </div>
                        <p className={`text-xs mb-4 leading-relaxed ${subText}`}>
                            Check how well your resume matches a job description.
                        </p>
                        <Link to="/ats-checker"
                            className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                                isDark
                                    ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                                    : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200"
                            }`}>
                            Run ATS Check <ArrowRight className="h-3 w-3" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
    Sparkles,
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Loader2,
    ArrowRight,
    FileText,
    ShieldCheck,
    Bot,
} from "lucide-react";
import toast from "react-hot-toast";

const FEATURES = [
    { icon: Bot, label: "AI-generated resumes in seconds" },
    { icon: ShieldCheck, label: "ATS score checker built-in" },
    { icon: FileText, label: "4 recruiter-approved templates" },
];

export default function Login() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { isDark } = useTheme();

    const [tab, setTab] = useState("signin"); // "signin" | "signup"
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (user) navigate("/dashboard", { replace: true });
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (tab === "signup") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                    },
                });
                if (error) throw error;
                toast.success("Account created! Check your email to confirm.");
            } else {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                toast.success("Welcome back!");
                navigate("/dashboard");
            }
        } catch (err) {
            toast.error(err.message || "Authentication failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setGoogleLoading(true);
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: { redirectTo: `${window.location.origin}/dashboard` },
        });
        if (error) {
            toast.error(error.message);
            setGoogleLoading(false);
        }
    };

    const inputCls = "bg-[var(--bg3)] border-[var(--border)] placeholder:text-[var(--text3)] focus:border-violet-500/60 focus:ring-violet-500/20 text-[var(--text)]";

    const text = "text-[var(--text)]";
    const text2 = "text-[var(--text2)]";
    const text3 = "text-[var(--text3)]";
    const divider = "bg-[var(--border)]";

    return (
        <div className="resumate-shell min-h-screen flex bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
            {/* ── Left panel — branding & features ─────────── */}
            <div className="hidden lg:flex flex-col justify-between w-[45%] border-r border-[var(--border)] bg-[var(--bg2)] relative overflow-hidden">
                {/* Dot grid background */}
                <div className={`absolute inset-0 bg-dot-grid opacity-[0.03] ${isDark ? "text-white" : "text-black"}`} />

                {/* Subtle glow */}
                <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px] ${
                    isDark ? "bg-violet-600/8" : "bg-violet-300/20"
                }`} />

                <div className="relative z-10 p-10 flex flex-col justify-between h-full">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className={`grid h-10 w-10 rotate-3 place-items-center rounded-[14px] ${isDark ? "bg-[#f6efe3] text-[#10141a]" : "bg-[#25241f] text-[#f7f1e5]"}`}>
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <span className={`atlas-serif text-xl font-semibold tracking-[-0.03em] ${text}`}>ResuMate</span>
                    </Link>

                    {/* Content */}
                    <div className="space-y-6 max-w-sm">
                        <h2 className={`resumate-page-title text-4xl leading-tight ${text}`}>
                            Build resumes that{" "}
                            <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                                land interviews
                            </span>
                        </h2>
                        <p className={`text-sm leading-relaxed ${text2}`}>
                            Generate professional, ATS-optimized resumes in seconds with AI — then customize and download.
                        </p>

                        {/* Feature list */}
                        <div className="space-y-3 pt-2">
                            {FEATURES.map((f) => {
                                const Icon = f.icon;
                                return (
                                    <div key={f.label} className="flex items-center gap-3">
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                                            isDark ? "bg-violet-500/10" : "bg-violet-50"
                                        }`}>
                                            <Icon className="h-4 w-4 text-violet-500" />
                                        </div>
                                        <span className={`text-sm ${text2}`}>{f.label}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Stats row */}
                        <div className="flex gap-6 pt-4">
                            {[
                                { value: "5K+", label: "Resumes" },
                                { value: "92%", label: "Avg ATS" },
                                { value: "Free", label: "Forever" },
                            ].map((s) => (
                                <div key={s.label}>
                                    <p className={`text-xl font-bold ${text}`}>{s.value}</p>
                                    <p className={`text-xs ${text3}`}>{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <p className={`text-xs ${text3}`}>© 2026 ResuMate. All rights reserved.</p>
                </div>
            </div>

            {/* ── Right panel — auth form ─────────────────── */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-md space-y-6">
                    {/* Mobile logo */}
                    <Link to="/" className="flex lg:hidden items-center gap-2.5 justify-center mb-2">
                        <div className={`grid h-9 w-9 rotate-3 place-items-center rounded-[13px] ${isDark ? "bg-[#f6efe3] text-[#10141a]" : "bg-[#25241f] text-[#f7f1e5]"}`}>
                            <Sparkles className="h-4 w-4" />
                        </div>
                        <span className={`atlas-serif text-xl font-semibold tracking-[-0.03em] ${text}`}>ResuMate</span>
                    </Link>

                    {/* Header */}
                    <div className="text-center lg:text-left">
                        <h1 className={`resumate-page-title text-3xl ${text}`}>
                            {tab === "signin" ? "Welcome back" : "Create account"}
                        </h1>
                        <p className={`text-sm mt-1.5 ${text2}`}>
                            {tab === "signin"
                                ? "Sign in to access your resumes"
                                : "Start building your perfect resume"}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 p-1 rounded-xl border bg-[var(--bg3)] border-[var(--border)]">
                        {["signin", "signup"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                                    tab === t
                                        ? "bg-violet-600 text-white shadow-md shadow-violet-500/25"
                                        : isDark ? "text-zinc-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                                }`}
                            >
                                {t === "signin" ? "Sign In" : "Sign Up"}
                            </button>
                        ))}
                    </div>

                    {/* Google OAuth */}
                    <button
                        onClick={handleGoogle}
                        disabled={googleLoading}
                        className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl border font-medium text-sm transition-all hover:-translate-y-px disabled:opacity-60 ${
                            isDark
                                ? "bg-white/[0.04] border-white/[0.08] text-zinc-200 hover:bg-white/[0.07]"
                                : "bg-white border-black/[0.1] text-slate-700 hover:bg-slate-50 shadow-sm"
                        }`}
                    >
                        {googleLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <svg className="h-4 w-4" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                        )}
                        Continue with Google
                    </button>

                    <div className="flex items-center gap-3">
                        <div className={`flex-1 h-px ${divider}`} />
                        <span className={`text-xs ${text3}`}>or continue with email</span>
                        <div className={`flex-1 h-px ${divider}`} />
                    </div>

                    {/* Email/Password form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {tab === "signup" && (
                            <div className="space-y-1.5">
                                <label className={`text-sm font-medium ${text2}`}>Full Name</label>
                                <div className="relative">
                                    <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${text3}`} />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Jordan Lee"
                                        required
                                        className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none focus:ring-1 transition-all ${inputCls}`}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className={`text-sm font-medium ${text2}`}>Email</label>
                            <div className="relative">
                                <Mail className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${text3}`} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className={`w-full pl-10 pr-4 py-3 border rounded-xl text-sm outline-none focus:ring-1 transition-all ${inputCls}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`text-sm font-medium ${text2}`}>Password</label>
                            <div className="relative">
                                <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 ${text3}`} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength={6}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-xl text-sm outline-none focus:ring-1 transition-all ${inputCls}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                                        isDark ? "text-zinc-500 hover:text-zinc-300" : "text-slate-400 hover:text-slate-600"
                                    }`}
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-md shadow-violet-500/20 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:-translate-y-px"
                        >
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {tab === "signin" ? "Sign In" : "Create Account"}
                                    <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className={`text-center text-sm ${text2}`}>
                        {tab === "signin" ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={() => setTab(tab === "signin" ? "signup" : "signin")}
                            className="text-violet-500 hover:text-violet-400 font-semibold transition-colors"
                        >
                            {tab === "signin" ? "Sign up free" : "Sign in"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

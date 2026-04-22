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
} from "lucide-react";
import toast from "react-hot-toast";

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

    const bg   = isDark ? "bg-zinc-950" : "bg-white";
    const text = isDark ? "text-white"  : "text-slate-900";
    const text2= isDark ? "text-zinc-400" : "text-slate-500";
    const side = isDark ? "bg-gradient-to-br from-violet-600/20 via-zinc-900 to-fuchsia-600/10 border-white/10" : "bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50 border-black/[0.07]";
    const inputCls = isDark
        ? "bg-zinc-900 border-white/10 placeholder-zinc-600 focus:border-violet-500/60 focus:ring-violet-500/30"
        : "bg-slate-50 border-black/10 placeholder-slate-400 focus:border-violet-400 focus:ring-violet-400/20";
    const statCard = isDark ? "bg-white/5 border-white/10" : "bg-violet-50/80 border-violet-100";

    return (
        <div className={`min-h-screen ${bg} ${text} flex transition-colors duration-300`}>
            {/* Left — branding */}
            <div className={`hidden lg:flex flex-col justify-between w-[45%] border-r p-12 ${side}`}>
                <Link to="/" className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-violet-400" />
                    </div>
                    <span className="text-xl font-bold">ResuMate</span>
                </Link>

                <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium">
                        <Sparkles className="h-3.5 w-3.5" />
                        AI-Powered Resume Builder
                    </div>
                    <h2 className="text-4xl font-bold leading-tight">
                        Build resumes that<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                            beat the ATS
                        </span>
                    </h2>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Generate professional resumes in seconds with AI, check your ATS score,
                        and land more interviews.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {[
                            { label: "Resumes Generated", value: "5K+" },
                            { label: "Avg ATS Score", value: "92%" },
                            { label: "Templates", value: "4" },
                            { label: "AI-Powered", value: "100%" },
                        ].map((stat) => (
                            <div key={stat.label} className={`rounded-2xl p-4 border ${statCard}`}>
                                <p className={`text-2xl font-bold ${text}`}>{stat.value}</p>
                                <p className={`text-xs mt-1 ${text2}`}>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-zinc-600 text-sm">© 2026 ResuMate. All rights reserved.</p>
            </div>

            {/* Right — form */}
            <div className={`flex-1 flex items-center justify-center p-6 ${isDark ? "" : "bg-white"}`}>
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile logo */}
                    <Link to="/" className="flex lg:hidden items-center gap-3 justify-center">
                        <div className="h-9 w-9 rounded-xl bg-violet-500/20 flex items-center justify-center">
                            <Sparkles className="h-4 w-4 text-violet-400" />
                        </div>
                        <span className="text-lg font-bold">ResuMate</span>
                    </Link>

                    <div className="text-center lg:text-left">
                        <h1 className="text-3xl font-bold">
                            {tab === "signin" ? "Welcome back" : "Create account"}
                        </h1>
                        <p className="text-zinc-400 mt-2">
                            {tab === "signin"
                                ? "Sign in to access your resumes"
                                : "Start building your perfect resume"}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className={`flex gap-1 border p-1 rounded-2xl ${isDark ? "bg-zinc-900 border-white/10" : "bg-slate-100 border-black/[0.07]"}`}>
                        {["signin", "signup"].map((t) => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                    tab === t
                                        ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
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
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl bg-white text-zinc-900 font-semibold hover:bg-zinc-100 transition-all disabled:opacity-60"
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
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-zinc-500">or continue with email</span>
                        <div className="flex-1 h-px bg-white/10" />
                    </div>

                    {/* Email/Password form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {tab === "signup" && (
                            <div className="space-y-1.5">
                                <label className={`text-sm font-medium ${text2}`}>Full Name</label>
                                <div className="relative">
                                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${text2}`} />
                                    <input
                                        type="text"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Harshit Yadav"
                                        required
                                        className={`w-full pl-11 pr-4 py-3 border rounded-2xl text-sm outline-none focus:ring-1 transition-all ${inputCls}`}
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <label className={`text-sm font-medium ${text2}`}>Email</label>
                            <div className="relative">
                                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${text2}`} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className={`w-full pl-11 pr-4 py-3 border rounded-2xl text-sm outline-none focus:ring-1 transition-all ${inputCls}`}
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className={`text-sm font-medium ${text2}`}>Password</label>
                            <div className="relative">
                                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 ${text2}`} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Min. 6 characters"
                                    required
                                    minLength={6}
                                    className={`w-full pl-11 pr-12 py-3 border rounded-2xl text-sm outline-none focus:ring-1 transition-all ${inputCls}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-2xl bg-violet-600 hover:bg-violet-500 font-semibold transition-all shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

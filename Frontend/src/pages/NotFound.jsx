import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function NotFound() {
    const { isDark } = useTheme();
    return (
        <div className={`min-h-screen flex flex-col items-center justify-center px-4 text-center transition-colors duration-300 ${isDark ? "bg-[#080810] text-white" : "bg-white text-slate-900"}`}>
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] ${isDark ? "bg-violet-600/10" : "bg-violet-200/40"}`} />
            </div>

            <div className="relative">
                <p className="text-[120px] sm:text-[160px] font-black leading-none bg-gradient-to-br from-violet-400/30 to-fuchsia-400/10 bg-clip-text text-transparent select-none">
                    404
                </p>
                <div className="flex justify-center -mt-6 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
                        <Sparkles className="h-6 w-6 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl sm:text-4xl font-black mb-3">Page not found</h1>
                <p className={`text-base max-w-sm mx-auto mb-10 leading-relaxed ${isDark ? "text-zinc-400" : "text-slate-500"}`}>
                    Looks like this page doesn't exist or was moved. Let's get you back on track.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link to="/" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold transition-all shadow-lg shadow-violet-500/25 hover:-translate-y-px">
                        <ArrowLeft className="h-4 w-4" /> Back to Home
                    </Link>
                    <Link to="/create"
                        className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-all hover:-translate-y-px ${isDark ? "border-white/10 bg-white/[0.04] text-zinc-300 hover:bg-white/[0.08] hover:text-white" : "border-black/10 bg-black/[0.03] text-slate-600 hover:bg-black/[0.06] hover:text-slate-900"}`}>
                        Build a Resume
                    </Link>
                </div>
            </div>
        </div>
    );
}

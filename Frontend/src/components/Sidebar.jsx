import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    LayoutDashboard, FileText, PlusCircle, Settings,
    LogOut, User, ShieldCheck, Sparkles, ChevronRight, Target,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard",     path: "/dashboard" },
    { icon: FileText,        label: "My Resumes",    path: "/dashboard/resumes" },
    { icon: PlusCircle,      label: "Create New",    path: "/create" },
    { icon: Target,          label: "Target Resume", path: "/target-resume" },
    { icon: ShieldCheck,     label: "ATS Checker",   path: "/ats-checker" },
    { icon: User,            label: "Profile",       path: "/dashboard/profile" },
    { icon: Settings,        label: "Settings",      path: "/dashboard/settings" },
];

function Sidebar() {
    const location = useLocation();
    const navigate  = useNavigate();
    const { user, signOut } = useAuth();

    const handleLogout = async () => {
        await signOut();
        toast.success("Logged out successfully.");
        navigate("/");
    };

    const initials = (() => {
        const name = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
        if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
        return user?.email?.[0]?.toUpperCase() || "U";
    })();

    const displayName = user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email?.split("@")[0] || "User";

    return (
        <aside className="hidden lg:flex flex-col w-[260px] shrink-0 min-h-screen bg-[#0f0f14] border-r border-white/[0.06]">

            {/* ── Logo ── */}
            <div className="px-6 py-6 border-b border-white/[0.06]">
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold text-white tracking-tight">ResuMate</span>
                </Link>
            </div>

            {/* ── Nav ── */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <p className="px-3 pt-1 pb-2 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest">Menu</p>
                {NAV_ITEMS.map((item) => {
                    const active = location.pathname === item.path;
                    const Icon   = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                                active
                                    ? "bg-violet-500/15 text-white"
                                    : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                            }`}
                        >
                            {active && (
                                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-violet-400" />
                            )}
                            <span className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all ${
                                active
                                    ? "bg-violet-500/25 text-violet-300"
                                    : "bg-white/[0.04] text-zinc-500 group-hover:bg-white/[0.08] group-hover:text-zinc-300"
                            }`}>
                                <Icon className="h-4 w-4" />
                            </span>
                            <span className="text-sm font-medium">{item.label}</span>
                            {active && <ChevronRight className="h-3.5 w-3.5 ml-auto text-violet-400 opacity-70" />}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Upgrade Banner ── */}
            <div className="mx-3 mb-4 p-3.5 rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 border border-violet-500/15">
                <p className="text-xs font-semibold text-violet-300 mb-0.5">Pro Tip</p>
                <p className="text-[11px] text-zinc-400 leading-snug">Use AI Improve to boost your resume's ATS score instantly.</p>
            </div>

            {/* ── User + Logout ── */}
            <div className="border-t border-white/[0.06] p-3">
                {user && (
                    <div className="flex items-center gap-3 px-2 py-2 rounded-xl mb-1">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold shrink-0 shadow-md shadow-violet-500/20">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                            <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-500/8 transition-all text-sm font-medium"
                >
                    <span className="flex items-center justify-center h-8 w-8 rounded-lg bg-white/[0.04]">
                        <LogOut className="h-4 w-4" />
                    </span>
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;

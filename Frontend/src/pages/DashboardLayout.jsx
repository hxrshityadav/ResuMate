import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
    Menu, X, Sparkles, LayoutDashboard, FileText, PlusCircle,
    ShieldCheck, User, Settings, LogOut, ChevronRight, Target, Sun, Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
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

/* ── Sidebar nav items ───────────────────────────── */
function NavItems({ onClose, isDark }) {
    const location = useLocation();
    return NAV_ITEMS.map((item) => {
        const active = location.pathname === item.path;
        const Icon   = item.icon;
        return (
            <Link key={item.path} to={item.path} onClick={onClose}
                className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group ${
                    active
                        ? isDark
                            ? "bg-violet-500/15 text-white"
                            : "bg-violet-50 text-violet-700"
                        : isDark
                            ? "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}>
                {active && (
                    <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full ${isDark ? "bg-violet-400" : "bg-violet-500"}`} />
                )}
                <span className={`flex items-center justify-center h-8 w-8 rounded-lg transition-all ${
                    active
                        ? isDark
                            ? "bg-violet-500/25 text-violet-300"
                            : "bg-violet-100 text-violet-600"
                        : isDark
                            ? "bg-white/[0.04] text-zinc-500 group-hover:bg-white/[0.08] group-hover:text-zinc-300"
                            : "bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-600"
                }`}>
                    <Icon className="h-4 w-4" />
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                {active && (
                    <ChevronRight className={`h-3.5 w-3.5 ml-auto opacity-70 ${isDark ? "text-violet-400" : "text-violet-500"}`} />
                )}
            </Link>
        );
    });
}

/* ── User footer ─────────────────────────────────── */
function UserFooter({ isDark }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const { toggle } = useTheme();

    const initials = (() => {
        const name = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
        if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
        return user?.email?.[0]?.toUpperCase() || "U";
    })();

    const handleLogout = async () => {
        await signOut();
        toast.success("Logged out successfully.");
        navigate("/");
    };

    return (
        <div className={`border-t p-3 space-y-1 ${isDark ? "border-white/[0.06]" : "border-slate-200"}`}>
            {/* Theme toggle */}
            <button onClick={toggle}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-sm font-medium group ${
                    isDark
                        ? "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                }`}>
                <span className={`flex items-center justify-center h-8 w-8 rounded-lg ${isDark ? "bg-white/[0.04]" : "bg-slate-100 group-hover:bg-slate-200"}`}>
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </span>
                {isDark ? "Light Mode" : "Dark Mode"}
            </button>

            {/* Logout */}
            <button onClick={handleLogout}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                    isDark
                        ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.08]"
                        : "text-slate-500 hover:text-red-500 hover:bg-red-50"
                }`}>
                <span className={`flex items-center justify-center h-8 w-8 rounded-lg ${isDark ? "bg-white/[0.04]" : "bg-slate-100"}`}>
                    <LogOut className="h-4 w-4" />
                </span>
                Logout
            </button>

            {/* User info */}
            {user && (
                <div className={`flex items-center gap-3 px-3 py-3 rounded-xl mt-1 ${isDark ? "bg-white/[0.03] border border-white/[0.05]" : "bg-slate-50 border border-slate-200"}`}>
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white shrink-0 shadow shadow-violet-500/25">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                            {user?.user_metadata?.full_name || user?.user_metadata?.name || "User"}
                        </p>
                        <p className={`text-[10px] truncate ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{user?.email}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

/* ── Mobile nav ──────────────────────────────────── */
function MobileNav({ onClose, isDark }) {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const { toggle } = useTheme();

    const initials = (() => {
        const name = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
        if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
        return user?.email?.[0]?.toUpperCase() || "U";
    })();

    const handleLogout = async () => {
        await signOut();
        toast.success("Logged out successfully.");
        navigate("/");
        onClose();
    };

    return (
        <div className="flex flex-col h-full">
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-white/[0.06]" : "border-slate-200"}`}>
                <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className={`font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>ResuMate</span>
                </div>
                <button onClick={onClose}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${isDark ? "bg-white/5 hover:bg-white/10 text-zinc-400" : "bg-slate-100 hover:bg-slate-200 text-slate-500"}`}>
                    <X className="h-4 w-4" />
                </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                <NavItems onClose={onClose} isDark={isDark} />
            </nav>

            <div className={`border-t p-3 ${isDark ? "border-white/[0.06]" : "border-slate-200"}`}>
                {user && (
                    <div className="flex items-center gap-3 px-2 py-2 mb-2">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {initials}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-slate-800"}`}>
                                {user?.user_metadata?.full_name || user?.user_metadata?.name || "User"}
                            </p>
                            <p className={`text-[10px] truncate ${isDark ? "text-zinc-500" : "text-slate-400"}`}>{user?.email}</p>
                        </div>
                    </div>
                )}
                <button onClick={toggle}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isDark ? "text-zinc-400 hover:text-white hover:bg-white/5" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"}`}>
                    {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {isDark ? "Light Mode" : "Dark Mode"}
                </button>
                <button onClick={handleLogout}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isDark ? "text-zinc-500 hover:text-red-400 hover:bg-red-500/[0.08]" : "text-slate-500 hover:text-red-500 hover:bg-red-50"}`}>
                    <LogOut className="h-4 w-4" /> Logout
                </button>
            </div>
        </div>
    );
}

/* ── Layout ──────────────────────────────────────── */
function DashboardLayout() {
    const [open, setOpen] = useState(false);
    const { isDark } = useTheme();

    const sidebarBg     = isDark ? "bg-[#0f0f14] border-white/[0.06]"   : "bg-white border-slate-200";
    const topbarBg      = isDark ? "bg-[#0f0f14] border-white/[0.06]"   : "bg-white border-slate-200";
    const menuLabel     = isDark ? "text-zinc-600" : "text-slate-400";
    const tipBg         = isDark
        ? "from-violet-500/10 to-fuchsia-500/10 border-violet-500/15"
        : "from-violet-50 to-fuchsia-50 border-violet-200";
    const tipText       = isDark ? "text-violet-300" : "text-violet-600";
    const tipBody       = isDark ? "text-zinc-400" : "text-violet-700/80";

    return (
        <div className={`min-h-screen flex transition-colors duration-300 ${isDark ? "bg-[#080810] text-white" : "bg-slate-50 text-slate-900"}`}>

            {/* DESKTOP SIDEBAR */}
            <aside className={`hidden lg:flex flex-col w-[240px] shrink-0 min-h-screen sticky top-0 h-screen border-r ${sidebarBg}`}>
                {/* Logo */}
                <div className={`px-5 py-5 border-b ${isDark ? "border-white/[0.06]" : "border-slate-200"}`}>
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-105 transition-transform">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className={`font-black text-[15px] tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                            Resu<span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Mate</span>
                        </span>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                    <p className={`px-3 pt-1 pb-2.5 text-[10px] font-bold uppercase tracking-widest ${menuLabel}`}>Menu</p>
                    <NavItems onClose={() => {}} isDark={isDark} />
                </nav>

                {/* Pro tip */}
                <div className={`mx-3 mb-3 p-4 rounded-2xl bg-gradient-to-br border ${tipBg}`}>
                    <p className={`text-xs font-bold mb-1 ${tipText}`}>Pro Tip</p>
                    <p className={`text-[11px] leading-snug ${tipBody}`}>
                        Use AI Improve to boost your resume's ATS score instantly.
                    </p>
                </div>

                <UserFooter isDark={isDark} />
            </aside>

            {/* MOBILE OVERLAY */}
            {open && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div onClick={() => setOpen(false)}
                        className={`absolute inset-0 backdrop-blur-sm ${isDark ? "bg-black/70" : "bg-black/30"}`} />
                    <div className={`absolute left-0 top-0 h-full w-[280px] border-r shadow-2xl overflow-y-auto ${isDark ? "bg-[#0f0f14] border-white/[0.06]" : "bg-white border-slate-200"}`}>
                        <MobileNav onClose={() => setOpen(false)} isDark={isDark} />
                    </div>
                </div>
            )}

            {/* MAIN CONTENT */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile topbar */}
                <div className={`lg:hidden flex items-center gap-3 px-4 py-3.5 border-b sticky top-0 z-40 ${topbarBg}`}>
                    <button onClick={() => setOpen(true)}
                        className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-all ${isDark ? "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10" : "bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200"}`}>
                        <Menu className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                            <Sparkles className="h-3 w-3 text-white" />
                        </div>
                        <span className={`font-bold text-sm ${isDark ? "text-white" : "text-slate-900"}`}>ResuMate</span>
                    </div>
                </div>

                <main className="flex-1 p-5 lg:p-8 max-w-7xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;

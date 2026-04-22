import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    Menu, X, Sparkles, LayoutDashboard,
    LogOut, LogIn, ChevronDown, FileText,
    User, Settings, Sun, Moon,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

const NAV_LINKS = [
    { path: "/",              label: "Home",          auth: false },
    { path: "/ats-checker",   label: "ATS Checker",   auth: false },
    { path: "/target-resume", label: "Target Resume", auth: false },
    { path: "/dashboard",     label: "Dashboard",     auth: true  },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [userMenu, setUserMenu] = useState(false);
    const userMenuRef = useRef(null);

    const location = useLocation();
    const navigate  = useNavigate();
    const { user, signOut } = useAuth();
    const { theme, toggle, isDark } = useTheme();

    if (location.pathname.startsWith("/dashboard")) return null;

    const isActive = (path) =>
        path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

    const initials = (() => {
        const name = user?.user_metadata?.full_name || user?.user_metadata?.name || "";
        if (name) return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
        return user?.email?.[0]?.toUpperCase() || "U";
    })();

    const displayName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split("@")[0] ||
        "User";

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        const h = (e) => {
            if (userMenuRef.current && !userMenuRef.current.contains(e.target))
                setUserMenu(false);
        };
        document.addEventListener("mousedown", h);
        return () => document.removeEventListener("mousedown", h);
    }, []);

    useEffect(() => { setMenuOpen(false); setUserMenu(false); }, [location.pathname]);

    const handleLogout = async () => {
        await signOut();
        toast.success("Logged out.");
        navigate("/");
        setUserMenu(false);
    };

    /* ── Computed classes ──────────────────────────────── */
    const navBg = scrolled
        ? isDark
            ? "bg-[#0c0c14]/95 border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
            : "bg-white/95 border-black/10 shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
        : isDark
            ? "bg-[#0c0c14]/80 border-white/[0.07]"
            : "bg-white/80 border-black/[0.06]";

    const textPrimary   = isDark ? "text-white"    : "text-slate-900";
    const textSecondary = isDark ? "text-zinc-400"  : "text-slate-500";
    const textHover     = isDark ? "hover:text-white hover:bg-white/[0.06]" : "hover:text-slate-900 hover:bg-black/[0.04]";
    const pillBg        = isDark ? "bg-white/[0.04] border-white/[0.07]" : "bg-black/[0.03] border-black/[0.07]";
    const activePill    = isDark ? "bg-white/10 text-white" : "bg-black/[0.06] text-slate-900";
    const drawerBg      = isDark ? "bg-[#0c0c14]"  : "bg-white";
    const drawerBorder  = isDark ? "border-white/[0.07]" : "border-black/[0.07]";

    return (
        <>
            {/* ─── Navbar ─── */}
            <header className={`fixed top-0 inset-x-0 z-50 flex justify-center transition-all duration-500 ${scrolled ? "pt-3" : "pt-5"}`}>
                <nav className={`w-full max-w-5xl mx-4 flex items-center justify-between px-5 h-[58px] rounded-2xl backdrop-blur-xl border transition-all duration-500 ${navBg}`}>

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0 select-none">
                        <div className="relative h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-600/40 group-hover:scale-105 transition-all duration-300">
                            <Sparkles className="h-[15px] w-[15px] text-white" />
                            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-fuchsia-400 border-2 border-white dark:border-[#0c0c14] animate-pulse" />
                        </div>
                        <span className={`font-black text-[17px] tracking-tight leading-none ${textPrimary}`}>
                            Resu<span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">Mate</span>
                        </span>
                    </Link>

                    {/* Desktop links — pill includes Dashboard when logged in */}
                    <div className={`hidden md:flex items-center gap-0.5 border rounded-xl px-1.5 py-1.5 ${pillBg}`}>
                        {NAV_LINKS.filter(({ auth }) => !auth || user).map(({ path, label }) => {
                            const active = isActive(path);
                            return (
                                <Link key={path} to={path}
                                    className={`relative px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all duration-200 ${
                                        active ? activePill : `${textSecondary} ${textHover}`
                                    }`}>
                                    {label}
                                    {active && (
                                        <span className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                {/* Avatar dropdown */}
                                <div className="relative" ref={userMenuRef}>
                                    <button onClick={() => setUserMenu((v) => !v)}
                                        className={`flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-200 ${
                                            userMenu
                                                ? isDark ? "bg-white/10 ring-1 ring-violet-500/40" : "bg-black/[0.06] ring-1 ring-violet-500/40"
                                                : isDark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.04]"
                                        }`}>
                                        <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-[11px] font-black text-white shadow shadow-violet-500/30">
                                            {initials}
                                        </div>
                                        <span className={`text-[13px] font-semibold max-w-[72px] truncate ${textPrimary}`}>
                                            {displayName.split(" ")[0]}
                                        </span>
                                        <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${userMenu ? "rotate-180" : ""} ${textSecondary}`} />
                                    </button>

                                    {userMenu && (
                                        <div className={`absolute right-0 top-[calc(100%+8px)] w-56 rounded-2xl border shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden ${
                                            isDark ? "bg-[#101018] border-white/[0.09]" : "bg-white border-black/[0.08]"
                                        }`}>
                                            <div className={`flex items-center gap-3 px-4 py-3.5 border-b ${
                                                isDark ? "bg-violet-600/10 border-white/[0.07]" : "bg-violet-50 border-black/[0.06]"
                                            }`}>
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm font-black text-white shadow shadow-violet-500/30 shrink-0">
                                                    {initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className={`text-sm font-bold truncate ${textPrimary}`}>{displayName}</p>
                                                    <p className={`text-xs truncate ${textSecondary}`}>{user.email}</p>
                                                </div>
                                            </div>

                                            <div className="p-1.5 space-y-0.5">
                                                {[
                                                    { to: "/dashboard",          Icon: LayoutDashboard, label: "Dashboard", ic: "text-violet-500 bg-violet-500/10" },
                                                    { to: "/dashboard/profile",  Icon: User,            label: "Profile",   ic: isDark ? "text-zinc-400 bg-white/[0.05]" : "text-slate-500 bg-black/[0.04]" },
                                                    { to: "/dashboard/settings", Icon: Settings,        label: "Settings",  ic: isDark ? "text-zinc-400 bg-white/[0.05]" : "text-slate-500 bg-black/[0.04]" },
                                                ].map(({ to, Icon, label, ic }) => (
                                                    <Link key={to} to={to} onClick={() => setUserMenu(false)}
                                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${textSecondary} ${textHover}`}>
                                                        <div className={`h-7 w-7 rounded-lg ${ic} flex items-center justify-center shrink-0`}>
                                                            <Icon className="h-3.5 w-3.5" />
                                                        </div>
                                                        {label}
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className={`p-1.5 border-t ${isDark ? "border-white/[0.07]" : "border-black/[0.06]"}`}>
                                                <button onClick={handleLogout}
                                                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/[0.08] transition-all text-left">
                                                    <div className="h-7 w-7 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                                                        <LogOut className="h-3.5 w-3.5 text-red-500" />
                                                    </div>
                                                    Log out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link to="/login"
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${textSecondary} ${textHover}`}>
                                <LogIn className="h-[15px] w-[15px]" />
                                Sign In
                            </Link>
                        )}

                        {/* CTA */}
                        <Link to="/create"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-bold text-white bg-violet-600 hover:bg-violet-500 transition-all duration-200 hover:-translate-y-px hover:shadow-lg hover:shadow-violet-500/30 active:scale-95">
                            <FileText className="h-3.5 w-3.5" />
                            Build Resume
                        </Link>

                        {/* Theme toggle — far right */}
                        <button onClick={toggle}
                            aria-label="Toggle theme"
                            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-200 border ${
                                isDark
                                    ? "border-white/[0.08] text-zinc-400 hover:text-white hover:bg-white/[0.06]"
                                    : "border-black/[0.08] text-slate-400 hover:text-slate-900 hover:bg-black/[0.05]"
                            }`}>
                            {isDark
                                ? <Sun className="h-[15px] w-[15px]" />
                                : <Moon className="h-[15px] w-[15px]" />}
                        </button>
                    </div>

                    {/* Mobile: hamburger + theme toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <button onClick={() => setMenuOpen((v) => !v)}
                            className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                                isDark
                                    ? "bg-white/[0.05] border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/10"
                                    : "bg-black/[0.03] border-black/[0.08] text-slate-500 hover:text-slate-900 hover:bg-black/[0.06]"
                            }`}>
                            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                        <button onClick={toggle}
                            className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all border ${
                                isDark
                                    ? "border-white/[0.08] text-zinc-400 hover:text-white bg-white/[0.05]"
                                    : "border-black/[0.08] text-slate-400 hover:text-slate-900 bg-black/[0.03]"
                            }`}>
                            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        </button>
                    </div>
                </nav>
            </header>

            {/* ─── Mobile Drawer ─── */}
            <div className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div onClick={() => setMenuOpen(false)}
                    className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ${
                        menuOpen ? "opacity-100" : "opacity-0"
                    } ${isDark ? "bg-black/70" : "bg-black/30"}`} />

                <div className={`absolute top-0 right-0 h-full w-[300px] border-l shadow-2xl flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"} ${drawerBg} ${drawerBorder}`}>

                    {/* Header */}
                    <div className={`flex items-center justify-between px-5 py-4 border-b ${drawerBorder}`}>
                        <div className="flex items-center gap-2.5">
                            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                                <Sparkles className="h-[15px] w-[15px] text-white" />
                            </div>
                            <span className={`font-black text-base ${textPrimary}`}>
                                Resu<span className="text-violet-500">Mate</span>
                            </span>
                        </div>
                        <button onClick={() => setMenuOpen(false)}
                            className={`h-8 w-8 rounded-xl flex items-center justify-center transition-all border ${
                                isDark ? "bg-white/[0.05] border-white/[0.08] text-zinc-400 hover:text-white" : "bg-black/[0.03] border-black/[0.07] text-slate-400 hover:text-slate-900"
                            }`}>
                            <X className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Links */}
                    <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                        {NAV_LINKS.filter(({ auth }) => !auth || user).map(({ path, label }) => {
                            const active = isActive(path);
                            return (
                                <Link key={path} to={path} onClick={() => setMenuOpen(false)}
                                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                                        active
                                            ? isDark
                                                ? "bg-violet-500/15 text-white border border-violet-500/20"
                                                : "bg-violet-50 text-violet-700 border border-violet-200"
                                            : isDark
                                                ? "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                                                : "text-slate-500 hover:text-slate-900 hover:bg-black/[0.04]"
                                    }`}>
                                    {label}
                                    {active && <span className="h-2 w-2 rounded-full bg-violet-500" />}
                                </Link>
                            );
                        })}

                        {user && (
                            <>
                                <div className={`h-px my-2 ${isDark ? "bg-white/[0.05]" : "bg-black/[0.06]"}`} />
                                {[
                                    { to: "/dashboard/profile",  Icon: User,     label: "Profile" },
                                    { to: "/dashboard/settings", Icon: Settings, label: "Settings" },
                                ].map(({ to, Icon, label }) => (
                                    <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${textSecondary} ${textHover}`}>
                                        <Icon className="h-4 w-4" />
                                        {label}
                                    </Link>
                                ))}
                            </>
                        )}
                    </nav>

                    {/* Footer */}
                    <div className={`p-3 space-y-2 border-t ${drawerBorder}`}>
                        <Link to="/create" onClick={() => setMenuOpen(false)}
                            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition-all">
                            <FileText className="h-4 w-4" />
                            Build Resume
                        </Link>
                        {user ? (
                            <button onClick={handleLogout}
                                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-red-500 hover:bg-red-500/[0.08] text-sm font-semibold transition-all">
                                <LogOut className="h-4 w-4" /> Log out
                            </button>
                        ) : (
                            <Link to="/login" onClick={() => setMenuOpen(false)}
                                className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                                    isDark ? "border-white/[0.08] text-zinc-300 hover:bg-white/[0.04]" : "border-black/[0.08] text-slate-600 hover:bg-black/[0.04]"
                                }`}>
                                <LogIn className="h-4 w-4" /> Sign In
                            </Link>
                        )}
                    </div>

                    {/* User card */}
                    {user && (
                        <div className={`mx-3 mb-3 px-4 py-3 rounded-xl border ${
                            isDark ? "bg-violet-500/10 border-violet-500/20" : "bg-violet-50 border-violet-200"
                        }`}>
                            <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-xs font-black text-white shadow shadow-violet-500/30 shrink-0">
                                    {initials}
                                </div>
                                <div className="min-w-0">
                                    <p className={`text-xs font-bold truncate ${textPrimary}`}>{displayName}</p>
                                    <p className={`text-[10px] truncate ${textSecondary}`}>{user.email}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

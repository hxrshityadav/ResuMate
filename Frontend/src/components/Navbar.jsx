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
    const { toggle, isDark } = useTheme();


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

    if (location.pathname.startsWith("/dashboard")) return null;

    const handleLogout = async () => {
        await signOut();
        toast.success("Logged out.");
        navigate("/");
        setUserMenu(false);
    };

    /* ── Computed classes ──────────────────────────────── */
    const navBg = scrolled
        ? "bg-[var(--nav-bg)] border-[var(--nav-border)] shadow-[0_14px_40px_rgba(20,18,14,0.12)]"
        : "bg-[var(--nav-bg)] border-[var(--nav-border)]";

    const textPrimary   = "text-[var(--text)]";
    const textSecondary = "text-[var(--text2)]";
    const textHover     = "hover:text-[var(--brand)] hover:bg-[var(--bg3)]";
    const pillBg        = "bg-[var(--bg3)] border-[var(--nav-border)]";
    const activePill    = "bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm";
    const drawerBg      = "bg-[var(--bg2)]";
    const drawerBorder  = "border-[var(--border)]";

    return (
        <>
            {/* ─── Navbar ─── */}
            <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 transition-all duration-300 sm:px-5">
                <nav className={`flex h-16 w-full max-w-[1380px] items-center justify-between rounded-[22px] border px-4 backdrop-blur-xl transition-all duration-300 sm:px-5 ${navBg}`}>

                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2.5 group shrink-0 select-none">
                        <div className={`relative grid h-10 w-10 rotate-3 place-items-center rounded-[14px] group-hover:-rotate-3 transition-all duration-300 ${isDark ? "bg-[#f6efe3] text-[#10141a]" : "bg-[#25241f] text-[#f7f1e5]"}`}>
                            <Sparkles className="h-[17px] w-[17px]" />
                        </div>
                        <span className={`atlas-serif text-xl font-semibold tracking-[-0.03em] leading-none ${textPrimary}`}>
                            ResuMate
                        </span>
                    </Link>

                    {/* Desktop links — pill includes Dashboard when logged in */}
                    <div className={`hidden lg:flex items-center gap-1 rounded-full border p-1 ${pillBg}`}>
                        {NAV_LINKS.filter(({ auth }) => !auth || user).map(({ path, label }) => {
                            const active = isActive(path);
                            return (
                                <Link key={path} to={path}
                                    aria-current={active ? "page" : undefined}
                                    className={`relative rounded-full px-4 py-2 text-[13px] font-semibold transition-all duration-200 ${
                                        active ? activePill : `${textSecondary} ${textHover}`
                                    }`}>
                                    {label}
                                </Link>
                            );
                        })}
                    </div>

                    {/* Right side */}
                    <div className="hidden lg:flex items-center gap-2">
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
                                                ].map(({ to, Icon: ICON, label, ic }) => (
                                                    <Link key={to} to={to} onClick={() => setUserMenu(false)}
                                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${textSecondary} ${textHover}`}>
                                                        <div className={`h-7 w-7 rounded-lg ${ic} flex items-center justify-center shrink-0`}>
                                                            {React.createElement(ICON, { className: "h-3.5 w-3.5" })}
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
                            className="flex items-center gap-2 rounded-full bg-[var(--brand)] px-5 py-2.5 text-[13px] font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:brightness-105 hover:shadow-lg active:scale-95">
                            <FileText className="h-4 w-4" />
                            Build Resume
                        </Link>

                        {/* Theme toggle — far right */}
                        <button onClick={toggle}
                            aria-label="Toggle theme"
                            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-200 border ${
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
                    <div className="flex items-center gap-2 lg:hidden">
                        <button
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
                            aria-expanded={menuOpen}
                            className={`h-10 w-10 rounded-full border flex items-center justify-center transition-all active:scale-95 ${
                                isDark
                                    ? "bg-white/[0.05] border-white/[0.08] text-zinc-300 hover:text-white hover:bg-white/10"
                                    : "bg-black/[0.03] border-black/[0.08] text-slate-500 hover:text-slate-900 hover:bg-black/[0.06]"
                            }`}>
                            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                        <button onClick={toggle}
                            aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
                            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all border ${
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
            <div className={`fixed inset-0 z-40 transition-all duration-300 lg:hidden ${menuOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
                <div onClick={() => setMenuOpen(false)}
                    className={`absolute inset-0 backdrop-blur-sm transition-opacity duration-300 ${
                        menuOpen ? "opacity-100" : "opacity-0"
                    } ${isDark ? "bg-black/70" : "bg-black/30"}`} />

                <div className={`absolute top-0 right-0 h-full w-[300px] border-l shadow-2xl flex flex-col transition-transform duration-300 ease-out ${menuOpen ? "translate-x-0" : "translate-x-full"} ${drawerBg} ${drawerBorder}`}>

                    {/* Header */}
                    <div className={`flex items-center justify-between px-5 py-4 border-b ${drawerBorder}`}>
                        <div className="flex items-center gap-2.5">
                            <div className={`grid h-9 w-9 rotate-3 place-items-center rounded-[13px] ${isDark ? "bg-[#f6efe3] text-[#10141a]" : "bg-[#25241f] text-[#f7f1e5]"}`}>
                                <Sparkles className="h-[15px] w-[15px]" />
                            </div>
                            <span className={`atlas-serif text-lg font-semibold tracking-[-0.03em] ${textPrimary}`}>
                                ResuMate
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
                                            ? "border border-[var(--nav-border)] bg-[var(--brand-soft)] text-[var(--brand)]"
                                            : isDark
                                                ? "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                                                : "text-slate-500 hover:text-slate-900 hover:bg-black/[0.04]"
                                    }`}>
                                    {label}
                                    {active && <span className="h-2 w-2 rounded-full bg-[var(--brand)]" />}
                                </Link>
                            );
                        })}

                        {user && (
                            <>
                                <div className={`h-px my-2 ${isDark ? "bg-white/[0.05]" : "bg-black/[0.06]"}`} />
                                {[
                                    { to: "/dashboard/profile",  Icon: User,     label: "Profile" },
                                    { to: "/dashboard/settings", Icon: Settings, label: "Settings" },
                                ].map(({ to, Icon: ICON, label }) => (
                                    <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${textSecondary} ${textHover}`}>
                                        {React.createElement(ICON, { className: "h-4 w-4" })}
                                        {label}
                                    </Link>
                                ))}
                            </>
                        )}
                    </nav>

                    {/* Footer */}
                    <div className={`p-3 space-y-2 border-t ${drawerBorder}`}>
                        <Link to="/create" onClick={() => setMenuOpen(false)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] py-3 text-sm font-bold text-white transition-all hover:brightness-105 active:scale-[0.98]">
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

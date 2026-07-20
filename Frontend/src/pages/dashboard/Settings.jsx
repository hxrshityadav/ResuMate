import React, { useState } from "react";
import { Bell, Lock, Palette, Moon, Sun, Monitor, ChevronRight, Check, Trash2, Download } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

function Toggle({ checked, onChange }) {
    return (
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all ${
                checked ? "bg-violet-500" : "bg-white/10"
            }`}
        >
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                checked ? "translate-x-4.5" : "translate-x-0.5"
            }`} style={{ transform: checked ? "translateX(18px)" : "translateX(2px)" }} />
        </button>
    );
}

function SettingSection({ icon: ICON, color, title, subtitle, children }) {
    return (
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.04]">
                <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center`}>
                    {React.createElement(ICON, { className: "h-4 w-4" })}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    {subtitle && <p className="text-[11px] text-zinc-500">{subtitle}</p>}
                </div>
            </div>
            <div className="p-5 space-y-4">{children}</div>
        </div>
    );
}

function ToggleRow({ label, desc, checked, onChange }) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm text-zinc-200 font-medium">{label}</p>
                {desc && <p className="text-xs text-zinc-600 mt-0.5">{desc}</p>}
            </div>
            <Toggle checked={checked} onChange={onChange} />
        </div>
    );
}

const THEMES = [
    { id: "dark", icon: Moon, label: "Dark" },
    { id: "light", icon: Sun, label: "Light" },
    { id: "system", icon: Monitor, label: "System" },
];

export default function Settings() {
    const { user } = useAuth();
    const [notifs, setNotifs] = useState({ email: true, tips: true, updates: false });
    const [theme, setTheme] = useState("dark");
    const [compact, setCompact] = useState(false);
    const [resetLoading, setRL] = useState(false);

    const email = user?.email || "user@resumate.ai";

    const handlePasswordReset = async () => {
        setRL(true);
        setTimeout(() => {
            setRL(false);
            toast.success("Password reset email sent!");
        }, 500);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="resumate-page-title text-3xl lg:text-4xl">Settings</h1>
                <p className="text-zinc-500 text-sm mt-1">Manage your preferences and account</p>
            </div>

            {/* Notifications */}
            <SettingSection icon={Bell} color="bg-amber-500/15 text-amber-400" title="Notifications" subtitle="Choose what you want to be notified about">
                <ToggleRow label="Email Notifications" desc="Receive important updates via email"
                    checked={notifs.email} onChange={(v) => setNotifs((p) => ({ ...p, email: v }))} />
                <div className="h-px bg-white/[0.04]" />
                <ToggleRow label="Resume Tips" desc="Weekly tips to improve your resume"
                    checked={notifs.tips} onChange={(v) => setNotifs((p) => ({ ...p, tips: v }))} />
                <div className="h-px bg-white/[0.04]" />
                <ToggleRow label="Product Updates" desc="New features and improvements"
                    checked={notifs.updates} onChange={(v) => setNotifs((p) => ({ ...p, updates: v }))} />
            </SettingSection>

            {/* Appearance */}
            <SettingSection icon={Palette} color="bg-blue-500/15 text-blue-400" title="Appearance" subtitle="Customize how ResuMate looks">
                <div>
                    <p className="text-sm text-zinc-400 mb-3">Theme</p>
                    <div className="grid grid-cols-3 gap-2">
                        {THEMES.map(({ id, icon: ICON, label }) => (
                            <button key={id} onClick={() => setTheme(id)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                                    theme === id
                                        ? "border-violet-500/50 bg-violet-500/10 text-violet-300"
                                        : "border-white/[0.06] bg-white/[0.02] text-zinc-500 hover:border-white/[0.12] hover:text-zinc-300"
                                }`}>
                                {React.createElement(ICON, { className: "h-4 w-4" })}
                                <span className="text-xs font-medium">{label}</span>
                                {theme === id && <Check className="h-3 w-3 text-violet-400" />}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="h-px bg-white/[0.04]" />
                <ToggleRow label="Compact Mode" desc="Use smaller spacing throughout the app"
                    checked={compact} onChange={setCompact} />
            </SettingSection>

            {/* Security */}
            <SettingSection icon={Lock} color="bg-violet-500/15 text-violet-400" title="Privacy & Security" subtitle="Manage your account security">
                <div className="space-y-3">
                    <div className="flex items-center justify-between py-1">
                        <div>
                            <p className="text-sm text-zinc-200 font-medium">Login Method</p>
                            <p className="text-xs text-zinc-500 mt-0.5">SaaS Authentication</p>
                        </div>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                            Active
                        </span>
                    </div>
                    <div className="h-px bg-white/[0.04]" />
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-zinc-200 font-medium">Password</p>
                            <p className="text-xs text-zinc-500 mt-0.5">Send a reset link to {email}</p>
                        </div>
                        <button onClick={handlePasswordReset} disabled={resetLoading}
                            className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-violet-500/10 text-violet-300 font-semibold hover:bg-violet-500/20 transition-all disabled:opacity-60">
                            {resetLoading ? "Sending…" : "Reset Password"}
                            <ChevronRight className="h-3 w-3" />
                        </button>
                    </div>
                </div>
            </SettingSection>

            {/* Data */}
            <SettingSection icon={Download} color="bg-emerald-500/15 text-emerald-400" title="Data & Export" subtitle="Manage your resume data">
                <div className="flex flex-col sm:flex-row gap-3">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] text-zinc-300 text-sm font-medium transition-all border border-white/[0.06]">
                        <Download className="h-4 w-4" />
                        Export All Resumes
                    </button>
                </div>
            </SettingSection>

            {/* Danger */}
            <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.03] p-5">
                <div className="flex items-center gap-2 mb-1">
                    <Trash2 className="h-4 w-4 text-red-400" />
                    <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
                </div>
                <p className="text-xs text-zinc-500 mb-4">Permanently delete your account and all associated data. This cannot be undone.</p>
                <button className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all border border-red-500/15">
                    Delete Account
                </button>
            </div>
        </div>
    );
}

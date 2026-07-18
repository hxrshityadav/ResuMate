import React, { useState } from "react";
import { User, Mail, Calendar, Shield, Key, ExternalLink, CheckCircle2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/supabase";
import toast from "react-hot-toast";

function Profile() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [sent,    setSent]    = useState(false);

    const fullName = user?.user_metadata?.full_name || user?.user_metadata?.name || "—";
    const email    = user?.email || "—";
    const provider = user?.app_metadata?.provider || "email";
    const joined   = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        : "—";

    const initials = fullName !== "—"
        ? fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
        : email[0]?.toUpperCase() || "U";

    const handlePasswordReset = async () => {
        setLoading(true);
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/dashboard/settings`,
        });
        setLoading(false);
        if (error) {
            toast.error(error.message);
        } else {
            setSent(true);
            toast.success("Password reset email sent!");
        }
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="resumate-page-title text-3xl lg:text-4xl">Profile</h1>
                <p className="text-zinc-500 text-sm mt-1">Manage your account details</p>
            </div>

            {/* ── Hero Card ── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] overflow-hidden">
                {/* Banner */}
                <div className="h-20 bg-gradient-to-r from-violet-600/30 via-fuchsia-600/20 to-blue-600/20 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(139,92,246,0.15),transparent_60%)]" />
                </div>
                {/* Avatar */}
                <div className="px-6 pb-6">
                    <div className="-mt-10 mb-4 flex items-end justify-between">
                        <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-bold text-white border-4 border-[#0f0f14] shadow-xl shadow-violet-500/25">
                            {initials}
                        </div>
                        <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${
                            provider === "google"
                                ? "bg-blue-500/10 border-blue-500/20 text-blue-400"
                                : "bg-violet-500/10 border-violet-500/20 text-violet-400"
                        }`}>
                            <Shield className="h-3 w-3" />
                            {provider === "google" ? "Google Account" : "Email Account"}
                        </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{fullName}</h2>
                    <p className="text-sm text-zinc-500">{email}</p>
                </div>
            </div>

            {/* ── Info Rows ── */}
            <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] divide-y divide-white/[0.04] overflow-hidden">
                <InfoRow icon={User}     label="Full Name"  value={fullName} />
                <InfoRow icon={Mail}     label="Email"      value={email} />
                <InfoRow icon={Calendar} label="Member Since" value={joined} />
                <InfoRow icon={Shield}   label="Login Method"
                    value={provider === "google" ? "Google OAuth" : "Email & Password"}
                    badge={provider === "google" ? "Connected" : undefined}
                />
            </div>

            {/* ── Security ── */}
            {provider !== "google" && (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5">
                    <div className="flex items-center gap-2 mb-1">
                        <Key className="h-4 w-4 text-amber-400" />
                        <h3 className="font-semibold text-white text-sm">Security</h3>
                    </div>
                    <p className="text-xs text-zinc-500 mb-4">
                        We'll send a password reset link to <span className="text-zinc-300">{email}</span>
                    </p>
                    {sent ? (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                            <p className="text-sm text-emerald-400 font-medium">Reset email sent! Check your inbox.</p>
                        </div>
                    ) : (
                        <button
                            onClick={handlePasswordReset}
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                        >
                            <Key className="h-4 w-4" />
                            {loading ? "Sending…" : "Send Password Reset Email"}
                        </button>
                    )}
                </div>
            )}

            {/* ── Danger ── */}
            <div className="rounded-2xl border border-red-500/10 bg-red-500/[0.03] p-5">
                <h3 className="font-semibold text-red-400 text-sm mb-1">Danger Zone</h3>
                <p className="text-xs text-zinc-500 mb-4">These actions are permanent and cannot be undone.</p>
                <button className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-sm font-semibold transition-all">
                    Delete Account
                </button>
            </div>
        </div>
    );
}

function InfoRow({ icon: ICON, label, value, badge }) {
    return (
        <div className="flex items-center gap-4 px-5 py-4">
            <div className="h-9 w-9 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                {React.createElement(ICON, { className: "h-4 w-4 text-zinc-500" })}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-600 mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-white truncate">{value}</p>
            </div>
            {badge && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    {badge}
                </span>
            )}
        </div>
    );
}

export default Profile;

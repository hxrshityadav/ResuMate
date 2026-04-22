import React, { useEffect, useState } from "react";
import { FileText, Trash2, PlusCircle, Loader2, ShieldCheck, Calendar, Search, LayoutGrid, List } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getResumes, deleteResume } from "../../api/resumeApi";
import toast from "react-hot-toast";

function MyResumes() {
    const navigate  = useNavigate();
    const [resumes, setResumes]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search,  setSearch]    = useState("");
    const [view,    setView]      = useState("grid"); // "grid" | "list"
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        getResumes()
            .then(setResumes)
            .catch(() => toast.error("Failed to load resumes."))
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this resume? This cannot be undone.")) return;
        setDeleting(id);
        try {
            await deleteResume(id);
            setResumes((prev) => prev.filter((r) => r.id !== id));
            toast.success("Resume deleted.");
        } catch {
            toast.error("Failed to delete resume.");
        } finally {
            setDeleting(null);
        }
    };

    const filtered = resumes.filter((r) =>
        r.title?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">

            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-white">My Resumes</h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        {loading ? "Loading…" : `${resumes.length} resume${resumes.length !== 1 ? "s" : ""} saved`}
                    </p>
                </div>
                <Link
                    to="/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-all shadow-md shadow-violet-500/20 hover:-translate-y-0.5 self-start sm:self-auto"
                >
                    <PlusCircle className="h-4 w-4" />
                    New Resume
                </Link>
            </div>

            {/* ── Search + View Toggle ── */}
            {!loading && resumes.length > 0 && (
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search resumes…"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-white/[0.05] border border-white/[0.08] text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.07] transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        <button onClick={() => setView("grid")}
                            className={`p-1.5 rounded-lg transition-all ${view === "grid" ? "bg-violet-500/20 text-violet-300" : "text-zinc-500 hover:text-zinc-300"}`}>
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button onClick={() => setView("list")}
                            className={`p-1.5 rounded-lg transition-all ${view === "list" ? "bg-violet-500/20 text-violet-300" : "text-zinc-500 hover:text-zinc-300"}`}>
                            <List className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* ── Content ── */}
            {loading ? (
                <div className="flex items-center justify-center py-32">
                    <Loader2 className="h-7 w-7 text-violet-400 animate-spin" />
                </div>

            ) : resumes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 rounded-2xl border border-dashed border-white/10 text-center space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <FileText className="h-7 w-7 text-violet-400" />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white">No resumes yet</h3>
                        <p className="text-sm text-zinc-500 max-w-xs">
                            Generate a resume with AI and click <span className="text-violet-400 font-medium">Save Resume</span> to store it here.
                        </p>
                    </div>
                    <Link to="/create"
                        className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-md shadow-violet-500/20">
                        Create My First Resume
                    </Link>
                </div>

            ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-zinc-500 text-sm">No resumes match "<span className="text-white">{search}</span>"</p>
                </div>

            ) : view === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((resume) => (
                        <ResumeCard
                            key={resume.id}
                            resume={resume}
                            onDelete={handleDelete}
                            onATS={() => navigate("/ats-checker")}
                            deleting={deleting}
                        />
                    ))}
                </div>

            ) : (
                <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
                    <div className="divide-y divide-white/[0.04]">
                        {filtered.map((resume) => (
                            <ResumeListRow
                                key={resume.id}
                                resume={resume}
                                onDelete={handleDelete}
                                onATS={() => navigate("/ats-checker")}
                                deleting={deleting}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

function ResumeCard({ resume, onDelete, onATS, deleting }) {
    const colors = [
        { icon: "bg-violet-500/15 text-violet-400", border: "hover:border-violet-500/30" },
        { icon: "bg-blue-500/15 text-blue-400",     border: "hover:border-blue-500/30" },
        { icon: "bg-emerald-500/15 text-emerald-400", border: "hover:border-emerald-500/30" },
    ];
    const c = colors[resume.id % colors.length] || colors[0];

    return (
        <div className={`group rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5 transition-all hover:bg-white/[0.05] ${c.border} hover:-translate-y-0.5`}>
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className={`h-10 w-10 rounded-xl ${c.icon} flex items-center justify-center shrink-0`}>
                    <FileText className="h-5 w-5" />
                </div>
                <span className="text-[10px] text-zinc-600 flex items-center gap-1 mt-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(resume.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1 truncate">{resume.title}</h3>
            <p className="text-xs text-zinc-600 line-clamp-2 mb-4 min-h-[2rem] leading-relaxed">
                {resume.data?.summary || "No summary available."}
            </p>
            <div className="flex gap-2 mt-auto">
                <button onClick={onATS}
                    className="flex-1 py-2 rounded-lg bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    ATS Check
                </button>
                <button onClick={() => onDelete(resume.id)} disabled={deleting === resume.id}
                    className="py-2 px-3 rounded-lg bg-red-500/8 hover:bg-red-500/18 text-red-500 flex items-center justify-center transition-all disabled:opacity-50">
                    {deleting === resume.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />}
                </button>
            </div>
        </div>
    );
}

function ResumeListRow({ resume, onDelete, onATS, deleting }) {
    return (
        <div className="flex items-center gap-4 px-5 py-4 hover:bg-white/[0.03] transition-all group">
            <div className="h-9 w-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                <FileText className="h-4 w-4 text-violet-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{resume.title}</p>
                <p className="text-xs text-zinc-600">
                    {new Date(resume.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <button onClick={onATS}
                    className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 font-semibold hover:bg-violet-500/20 transition-all">
                    <ShieldCheck className="h-3 w-3" />
                    ATS
                </button>
                <button onClick={() => onDelete(resume.id)} disabled={deleting === resume.id}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50">
                    {deleting === resume.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <Trash2 className="h-3.5 w-3.5" />}
                </button>
            </div>
        </div>
    );
}

export default MyResumes;

import React, { useState, useRef, useCallback, useEffect } from "react";
import {
    ShieldCheck, FileText, Briefcase, Loader2, CheckCircle2,
    XCircle, AlertCircle, Sparkles, TrendingUp, Tag, Lightbulb,
    Award, Upload, LayoutDashboard, Trash2, ChevronDown, ChevronUp,
    FileUp, ClipboardList,
} from "lucide-react";
import { extractPdfText as extractPdf } from "../utils/extractPdfText";
import { checkAtsScore } from "../api/ResumeService";
import { getResumes, deleteResume } from "../api/resumeApi";
import { resumeToText } from "../utils/resumeToText";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import toast from "react-hot-toast";

/* ─── helpers ────────────────────────────────────────────── */
function ScoreRing({ score, isDark }) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;
    const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
    const trackColor = isDark ? "#ffffff10" : "#00000010";
    const textColor  = isDark ? "#ffffff"   : "#0f172a";
    const subColor   = isDark ? "#71717a"   : "#94a3b8";
    return (
        <div className="relative flex items-center justify-center w-40 h-40">
            <svg className="w-40 h-40 -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r={radius} stroke={trackColor} strokeWidth="12" fill="none" />
                <circle cx="70" cy="70" r={radius} stroke={color} strokeWidth="12" fill="none"
                    strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s ease" }} />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold" style={{ color: textColor }}>{score}</span>
                <span className="text-xs font-medium" style={{ color: subColor }}>/ 100</span>
            </div>
        </div>
    );
}

function BreakdownBar({ label, score, isDark }) {
    const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-amber-400" : "bg-red-500";
    const trackCls = isDark ? "bg-white/10" : "bg-black/10";
    return (
        <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-[var(--text2)]">{label}</span>
                <span className="font-bold text-[var(--text)]">{score}%</span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${trackCls}`}>
                <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
}

function TagPill({ text, variant = "default", isDark }) {
    const styles = {
        default: isDark ? "bg-white/5 text-zinc-300 border-white/10"  : "bg-black/[0.04] text-slate-600 border-black/10",
        green:   "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
        red:     "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
    };
    return (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}>
            {text}
        </span>
    );
}

const TABS = [
    { id: "myresumes", label: "My Resumes",  icon: <LayoutDashboard className="h-4 w-4" /> },
    { id: "pdf",       label: "Upload PDF",   icon: <FileUp className="h-4 w-4" /> },
    { id: "paste",     label: "Paste Text",   icon: <ClipboardList className="h-4 w-4" /> },
];

const BREAKDOWN_LABELS = {
    keywordsMatch:       "Keywords Match",
    formatting:          "Formatting",
    skillsRelevance:     "Skills Relevance",
    experienceClarity:   "Experience Clarity",
    educationPresence:   "Education Presence",
};

/* ─── card helper ─────────────────────────────────────────── */
function Card({ className = "", children }) {
    return (
        <div className={`bg-[var(--bg2)] border border-[var(--border)] rounded-3xl ${className}`}>
            {children}
        </div>
    );
}

/* ─── main component ──────────────────────────────────────── */
export default function AtsChecker() {
    const { user } = useAuth();
    const { isDark } = useTheme();

    const [activeTab,        setActiveTab]        = useState("myresumes");
    const [savedResumes,     setSavedResumes]     = useState([]);
    const [resumesLoading,   setResumesLoading]   = useState(false);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [pdfFile,          setPdfFile]          = useState(null);
    const [pdfText,          setPdfText]          = useState("");
    const [pdfLoading,       setPdfLoading]       = useState(false);
    const [isDragging,       setIsDragging]       = useState(false);
    const fileInputRef = useRef(null);
    const [pastedText, setPastedText] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [showJD,   setShowJD]   = useState(false);
    const [loading,  setLoading]  = useState(false);
    const [result,   setResult]   = useState(null);

    useEffect(() => {
        if (activeTab !== "myresumes" || !user) return;
        setResumesLoading(true);
        getResumes()
            .then(setSavedResumes)
            .catch(() => toast.error("Failed to load resumes."))
            .finally(() => setResumesLoading(false));
    }, [activeTab, user]);

    const getResumeText = () => {
        if (activeTab === "myresumes") {
            const found = savedResumes.find((r) => r.id === selectedResumeId);
            return found ? resumeToText(found.data) : "";
        }
        if (activeTab === "pdf") return pdfText;
        return pastedText;
    };

    const getResumePreviewText = (resume) => resumeToText(resume.data);

    const handleFileSelect = async (file) => {
        if (!file || file.type !== "application/pdf") { toast.error("Please upload a valid PDF file."); return; }
        setPdfFile(file); setPdfLoading(true); setPdfText("");
        const toastId = toast.loading("Reading PDF…");
        try {
            const { text, pages, method } = await extractPdf(file, (status) => {
                if (status === "ocr") toast.loading("Scanned PDF — running OCR…", { id: toastId });
            });
            if (!text) { toast.error("No text found in this PDF.", { id: toastId }); setPdfFile(null); return; }
            setPdfText(text);
            const wc = text.split(/\s+/).filter(Boolean).length;
            toast.success(`✅ ${wc} words extracted from ${pages} page${pages > 1 ? "s" : ""} (${method})`, { id: toastId });
        } catch {
            toast.error("Failed to read PDF. Please try a different file.", { id: toastId });
            setPdfFile(null);
        } finally { setPdfLoading(false); }
    };

    const onDrop      = useCallback((e) => { e.preventDefault(); setIsDragging(false); handleFileSelect(e.dataTransfer.files[0]); }, []);
    const onDragOver  = (e) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);

    const handleDelete = async (id, e) => {
        e.stopPropagation();
        try {
            await deleteResume(id);
            setSavedResumes((prev) => prev.filter((r) => r.id !== id));
            if (selectedResumeId === id) setSelectedResumeId(null);
            toast.success("Resume removed.");
        } catch { toast.error("Failed to delete resume."); }
    };

    const handleCheck = async () => {
        const resumeText = getResumeText();
        if (!resumeText.trim()) {
            toast.error(activeTab === "myresumes" ? "Please select a resume first." : activeTab === "pdf" ? "Please upload a PDF first." : "Please paste your resume text first.");
            return;
        }
        setLoading(true); setResult(null);
        try {
            const data = await checkAtsScore(resumeText, jobDescription);
            if (data.error) toast.error("ATS check failed: " + data.error);
            else { setResult(data); toast.success("ATS analysis complete!"); }
        } catch { toast.error("Something went wrong. Please try again."); }
        finally { setLoading(false); }
    };

    const scoreLabel = result?.overallScore >= 80
        ? { text: "Excellent", color: "text-green-500" }
        : result?.overallScore >= 60
        ? { text: "Good",      color: "text-amber-500" }
        : { text: "Needs Work",color: "text-red-500" };

    /* ── shared input classes ── */
    const inputCls  = `w-full border rounded-2xl p-4 text-sm resize-none outline-none transition-all bg-[var(--bg3)] border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text3)] focus:border-violet-500/60 focus:ring-1 focus:ring-violet-500/30`;
    const tabInactive = isDark ? "text-zinc-400 hover:text-white" : "text-slate-500 hover:text-slate-900";

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">

            {/* Hero */}
            <div className={`relative overflow-hidden border-b border-[var(--border)]`}>
                <div className={`absolute inset-0 pointer-events-none ${isDark ? "bg-gradient-to-br from-violet-600/10 via-transparent to-fuchsia-600/5" : "bg-gradient-to-br from-violet-100/60 via-transparent to-fuchsia-100/40"}`} />
                <div className="max-w-4xl mx-auto px-4 pt-28 pb-14 text-center relative">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium mb-5 ${isDark ? "bg-violet-500/10 border-violet-500/20 text-violet-400" : "bg-violet-50 border-violet-200 text-violet-600"}`}>
                        <Sparkles className="h-4 w-4" />
                        AI-Powered ATS Scanner
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold mb-3 text-[var(--text)]">ATS Resume Checker</h1>
                    <p className="text-lg max-w-xl mx-auto text-[var(--text2)]">
                        Select a resume you built, upload a PDF, or paste plain text — then add an optional job
                        description for a targeted score.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">

                {/* Tabs */}
                <div className={`flex gap-2 border p-1.5 rounded-2xl bg-[var(--bg2)] border-[var(--border)]`}>
                    {TABS.map((tab) => (
                        <button key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setResult(null); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                activeTab === tab.id
                                    ? "bg-violet-600 text-white shadow-lg shadow-violet-500/30"
                                    : tabInactive
                            }`}>
                            {tab.icon}{tab.label}
                        </button>
                    ))}
                </div>

                {/* My Resumes */}
                {activeTab === "myresumes" && (
                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-[var(--text)]">
                            <LayoutDashboard className="h-4 w-4 text-violet-500" />
                            Select a Saved Resume
                        </h3>

                        {!user ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-black/[0.04]"}`}>
                                    <FileText className="h-8 w-8 text-[var(--text3)]" />
                                </div>
                                <p className="font-medium text-[var(--text2)]">Sign in to access your resumes</p>
                                <a href="/login" className="text-violet-500 hover:underline text-sm">Sign in / Sign up</a>
                            </div>
                        ) : resumesLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
                            </div>
                        ) : savedResumes.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                                <div className={`h-16 w-16 rounded-2xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-black/[0.04]"}`}>
                                    <FileText className="h-8 w-8 text-[var(--text3)]" />
                                </div>
                                <p className="font-medium text-[var(--text2)]">No saved resumes yet</p>
                                <p className="text-sm text-[var(--text3)]">
                                    Go to <a href="/create" className="text-violet-500 hover:underline">Create Resume</a> and click <strong>Save Resume</strong>.
                                </p>
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-3">
                                {savedResumes.map((resume) => (
                                    <button key={resume.id} onClick={() => setSelectedResumeId(resume.id)}
                                        className={`relative text-left p-4 rounded-2xl border transition-all group ${
                                            selectedResumeId === resume.id
                                                ? "border-violet-500 bg-violet-500/10"
                                                : `border-[var(--border)] bg-[var(--bg3)] hover:border-violet-400/40`
                                        }`}>
                                        <div className="flex items-start gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                                                <FileText className="h-5 w-5 text-violet-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-sm truncate text-[var(--text)]">{resume.title}</p>
                                                <p className="text-xs mt-0.5 text-[var(--text3)]">
                                                    {new Date(resume.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                                </p>
                                            </div>
                                            {selectedResumeId === resume.id && <CheckCircle2 className="h-5 w-5 text-violet-500 shrink-0" />}
                                        </div>
                                        <button onClick={(e) => handleDelete(resume.id, e)}
                                            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/20 text-red-500">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </button>
                                ))}
                            </div>
                        )}

                        {selectedResumeId && (
                            <details className="mt-2">
                                <summary className="text-xs cursor-pointer hover:text-violet-500 transition-colors text-[var(--text3)]">
                                    Preview extracted text
                                </summary>
                                <pre className={`mt-2 p-3 rounded-xl text-xs whitespace-pre-wrap max-h-48 overflow-y-auto bg-[var(--bg3)] text-[var(--text2)]`}>
                                    {getResumePreviewText(savedResumes.find((r) => r.id === selectedResumeId))}
                                </pre>
                            </details>
                        )}
                    </Card>
                )}

                {/* Upload PDF */}
                {activeTab === "pdf" && (
                    <Card className="p-6 space-y-4">
                        <h3 className="font-semibold flex items-center gap-2 text-[var(--text)]">
                            <FileUp className="h-4 w-4 text-fuchsia-500" />
                            Upload Resume PDF
                        </h3>
                        <div onClick={() => fileInputRef.current?.click()}
                            onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                            className={`relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all py-14 ${
                                isDragging        ? "border-violet-500 bg-violet-500/10"
                                : pdfFile         ? "border-green-500/50 bg-green-500/5"
                                : isDark          ? "border-white/15 hover:border-white/30 hover:bg-white/5"
                                                  : "border-black/10 hover:border-violet-400/40 hover:bg-violet-50/50"
                            }`}>
                            <input ref={fileInputRef} type="file" accept="application/pdf" className="hidden"
                                onChange={(e) => handleFileSelect(e.target.files?.[0])} />
                            {pdfLoading ? (
                                <><Loader2 className="h-10 w-10 text-violet-500 animate-spin" />
                                <p className="text-sm text-[var(--text2)]">Extracting text from PDF...</p></>
                            ) : pdfFile ? (
                                <><CheckCircle2 className="h-10 w-10 text-green-500" />
                                <p className="font-semibold text-green-500">{pdfFile.name}</p>
                                <p className="text-xs text-[var(--text3)]">{pdfText ? `${pdfText.trim().split(/\s+/).length} words extracted` : "Text extracted"}</p>
                                <p className="text-xs text-[var(--text3)]">Click to replace</p></>
                            ) : (
                                <><div className={`h-14 w-14 rounded-2xl flex items-center justify-center ${isDark ? "bg-white/5" : "bg-black/[0.04]"}`}>
                                    <Upload className="h-7 w-7 text-[var(--text3)]" />
                                </div>
                                <p className="font-medium text-[var(--text2)]">Drag & drop your PDF here</p>
                                <p className="text-sm text-[var(--text3)]">or click to browse</p>
                                <p className="text-xs text-[var(--text3)] mt-1">PDF files only</p></>
                            )}
                        </div>
                        {pdfText && (
                            <details>
                                <summary className="text-xs cursor-pointer hover:text-violet-500 transition-colors text-[var(--text3)]">Preview extracted text</summary>
                                <pre className="mt-2 p-3 rounded-xl text-xs whitespace-pre-wrap max-h-48 overflow-y-auto bg-[var(--bg3)] text-[var(--text2)]">{pdfText}</pre>
                            </details>
                        )}
                    </Card>
                )}

                {/* Paste Text */}
                {activeTab === "paste" && (
                    <Card className="p-6 space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
                            <ClipboardList className="h-4 w-4 text-violet-500" />
                            Paste Resume Text <span className="text-red-400">*</span>
                        </label>
                        <textarea value={pastedText} onChange={(e) => setPastedText(e.target.value)}
                            placeholder="Paste your full resume content here (plain text)..."
                            rows={12} className={inputCls} />
                        <p className="text-xs text-[var(--text3)]">{pastedText.trim().split(/\s+/).filter(Boolean).length} words</p>
                    </Card>
                )}

                {/* Job Description */}
                <Card className="p-6 space-y-3">
                    <button onClick={() => setShowJD(!showJD)}
                        className="flex items-center gap-2 text-sm font-semibold w-full text-[var(--text)] hover:text-violet-500 transition-colors">
                        <Briefcase className="h-4 w-4 text-fuchsia-500" />
                        <span className="flex-1 text-left">
                            Job Description <span className="font-normal text-[var(--text3)]">(optional — improves accuracy)</span>
                        </span>
                        {showJD ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                    {showJD && (
                        <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}
                            placeholder="Paste the job description you're targeting..."
                            rows={6} className={inputCls} />
                    )}
                </Card>

                {/* CTA */}
                <button onClick={handleCheck} disabled={loading}
                    className="w-full py-4 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-base transition-all shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                    {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Analyzing your resume...</>
                             : <><ShieldCheck className="h-5 w-5" />Check ATS Score</>}
                </button>

                {/* Results */}
                {result && (
                    <div className="space-y-6">
                        {/* Score */}
                        <Card className="p-8 flex flex-col sm:flex-row items-center gap-8">
                            <ScoreRing score={result.overallScore} isDark={isDark} />
                            <div className="flex-1 text-center sm:text-left space-y-3">
                                <div>
                                    <p className="text-sm font-medium uppercase tracking-wider text-[var(--text3)]">Overall ATS Score</p>
                                    <h2 className={`text-3xl font-bold mt-1 ${scoreLabel.color}`}>{scoreLabel.text}</h2>
                                </div>
                                <p className="text-sm leading-relaxed text-[var(--text2)]">{result.summary}</p>
                            </div>
                        </Card>

                        {/* Breakdown */}
                        <Card className="p-6 space-y-5">
                            <h3 className="flex items-center gap-2 font-semibold text-[var(--text)]">
                                <TrendingUp className="h-5 w-5 text-violet-500" />
                                Score Breakdown
                            </h3>
                            {result.scoreBreakdown && Object.entries(result.scoreBreakdown).map(([key, val]) => (
                                <BreakdownBar key={key} label={BREAKDOWN_LABELS[key] || key} score={val} isDark={isDark} />
                            ))}
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6 space-y-4">
                                <h3 className="flex items-center gap-2 font-semibold text-[var(--text)]">
                                    <Award className="h-5 w-5 text-green-500" />Strengths
                                </h3>
                                <ul className="space-y-3">
                                    {result.strengths?.map((s, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-sm text-[var(--text2)]">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                            <Card className="p-6 space-y-4">
                                <h3 className="flex items-center gap-2 font-semibold text-[var(--text)]">
                                    <Lightbulb className="h-5 w-5 text-amber-500" />Improvements
                                </h3>
                                <ul className="space-y-3">
                                    {result.improvements?.map((s, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                                            <span className="text-sm text-[var(--text2)]">{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </Card>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6 space-y-4">
                                <h3 className="flex items-center gap-2 font-semibold text-[var(--text)]">
                                    <Tag className="h-5 w-5 text-violet-500" />Detected Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.detectedKeywords?.map((kw, i) => <TagPill key={i} text={kw} variant="green" isDark={isDark} />)}
                                </div>
                            </Card>
                            <Card className="p-6 space-y-4">
                                <h3 className="flex items-center gap-2 font-semibold text-[var(--text)]">
                                    <XCircle className="h-5 w-5 text-red-500" />Missing Keywords
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {result.missingKeywords?.map((kw, i) => <TagPill key={i} text={kw} variant="red" isDark={isDark} />)}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

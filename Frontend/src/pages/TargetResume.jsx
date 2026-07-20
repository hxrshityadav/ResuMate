import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { axiosInstance } from "../api/ResumeService";
import { extractPdfText as extractPdf } from "../utils/extractPdfText";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import toast from "react-hot-toast";
import {
    Upload, FileText, Briefcase, Sparkles, Loader2, ShieldCheck,
    Download, CheckCircle2, XCircle, AlertCircle,
    X, ChevronDown, ChevronUp, LayoutTemplate, Trash2, FileUp,
    Target, RotateCcw, Wand2, ArrowRight, Edit3, Type, Palette,
    GripVertical, Plus, Check, FileCode, AlignJustify,
} from "lucide-react";
import HarvardClassic from "../templates/HarvardClassic";
import AcademicClean from "../templates/AcademicClean";
import SidebarPro from "../templates/SidebarPro";
import TimelinePro from "../templates/TimelinePro";

/* ── constants ────────────────────────────────────────────── */
const FONTS = [
    { id: "system",    label: "Default",        value: "system-ui, sans-serif" },
    { id: "arial",     label: "Arial",           value: "Arial, sans-serif" },
    { id: "verdana",   label: "Verdana",         value: "Verdana, sans-serif" },
    { id: "trebuchet", label: "Trebuchet",       value: "'Trebuchet MS', sans-serif" },
    { id: "georgia",   label: "Georgia",         value: "Georgia, serif" },
    { id: "times",     label: "Times New Roman", value: "'Times New Roman', serif" },
];
const FONT_SIZES = [
    { id: "sm", label: "S", title: "Small",  px: 13 },
    { id: "md", label: "M", title: "Medium", px: 15 },
    { id: "lg", label: "L", title: "Large",  px: 17 },
];
const DEFAULT_SECTIONS = ["summary","skills","experience","education","projects","certifications","achievements","languages"];
const SECTION_LABELS = {
    summary: "Professional Summary", skills: "Skills", experience: "Experience",
    education: "Education", projects: "Projects", certifications: "Certifications",
    achievements: "Achievements", languages: "Languages",
};

/* ── AutoTextarea ─────────────────────────────────────────── */
const AutoTextarea = ({ value, onChange, placeholder = "", className = "" }) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.max(el.scrollHeight, 48)}px`;
    }, [value]);
    return (
        <textarea ref={ref} value={value ?? ""} onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder} className={className}
            style={{ overflow: "hidden", resize: "none" }} />
    );
};

/* ── Accordion ────────────────────────────────────────────── */
const Accordion = ({ id, label, openEdit, setOpenEdit, children }) => {
    const isOpen = openEdit === id;
    return (
        <div className="border border-[var(--border)] rounded-2xl overflow-hidden">
            <button type="button" onClick={() => setOpenEdit(isOpen ? null : id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-[var(--bg3)] hover:bg-[var(--bg4)] transition-all text-sm font-semibold text-[var(--text)]">
                <span className="flex items-center gap-2">
                    <Edit3 className="h-3.5 w-3.5 text-violet-500" />{label}
                </span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-[var(--text3)]" /> : <ChevronDown className="h-4 w-4 text-[var(--text3)]" />}
            </button>
            {isOpen && <div className="p-4 space-y-3 bg-[var(--bg2)] border-t border-[var(--border)]">{children}</div>}
        </div>
    );
};

/* ── Field ────────────────────────────────────────────────── */
const inputCls = "w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-500/60 transition-all placeholder:text-[var(--text3)]";
const Field = ({ label, value, onChange, textarea = false, placeholder = "" }) => (
    <div className="space-y-1">
        <label className="text-xs text-[var(--text2)] font-medium">{label}</label>
        {textarea
            ? <AutoTextarea value={value} onChange={onChange} placeholder={placeholder} className={inputCls} />
            : <input type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
        }
    </div>
);

/* ── AI Improve button ────────────────────────────────────── */
const AIBtn = ({ onClick, loading }) => (
    <button type="button" onClick={onClick} disabled={loading}
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-400 hover:bg-violet-500/25 hover:text-violet-300 text-[11px] font-semibold transition-all disabled:opacity-50">
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
        AI Improve
    </button>
);

/* ── helpers ─────────────────────────────────────────────── */
function normalizeResume(raw) {
    const pi = raw.personalInformation || {};
    return {
        name:     pi.fullName      || raw.name     || "",
        role:     raw.targetRole   || raw.role      || "",
        email:    pi.email         || raw.email     || "",
        phone:    pi.phoneNumber   || raw.phone     || "",
        location: pi.location      || raw.location  || "",
        linkedIn: pi.linkedIn      || raw.linkedIn  || "",
        gitHub:   pi.gitHub        || raw.gitHub    || "",
        summary:  raw.summary      || "",
        skills:   (raw.skills      || []).map((s) => (typeof s === "object" ? s.title || s : s)),
        experience: (raw.experience || []).map((e) => ({
            title:    e.jobTitle      || e.title    || "",
            company:  e.company       || "",
            time:     e.duration      || e.time     || "",
            location: e.location      || "",
            points:   e.points        || (e.responsibility ? [e.responsibility] : []),
        })),
        education: Array.isArray(raw.education) ? raw.education : raw.education ? [raw.education] : [],
        projects:       raw.projects       || [],
        certifications: raw.certifications || [],
        achievements:   raw.achievements   || [],
        languages:      raw.languages      || [],
    };
}

/* ── Score Ring ──────────────────────────────────────────── */
function ScoreRing({ score }) {
    const r = 46, c = 2 * Math.PI * r;
    const color = score >= 80 ? "#22c55e" : score >= 60 ? "#f59e0b" : "#ef4444";
    return (
        <div className="relative flex items-center justify-center w-28 h-28">
            <svg className="w-28 h-28 -rotate-90" viewBox="0 0 110 110">
                <circle cx="55" cy="55" r={r} stroke="currentColor" strokeOpacity="0.08" strokeWidth="10" fill="none" />
                <circle cx="55" cy="55" r={r} stroke={color} strokeWidth="10" fill="none"
                    strokeDasharray={c} strokeDashoffset={c - (score / 100) * c}
                    strokeLinecap="round" style={{ transition: "stroke-dashoffset 1.2s ease" }} />
            </svg>
            <div className="absolute text-center">
                <span className="text-2xl font-black text-[var(--text)]">{score}</span>
                <p className="text-[10px] text-[var(--text3)] -mt-0.5">/ 100</p>
            </div>
        </div>
    );
}

/* ── Score Bar ───────────────────────────────────────────── */
function ScoreBar({ label, score }) {
    const color = score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-400" : "bg-red-500";
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-[var(--text2)]">{label}</span>
                <span className="font-semibold text-[var(--text)]">{score}</span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--bg4)] overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${score}%` }} />
            </div>
        </div>
    );
}

const TEMPLATES = [
    { id: "harvard",  label: "Harvard Classic" },
    { id: "academic", label: "Academic Clean"  },
    { id: "sidebar",  label: "Sidebar Pro"     },
    { id: "timeline", label: "Timeline Pro"    },
];

const ACCENT_PRESETS = [
    "#7c3aed","#0ea5e9","#10b981","#f43f5e","#f59e0b","#18181b",
];

export default function TargetResume() {
    /* ── input state ── */
    const [inputTab,       setInputTab]       = useState("upload"); // "upload" | "paste"
    const [pdfFile,        setPdfFile]        = useState(null);
    const [extractedText,  setExtractedText]  = useState("");
    const [pastedText,     setPastedText]     = useState("");
    const [extracting,     setExtracting]     = useState(false);
    const [ocrStatus,      setOcrStatus]      = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [targetRole,     setTargetRole]     = useState("");
    const [dragOver,       setDragOver]       = useState(false);

    /* resolve which text to use */
    const resumeText = inputTab === "upload" ? extractedText : pastedText;

    /* ── generation state ── */
    const [generating,     setGenerating]     = useState(false);
    const [resumeData,     setResumeData]     = useState(null);

    /* ── ATS state ── */
    const [atsLoading,     setAtsLoading]     = useState(false);
    const [atsResult,      setAtsResult]      = useState(null);

    /* ── template/style state ── */
    const [selectedTemplate, setSelectedTemplate] = useState("harvard");
    const [accent,         setAccent]         = useState("#7c3aed");
    const [customHex,      setCustomHex]      = useState("");
    const [fontFamily,     setFontFamily]     = useState("system-ui, sans-serif");
    const [fontSize,       setFontSize]       = useState("md");
    const [sectionOrder,   setSectionOrder]   = useState(DEFAULT_SECTIONS);
    const [zoom,           setZoom]           = useState(70);
    const [downloading,    setDownloading]    = useState(false);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);

    /* ── right panel sections ── */
    const [atsOpen,        setAtsOpen]        = useState(true);
    const [editOpen,       setEditOpen]       = useState(true);
    const [showSectionOrder, setShowSectionOrder] = useState(false);

    /* ── edit state ── */
    const [openEdit,       setOpenEdit]       = useState(null);
    const [aiImproving,    setAiImproving]    = useState(null);

    const resumeRef = useRef(null);
    const fontStyleRef = useRef(null);
    const dragSrcRef   = useRef(null);

    /* ── derived ── */
    const accentKey = ["#7c3aed","#0ea5e9","#10b981","#f43f5e","#f59e0b","#18181b"].includes(accent)
        ? ["violet","blue","emerald","rose","amber","black"][["#7c3aed","#0ea5e9","#10b981","#f43f5e","#f59e0b","#18181b"].indexOf(accent)]
        : "violet";
    const baseFontPx = FONT_SIZES.find(f => f.id === fontSize)?.px ?? 15;

    /* ── extract PDF text (with OCR fallback) ── */
    const handleExtract = async (file) => {
        setExtracting(true);
        setOcrStatus("");
        const toastId = toast.loading("Reading PDF…");
        try {
            const { text, pages, method } = await extractPdf(file, (status) => {
                if (status === "ocr") {
                    setOcrStatus("Scanned PDF detected — running OCR…");
                    toast.loading("Scanned PDF detected — running OCR (this may take a moment)…", { id: toastId });
                } else if (status.startsWith("ocr-page")) {
                    const [, , page, total] = status.split("-");
                    setOcrStatus(`OCR: page ${page} of ${total}…`);
                }
            });

            if (!text) {
                toast.error("Could not extract any text from this PDF.", { id: toastId });
                setPdfFile(null);
                return;
            }

            setExtractedText(text);
            const wordCount = text.split(/\s+/).filter(Boolean).length;
            const label = method === "ocr" ? "OCR" : "native";
            toast.success(`✅ ${wordCount} words extracted from ${pages} page${pages > 1 ? "s" : ""} (${label})`, { id: toastId });
        } catch (err) {
            console.error("PDF extraction error:", err);
            toast.error("Failed to read PDF. Try the 'Paste Text' tab instead.", { id: toastId });
            setPdfFile(null);
        } finally {
            setExtracting(false);
            setOcrStatus("");
        }
    };

    const handleFileChange = (file) => {
        if (!file || file.type !== "application/pdf") { toast.error("Please upload a PDF file."); return; }
        setExtractedText("");
        setPdfFile(file);
        handleExtract(file);
    };

    const handleDrop = (e) => {
        e.preventDefault(); setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    /* ── close download menu / section order popover on outside click ── */
    useEffect(() => {
        if (!showDownloadMenu && !showSectionOrder) return;
        const handler = (e) => {
            if (!e.target.closest("#tr-download-root")) setShowDownloadMenu(false);
            if (!e.target.closest("#tr-section-order-root")) setShowSectionOrder(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showDownloadMenu, showSectionOrder]);

    /* ── font size CSS injection ── */
    useEffect(() => {
        if (fontStyleRef.current) fontStyleRef.current.remove();
        const scale = baseFontPx / 14;
        const s = (b) => (b * scale).toFixed(2) + "px";
        const css = `
            .tr-scale .text-xs   { font-size: ${s(12)} !important; }
            .tr-scale .text-sm   { font-size: ${s(14)} !important; }
            .tr-scale .text-base { font-size: ${s(16)} !important; }
            .tr-scale .text-lg   { font-size: ${s(18)} !important; }
            .tr-scale .text-xl   { font-size: ${s(20)} !important; }
            .tr-scale .text-2xl  { font-size: ${s(24)} !important; }
            .tr-scale .text-3xl  { font-size: ${s(30)} !important; }
            .tr-scale .text-4xl  { font-size: ${s(36)} !important; }
        `;
        const el = document.createElement("style");
        el.setAttribute("data-tr-scale", "1");
        el.textContent = css;
        document.head.appendChild(el);
        fontStyleRef.current = el;
        return () => { el.remove(); };
    }, [baseFontPx]);

    /* ── update helper ── */
    const update = useCallback((path, value) => {
        setResumeData((prev) => {
            const next = { ...prev };
            const parts = path.split(".");
            let cur = next;
            for (let i = 0; i < parts.length - 1; i++) {
                cur[parts[i]] = Array.isArray(cur[parts[i]]) ? [...cur[parts[i]]] : { ...cur[parts[i]] };
                cur = cur[parts[i]];
            }
            cur[parts[parts.length - 1]] = value;
            return next;
        });
    }, []);

    /* ── AI improve ── */
    const handleAIImprove = async (key, sectionType, content, onResult) => {
        setAiImproving(key);
        const toastId = toast.loading("✨ AI improving…");
        try {
            const res = await axiosInstance.post("/resume/improve-section", {
                sectionType,
                content: typeof content === "string" ? content : JSON.stringify(content),
            });
            const data = res?.data !== undefined ? res.data : res;
            if (data?.error) throw new Error(data.error);
            onResult(data);
            toast.success("✨ Improved!", { id: toastId });
        } catch (err) {
            let msg = "AI improve failed. Try again.";
            if (err?.response?.status === 404 || err?.code === "ERR_NETWORK") msg = "Backend not running — start Spring Boot on port 8080.";
            else if (err?.response?.status === 503) msg = "The AI service is busy — wait a few seconds and retry.";
            else if (err.message?.includes("429")) msg = "Rate limit reached — wait a minute and retry.";
            toast.error(msg, { id: toastId, duration: 6000 });
        } finally {
            setAiImproving(null);
        }
    };

    /* ── section drag-to-reorder ── */
    const handleDragStart = useCallback((idx) => { dragSrcRef.current = idx; }, []);
    const handleDragEnter = useCallback((idx) => {
        setSectionOrder((prev) => {
            if (dragSrcRef.current === null || dragSrcRef.current === idx) return prev;
            const next = [...prev];
            const [moved] = next.splice(dragSrcRef.current, 1);
            next.splice(idx, 0, moved);
            dragSrcRef.current = idx;
            return next;
        });
    }, []);
    const handleDragEnd = useCallback(() => { dragSrcRef.current = null; }, []);

    /* ── education helpers ── */
    const eduList = resumeData
        ? (Array.isArray(resumeData.education) ? resumeData.education : resumeData.education ? [resumeData.education] : [])
        : [];

    const updateEdu = useCallback((idx, field, value) => {
        setResumeData(prev => {
            const list = Array.isArray(prev.education) ? prev.education : [prev.education].filter(Boolean);
            return { ...prev, education: list.map((e, i) => i === idx ? { ...e, [field]: value } : e) };
        });
    }, []);
    const addEdu = useCallback(() => {
        setResumeData(prev => {
            const list = Array.isArray(prev.education) ? prev.education : [prev.education].filter(Boolean);
            return { ...prev, education: [...list, { degree: "", college: "", year: "" }] };
        });
    }, []);
    const removeEdu = useCallback((idx) => {
        setResumeData(prev => {
            const list = Array.isArray(prev.education) ? prev.education : [prev.education].filter(Boolean);
            return { ...prev, education: list.filter((_, i) => i !== idx) };
        });
    }, []);

    /* ── generate targeted resume ── */
    const handleGenerate = async () => {
        if (!resumeText.trim()) {
            toast.error(inputTab === "upload"
                ? "Please upload your resume PDF first."
                : "Please paste your resume text first.");
            return;
        }
        if (!targetRole.trim()) { toast.error("Please specify the target job role."); return; }
        if (!jobDescription.trim()) { toast.error("Please paste the job description."); return; }

        setGenerating(true);
        setAtsResult(null);
        const toastId = toast.loading("🎯 Tailoring your resume to the job…");
        try {
            const res = await axiosInstance.post("/resume/target-resume", {
                resumeText: resumeText.trim(),
                jobDescription,
                targetRole,
            });
            const data = res?.data !== undefined ? res.data : res;
            if (data?.error) throw new Error(data.error);
            const normalized = normalizeResume({ ...data, targetRole });
            setResumeData(normalized);
            toast.success("✅ Targeted resume generated!", { id: toastId });
            runAtsCheck(normalized, jobDescription);  // auto-run ATS check
        } catch (err) {
            toast.error(err.message?.substring(0, 100) || "Generation failed.", { id: toastId });
        } finally {
            setGenerating(false);
        }
    };

    /* ── ATS check ── */
    const runAtsCheck = async (data, jd) => {
        setAtsLoading(true);
        try {
            const resumeText = [
                data.name, data.role, data.summary,
                data.skills?.join(", "),
                data.experience?.map(e => `${e.title} ${e.company} ${e.points?.join(" ")}`).join(" "),
            ].filter(Boolean).join("\n");
            const res = await axiosInstance.post("/api/v1/resume/ats-check", {
                resumeText,
                jobDescription: jd,
            });
            if (res.data?.error) throw new Error(res.data.error);
            setAtsResult(res.data);
        } catch (err) {
            toast.error("ATS check failed: " + (err.message?.substring(0, 60) || "Unknown error"));
        } finally {
            setAtsLoading(false);
        }
    };


    const renderTemplate = () => {
        const props = { data: resumeData, accent: accentKey, accentHex: accent, sectionOrder, fontFamily };
        const map = {
            harvard:  <HarvardClassic {...props} />,
            academic: <AcademicClean {...props} />,
            sidebar:  <SidebarPro    {...props} />,
            timeline: <TimelinePro   {...props} />,
        };
        return <div className="tr-scale">{map[selectedTemplate] || map.harvard}</div>;
    };

    /* ── download PDF ── */
    const handleDownloadPDF = async () => {
        if (!resumeRef.current) return;
        setDownloading(true);
        setShowDownloadMenu(false);
        const toastId = toast.loading("Generating PDF…");
        try {
            const el = resumeRef.current;
            const prev = el.style.transform;
            el.style.transform = "none";
            const dataUrl = await toPng(el, { cacheBust: true, pixelRatio: 2, backgroundColor: "#ffffff" });
            el.style.transform = prev;
            const img = new Image();
            img.src = dataUrl;
            await new Promise((res) => { img.onload = res; });
            const pdfW = 210, pdfH = 297;
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            const scaledH = (img.naturalHeight / img.naturalWidth) * pdfW;
            const pageCount = Math.ceil(scaledH / pdfH);
            for (let i = 0; i < pageCount; i++) {
                if (i > 0) pdf.addPage();
                pdf.addImage(dataUrl, "PNG", 0, -i * pdfH, pdfW, scaledH);
            }
            pdf.save(`${resumeData?.name || "targeted"}-resume.pdf`);
            toast.success(`Downloaded (${pageCount} page${pageCount > 1 ? "s" : ""})!`, { id: toastId });
        } catch {
            toast.error("PDF export failed.", { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    /* ── download DOCX ── */
    const handleDownloadDOCX = async () => {
        setShowDownloadMenu(false);
        const toastId = toast.loading("Generating DOCX…");
        try {
            const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");
            const edu = Array.isArray(resumeData.education) ? resumeData.education[0] : resumeData.education;
            const children = [];
            children.push(new Paragraph({ text: resumeData.name, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }));
            children.push(new Paragraph({ children: [new TextRun({ text: resumeData.role, bold: true })], alignment: AlignmentType.CENTER }));
            const contact = [resumeData.location, resumeData.email, resumeData.phone].filter(Boolean);
            if (contact.length) children.push(new Paragraph({ text: contact.join("  |  "), alignment: AlignmentType.CENTER }));
            children.push(new Paragraph(""));
            if (resumeData.summary) {
                children.push(new Paragraph({ text: "PROFESSIONAL SUMMARY", heading: HeadingLevel.HEADING_2 }));
                children.push(new Paragraph(resumeData.summary));
                children.push(new Paragraph(""));
            }
            if (resumeData.skills?.length) {
                children.push(new Paragraph({ text: "SKILLS", heading: HeadingLevel.HEADING_2 }));
                children.push(new Paragraph(resumeData.skills.map(s => typeof s === "object" ? s.title || s.name : s).join(", ")));
                children.push(new Paragraph(""));
            }
            if (resumeData.experience?.length) {
                children.push(new Paragraph({ text: "EXPERIENCE", heading: HeadingLevel.HEADING_2 }));
                resumeData.experience.forEach(exp => {
                    children.push(new Paragraph({ children: [new TextRun({ text: exp.title, bold: true }), new TextRun(`  —  ${exp.company}  (${exp.time || ""})`)] }));
                    (exp.points || []).forEach(pt => children.push(new Paragraph({ text: `• ${pt}`, indent: { left: 400 } })));
                    children.push(new Paragraph(""));
                });
            }
            if (edu) {
                children.push(new Paragraph({ text: "EDUCATION", heading: HeadingLevel.HEADING_2 }));
                children.push(new Paragraph({ children: [new TextRun({ text: edu.degree || "", bold: true }), new TextRun(`  —  ${edu.college || edu.university || ""}  (${edu.year || ""})`)] }));
                children.push(new Paragraph(""));
            }
            if (resumeData.projects?.length) {
                children.push(new Paragraph({ text: "PROJECTS", heading: HeadingLevel.HEADING_2 }));
                resumeData.projects.forEach(p => {
                    children.push(new Paragraph({ children: [new TextRun({ text: p.title, bold: true })] }));
                    if (p.description) children.push(new Paragraph(p.description));
                    if (p.technologiesUsed?.length) children.push(new Paragraph(`Tech: ${p.technologiesUsed.join(", ")}`));
                    children.push(new Paragraph(""));
                });
            }
            const doc = new Document({ sections: [{ children }] });
            const blob = await Packer.toBlob(doc);
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `${resumeData.name || "targeted"}-resume.docx`;
            a.click(); URL.revokeObjectURL(url);
            toast.success("DOCX downloaded!", { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error("DOCX download failed.", { id: toastId });
        }
    };

    /* ── download Markdown ── */
    const handleDownloadMD = () => {
        setShowDownloadMenu(false);
        const edu = Array.isArray(resumeData.education) ? resumeData.education[0] : resumeData.education;
        let md = `# ${resumeData.name}\n**${resumeData.role}**\n\n`;
        const contact = [resumeData.location, resumeData.email, resumeData.phone].filter(Boolean);
        if (contact.length) md += `${contact.join(" | ")}\n\n---\n\n`;
        if (resumeData.summary) md += `## Professional Summary\n${resumeData.summary}\n\n`;
        if (resumeData.skills?.length) md += `## Skills\n${resumeData.skills.map(s => typeof s === "object" ? s.title || s.name : s).join(", ")}\n\n`;
        if (resumeData.experience?.length) {
            md += `## Experience\n`;
            resumeData.experience.forEach(exp => {
                md += `### ${exp.title} — ${exp.company}\n*${exp.time || ""}*\n`;
                (exp.points || []).forEach(pt => { md += `- ${pt}\n`; });
                md += "\n";
            });
        }
        if (edu) md += `## Education\n**${edu.degree || ""}** — ${edu.college || edu.university || ""} (${edu.year || ""})\n\n`;
        if (resumeData.projects?.length) {
            md += `## Projects\n`;
            resumeData.projects.forEach(p => {
                md += `### ${p.title}\n${p.description || ""}\n`;
                if (p.technologiesUsed?.length) md += `*Tech: ${p.technologiesUsed.join(", ")}*\n`;
                md += "\n";
            });
        }
        const blob = new Blob([md], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${resumeData.name || "targeted"}-resume.md`;
        a.click(); URL.revokeObjectURL(url);
        toast.success("Markdown downloaded!");
    };

    /* ─────────────────────────────────────────────────────────
       RENDER
    ───────────────────────────────────────────────────────── */
    const TEMPLATE_LIST = [
        { id: "harvard",  label: "Harvard"  },
        { id: "academic", label: "Academic" },
        { id: "sidebar",  label: "Sidebar"  },
        { id: "timeline", label: "Timeline" },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-colors duration-300">

            {/* ── Top header bar ── */}
            <div className="border-b border-[var(--border)] bg-[var(--bg2)] px-6 py-4 flex items-center justify-between gap-4 sticky top-0 z-30 mt-[88px]">
                <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
                        <Target className="h-4.5 w-4.5 text-white" style={{ height: 18, width: 18 }} />
                    </div>
                    <div>
                        <h1 className="resumate-page-title text-[var(--text)] text-2xl leading-tight">Target Resume Builder</h1>
                        <p className="text-xs text-[var(--text3)]">AI tailors your resume for a specific job</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {resumeData && (
                        <>
                            <button onClick={() => runAtsCheck(resumeData, jobDescription)}
                                disabled={atsLoading}
                                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all disabled:opacity-60">
                                {atsLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="h-3.5 w-3.5" />}
                                Re-check ATS
                            </button>
                            <div className="relative" id="tr-download-root">
                                <button onClick={() => setShowDownloadMenu(v => !v)} disabled={downloading}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all shadow-md shadow-violet-500/20 disabled:opacity-60">
                                    {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                                    Download
                                    <ChevronDown className="h-3 w-3 opacity-70" />
                                </button>
                                {showDownloadMenu && (
                                    <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-[var(--border)] bg-[var(--bg2)] shadow-[var(--shadow-lg)] z-50 overflow-hidden">
                                        <button onClick={handleDownloadPDF} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[var(--bg3)] transition-all text-sm text-[var(--text)]">
                                            <span className="text-red-400">📄</span> PDF
                                        </button>
                                        <div className="h-px bg-[var(--border)]" />
                                        <button onClick={handleDownloadDOCX} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[var(--bg3)] transition-all text-sm text-[var(--text)]">
                                            <FileCode className="h-4 w-4 text-blue-400" /> Word (.docx)
                                        </button>
                                        <div className="h-px bg-[var(--border)]" />
                                        <button onClick={handleDownloadMD} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-[var(--bg3)] transition-all text-sm text-[var(--text)]">
                                            <AlignJustify className="h-4 w-4 text-green-400" /> Markdown (.md)
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* ── 3-column body ── */}
            <div className="flex flex-1 overflow-hidden">

                {/* ═══════════════════════════════════
                    LEFT PANEL — Inputs
                ═══════════════════════════════════ */}
                <div className="w-[300px] shrink-0 border-r border-[var(--border)] bg-[var(--bg2)] overflow-y-auto flex flex-col">
                    <div className="p-5 space-y-5">

                        {/* Step 1 — Resume Input */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-violet-500 text-white text-[10px] font-black">1</span>
                                <p className="text-sm font-semibold text-[var(--text)]">Your Existing Resume</p>
                            </div>

                            {/* Tab switcher */}
                            <div className="flex gap-1 p-1 rounded-xl bg-[var(--bg3)] border border-[var(--border)] mb-3">
                                {[{ id: "upload", label: "Upload PDF" }, { id: "paste", label: "Paste Text" }].map((tab) => (
                                    <button key={tab.id} onClick={() => setInputTab(tab.id)}
                                        className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                                            inputTab === tab.id
                                                ? "bg-violet-500/25 text-violet-400 shadow"
                                                : "text-[var(--text3)] hover:text-[var(--text)]"
                                        }`}>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* Upload tab */}
                            {inputTab === "upload" && (
                                pdfFile ? (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.06]">
                                        <div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                                            <FileText className="h-4 w-4 text-emerald-400" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-[var(--text)] truncate">{pdfFile.name}</p>
                                            {extracting
                                                    ? <p className="text-[10px] text-[var(--text3)] flex items-center gap-1.5 mt-0.5">
                                                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                                                    {ocrStatus || "Extracting text…"}
                                                  </p>
                                                : extractedText
                                                    ? <p className="text-[10px] text-emerald-500 mt-0.5">✓ {extractedText.split(/\s+/).filter(Boolean).length} words extracted</p>
                                                    : <p className="text-[10px] text-[var(--text3)] mt-0.5">Ready to extract…</p>
                                            }
                                        </div>
                                        <button onClick={() => { setPdfFile(null); setExtractedText(""); }}
                                            className="text-[var(--text3)] hover:text-red-500 transition-colors shrink-0">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <label
                                        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                                        onDragLeave={() => setDragOver(false)}
                                        onDrop={handleDrop}
                                        className={`flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                                            dragOver
                                                ? "border-violet-500/60 bg-violet-500/10"
                                                : "border-[var(--border)] bg-[var(--bg3)] hover:border-violet-500/30 hover:bg-violet-500/5"
                                        }`}>
                                        <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center">
                                            <FileUp className="h-5 w-5 text-violet-500" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-semibold text-[var(--text)]">Drop your PDF here</p>
                                            <p className="text-xs text-[var(--text3)] mt-0.5">or click to browse files</p>
                                        </div>
                                        <input type="file" accept=".pdf" className="hidden"
                                            onChange={(e) => handleFileChange(e.target.files[0])} />
                                    </label>
                                )
                            )}

                            {/* Paste tab */}
                            {inputTab === "paste" && (
                                <div>
                                    <textarea
                                        value={pastedText}
                                        onChange={(e) => setPastedText(e.target.value)}
                                        placeholder="Paste your full resume text here — name, experience, skills, education, etc…"
                                        rows={8}
                                        className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-violet-500/50 transition-all resize-none leading-relaxed"
                                    />
                                    <p className="text-[10px] text-[var(--text3)] mt-1">{pastedText.split(/\s+/).filter(Boolean).length} words</p>
                                </div>
                            )}
                        </div>

                        <div className="h-px bg-[var(--border)]" />

                        {/* Step 2 — Target Role */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-violet-500 text-white text-[10px] font-black">2</span>
                                <p className="text-sm font-semibold text-[var(--text)]">Target Job Role</p>
                            </div>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text3)]" />
                                <input
                                    type="text"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                    placeholder="e.g. Senior Software Engineer"
                                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-violet-500/50 transition-all"
                                />
                            </div>
                        </div>

                        <div className="h-px bg-[var(--border)]" />

                        {/* Step 3 — Job Description */}
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="flex items-center justify-center h-5 w-5 rounded-full bg-violet-500 text-white text-[10px] font-black">3</span>
                                <p className="text-sm font-semibold text-[var(--text)]">Job Description</p>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job description here. The more detail you provide, the better the AI can tailor your resume…"
                                rows={10}
                                className="w-full px-3 py-2.5 text-sm rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--text)] placeholder:text-[var(--text3)] focus:outline-none focus:border-violet-500/50 transition-all resize-none leading-relaxed"
                            />
                            <p className="text-[10px] text-[var(--text3)] mt-1">{jobDescription.length} characters</p>
                        </div>

                        {/* Generate button */}
                        <button
                            onClick={handleGenerate}
                            disabled={generating || extracting}
                            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all shadow-md shadow-violet-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {generating ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Tailoring Resume…</>
                            ) : extracting ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Extracting PDF…</>
                            ) : (
                                <><Wand2 className="h-4 w-4" /> Generate Targeted Resume</>
                            )}
                        </button>

                        {/* Status hint */}
                        {!resumeText.trim() && (
                            <p className="text-[11px] text-[var(--text3)] text-center -mt-2">
                                {inputTab === "upload" ? "📄 Upload a PDF resume to enable generation" : "✏️ Paste your resume text to enable generation"}
                            </p>
                        )}

                        {/* Tips */}
                        <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.05] p-3.5">
                            <p className="text-xs font-semibold text-violet-400 mb-2 flex items-center gap-1.5">
                                <Sparkles className="h-3 w-3" /> How it works
                            </p>
                            <ul className="space-y-1.5 text-[11px] text-[var(--text3)]">
                                <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />AI reads your existing resume</li>
                                <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />Rewrites it using JD keywords</li>
                                <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />Automatically checks ATS score</li>
                                <li className="flex items-start gap-1.5"><CheckCircle2 className="h-3 w-3 text-emerald-500 mt-0.5 shrink-0" />Download as A4 PDF instantly</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ═══════════════════════════════════
                    CENTER — Style Toolbar + Resume Preview
                ═══════════════════════════════════ */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* ── Style Toolbar (above preview) ── */}
                    <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg2)] px-3 py-2 flex items-center gap-2 flex-wrap">

                        {/* Template */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[var(--text3)] font-semibold uppercase tracking-wider shrink-0">Template</span>
                            <div className="flex gap-1">
                                {TEMPLATE_LIST.map((t) => (
                                    <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                                            selectedTemplate === t.id
                                                ? "bg-violet-500/25 border-violet-500/50 text-violet-400"
                                                : "bg-[var(--bg3)] border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)] hover:border-violet-400/30"
                                        }`}>
                                        {t.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-5 w-px bg-[var(--border)] shrink-0" />

                        {/* Font */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[var(--text3)] font-semibold uppercase tracking-wider shrink-0">Font</span>
                            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}
                                className="bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-2 py-1 text-[11px] text-[var(--text)] outline-none focus:border-violet-500/50 cursor-pointer transition-all"
                                style={{ fontFamily }}>
                                {FONTS.map(f => <option key={f.id} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>)}
                            </select>
                            <div className="flex gap-0.5">
                                {FONT_SIZES.map((s) => (
                                    <button key={s.id} onClick={() => setFontSize(s.id)} title={s.title}
                                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all border ${
                                            fontSize === s.id
                                                ? "bg-violet-500/25 border-violet-500/50 text-violet-400"
                                                : "bg-[var(--bg3)] border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)] hover:border-violet-400/30"
                                        }`}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-5 w-px bg-[var(--border)] shrink-0" />

                        {/* Accent Color */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-[var(--text3)] font-semibold uppercase tracking-wider shrink-0">Color</span>
                            <div className="flex items-center gap-1">
                                {["#7c3aed","#0ea5e9","#10b981","#f43f5e","#f59e0b","#18181b"].map((hex) => (
                                    <button key={hex} onClick={() => { setAccent(hex); setCustomHex(""); }}
                                        style={{ background: hex }}
                                        className={`h-5 w-5 rounded-md border-2 transition-all shrink-0 ${accent === hex && !customHex ? "border-violet-300 scale-110" : "border-transparent hover:scale-110"}`} />
                                ))}
                                <label className="h-5 w-5 rounded-md border-2 border-[var(--border)] overflow-hidden cursor-pointer hover:border-violet-400/50 transition-all shrink-0 relative" title="Custom color">
                                    <input type="color" value={accent} onChange={(e) => { setAccent(e.target.value); setCustomHex(e.target.value); }} className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" />
                                    <div className="h-full w-full" style={{ background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }} />
                                </label>
                                {customHex && (
                                    <span className="text-[10px] font-mono text-[var(--text2)] uppercase">{accent}</span>
                                )}
                            </div>
                        </div>

                        <div className="h-5 w-px bg-[var(--border)] shrink-0" />

                        {/* Section Order popover */}
                        <div className="relative shrink-0" id="tr-section-order-root">
                            <button onClick={() => setShowSectionOrder(v => !v)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                                    showSectionOrder
                                        ? "bg-violet-500/20 border-violet-500/40 text-violet-400"
                                        : "bg-[var(--bg3)] border-[var(--border)] text-[var(--text3)] hover:text-[var(--text)] hover:border-violet-400/30"
                                }`}>
                                <GripVertical className="h-3 w-3" />
                                Sections
                                <ChevronDown className={`h-3 w-3 transition-transform ${showSectionOrder ? "rotate-180" : ""}`} />
                            </button>
                            {showSectionOrder && (
                                <div className="absolute top-full mt-1.5 left-0 z-50 w-52 rounded-xl border border-[var(--border)] bg-[var(--bg2)] shadow-[var(--shadow-lg)] p-2 space-y-1 select-none">
                                    <p className="text-[10px] text-[var(--text3)] px-1 pb-1">Drag to reorder sections</p>
                                    {sectionOrder.map((sec, idx) => (
                                        <div key={sec} draggable
                                            onDragStart={() => handleDragStart(idx)}
                                            onDragEnter={() => handleDragEnter(idx)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 border border-[var(--border)] bg-[var(--bg3)] hover:bg-[var(--bg4)] cursor-grab active:cursor-grabbing transition-all">
                                            <GripVertical className="h-3.5 w-3.5 text-[var(--text3)] shrink-0" />
                                            <span className="flex-1 text-xs font-medium text-[var(--text)]">{SECTION_LABELS[sec]}</span>
                                            <span className="text-[10px] text-[var(--text3)] font-mono w-4 text-right">{idx + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Spacer */}
                        <div className="flex-1 min-w-0" />

                        {/* Zoom */}
                        <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setZoom(z => Math.max(40, z - 5))}
                                className="h-6 w-6 rounded-lg bg-[var(--bg3)] border border-[var(--border)] hover:bg-[var(--bg4)] flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] text-sm transition-all">−</button>
                            <span className="text-xs text-[var(--text3)] w-10 text-center font-mono">{zoom}%</span>
                            <button onClick={() => setZoom(z => Math.min(120, z + 5))}
                                className="h-6 w-6 rounded-lg bg-[var(--bg3)] border border-[var(--border)] hover:bg-[var(--bg4)] flex items-center justify-center text-[var(--text2)] hover:text-[var(--text)] text-sm transition-all">+</button>
                        </div>
                    </div>

                    {/* ── Resume Preview ── */}
                    <div className="flex-1 bg-[var(--bg)] overflow-auto flex flex-col items-center py-8 px-4">
                        {resumeData ? (
                            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}>
                                <div ref={resumeRef}>{renderTemplate()}</div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center flex-1 text-center max-w-sm mx-auto">
                                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/20 flex items-center justify-center mb-5">
                                    <Target className="h-9 w-9 text-violet-400" />
                                </div>
                                <h2 className="resumate-page-title text-2xl text-[var(--text)] mb-2">Your Targeted Resume</h2>
                                <p className="text-sm text-[var(--text2)] leading-relaxed mb-6">
                                    Upload your resume, set the target role, paste the job description, and click Generate.
                                </p>
                                <div className="flex flex-col gap-2 text-xs text-[var(--text3)]">
                                    {["Upload PDF or paste text", "Add target job role", "Paste job description", "Click Generate"].map((step, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="h-5 w-5 rounded-full bg-[var(--bg3)] border border-[var(--border)] flex items-center justify-center text-[10px] font-bold text-[var(--text3)]">{i + 1}</span>
                                            {step}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* ═══════════════════════════════════
                    RIGHT PANEL — ATS + Edit (separate)
                ═══════════════════════════════════ */}
                <div className="w-[340px] shrink-0 border-l border-[var(--border)] bg-[var(--bg2)] overflow-y-auto flex flex-col">

                    {/* ── ATS Score Section ── */}
                    <div className="border-b border-[var(--border)]">
                        <button onClick={() => setAtsOpen(v => !v)}
                            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[var(--bg3)] transition-all">
                            <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                                </div>
                                <span className="text-sm font-bold text-[var(--text)]">ATS Score</span>
                                {atsResult && (
                                    <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                                        atsResult.overallScore >= 80 ? "bg-emerald-500/15 text-emerald-500"
                                        : atsResult.overallScore >= 60 ? "bg-amber-500/15 text-amber-500"
                                        : "bg-red-500/15 text-red-500"
                                    }`}>{atsResult.overallScore}/100</span>
                                )}
                                {atsLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-violet-500" />}
                            </div>
                            {atsOpen ? <ChevronUp className="h-4 w-4 text-[var(--text3)]" /> : <ChevronDown className="h-4 w-4 text-[var(--text3)]" />}
                        </button>

                        {atsOpen && (
                            <div className="px-4 pb-5 space-y-4">
                                {atsLoading ? (
                                    <div className="flex flex-col items-center gap-2 py-8">
                                        <Loader2 className="h-7 w-7 animate-spin text-violet-500" />
                                        <p className="text-xs text-[var(--text3)]">Analyzing resume against job description…</p>
                                    </div>
                                ) : atsResult ? (
                                    <>
                                        <div className="flex flex-col items-center gap-1 py-3">
                                            <ScoreRing score={atsResult.overallScore} />
                                            <p className="text-xs text-[var(--text3)] mt-1">Overall ATS Match</p>
                                            <p className={`text-sm font-bold mt-1 ${atsResult.overallScore >= 80 ? "text-emerald-500" : atsResult.overallScore >= 60 ? "text-amber-500" : "text-red-500"}`}>
                                                {atsResult.overallScore >= 80 ? "Excellent Match!" : atsResult.overallScore >= 60 ? "Good — Improvable" : "Needs Work"}
                                            </p>
                                        </div>
                                        {atsResult.scoreBreakdown && (
                                            <div className="space-y-2.5">
                                                {Object.entries(atsResult.scoreBreakdown).map(([k, v]) => (
                                                    <ScoreBar key={k} label={k.replace(/([A-Z])/g, " $1").replace(/^./, s => s.toUpperCase())} score={v} />
                                                ))}
                                            </div>
                                        )}
                                        {atsResult.detectedKeywords?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                                    <CheckCircle2 className="h-3 w-3" /> Matched Keywords
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {atsResult.detectedKeywords.slice(0, 10).map((kw) => (
                                                        <span key={kw} className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">{kw}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {atsResult.missingKeywords?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] text-red-400 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                                    <XCircle className="h-3 w-3" /> Missing Keywords
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {atsResult.missingKeywords.slice(0, 8).map((kw) => (
                                                        <span key={kw} className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium">{kw}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        {atsResult.improvements?.length > 0 && (
                                            <div>
                                                <p className="text-[10px] text-amber-400 font-semibold uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                                    <AlertCircle className="h-3 w-3" /> Suggestions
                                                </p>
                                                <ul className="space-y-1.5">
                                                    {atsResult.improvements.slice(0, 5).map((imp, i) => (
                                                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-[var(--text2)]">
                                                            <ArrowRight className="h-3 w-3 text-amber-500 mt-0.5 shrink-0" />{imp}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                        <button onClick={() => runAtsCheck(resumeData, jobDescription)} disabled={atsLoading}
                                            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/20 transition-all disabled:opacity-60">
                                            {atsLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <ShieldCheck className="h-3 w-3" />}
                                            Re-check ATS
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 py-8 text-center">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                            <ShieldCheck className="h-6 w-6 text-emerald-400" />
                                        </div>
                                        <p className="text-xs text-[var(--text3)] max-w-[200px]">ATS score will appear automatically after generating your targeted resume</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ── Edit Resume Section ── */}
                    <div className="flex-1">
                        <button onClick={() => setEditOpen(v => !v)}
                            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-[var(--bg3)] transition-all border-b border-[var(--border)]">
                            <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                                    <Edit3 className="h-3.5 w-3.5 text-violet-500" />
                                </div>
                                <span className="text-sm font-bold text-[var(--text)]">Edit Resume</span>
                                {resumeData && <span className="text-[10px] text-[var(--text3)] font-medium">section by section</span>}
                            </div>
                            {editOpen ? <ChevronUp className="h-4 w-4 text-[var(--text3)]" /> : <ChevronDown className="h-4 w-4 text-[var(--text3)]" />}
                        </button>

                        {editOpen && (
                            !resumeData ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center gap-3 px-4">
                                    <p className="text-sm text-[var(--text3)]">Generate a resume first to enable editing.</p>
                                </div>
                            ) : (
                                <div className="p-3 space-y-2">

                                    <Accordion id="personal" label="Personal Info" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                        <Field label="Full Name"        value={resumeData.name}     onChange={(v) => update("name", v)} />
                                        <Field label="Job Title / Role" value={resumeData.role}     onChange={(v) => update("role", v)} />
                                        <Field label="Email"            value={resumeData.email}    onChange={(v) => update("email", v)} />
                                        <Field label="Phone"            value={resumeData.phone}    onChange={(v) => update("phone", v)} />
                                        <Field label="Location"         value={resumeData.location} onChange={(v) => update("location", v)} />
                                        <Field label="LinkedIn URL"     value={resumeData.linkedIn} onChange={(v) => update("linkedIn", v)} />
                                        <Field label="GitHub URL"       value={resumeData.gitHub}   onChange={(v) => update("gitHub", v)} />
                                    </Accordion>

                                    <Accordion id="summary" label="Summary" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                        <div className="flex items-center justify-between mb-1">
                                            <label className="text-xs text-[var(--text2)] font-medium">Professional Summary</label>
                                            <AIBtn loading={aiImproving === "summary"}
                                                onClick={() => handleAIImprove("summary", "summary", resumeData.summary, (d) => {
                                                    if (d.improved) update("summary", d.improved);
                                                })} />
                                        </div>
                                        <AutoTextarea value={resumeData.summary} onChange={(v) => update("summary", v)}
                                            placeholder="Write your professional summary…" className={inputCls} />
                                    </Accordion>

                                    <Accordion id="skills" label="Skills" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                        <label className="text-xs text-[var(--text2)]">Skills (comma-separated)</label>
                                        <AutoTextarea
                                            value={(resumeData.skills || []).map((s) => (typeof s === "object" ? s.title || s.name : s)).join(", ")}
                                            onChange={(v) => update("skills", v.split(",").map((s) => s.trim()).filter(Boolean))}
                                            className={inputCls} />
                                    </Accordion>

                                    <Accordion id="experience" label="Experience" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                        {(resumeData.experience || []).map((exp, i) => (
                                            <div key={i} className="space-y-2 p-3 bg-[var(--bg3)] rounded-xl border border-[var(--border)]">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-semibold text-violet-400">Entry {i + 1}</span>
                                                    <div className="flex items-center gap-2">
                                                        <AIBtn loading={aiImproving === `exp-${i}`}
                                                            onClick={() => {
                                                                const idx = i;
                                                                handleAIImprove(`exp-${idx}`, "experience", { title: exp.title, company: exp.company, time: exp.time, points: exp.points }, (d) => {
                                                                    if (d.bullets?.length) setResumeData(prev => ({ ...prev, experience: prev.experience.map((e, k) => k === idx ? { ...e, points: d.bullets } : e) }));
                                                                });
                                                            }} />
                                                        <button type="button" onClick={() => update("experience", resumeData.experience.filter((_, k) => k !== i))} className="text-red-400/70 hover:text-red-400">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <Field label="Job Title" value={exp.title}   onChange={(v) => update("experience", resumeData.experience.map((e, k) => k === i ? { ...e, title: v } : e))} />
                                                <Field label="Company"   value={exp.company} onChange={(v) => update("experience", resumeData.experience.map((e, k) => k === i ? { ...e, company: v } : e))} />
                                                <Field label="Duration"  value={exp.time}    onChange={(v) => update("experience", resumeData.experience.map((e, k) => k === i ? { ...e, time: v } : e))} placeholder="Jan 2024 - Present" />
                                                <div className="space-y-1">
                                                    <label className="text-xs text-[var(--text2)]">Bullet Points (one per line)</label>
                                                    <AutoTextarea
                                                        value={(exp.points || []).join("\n")}
                                                        onChange={(v) => update("experience", resumeData.experience.map((e, k) => k === i ? { ...e, points: v.split("\n").filter(Boolean) } : e))}
                                                        className={inputCls} />
                                                </div>
                                            </div>
                                        ))}
                                        <button type="button"
                                            onClick={() => update("experience", [...(resumeData.experience || []), { title: "", company: "", time: "", points: [] }])}
                                            className="w-full py-2 rounded-xl border border-dashed border-[var(--border)] text-[var(--text3)] hover:text-violet-500 hover:border-violet-500/40 text-xs flex items-center justify-center gap-2 transition-all">
                                            <Plus className="h-3.5 w-3.5" /> Add Experience
                                        </button>
                                    </Accordion>

                                    <Accordion id="education" label="Education" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                        {eduList.map((e, i) => (
                                            <div key={i} className="space-y-2 p-3 bg-[var(--bg3)] rounded-xl border border-[var(--border)]">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-semibold text-violet-400">Entry {i + 1}</span>
                                                    {eduList.length > 1 && (
                                                        <button type="button" onClick={() => removeEdu(i)} className="text-red-400/70 hover:text-red-400">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                                <Field label="Degree"               value={e.degree}                   onChange={(v) => updateEdu(i, "degree", v)} />
                                                <Field label="College / University" value={e.college || e.university}  onChange={(v) => updateEdu(i, "college", v)} />
                                                <Field label="Graduation Year"      value={e.year || e.graduationYear} onChange={(v) => updateEdu(i, "year", v)} />
                                            </div>
                                        ))}
                                        <button type="button" onClick={addEdu}
                                            className="w-full py-2 rounded-xl border border-dashed border-[var(--border)] text-[var(--text3)] hover:text-violet-500 hover:border-violet-500/40 text-xs flex items-center justify-center gap-2 transition-all">
                                            <Plus className="h-3.5 w-3.5" /> Add Education
                                        </button>
                                    </Accordion>

                                    <Accordion id="projects" label="Projects" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                        {(resumeData.projects || []).map((p, i) => (
                                            <div key={i} className="space-y-2 p-3 bg-[var(--bg3)] rounded-xl border border-[var(--border)]">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-semibold text-violet-400">Project {i + 1}</span>
                                                    <div className="flex items-center gap-2">
                                                        <AIBtn loading={aiImproving === `proj-${i}`}
                                                            onClick={() => {
                                                                const idx = i;
                                                                handleAIImprove(`proj-${idx}`, "project", { title: p.title, description: p.description, technologiesUsed: p.technologiesUsed }, (d) => {
                                                                    if (d.bullets?.length) setResumeData(prev => ({ ...prev, projects: prev.projects.map((x, k) => k === idx ? { ...x, description: d.bullets.join("\n") } : x) }));
                                                                });
                                                            }} />
                                                        <button type="button" onClick={() => update("projects", resumeData.projects.filter((_, k) => k !== i))} className="text-red-400/70 hover:text-red-400">
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <Field label="Title" value={p.title} onChange={(v) => update("projects", resumeData.projects.map((x, k) => k === i ? { ...x, title: v } : x))} />
                                                <div className="space-y-1">
                                                    <label className="text-xs text-[var(--text2)]">Description</label>
                                                    <AutoTextarea value={p.description || ""} placeholder="Describe the project…"
                                                        onChange={(v) => update("projects", resumeData.projects.map((x, k) => k === i ? { ...x, description: v } : x))}
                                                        className={inputCls} />
                                                </div>
                                                <Field label="Technologies (comma-separated)"
                                                    value={(p.technologiesUsed || []).join(", ")}
                                                    onChange={(v) => update("projects", resumeData.projects.map((x, k) => k === i ? { ...x, technologiesUsed: v.split(",").map(s => s.trim()).filter(Boolean) } : x))} />
                                            </div>
                                        ))}
                                        <button type="button"
                                            onClick={() => update("projects", [...(resumeData.projects || []), { title: "", description: "", technologiesUsed: [] }])}
                                            className="w-full py-2 rounded-xl border border-dashed border-[var(--border)] text-[var(--text3)] hover:text-violet-500 hover:border-violet-500/40 text-xs flex items-center justify-center gap-2 transition-all">
                                            <Plus className="h-3.5 w-3.5" /> Add Project
                                        </button>
                                    </Accordion>

                                    <Accordion id="certifications" label="Certifications" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                        {(resumeData.certifications || []).map((c, i) => (
                                            <div key={i} className="space-y-2 p-3 bg-[var(--bg3)] rounded-xl border border-[var(--border)]">
                                                <div className="flex justify-between">
                                                    <span className="text-xs font-semibold text-violet-400">Cert {i + 1}</span>
                                                    <button type="button" onClick={() => update("certifications", resumeData.certifications.filter((_, k) => k !== i))} className="text-red-400/70 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                                                </div>
                                                <Field label="Title"  value={c.title}               onChange={(v) => update("certifications", resumeData.certifications.map((x, k) => k === i ? { ...x, title: v } : x))} />
                                                <Field label="Issuer" value={c.issuingOrganization} onChange={(v) => update("certifications", resumeData.certifications.map((x, k) => k === i ? { ...x, issuingOrganization: v } : x))} />
                                                <Field label="Year"   value={c.year}                onChange={(v) => update("certifications", resumeData.certifications.map((x, k) => k === i ? { ...x, year: v } : x))} />
                                            </div>
                                        ))}
                                        <button type="button"
                                            onClick={() => update("certifications", [...(resumeData.certifications || []), { title: "", issuingOrganization: "", year: "" }])}
                                            className="w-full py-2 rounded-xl border border-dashed border-[var(--border)] text-[var(--text3)] hover:text-violet-500 hover:border-violet-500/40 text-xs flex items-center justify-center gap-2 transition-all">
                                            <Plus className="h-3.5 w-3.5" /> Add Certification
                                        </button>
                                    </Accordion>

                                    <Accordion id="achievements" label="Achievements" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                        <label className="text-xs text-[var(--text2)]">One per line</label>
                                        <AutoTextarea
                                            value={(resumeData.achievements || []).map(a => typeof a === "object" ? a.title || a.description || "" : a).join("\n")}
                                            onChange={(v) => update("achievements", v.split("\n").filter(Boolean).map(s => ({ title: s.trim() })))}
                                            placeholder="Won hackathon, Published paper…"
                                            className={inputCls} />
                                    </Accordion>

                                    <Accordion id="languages" label="Languages" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                        <label className="text-xs text-[var(--text2)]">Languages (comma-separated)</label>
                                        <input type="text"
                                            value={(resumeData.languages || []).map(l => l.name || l).join(", ")}
                                            onChange={(e) => update("languages", e.target.value.split(",").map(s => ({ name: s.trim() })).filter(l => l.name))}
                                            className={inputCls} placeholder="English, Hindi, Spanish" />
                                    </Accordion>

                                    {/* Start Over */}
                                    <button onClick={() => { setResumeData(null); setAtsResult(null); setPdfFile(null); setExtractedText(""); setPastedText(""); setJobDescription(""); setTargetRole(""); setSectionOrder(DEFAULT_SECTIONS); }}
                                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[var(--bg3)] border border-[var(--border)] text-[var(--text3)] hover:text-red-500 hover:border-red-500/30 text-xs font-medium transition-all mt-2">
                                        <RotateCcw className="h-3.5 w-3.5" /> Start Over
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

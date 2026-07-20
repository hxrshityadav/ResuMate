import React, { useState, useRef, useCallback, useEffect, useLayoutEffect } from "react";
import { axiosInstance } from "../api/ResumeService";
import HarvardClassic from "../templates/HarvardClassic";
import AcademicClean from "../templates/AcademicClean";
import SidebarPro from "../templates/SidebarPro";
import TimelinePro from "../templates/TimelinePro";
import toast from "react-hot-toast";
import {
    Sparkles, LayoutTemplate, Palette, Download, Loader2, Wand2,
    Check, ZoomIn, ZoomOut, Save, ShieldCheck, ChevronDown,
    ChevronUp, Plus, Trash2, Edit3, Type, GripVertical, Maximize2,
    FileCode, AlignJustify, X,
} from "lucide-react";
import { saveResume } from "../api/resumeApi";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { createSampleResume } from "../data/sampleResume";

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

const ACCENT_PRESETS = [
    { id: "violet",  hex: "#7c3aed" },
    { id: "blue",    hex: "#0ea5e9" },
    { id: "emerald", hex: "#10b981" },
    { id: "rose",    hex: "#f43f5e" },
    { id: "amber",   hex: "#f59e0b" },
    { id: "black",   hex: "#18181b" },
];

const DEFAULT_SECTIONS = ["summary", "skills", "experience", "education", "projects", "certifications", "achievements", "languages"];
const SECTION_LABELS = {
    summary: "Professional Summary", skills: "Skills", experience: "Experience",
    education: "Education", projects: "Projects", certifications: "Certifications",
    achievements: "Achievements", languages: "Languages",
};

/* ── AutoTextarea — auto-expands to show all content ──────── */
const AutoTextarea = ({ value, onChange, placeholder = "", className = "" }) => {
    const ref = useRef(null);
    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${Math.max(el.scrollHeight, 48)}px`;
    }, [value]);
    return (
        <textarea
            ref={ref}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={className}
            style={{ overflow: "hidden", resize: "none" }}
        />
    );
};

/* ── Accordion ────────────────────────────────────────────── */
const Accordion = ({ id, label, openEdit, setOpenEdit, children }) => {
    const isOpen = openEdit === id;
    return (
        <div className="border border-white/10 rounded-2xl overflow-hidden">
            <button
                type="button"
                onClick={() => setOpenEdit(isOpen ? null : id)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white/5 hover:bg-white/10 transition-all text-sm font-semibold"
            >
                <span className="flex items-center gap-2">
                    <Edit3 className="h-3.5 w-3.5 text-violet-400" />
                    {label}
                </span>
                {isOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
            </button>
            {isOpen && <div className="p-4 space-y-3 bg-zinc-900/60 border-t border-white/10">{children}</div>}
        </div>
    );
};

/* ── Field ────────────────────────────────────────────────── */
const inputCls = "w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-3 py-2 text-sm text-[var(--text)] outline-none focus:border-violet-500/60 transition-all placeholder:text-[var(--text3)]";

const Field = ({ label, value, onChange, textarea = false, placeholder = "" }) => (
    <div className="space-y-1">
        <label className="text-xs text-zinc-400 font-medium">{label}</label>
        {textarea
            ? <AutoTextarea value={value} onChange={onChange} placeholder={placeholder} className={inputCls} />
            : <input type="text" value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={inputCls} />
        }
    </div>
);

/* ── AI Improve button ────────────────────────────────────── */
const AIBtn = ({ onClick, loading }) => (
    <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="flex items-center gap-1 px-2 py-1 rounded-lg bg-violet-500/15 border border-violet-500/30 text-violet-400 hover:bg-violet-500/25 hover:text-violet-300 text-[11px] font-semibold transition-all disabled:opacity-50"
    >
        {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
        AI Improve
    </button>
);

/* ─────────────────────────────────────────────────────────── */

function Create() {
    const resumeRef = useRef(null);

    const [prompt, setPrompt]                   = useState("");
    const [loading, setLoading]                 = useState(false);
    const [downloading, setDownloading]         = useState(false);
    const [isSaved, setIsSaved]                 = useState(false);
    const [zoom, setZoom]                       = useState(75);
    const [selectedTemplate, setSelectedTemplate] = useState("harvard");
    const [accent, setAccent]                   = useState("#7c3aed");
    const [customHex, setCustomHex]             = useState("");
    const [fontFamily, setFontFamily]           = useState("system-ui, sans-serif");
    const [fontSize, setFontSize]               = useState("md");
    const [sectionOrder, setSectionOrder]       = useState(DEFAULT_SECTIONS);
    const [openEdit, setOpenEdit]               = useState(null);
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const [autoFitMode, setAutoFitMode]         = useState(false);
    const [aiImproving, setAiImproving]         = useState(null);

    const accentKey = ACCENT_PRESETS.find(p => p.hex === accent)?.id ?? "violet";
    const baseFontPx = FONT_SIZES.find(f => f.id === fontSize)?.px ?? 15;

    const [resumeData, setResumeData] = useState(() => createSampleResume());

    /* ── panel state ── */
    const [editOpen,       setEditOpen]       = useState(true);
    const [showSectionOrder, setShowSectionOrder] = useState(false);

    /* ── close download menu / section order on outside click ── */
    useEffect(() => {
        if (!showDownloadMenu && !showSectionOrder) return;
        const handler = (e) => {
            if (!e.target.closest("#download-menu-root")) setShowDownloadMenu(false);
            if (!e.target.closest("#section-order-root")) setShowSectionOrder(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showDownloadMenu, showSectionOrder]);

    /* ── inject scoped font-size CSS into <head> ──────────── */
    const fontStyleRef = useRef(null);
    useEffect(() => {
        if (fontStyleRef.current) fontStyleRef.current.remove();
        const scale = baseFontPx / 14; // 14px = Tailwind text-sm baseline
        const s = (base) => (base * scale).toFixed(2) + "px";
        const css = `
            .rf-scale .text-xs   { font-size: ${s(12)} !important; }
            .rf-scale .text-sm   { font-size: ${s(14)} !important; }
            .rf-scale .text-base { font-size: ${s(16)} !important; }
            .rf-scale .text-lg   { font-size: ${s(18)} !important; }
            .rf-scale .text-xl   { font-size: ${s(20)} !important; }
            .rf-scale .text-2xl  { font-size: ${s(24)} !important; }
            .rf-scale .text-3xl  { font-size: ${s(30)} !important; }
            .rf-scale .text-4xl  { font-size: ${s(36)} !important; }
        `;
        const el = document.createElement("style");
        el.setAttribute("data-rf-scale", "1");
        el.textContent = css;
        document.head.appendChild(el);
        fontStyleRef.current = el;
        return () => { el.remove(); };
    }, [baseFontPx]);

    /* ── update helper ────────────────────────────────────── */
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

    /* ── AI improve section ───────────────────────────────── */
    const handleAIImprove = async (key, sectionType, content, onResult) => {
        setAiImproving(key);
        const toastId = toast.loading("✨ AI improving…");
        try {
            const res = await axiosInstance.post("/resume/improve-section", {
                sectionType,
                content: typeof content === "string" ? content : JSON.stringify(content),
            });
            const data = res?.improved !== undefined ? res : (res?.data || res);
            if (data?.error) {
                throw new Error(data.error);
            }
            onResult(data);
            toast.success("✨ Improved!", { id: toastId });
        } catch (err) {
            console.error(err);
            let msg = "AI improve failed. Try again in a moment.";
            if (err?.response?.status === 404 || err?.code === "ERR_NETWORK") {
                msg = "Cannot reach backend — make sure Spring Boot is running on port 8080.";
            } else if (err?.response?.status === 503 || (err.message && err.message.includes("503"))) {
                msg = "The AI service is temporarily busy. Please wait a few seconds and try again.";
            } else if (err.message && err.message.includes("429")) {
                msg = "The AI request limit was reached. Please wait a minute and try again.";
            } else if (err.message) {
                msg = err.message.length > 120 ? err.message.substring(0, 120) + "…" : err.message;
            }
            toast.error(msg, { id: toastId, duration: 6000 });
        } finally {
            setAiImproving(null);
        }
    };

    /* ── drag-to-reorder sections ─────────────────────────── */
    const dragSrc  = useRef(null);
    const dragOver = useRef(null);

    const handleDragStart = useCallback((idx) => { dragSrc.current = idx; }, []);
    const handleDragEnter = useCallback((idx) => {
        dragOver.current = idx;
        setSectionOrder((prev) => {
            if (dragSrc.current === null || dragSrc.current === idx) return prev;
            const next = [...prev];
            const [moved] = next.splice(dragSrc.current, 1);
            next.splice(idx, 0, moved);
            dragSrc.current = idx;
            return next;
        });
    }, []);
    const handleDragEnd = useCallback(() => { dragSrc.current = null; dragOver.current = null; }, []);

    /* ── generate ─────────────────────────────────────────── */
    const handleGenerate = async () => {
        if (!prompt.trim()) { toast.error("Please describe yourself first."); return; }
        try {
            setLoading(true);
            toast.loading("Generating your resume…");
            const res = await axiosInstance.post("/resume/generate", { userDescription: prompt });
            const data = res?.personalInformation ? res : (res?.data || res);
            const safeSkills = Array.isArray(data.skills)
                ? data.skills.map((item) => (typeof item === "object" ? item.title || item.name || "" : String(item)))
                : [];
            setResumeData({
                name: data.personalInformation?.fullName || data.personalInformation?.name || data.name || "Your Name",
                role: data.role || data.personalInformation?.role || "Software Engineer",
                location: data.personalInformation?.location || data.location || "India",
                phone: data.personalInformation?.phoneNumber || data.personalInformation?.phone || data.phone || "",
                email: data.personalInformation?.email || data.email || "",
                linkedIn: data.personalInformation?.linkedIn || "",
                gitHub: data.personalInformation?.gitHub || "",
                summary: data.summary || "",
                education: data.education || { degree: "B.Tech Computer Science", college: "Your University", year: "2026" },
                skills: safeSkills,
                experience: Array.isArray(data.experience) ? data.experience : [],
                certifications: Array.isArray(data.certifications) ? data.certifications : [],
                projects: Array.isArray(data.projects) ? data.projects : [],
                achievements: Array.isArray(data.achievements) ? data.achievements : [],
                languages: Array.isArray(data.languages) ? data.languages : [],
            });
            setIsSaved(false);
            setAutoFitMode(false);
            toast.dismiss();
            toast.success("Resume generated!");
        } catch (error) {
            console.error(error);
            toast.dismiss();
            toast.error("Failed to generate. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    /* ── save ─────────────────────────────────────────────── */
    const handleSave = async () => {
        try {
            await saveResume(resumeData);
            setIsSaved(true);
            toast.success("Resume saved!");
        } catch (err) {
            toast.error(err.message || "Failed to save.");
        }
    };

    /* ── auto adjust ──────────────────────────────────────── */
    const handleAutoAdjust = () => {
        setAutoFitMode((v) => {
            if (!v) { toast.success("Auto Adjust ON — PDF will fit to 1 page."); return true; }
            toast("Auto Adjust OFF."); return false;
        });
    };

    /* ── PDF download ─────────────────────────────────────── */
    const handleDownloadPDF = async () => {
        if (!resumeRef.current) return;
        setDownloading(true);
        setShowDownloadMenu(false);
        const toastId = toast.loading("Generating PDF…");
        try {
            const dataUrl = await toPng(resumeRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: "#ffffff" });
            const img = new Image();
            img.src = dataUrl;
            await new Promise((res) => { img.onload = res; });
            const pdfW = 210, pdfH = 297;
            const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
            if (autoFitMode) {
                pdf.addImage(dataUrl, "PNG", 0, 0, pdfW, pdfH);
                toast.success("Downloaded (1 page, auto adjusted)!", { id: toastId });
            } else {
                const scaledH = (img.naturalHeight / img.naturalWidth) * pdfW;
                const pageCount = Math.ceil(scaledH / pdfH);
                for (let i = 0; i < pageCount; i++) {
                    if (i > 0) pdf.addPage();
                    pdf.addImage(dataUrl, "PNG", 0, -i * pdfH, pdfW, scaledH);
                }
                toast.success(`Downloaded (${pageCount} page${pageCount > 1 ? "s" : ""})!`, { id: toastId });
            }
            pdf.save(`${resumeData.name || "Resume"}_Resume.pdf`);
        } catch (err) {
            console.error(err);
            toast.error("PDF download failed.", { id: toastId });
        } finally {
            setDownloading(false);
        }
    };

    /* ── DOCX download ────────────────────────────────────── */
    const handleDownloadDOCX = async () => {
        setShowDownloadMenu(false);
        const toastId = toast.loading("Generating DOCX…");
        try {
            const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = await import("docx");
            const edu = Array.isArray(resumeData.education) ? resumeData.education[0] : resumeData.education;
            const children = [];
            children.push(new Paragraph({ text: resumeData.name, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }));
            children.push(new Paragraph({ children: [new TextRun({ text: resumeData.role, color: "7c3aed", bold: true })], alignment: AlignmentType.CENTER }));
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
                children.push(new Paragraph({ children: [new TextRun({ text: edu.degree, bold: true }), new TextRun(`  —  ${edu.college || edu.university || ""}  (${edu.year || ""})`)] }));
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
            a.href = url; a.download = `${resumeData.name || "Resume"}_Resume.docx`;
            a.click(); URL.revokeObjectURL(url);
            toast.success("DOCX downloaded!", { id: toastId });
        } catch (err) {
            console.error(err);
            toast.error("DOCX download failed.", { id: toastId });
        }
    };

    /* ── Markdown download ────────────────────────────────── */
    const handleDownloadMD = () => {
        setShowDownloadMenu(false);
        const edu = Array.isArray(resumeData.education) ? resumeData.education[0] : resumeData.education;
        let md = `# ${resumeData.name}\n**${resumeData.role}**\n\n`;
        const contact = [resumeData.location, resumeData.email, resumeData.phone, resumeData.linkedIn].filter(Boolean);
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
        if (edu) md += `## Education\n**${edu.degree}** — ${edu.college || edu.university || ""} (${edu.year || ""})\n\n`;
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
        a.href = url; a.download = `${resumeData.name || "Resume"}_Resume.md`;
        a.click(); URL.revokeObjectURL(url);
        toast.success("Markdown downloaded!");
    };

    /* ── templates ────────────────────────────────────────── */
    const templates = [
        { id: "harvard",  name: "Harvard",     desc: "Traditional" },
        { id: "academic", name: "Academic",    desc: "Academic style" },
        { id: "sidebar",  name: "Sidebar Pro", desc: "Dark sidebar" },
        { id: "timeline", name: "Timeline",    desc: "With timeline" },
    ];

    const renderTemplate = () => {
        const props = { data: resumeData, accent: accentKey, accentHex: accent, sectionOrder, fontFamily };
        const templateMap = {
            harvard:  <HarvardClassic {...props} />,
            academic: <AcademicClean {...props} />,
            sidebar:  <SidebarPro {...props} />,
            timeline: <TimelinePro {...props} />,
        };
        return (
            <div className="rf-scale">
                {templateMap[selectedTemplate] || templateMap.harvard}
            </div>
        );
    };

    /* ── education helpers ────────────────────────────────── */
    const eduList = Array.isArray(resumeData.education)
        ? resumeData.education
        : resumeData.education ? [resumeData.education] : [];

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

    /* ─────────────────────────────────────────────────────── */
    return (
        <div className="h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col overflow-hidden transition-colors duration-300" style={{ paddingTop: "88px" }}>

            {/* ══ TOP HEADER BAR ══════════════════════════════════════ */}
            <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg2)] px-5 py-3 flex items-center justify-between gap-4 z-30">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow shadow-violet-500/30">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h1 className="resumate-page-title text-[var(--text)] text-xl leading-tight">AI Resume Builder</h1>
                        <p className="text-[11px] text-zinc-500">Generate, edit and download your resume</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleSave}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                            isSaved
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                : "bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-white hover:border-white/20"
                        }`}>
                        {isSaved ? <><Check className="h-3.5 w-3.5" />Saved</> : <><Save className="h-3.5 w-3.5" />Save</>}
                    </button>
                    <div className="relative" id="download-menu-root">
                        <button onClick={() => setShowDownloadMenu(v => !v)} disabled={downloading}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all disabled:opacity-60 shadow shadow-violet-500/25">
                            {downloading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
                            Download
                            <ChevronDown className="h-3 w-3 opacity-70" />
                        </button>
                        {showDownloadMenu && (
                            <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-white/15 bg-zinc-900 shadow-2xl shadow-black/60 z-50 overflow-hidden">
                                <button onClick={handleDownloadPDF} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-white/8 transition-all text-sm">
                                    <span className="text-red-400">📄</span><span>PDF</span>
                                    {autoFitMode && <span className="ml-auto text-[10px] text-emerald-400 font-medium">1-page</span>}
                                </button>
                                <div className="h-px bg-white/8" />
                                <button onClick={handleDownloadDOCX} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-white/8 transition-all text-sm">
                                    <FileCode className="h-4 w-4 text-blue-400" /><span>Word (.docx)</span>
                                </button>
                                <div className="h-px bg-white/8" />
                                <button onClick={handleDownloadMD} className="w-full flex items-center gap-2.5 px-4 py-3 hover:bg-white/8 transition-all text-sm">
                                    <AlignJustify className="h-4 w-4 text-green-400" /><span>Markdown (.md)</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ══ BODY ════════════════════════════════════════════════ */}
            <div className="flex flex-1 overflow-hidden">

                {/* ── LEFT — AI Prompt ── */}
                <div className="w-[270px] shrink-0 border-r border-white/[0.06] bg-[#0c0c14] flex flex-col overflow-y-auto">
                    <div className="p-4 flex-1 flex flex-col gap-4">

                        {/* AI Generate */}
                        <div>
                            <div className="flex items-center gap-2 mb-2.5">
                                <div className="h-6 w-6 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                                    <Sparkles className="h-3.5 w-3.5 text-violet-400" />
                                </div>
                                <h2 className="font-bold text-sm">AI Builder</h2>
                            </div>
                            <textarea rows={7} value={prompt} onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe yourself… e.g. Java developer, 2 years experience in Spring Boot and React, built 3 SaaS products…"
                                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] p-3 resize-none outline-none text-xs text-zinc-300 focus:border-violet-500/40 transition-all placeholder:text-zinc-600 leading-relaxed" />
                            <button onClick={handleGenerate} disabled={loading || !prompt.trim()}
                                className="w-full mt-2.5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow shadow-violet-500/20">
                                {loading ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Generating…</> : <><Sparkles className="h-3.5 w-3.5" />Generate Resume</>}
                            </button>
                        </div>

                        <div className="h-px bg-white/[0.04]" />

                        {/* Quick tip */}
                        <div className="rounded-xl border border-violet-500/15 bg-violet-500/[0.05] p-3">
                            <p className="text-[11px] text-violet-300 font-semibold mb-1.5 flex items-center gap-1.5">
                                <Sparkles className="h-3 w-3" /> Tips
                            </p>
                            <ul className="space-y-1 text-[10px] text-zinc-500 leading-relaxed">
                                <li>• Include your tech stack and years of experience</li>
                                <li>• Mention key projects you've built</li>
                                <li>• Add education and any certifications</li>
                                <li>• Edit each section in the right panel after generating</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* ── CENTER — Style Toolbar + Preview ── */}
                <div className="flex-1 flex flex-col overflow-hidden">

                    {/* Style Toolbar */}
                    <div className="shrink-0 border-b border-white/[0.06] bg-[#0a0a12] px-3 py-2 flex items-center gap-2 flex-wrap">

                        {/* Template */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider shrink-0">Template</span>
                            <div className="flex gap-1">
                                {templates.map((t) => (
                                    <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                                            selectedTemplate === t.id
                                                ? "bg-violet-500/25 border border-violet-500/50 text-violet-300"
                                                : "bg-white/[0.04] border border-white/[0.06] text-zinc-500 hover:text-white hover:border-white/10"
                                        }`}>
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-5 w-px bg-white/[0.08] shrink-0" />

                        {/* Font */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider shrink-0">Font</span>
                            <select value={fontFamily} onChange={(e) => setFontFamily(e.target.value)}
                                className="bg-white/[0.04] border border-white/[0.06] rounded-lg px-2 py-1 text-[11px] text-zinc-300 outline-none focus:border-violet-500/50 cursor-pointer transition-all hover:border-white/10"
                                style={{ fontFamily }}>
                                {FONTS.map(f => <option key={f.id} value={f.value} style={{ fontFamily: f.value }}>{f.label}</option>)}
                            </select>
                            <div className="flex gap-0.5">
                                {FONT_SIZES.map((s) => (
                                    <button key={s.id} onClick={() => setFontSize(s.id)} title={s.title}
                                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-all border ${
                                            fontSize === s.id
                                                ? "bg-violet-500/25 border-violet-500/50 text-violet-300"
                                                : "bg-white/[0.04] border-white/[0.06] text-zinc-500 hover:text-white hover:border-white/10"
                                        }`}>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-5 w-px bg-white/[0.08] shrink-0" />

                        {/* Accent Color */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-zinc-600 font-semibold uppercase tracking-wider shrink-0">Color</span>
                            <div className="flex items-center gap-1">
                                {ACCENT_PRESETS.map(({ id, hex }) => (
                                    <button key={id} onClick={() => { setAccent(hex); setCustomHex(""); }}
                                        style={{ background: hex }}
                                        className={`h-5 w-5 rounded-md border-2 transition-all shrink-0 ${accent === hex && !customHex ? "border-white scale-110" : "border-transparent hover:scale-110"}`}
                                        title={id} />
                                ))}
                                <label className="h-5 w-5 rounded-md border-2 border-white/20 overflow-hidden cursor-pointer hover:border-white/50 transition-all shrink-0 relative" title="Custom color">
                                    <input type="color" value={accent} onChange={(e) => { setAccent(e.target.value); setCustomHex(e.target.value); }}
                                        className="absolute opacity-0 inset-0 w-full h-full cursor-pointer" />
                                    <div className="h-full w-full" style={{ background: "conic-gradient(red,yellow,lime,cyan,blue,magenta,red)" }} />
                                </label>
                                {customHex && (
                                    <>
                                        <span className="text-[10px] font-mono text-zinc-400 uppercase">{accent}</span>
                                        <button type="button" onClick={() => { setCustomHex(""); setAccent("#7c3aed"); }}
                                            className="text-zinc-600 hover:text-white transition-colors">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="h-5 w-px bg-white/[0.08] shrink-0" />

                        {/* Section Order popover */}
                        <div className="relative shrink-0" id="section-order-root">
                            <button onClick={() => setShowSectionOrder(v => !v)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all ${
                                    showSectionOrder
                                        ? "bg-violet-500/20 border-violet-500/40 text-violet-300"
                                        : "bg-white/[0.04] border-white/[0.06] text-zinc-500 hover:text-white hover:border-white/10"
                                }`}>
                                <GripVertical className="h-3 w-3" />
                                Sections
                                <ChevronDown className={`h-3 w-3 transition-transform ${showSectionOrder ? "rotate-180" : ""}`} />
                            </button>
                            {showSectionOrder && (
                                <div className="absolute top-full mt-1.5 left-0 z-50 w-52 rounded-xl border border-white/10 bg-[#12121e] shadow-2xl shadow-black/60 p-2 space-y-1 select-none">
                                    <p className="text-[10px] text-zinc-600 px-1 pb-1">Drag to reorder resume sections</p>
                                    {sectionOrder.map((sec, idx) => (
                                        <div key={sec} draggable
                                            onDragStart={() => handleDragStart(idx)}
                                            onDragEnter={() => handleDragEnter(idx)}
                                            onDragEnd={handleDragEnd}
                                            onDragOver={(e) => e.preventDefault()}
                                            className="flex items-center gap-2 rounded-lg px-2.5 py-2 border border-white/[0.06] bg-white/[0.03] hover:bg-white/[0.07] cursor-grab active:cursor-grabbing transition-all">
                                            <GripVertical className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
                                            <span className="flex-1 text-xs font-medium text-zinc-300">{SECTION_LABELS[sec]}</span>
                                            <span className="text-[10px] text-zinc-700 font-mono">{idx + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="h-5 w-px bg-white/[0.08] shrink-0" />

                        {/* Auto Adjust */}
                        <button onClick={handleAutoAdjust}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-all shrink-0 ${
                                autoFitMode
                                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
                                    : "bg-white/[0.04] border-white/[0.06] text-zinc-500 hover:text-white hover:border-white/10"
                            }`}>
                            <Maximize2 className="h-3 w-3" />
                            Auto Adjust
                            {autoFitMode && <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold">ON</span>}
                        </button>

                        {/* Spacer */}
                        <div className="flex-1 min-w-0" />

                        {/* Zoom */}
                        <div className="flex items-center gap-1 shrink-0">
                            <button onClick={() => setZoom(Math.max(40, zoom - 10))}
                                className="h-6 w-6 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white text-sm transition-all">−</button>
                            <span className="text-xs text-zinc-500 w-10 text-center font-mono">{zoom}%</span>
                            <button onClick={() => setZoom(Math.min(130, zoom + 10))}
                                className="h-6 w-6 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white text-sm transition-all">+</button>
                        </div>
                    </div>

                    {/* Resume Preview */}
                    <div className="flex-1 bg-zinc-950/50 overflow-auto">
                        <div className="p-6" style={{ transform: `scale(${zoom / 100})`, transformOrigin: "top center", transition: "transform 0.2s ease" }}>
                            {renderTemplate()}
                        </div>
                    </div>
                </div>

                {/* ── RIGHT — Edit + ATS ── */}
                <div className="w-[340px] shrink-0 border-l border-white/[0.06] bg-[#0c0c14] overflow-y-auto flex flex-col">

                    {/* ── Edit Resume Section ── */}
                    <div className="border-b border-white/[0.06]">
                        <button onClick={() => setEditOpen(v => !v)}
                            className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-white/[0.02] transition-all">
                            <div className="flex items-center gap-2.5">
                                <div className="h-7 w-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                                    <Edit3 className="h-3.5 w-3.5 text-violet-400" />
                                </div>
                                <span className="text-sm font-bold text-[var(--text)]">Edit Resume</span>
                                <span className="text-[10px] text-zinc-600">section by section</span>
                            </div>
                            {editOpen ? <ChevronUp className="h-4 w-4 text-zinc-600" /> : <ChevronDown className="h-4 w-4 text-zinc-600" />}
                        </button>

                        {editOpen && (
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
                                        <label className="text-xs text-zinc-400 font-medium">Professional Summary</label>
                                        <AIBtn loading={aiImproving === "summary"}
                                            onClick={() => handleAIImprove("summary", "summary", resumeData.summary, (d) => {
                                                if (d.improved) update("summary", d.improved);
                                            })} />
                                    </div>
                                    <AutoTextarea value={resumeData.summary} onChange={(v) => update("summary", v)}
                                        placeholder="Professional summary…" className={inputCls} />
                                </Accordion>

                                <Accordion id="skills" label="Skills" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                    <label className="text-xs text-zinc-400">Skills (comma-separated)</label>
                                    <AutoTextarea
                                        value={resumeData.skills.map((s) => (typeof s === "object" ? s.title || s.name : s)).join(", ")}
                                        onChange={(v) => update("skills", v.split(",").map((s) => s.trim()).filter(Boolean))}
                                        className={inputCls} />
                                </Accordion>

                                <Accordion id="experience" label="Experience" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                    {resumeData.experience.map((exp, i) => (
                                        <div key={i} className="space-y-2 p-3 bg-zinc-800/60 rounded-xl border border-white/10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-violet-400">Entry {i + 1}</span>
                                                <div className="flex items-center gap-2">
                                                    <AIBtn loading={aiImproving === `exp-${i}`}
                                                        onClick={() => {
                                                            const expIdx = i;
                                                            handleAIImprove(`exp-${expIdx}`, "experience", { title: exp.title, company: exp.company, time: exp.time, points: exp.points }, (d) => {
                                                                if (d.bullets?.length) setResumeData(prev => ({ ...prev, experience: prev.experience.map((e, idx) => idx === expIdx ? { ...e, points: d.bullets } : e) }));
                                                            });
                                                        }} />
                                                    <button type="button" onClick={() => update("experience", resumeData.experience.filter((_, idx) => idx !== i))} className="text-red-400/70 hover:text-red-400">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <Field label="Job Title" value={exp.title}   onChange={(v) => update("experience", resumeData.experience.map((e, idx) => idx === i ? { ...e, title: v } : e))} />
                                            <Field label="Company"   value={exp.company} onChange={(v) => update("experience", resumeData.experience.map((e, idx) => idx === i ? { ...e, company: v } : e))} />
                                            <Field label="Duration"  value={exp.time}    onChange={(v) => update("experience", resumeData.experience.map((e, idx) => idx === i ? { ...e, time: v } : e))} placeholder="Jan 2024 - Present" />
                                            <div className="space-y-1">
                                                <label className="text-xs text-zinc-400">Bullet Points (one per line)</label>
                                                <AutoTextarea value={(exp.points || []).join("\n")}
                                                    onChange={(v) => update("experience", resumeData.experience.map((ex, idx) => idx === i ? { ...ex, points: v.split("\n").filter(Boolean) } : ex))}
                                                    className={inputCls} />
                                            </div>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => update("experience", [...resumeData.experience, { title: "", company: "", time: "", points: [] }])}
                                        className="w-full py-2 rounded-xl border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 text-xs flex items-center justify-center gap-2 transition-all">
                                        <Plus className="h-3.5 w-3.5" /> Add Experience
                                    </button>
                                </Accordion>

                                <Accordion id="education" label="Education" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                    {eduList.map((e, i) => (
                                        <div key={i} className="space-y-2 p-3 bg-zinc-800/60 rounded-xl border border-white/10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-violet-400">Entry {i + 1}</span>
                                                {eduList.length > 1 && (
                                                    <button type="button" onClick={() => removeEdu(i)} className="text-red-400/70 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                                                )}
                                            </div>
                                            <Field label="Degree"               value={e.degree}                   onChange={(v) => updateEdu(i, "degree", v)} />
                                            <Field label="College / University" value={e.college || e.university}  onChange={(v) => updateEdu(i, "college", v)} />
                                            <Field label="Graduation Year"      value={e.year || e.graduationYear} onChange={(v) => updateEdu(i, "year", v)} />
                                        </div>
                                    ))}
                                    <button type="button" onClick={addEdu}
                                        className="w-full py-2 rounded-xl border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 text-xs flex items-center justify-center gap-2 transition-all">
                                        <Plus className="h-3.5 w-3.5" /> Add Education
                                    </button>
                                </Accordion>

                                <Accordion id="projects" label="Projects" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                    {resumeData.projects?.map((p, i) => (
                                        <div key={i} className="space-y-2 p-3 bg-zinc-800/60 rounded-xl border border-white/10">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-violet-400">Project {i + 1}</span>
                                                <div className="flex items-center gap-2">
                                                    <AIBtn loading={aiImproving === `proj-${i}`}
                                                        onClick={() => {
                                                            const projIdx = i;
                                                            handleAIImprove(`proj-${projIdx}`, "project", { title: p.title, description: p.description, technologiesUsed: p.technologiesUsed }, (d) => {
                                                                if (d.bullets?.length) setResumeData(prev => ({ ...prev, projects: prev.projects.map((x, idx) => idx === projIdx ? { ...x, description: d.bullets.join("\n") } : x) }));
                                                            });
                                                        }} />
                                                    <button type="button" onClick={() => update("projects", resumeData.projects.filter((_, idx) => idx !== i))} className="text-red-400/70 hover:text-red-400">
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                            <Field label="Title" value={p.title} onChange={(v) => update("projects", resumeData.projects.map((x, idx) => idx === i ? { ...x, title: v } : x))} />
                                            <div className="space-y-1">
                                                <label className="text-xs text-zinc-400">Description</label>
                                                <AutoTextarea value={p.description || ""} placeholder="Describe your project…"
                                                    onChange={(v) => update("projects", resumeData.projects.map((x, idx) => idx === i ? { ...x, description: v } : x))}
                                                    className={inputCls} />
                                            </div>
                                            <Field label="Technologies (comma-separated)"
                                                value={(p.technologiesUsed || []).join(", ")}
                                                onChange={(v) => update("projects", resumeData.projects.map((x, idx) => idx === i ? { ...x, technologiesUsed: v.split(",").map((s) => s.trim()).filter(Boolean) } : x))} />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => update("projects", [...(resumeData.projects || []), { title: "", description: "", technologiesUsed: [] }])}
                                        className="w-full py-2 rounded-xl border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 text-xs flex items-center justify-center gap-2 transition-all">
                                        <Plus className="h-3.5 w-3.5" /> Add Project
                                    </button>
                                </Accordion>

                                <Accordion id="certifications" label="Certifications" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                    {resumeData.certifications?.map((c, i) => (
                                        <div key={i} className="space-y-2 p-3 bg-zinc-800/60 rounded-xl border border-white/10">
                                            <div className="flex justify-between">
                                                <span className="text-xs font-semibold text-violet-400">Cert {i + 1}</span>
                                                <button type="button" onClick={() => update("certifications", resumeData.certifications.filter((_, idx) => idx !== i))} className="text-red-400/70 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                                            </div>
                                            <Field label="Title"  value={c.title}               onChange={(v) => update("certifications", resumeData.certifications.map((x, idx) => idx === i ? { ...x, title: v } : x))} />
                                            <Field label="Issuer" value={c.issuingOrganization} onChange={(v) => update("certifications", resumeData.certifications.map((x, idx) => idx === i ? { ...x, issuingOrganization: v } : x))} />
                                            <Field label="Year"   value={c.year}                onChange={(v) => update("certifications", resumeData.certifications.map((x, idx) => idx === i ? { ...x, year: v } : x))} />
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => update("certifications", [...(resumeData.certifications || []), { title: "", issuingOrganization: "", year: "" }])}
                                        className="w-full py-2 rounded-xl border border-dashed border-white/20 text-zinc-400 hover:text-white hover:border-white/40 text-xs flex items-center justify-center gap-2 transition-all">
                                        <Plus className="h-3.5 w-3.5" /> Add Certification
                                    </button>
                                </Accordion>

                                <Accordion id="languages" label="Languages" openEdit={openEdit} setOpenEdit={setOpenEdit}>
                                    <label className="text-xs text-zinc-400">Languages (comma-separated)</label>
                                    <input type="text"
                                        value={(resumeData.languages || []).map((l) => l.name || l).join(", ")}
                                        onChange={(e) => update("languages", e.target.value.split(",").map((s) => ({ name: s.trim() })).filter((l) => l.name))}
                                        className={inputCls} placeholder="English, Hindi, Spanish" />
                                </Accordion>
                            </div>
                        )}
                    </div>

                </div>
            </div>

            {/* Hidden ref for PDF export */}
            <div style={{ position: "fixed", left: "-9999px", top: 0, zIndex: -1, pointerEvents: "none" }} aria-hidden="true">
                <div ref={resumeRef}>{renderTemplate()}</div>
            </div>
        </div>
    );
}

export default Create;

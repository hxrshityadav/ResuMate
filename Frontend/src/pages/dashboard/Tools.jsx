import React, { useState } from "react";
import {
    Sparkles,
    FileSearch,
    Wand2,
    Target,
    Briefcase,
    Copy,
    CheckCircle2,
    ArrowRight
} from "lucide-react";

function Tools() {
    const [activeTool, setActiveTool] =
        useState("ats");

    const [input, setInput] =
        useState("");

    const [copied, setCopied] =
        useState(false);

    const tools = [
        {
            id: "ats",
            title: "ATS Score Checker",
            icon: FileSearch,
            desc: "Analyze your resume for recruiter systems."
        },
        {
            id: "rewrite",
            title: "Bullet Rewriter",
            icon: Wand2,
            desc: "Transform weak points into impact bullets."
        },
        {
            id: "summary",
            title: "Summary Generator",
            icon: Sparkles,
            desc: "Generate a strong professional summary."
        },
        {
            id: "match",
            title: "Job Match Analyzer",
            icon: Target,
            desc: "Compare resume with job description."
        },
        {
            id: "interview",
            title: "Interview Questions",
            icon: Briefcase,
            desc: "Generate role-based interview questions."
        }
    ];

    const getOutput = () => {
        if (activeTool === "ats") {
            return {
                title: "ATS Analysis",
                score: "92%",
                lines: [
                    "Strong keyword relevance",
                    "Readable formatting",
                    "Projects section effective",
                    "Add more quantified achievements"
                ]
            };
        }

        if (activeTool === "rewrite") {
            return {
                title: "Rewritten Bullet",
                score: "Improved",
                lines: [
                    "Developed responsive full-stack web application using React and Spring Boot, improving user experience and scalability."
                ]
            };
        }

        if (activeTool === "summary") {
            return {
                title: "Professional Summary",
                score: "Ready",
                lines: [
                    "Results-driven Computer Science student skilled in Java, Spring Boot, React and backend systems, focused on building scalable products."
                ]
            };
        }

        if (activeTool === "match") {
            return {
                title: "Job Match Result",
                score: "87%",
                lines: [
                    "Strong Java match",
                    "Good React relevance",
                    "Add Docker keyword",
                    "Mention REST API projects"
                ]
            };
        }

        return {
            title: "Interview Prep",
            score: "Generated",
            lines: [
                "Explain Spring Boot dependency injection.",
                "Difference between HashMap and HashSet.",
                "How REST APIs work?",
                "What is React Virtual DOM?"
            ]
        };
    };

    const output = getOutput();

    const copyText = async () => {
        const text =
            output.lines.join("\n");

        await navigator.clipboard.writeText(
            text
        );

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    return (
        <div className="space-y-8">

            {/* HERO */}
            <section className="rounded-3xl border bg-gradient-to-r from-primary/15 via-card to-secondary/10 p-8 shadow-soft">
                <div className="grid lg:grid-cols-2 gap-8 items-center">

                    <div>
                        <p className="text-sm font-semibold text-primary mb-3">
                            ResuMate AI Lab
                        </p>

                        <h1 className="text-4xl font-bold leading-tight">
                            Smart Tools to Boost
                            Your Career Faster
                        </h1>

                        <p className="text-muted-foreground mt-4 max-w-xl">
                            Improve resumes, optimize ATS score,
                            generate summaries and prepare
                            for interviews using AI.
                        </p>

                        <button className="mt-6 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center gap-2">
                            Try AI Tools
                            <ArrowRight className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="rounded-3xl bg-card border p-5">
                            <p className="text-sm text-muted-foreground">
                                Tools Available
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                5
                            </p>
                        </div>

                        <div className="rounded-3xl bg-card border p-5">
                            <p className="text-sm text-muted-foreground">
                                Avg ATS Boost
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                +27%
                            </p>
                        </div>

                        <div className="rounded-3xl bg-card border p-5">
                            <p className="text-sm text-muted-foreground">
                                Users Helped
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                500+
                            </p>
                        </div>

                        <div className="rounded-3xl bg-card border p-5">
                            <p className="text-sm text-muted-foreground">
                                AI Accuracy
                            </p>

                            <p className="text-3xl font-bold mt-2">
                                94%
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* MAIN GRID */}
            <section className="grid lg:grid-cols-3 gap-8">

                {/* LEFT TOOLS */}
                <div className="space-y-4">

                    {tools.map((tool) => {
                        const Icon = tool.icon;

                        return (
                            <button
                                key={tool.id}
                                onClick={() =>
                                    setActiveTool(
                                        tool.id
                                    )
                                }
                                className={`w-full text-left rounded-3xl border p-5 transition ${
                                    activeTool ===
                                    tool.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-card hover:bg-muted"
                                }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="h-11 w-11 rounded-2xl bg-background/20 flex items-center justify-center">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <p className="font-semibold">
                                            {tool.title}
                                        </p>

                                        <p className="text-sm opacity-80 mt-1">
                                            {tool.desc}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                </div>

                {/* RIGHT PANEL */}
                <div className="lg:col-span-2 rounded-3xl border bg-card p-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

                        <div>
                            <h2 className="text-2xl font-bold">
                                {output.title}
                            </h2>

                            <p className="text-muted-foreground mt-1">
                                Paste your content and improve it instantly.
                            </p>
                        </div>

                        <div className="px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold">
                            {output.score}
                        </div>

                    </div>

                    {/* INPUT */}
                    <textarea
                        rows="8"
                        value={input}
                        onChange={(e) =>
                            setInput(
                                e.target.value
                            )
                        }
                        placeholder="Paste resume text, bullet points, job description..."
                        className="w-full rounded-3xl border bg-background p-5 outline-none resize-none"
                    />

                    {/* ACTIONS */}
                    <div className="flex flex-wrap gap-3 mt-5">

                        <button className="px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-medium">
                            Generate Output
                        </button>

                        <button
                            onClick={copyText}
                            className="px-6 py-3 rounded-2xl border bg-background font-medium flex items-center gap-2"
                        >
                            {copied ? (
                                <>
                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                    Copied
                                </>
                            ) : (
                                <>
                                    <Copy className="h-4 w-4" />
                                    Copy Result
                                </>
                            )}
                        </button>

                    </div>

                    {/* OUTPUT */}
                    <div className="mt-8 rounded-3xl bg-muted p-6">
                        <p className="font-semibold mb-4">
                            AI Output
                        </p>

                        <div className="space-y-3 text-sm">
                            {output.lines.map(
                                (
                                    line,
                                    index
                                ) => (
                                    <div
                                        key={index}
                                        className="flex gap-3"
                                    >
                    <span className="text-primary font-bold">
                      •
                    </span>

                                        <p>
                                            {line}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                </div>

            </section>
        </div>
    );
}

export default Tools;
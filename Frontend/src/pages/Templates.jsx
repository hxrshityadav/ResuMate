import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Sparkles,
    Check,
    Eye,
    FileText,
    ArrowRight,
    Crown,
} from "lucide-react";

function Templates() {
    const [selected, setSelected] = useState("modern");

    const templates = [
        {
            id: "modern",
            name: "Modern",
            tag: "Most Popular",
            premium: false,
            desc: "Clean ATS-friendly layout for software roles.",
            accent: "from-violet-500 to-purple-600",
        },
        {
            id: "classic",
            name: "Classic",
            tag: "Corporate",
            premium: false,
            desc: "Traditional structure for enterprise hiring.",
            accent: "from-sky-500 to-cyan-500",
        },
        {
            id: "minimal",
            name: "Minimal",
            tag: "Simple",
            premium: false,
            desc: "Elegant whitespace-focused clean design.",
            accent: "from-emerald-500 to-green-600",
        },
        {
            id: "tech",
            name: "Tech",
            tag: "Developer",
            premium: true,
            desc: "Perfect for engineers, startups and builders.",
            accent: "from-pink-500 to-rose-600",
        },
        {
            id: "executive",
            name: "Executive",
            tag: "Leadership",
            premium: true,
            desc: "Premium style for senior professionals.",
            accent: "from-amber-500 to-orange-600",
        },
        {
            id: "creative",
            name: "Creative",
            tag: "Designers",
            premium: true,
            desc: "Bold visual hierarchy for creative talent.",
            accent: "from-indigo-500 to-blue-600",
        },
    ];

    const selectedTemplate = templates.find(
        (item) => item.id === selected
    );

    const MiniResume = ({ accent }) => (
        <div className="rounded-2xl border border-white/10 bg-zinc-950 p-4 h-72 overflow-hidden">
            <div
                className={`h-2 w-20 rounded-full bg-gradient-to-r ${accent}`}
            />
            <div className="mt-4 space-y-3">
                <div className="h-5 w-40 rounded bg-white/10" />
                <div className="h-3 w-28 rounded bg-white/5" />

                <div className="pt-3 space-y-2">
                    <div className="h-2 w-20 rounded bg-white/10" />
                    <div className="h-2 w-full rounded bg-white/5" />
                    <div className="h-2 w-5/6 rounded bg-white/5" />
                </div>

                <div className="pt-3 space-y-2">
                    <div className="h-2 w-24 rounded bg-white/10" />
                    <div className="h-2 w-full rounded bg-white/5" />
                    <div className="h-2 w-4/5 rounded bg-white/5" />
                </div>

                <div className="pt-3 grid grid-cols-2 gap-2">
                    <div className="h-10 rounded bg-white/5" />
                    <div className="h-10 rounded bg-white/5" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            {/* HERO */}
            <section className="border-b border-white/10">
                <div className="max-w-7xl mx-auto px-5 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">

                    <div>
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-300">
                            <Sparkles className="h-4 w-4 text-violet-400" />
                            Premium Resume Templates
                        </div>

                        <h1 className="mt-6 text-5xl lg:text-6xl font-bold leading-tight">
                            Choose a Template
                            <span className="block bg-gradient-to-r from-violet-400 to-purple-500 bg-clip-text text-transparent">
                That Gets Interviews
              </span>
                        </h1>

                        <p className="mt-5 text-zinc-400 text-lg max-w-xl">
                            ATS-ready, elegant and recruiter-tested resume
                            templates for developers, freshers and professionals.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-4">
                            <Link
                                to="/create"
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 font-semibold hover:scale-[1.02] transition"
                            >
                                Start Building
                            </Link>

                            <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                                View Live Preview
                            </button>
                        </div>
                    </div>

                    <div>
                        <MiniResume accent={selectedTemplate.accent} />
                    </div>
                </div>
            </section>

            {/* GRID */}
            <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
                <div className="flex items-center justify-between gap-4 flex-wrap mb-8">
                    <div>
                        <h2 className="text-3xl font-bold">
                            6 Premium Templates
                        </h2>
                        <p className="text-zinc-400 mt-2">
                            Switch styles instantly inside builder.
                        </p>
                    </div>

                    <Link
                        to="/create"
                        className="px-5 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
                    >
                        Open Builder
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">
                    {templates.map((template) => {
                        const active =
                            selected === template.id;

                        return (
                            <div
                                key={template.id}
                                className={`rounded-3xl border transition overflow-hidden ${
                                    active
                                        ? "border-violet-500 bg-zinc-900 shadow-lg shadow-violet-500/10"
                                        : "border-white/10 bg-zinc-950 hover:border-white/20"
                                }`}
                            >
                                {/* CARD PREVIEW */}
                                <div className="p-5">
                                    <MiniResume accent={template.accent} />
                                </div>

                                {/* INFO */}
                                <div className="px-5 pb-5">
                                    <div className="flex items-center justify-between gap-3">
                                        <h3 className="text-xl font-semibold">
                                            {template.name}
                                        </h3>

                                        {template.premium ? (
                                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs text-amber-300">
                        <Crown className="h-3 w-3" />
                        Pro
                      </span>
                                        ) : (
                                            <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-zinc-300">
                        {template.tag}
                      </span>
                                        )}
                                    </div>

                                    <p className="mt-3 text-sm text-zinc-400 min-h-[42px]">
                                        {template.desc}
                                    </p>

                                    <div className="mt-5 flex gap-3">
                                        <button
                                            onClick={() =>
                                                setSelected(
                                                    template.id
                                                )
                                            }
                                            className={`flex-1 px-4 py-3 rounded-xl font-medium transition ${
                                                active
                                                    ? "bg-violet-500 text-white"
                                                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                                            }`}
                                        >
                      <span className="flex items-center justify-center gap-2">
                        {active ? (
                            <>
                                <Check className="h-4 w-4" />
                                Selected
                            </>
                        ) : (
                            "Use Template"
                        )}
                      </span>
                                        </button>

                                        <button className="px-4 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition">
                                            <Eye className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* CTA */}
            <section className="border-t border-white/10">
                <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
                    <div className="rounded-3xl border border-white/10 bg-gradient-to-r from-violet-500/10 to-purple-500/10 p-10 text-center">
                        <h3 className="text-4xl font-bold">
                            Build Your Resume in Minutes
                        </h3>

                        <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
                            Choose any template, edit instantly and
                            export recruiter-ready resumes.
                        </p>

                        <Link
                            to="/create"
                            className="inline-flex items-center gap-2 mt-8 px-7 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 font-semibold hover:scale-[1.02] transition"
                        >
                            <FileText className="h-4 w-4" />
                            Start Now
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Templates;
import React from "react";

const getSkillName = (s) => (typeof s === "object" ? s.title || s.name || "" : s);
const getEduArr = (e) => !e ? [] : Array.isArray(e) ? e : [e];

const LEFT_SECTIONS  = new Set(["skills", "languages", "certifications", "achievements"]);
const RIGHT_SECTIONS = new Set(["summary", "experience", "education", "projects"]);

const TimelinePro = ({ data, accent = "violet", accentHex: accentHexProp, fontFamily, sectionOrder = [] }) => {
    const accentHex = accentHexProp || {
        violet: "#4f46e5", blue: "#0369a1", emerald: "#047857",
        rose: "#be123c", amber: "#b45309", black: "#18181b",
    }[accent] || "#1e293b";

    const headingColor = "#1e293b";
    const eduArr = getEduArr(data.education);

    const defaultOrder = ["summary", "skills", "experience", "education", "projects", "certifications", "achievements", "languages"];
    const order = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    const leftOrder  = order.filter(s => LEFT_SECTIONS.has(s));
    const rightOrder = order.filter(s => RIGHT_SECTIONS.has(s));

    /* ── left column section renderers ── */
    const leftSections = {
        skills: data.skills?.length > 0 && (
            <LeftSection key="skills" title="Skills" headingColor={headingColor}>
                <ul className="mt-1 space-y-1">
                    {data.skills.map((s, i) => (
                        <li key={i} className="text-xs text-zinc-700 flex items-center gap-2">
                            <span className="text-zinc-400">•</span>{getSkillName(s)}
                        </li>
                    ))}
                </ul>
            </LeftSection>
        ),
        languages: data.languages?.length > 0 && (
            <LeftSection key="languages" title="Languages" headingColor={headingColor}>
                <ul className="mt-1 space-y-1">
                    {data.languages.map((l, i) => (
                        <li key={i} className="text-xs text-zinc-700 flex items-center gap-2">
                            <span className="text-zinc-400">•</span>{l.name || l}
                        </li>
                    ))}
                </ul>
            </LeftSection>
        ),
        certifications: data.certifications?.length > 0 && (
            <LeftSection key="certifications" title="Certifications" headingColor={headingColor}>
                <ul className="mt-1 space-y-1">
                    {data.certifications.map((c, i) => (
                        <li key={i} className="text-xs text-zinc-700">
                            <p className="font-semibold">{c.title}</p>
                            <p className="text-zinc-400">{c.issuingOrganization} · {c.year}</p>
                        </li>
                    ))}
                </ul>
            </LeftSection>
        ),
        achievements: data.achievements?.length > 0 && (
            <LeftSection key="achievements" title="Achievements" headingColor={headingColor}>
                <ul className="mt-1 space-y-2">
                    {data.achievements.map((a, i) => (
                        <li key={i} className="text-xs text-zinc-700">
                            <p className="font-semibold">{a.title}</p>
                            {a.extraInformation && <p className="text-zinc-400">{a.extraInformation}</p>}
                            <p className="text-zinc-400">{a.year}</p>
                        </li>
                    ))}
                </ul>
            </LeftSection>
        ),
    };

    /* ── right column section renderers ── */
    const rightSections = {
        summary: data.summary && (
            <RightSection key="summary" title="Profile" accentHex={accentHex} headingColor={headingColor}>
                <p className="text-xs text-zinc-700 leading-relaxed mt-3 pl-6">"{data.summary}"</p>
            </RightSection>
        ),
        experience: data.experience?.length > 0 && (
            <RightSection key="experience" title="Work Experience" accentHex={accentHex} headingColor={headingColor}>
                {data.experience.map((exp, i) => (
                    <TimelineEntry key={i} accentHex={accentHex}>
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-sm text-zinc-900">{exp.company}</p>
                            <p className="text-xs text-zinc-500 shrink-0 ml-2">{exp.time || exp.duration}</p>
                        </div>
                        <p className="text-xs font-semibold mt-0.5" style={{ color: accentHex }}>{exp.title}</p>
                        <ul className="mt-1 space-y-0.5 ml-3">
                            {(exp.points || (exp.responsibility ? [exp.responsibility] : [])).map((pt, idx) => (
                                <li key={idx} className="text-xs text-zinc-700 list-disc leading-snug">{pt}</li>
                            ))}
                        </ul>
                    </TimelineEntry>
                ))}
            </RightSection>
        ),
        education: eduArr.length > 0 && (
            <RightSection key="education" title="Education" accentHex={accentHex} headingColor={headingColor}>
                {eduArr.map((edu, i) => (
                    <TimelineEntry key={i} accentHex={accentHex}>
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-sm text-zinc-900">{edu.degree}</p>
                            <p className="text-xs text-zinc-500 shrink-0 ml-2">{edu.graduationYear || edu.year}</p>
                        </div>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            {edu.university || edu.college}{edu.location ? ` | ${edu.location}` : ""}
                        </p>
                    </TimelineEntry>
                ))}
            </RightSection>
        ),
        projects: data.projects?.length > 0 && (
            <RightSection key="projects" title="Projects" accentHex={accentHex} headingColor={headingColor}>
                {data.projects.map((p, i) => (
                    <TimelineEntry key={i} accentHex={accentHex}>
                        <p className="font-bold text-sm text-zinc-900">{p.title}</p>
                        <p className="text-xs text-zinc-600 mt-0.5">{p.description}</p>
                        {p.technologiesUsed?.length > 0 && (
                            <p className="text-xs mt-0.5" style={{ color: accentHex }}>{p.technologiesUsed.join(" · ")}</p>
                        )}
                    </TimelineEntry>
                ))}
            </RightSection>
        ),
    };

    return (
        <div className="w-[794px] min-h-[1123px] mx-auto flex bg-white shadow-2xl overflow-hidden"
            style={{ fontFamily: fontFamily || "Arial, sans-serif" }}>

            {/* ── LEFT COLUMN ── */}
            <div className="w-[240px] shrink-0 bg-zinc-50 border-r border-zinc-200 px-6 py-10 flex flex-col gap-6">
                {/* Contact — always first */}
                <LeftSection title="Contact" headingColor={headingColor}>
                    {data.phone    && <ContactRow icon="☎" text={data.phone} />}
                    {data.email    && <ContactRow icon="✉" text={data.email} />}
                    {data.location && <ContactRow icon="⊙" text={data.location} />}
                    {data.linkedIn && <ContactRow icon="⊞" text={data.linkedIn} />}
                    {data.gitHub   && <ContactRow icon="⊡" text={data.gitHub} />}
                </LeftSection>
                {leftOrder.map(sec => leftSections[sec] || null)}
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="flex-1 px-8 py-10">
                <div className="mb-6">
                    <h1 className="text-3xl font-black uppercase leading-none tracking-tight" style={{ color: headingColor }}>
                        {data.name}
                    </h1>
                    <p className="text-sm font-semibold uppercase tracking-widest mt-1" style={{ color: accentHex }}>
                        {data.role}
                    </p>
                    <div className="mt-2 h-0.5 w-16" style={{ backgroundColor: accentHex }} />
                </div>
                {rightOrder.map(sec => rightSections[sec] || null)}
            </div>
        </div>
    );
};

function LeftSection({ title, headingColor, children }) {
    return (
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest pb-1 border-b border-zinc-300" style={{ color: headingColor }}>
                {title}
            </h3>
            {children}
        </div>
    );
}

function ContactRow({ icon, text }) {
    return (
        <p className="text-xs text-zinc-700 flex items-start gap-2 mt-1.5 leading-snug">
            <span className="shrink-0 text-zinc-400">{icon}</span>
            <span className="break-all">{text}</span>
        </p>
    );
}

function RightSection({ title, accentHex, headingColor, children }) {
    return (
        <div className="mb-5">
            <div className="flex items-center gap-3 mb-1">
                <div className="h-6 w-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: accentHex }}>
                    <span className="text-white text-xs font-bold">▸</span>
                </div>
                <h2 className="text-sm font-black uppercase tracking-wider" style={{ color: headingColor }}>{title}</h2>
            </div>
            <div className="border-t border-zinc-200 mb-2" />
            <div className="relative pl-6">
                <div className="absolute left-[9px] top-0 bottom-0 w-0.5" style={{ backgroundColor: `${accentHex}44` }} />
                {children}
            </div>
        </div>
    );
}

function TimelineEntry({ accentHex, children }) {
    return (
        <div className="relative mb-4">
            <div className="absolute -left-[19px] top-1.5 h-2.5 w-2.5 rounded-full border-2 bg-white" style={{ borderColor: accentHex }} />
            {children}
        </div>
    );
}

export default TimelinePro;

import React from "react";

const getSkillName = (s) => (typeof s === "object" ? s.title || s.name || "" : s);
const getEduArr = (e) => !e ? [] : Array.isArray(e) ? e : [e];

/* Sections that live in the sidebar */
const SIDEBAR_SECTIONS = new Set(["skills", "languages", "certifications"]);
/* Sections that live in the main column */
const MAIN_SECTIONS = new Set(["summary", "experience", "education", "projects", "achievements"]);

const SidebarPro = ({ data, accent = "violet", accentHex: accentHexProp, fontFamily, sectionOrder = [] }) => {
    const accentHex = accentHexProp || {
        violet: "#7c3aed", blue: "#0284c7", emerald: "#059669",
        rose: "#e11d48", amber: "#d97706", black: "#18181b",
    }[accent] || "#7c3aed";

    const sidebarBg = "#1e293b";
    const eduArr = getEduArr(data.education);

    /* Order sidebar / main sections according to sectionOrder */
    const defaultOrder = ["summary", "skills", "experience", "education", "projects", "certifications", "achievements", "languages"];
    const order = sectionOrder.length > 0 ? sectionOrder : defaultOrder;

    const sidebarOrder = order.filter(s => SIDEBAR_SECTIONS.has(s));
    const mainOrder    = order.filter(s => MAIN_SECTIONS.has(s));

    /* ── sidebar section renderers ── */
    const sidebarSections = {
        skills: data.skills?.length > 0 && (
            <SideSection key="skills" title="Skills" accentHex={accentHex}>
                <ul className="space-y-1 mt-1">
                    {data.skills.map((s, i) => (
                        <li key={i} className="text-xs flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentHex }} />
                            {getSkillName(s)}
                        </li>
                    ))}
                </ul>
            </SideSection>
        ),
        languages: data.languages?.length > 0 && (
            <SideSection key="languages" title="Languages" accentHex={accentHex}>
                <ul className="space-y-1 mt-1">
                    {data.languages.map((l, i) => (
                        <li key={i} className="text-xs flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentHex }} />
                            {l.name || l}
                        </li>
                    ))}
                </ul>
            </SideSection>
        ),
        certifications: data.certifications?.length > 0 && (
            <SideSection key="certifications" title="Certifications" accentHex={accentHex}>
                <ul className="space-y-1 mt-1">
                    {data.certifications.map((c, i) => (
                        <li key={i} className="text-xs flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: accentHex }} />
                            {c.title} ({c.year})
                        </li>
                    ))}
                </ul>
            </SideSection>
        ),
    };

    /* ── main section renderers ── */
    const mainSections = {
        summary: data.summary && (
            <RightSection key="summary" title="Profile" accentHex={accentHex}>
                <p className="text-sm text-zinc-700 leading-relaxed mt-2">{data.summary}</p>
            </RightSection>
        ),
        experience: data.experience?.length > 0 && (
            <RightSection key="experience" title="Work Experience" accentHex={accentHex}>
                {data.experience.map((exp, i) => (
                    <div key={i} className="mt-3">
                        <p className="font-bold text-sm text-zinc-900">{exp.title}</p>
                        <div className="flex justify-between text-xs text-zinc-500 mb-1">
                            <span>{exp.company}</span>
                            <span className="italic">{exp.time || exp.duration}</span>
                        </div>
                        <ul className="ml-4 space-y-0.5">
                            {(exp.points || (exp.responsibility ? [exp.responsibility] : [])).map((pt, idx) => (
                                <li key={idx} className="text-xs text-zinc-700 list-disc leading-relaxed">{pt}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </RightSection>
        ),
        education: eduArr.length > 0 && (
            <RightSection key="education" title="Education" accentHex={accentHex}>
                {eduArr.map((edu, i) => (
                    <div key={i} className="mt-3">
                        <p className="font-bold text-sm text-zinc-900">{edu.degree}</p>
                        <div className="flex justify-between text-xs text-zinc-500">
                            <span>{edu.university || edu.college}</span>
                            <span className="italic">{edu.graduationYear || edu.year}</span>
                        </div>
                    </div>
                ))}
            </RightSection>
        ),
        projects: data.projects?.length > 0 && (
            <RightSection key="projects" title="Projects" accentHex={accentHex}>
                {data.projects.map((p, i) => (
                    <div key={i} className="mt-2">
                        <p className="font-bold text-sm text-zinc-900">{p.title}</p>
                        <p className="text-xs text-zinc-600 mt-0.5">{p.description}</p>
                        {p.technologiesUsed?.length > 0 && (
                            <p className="text-xs text-zinc-400 mt-0.5">Stack: {p.technologiesUsed.join(", ")}</p>
                        )}
                    </div>
                ))}
            </RightSection>
        ),
        achievements: data.achievements?.length > 0 && (
            <RightSection key="achievements" title="Achievements" accentHex={accentHex}>
                {data.achievements.map((a, i) => (
                    <div key={i} className="mt-2 flex justify-between text-sm">
                        <span className="font-medium text-zinc-800">{a.title}</span>
                        <span className="text-xs text-zinc-500">{a.year}</span>
                    </div>
                ))}
            </RightSection>
        ),
    };

    return (
        <div className="w-[794px] min-h-[1123px] mx-auto flex shadow-2xl overflow-hidden"
            style={{ fontFamily: fontFamily || "Arial, sans-serif" }}>

            {/* ── LEFT SIDEBAR ── */}
            <div className="w-[270px] shrink-0 flex flex-col px-7 py-10 gap-6"
                style={{ backgroundColor: sidebarBg, color: "#e2e8f0", minHeight: "1123px" }}>
                {/* Avatar */}
                <div className="flex justify-center mb-2">
                    <div className="h-24 w-24 rounded-full flex items-center justify-center text-3xl font-bold border-4"
                        style={{ borderColor: accentHex, background: `linear-gradient(135deg,${accentHex}33,${accentHex}66)`, color: "#fff" }}>
                        {(data.name || "U").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                </div>
                {/* Contact — always first */}
                <SideSection title="Contact" accentHex={accentHex}>
                    {data.location && <SideItem icon="📍" text={data.location} />}
                    {data.phone    && <SideItem icon="📞" text={data.phone} />}
                    {data.email    && <SideItem icon="✉️" text={data.email} />}
                    {data.linkedIn && <SideItem icon="🔗" text={data.linkedIn} />}
                    {data.gitHub   && <SideItem icon="💻" text={data.gitHub} />}
                </SideSection>
                {/* Sidebar sections in order */}
                {sidebarOrder.map(sec => sidebarSections[sec] || null)}
            </div>

            {/* ── RIGHT CONTENT ── */}
            <div className="flex-1 bg-white px-9 py-10 flex flex-col gap-5">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-900 leading-none">{data.name}</h1>
                    <p className="text-base font-semibold mt-1" style={{ color: accentHex }}>{data.role}</p>
                </div>
                {mainOrder.map(sec => mainSections[sec] || null)}
            </div>
        </div>
    );
};

function SideSection({ title, accentHex, children }) {
    return (
        <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: accentHex }}>{title}</h3>
            <div className="border-t mb-2" style={{ borderColor: `${accentHex}55` }} />
            {children}
        </div>
    );
}

function SideItem({ icon, text }) {
    return (
        <p className="text-xs flex items-start gap-2 leading-snug mt-1">
            <span className="shrink-0">{icon}</span>
            <span className="break-all">{text}</span>
        </p>
    );
}

function RightSection({ title, accentHex, children }) {
    return (
        <div>
            <h2 className="text-base font-black uppercase tracking-wider" style={{ color: accentHex }}>{title}</h2>
            <div className="h-0.5 mt-0.5" style={{ backgroundColor: accentHex }} />
            {children}
        </div>
    );
}

export default SidebarPro;

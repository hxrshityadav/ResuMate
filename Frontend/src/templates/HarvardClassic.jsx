import React from "react";

const getSkillName = (s) => (typeof s === "object" ? s.title || s.name || "" : s);
const getEduArr = (e) => !e ? [] : Array.isArray(e) ? e : [e];

const HarvardClassic = ({ data, accent = "violet", accentHex: accentHexProp, fontFamily, sectionOrder = [] }) => {
    const accentHex = accentHexProp || {
        violet: "#4f1fbf", blue: "#0369a1", emerald: "#047857",
        rose: "#be123c", amber: "#b45309", black: "#18181b",
    }[accent] || "#111827";

    const eduArr = getEduArr(data.education);

    const sections = {
        summary: data.summary ? (
            <section key="summary" className="mb-4">
                <SectionHeader label="Summary" color={accentHex} />
                <p className="text-sm mt-2 leading-relaxed text-zinc-700">{data.summary}</p>
            </section>
        ) : null,

        education: eduArr.length > 0 ? (
            <section key="education" className="mb-4">
                <SectionHeader label="Education" color={accentHex} />
                {eduArr.map((edu, i) => (
                    <div key={i} className="mt-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-sm uppercase">{edu.university || edu.college}</p>
                                <p className="text-sm italic">{edu.degree}</p>
                            </div>
                            <div className="text-right text-sm">
                                <p>{edu.location || data.location}</p>
                                <p className="italic">Expected {edu.graduationYear || edu.year}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        ) : null,

        experience: data.experience?.length > 0 ? (
            <section key="experience" className="mb-4">
                <SectionHeader label="Work Experience" color={accentHex} />
                {data.experience.map((exp, i) => (
                    <div key={i} className="mt-2">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-sm uppercase">{exp.company || exp.title}</p>
                                <p className="text-sm italic">{exp.title}</p>
                            </div>
                            <div className="text-right text-sm">
                                <p>{exp.location || ""}</p>
                                <p className="italic">{exp.time || exp.duration}</p>
                            </div>
                        </div>
                        <ul className="mt-1 ml-4 space-y-0.5">
                            {(exp.points || (exp.responsibility ? [exp.responsibility] : [])).map((pt, idx) => (
                                <li key={idx} className="text-sm list-disc">{pt}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        ) : null,

        projects: data.projects?.length > 0 ? (
            <section key="projects" className="mb-4">
                <SectionHeader label="Projects" color={accentHex} />
                {data.projects.map((p, i) => (
                    <div key={i} className="mt-2">
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-sm uppercase">{p.title}</p>
                            <p className="text-sm italic">{p.year || ""}</p>
                        </div>
                        <ul className="mt-1 ml-4 space-y-0.5">
                            <li className="text-sm list-disc">{p.description}</li>
                            {p.technologiesUsed?.length > 0 && (
                                <li className="text-sm list-disc">Technologies: {p.technologiesUsed.join(", ")}</li>
                            )}
                        </ul>
                    </div>
                ))}
            </section>
        ) : null,

        skills: data.skills?.length > 0 ? (
            <section key="skills" className="mb-4">
                <SectionHeader label="Technical Skills" color={accentHex} />
                <p className="text-sm mt-2">{data.skills.map(getSkillName).join(" • ")}</p>
            </section>
        ) : null,

        certifications: data.certifications?.length > 0 ? (
            <section key="certifications" className="mb-4">
                <SectionHeader label="Certifications" color={accentHex} />
                <div className="mt-2 space-y-1 text-sm">
                    {data.certifications.map((c, i) => (
                        <p key={i}><strong>{c.title}</strong> — {c.issuingOrganization} ({c.year})</p>
                    ))}
                </div>
            </section>
        ) : null,

        achievements: data.achievements?.length > 0 ? (
            <section key="achievements" className="mb-4">
                <SectionHeader label="Achievements" color={accentHex} />
                <div className="mt-2 space-y-1 text-sm">
                    {data.achievements.map((a, i) => (
                        <p key={i}><strong>{a.title}</strong>{a.year ? ` (${a.year})` : ""}</p>
                    ))}
                </div>
            </section>
        ) : null,

        languages: data.languages?.length > 0 ? (
            <section key="languages" className="mb-4">
                <SectionHeader label="Languages" color={accentHex} />
                <p className="text-sm mt-2">{data.languages.map((l) => l.name || l).join(", ")}</p>
            </section>
        ) : null,
    };

    const order = sectionOrder.length > 0 ? sectionOrder : Object.keys(sections);

    return (
        <div className="w-[794px] min-h-[1123px] mx-auto bg-white text-black shadow-2xl px-14 py-12"
            style={{ fontFamily: fontFamily || "Georgia, serif" }}>

            {/* Header */}
            <div className="text-center mb-1">
                <h1 className="text-2xl font-bold uppercase tracking-widest text-black">{data.name}</h1>
                <p className="text-sm mt-1 text-zinc-600">
                    {[data.location, data.phone && `P: ${data.phone}`, data.email, data.linkedIn]
                        .filter(Boolean).join(" | ")}
                </p>
            </div>
            <div className="border-t-2 border-b border-black mt-3 mb-4" />

            {order.map((sec) => sections[sec] ?? null)}
        </div>
    );
};

function SectionHeader({ label, color }) {
    return (
        <div className="mt-3 mb-1">
            <h2 className="text-sm font-bold uppercase tracking-widest" style={{ color }}>{label}</h2>
            <div className="border-t border-black mt-0.5" />
        </div>
    );
}

export default HarvardClassic;

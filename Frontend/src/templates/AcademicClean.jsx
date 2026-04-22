import React from "react";

const getSkillName = (s) => (typeof s === "object" ? s.title || s.name || "" : s);
const getEduArr = (e) => !e ? [] : Array.isArray(e) ? e : [e];

const AcademicClean = ({ data, accent = "violet", accentHex: accentHexProp, fontFamily, sectionOrder = [] }) => {
    const accentHex = accentHexProp || {
        violet: "#5b21b6", blue: "#0369a1", emerald: "#065f46",
        rose: "#9f1239", amber: "#92400e", black: "#18181b",
    }[accent] || "#111827";

    const eduArr = getEduArr(data.education);

    const sections = {
        summary: data.summary ? (
            <section key="summary" className="mt-6">
                <CenteredHeader label="Summary" color={accentHex} />
                <p className="text-sm mt-3 leading-relaxed text-zinc-700">{data.summary}</p>
            </section>
        ) : null,

        education: eduArr.length > 0 ? (
            <section key="education" className="mt-6">
                <CenteredHeader label="Education" color={accentHex} />
                {eduArr.map((edu, i) => (
                    <div key={i} className="mt-3 flex justify-between">
                        <div>
                            <p className="font-bold text-sm">{edu.university || edu.college}</p>
                            <p className="text-sm">{edu.degree}</p>
                            {i === 0 && data.skills?.length > 0 && (
                                <p className="text-xs text-zinc-500 mt-0.5 italic">
                                    Relevant Coursework: {data.skills.slice(0, 5).map(getSkillName).join("; ")}
                                </p>
                            )}
                        </div>
                        <div className="text-right text-sm">
                            <p>{edu.location || data.location}</p>
                            <p className="italic">Graduation {edu.graduationYear || edu.year}</p>
                        </div>
                    </div>
                ))}
            </section>
        ) : null,

        experience: data.experience?.length > 0 ? (
            <section key="experience" className="mt-6">
                <CenteredHeader label="Experience" color={accentHex} />
                {data.experience.map((exp, i) => (
                    <div key={i} className="mt-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-bold text-sm">{exp.company}</p>
                                <p className="text-sm italic">{exp.title}</p>
                            </div>
                            <div className="text-right text-sm">
                                <p>{exp.location || ""}</p>
                                <p className="italic">{exp.time || exp.duration}</p>
                            </div>
                        </div>
                        <ul className="mt-1.5 ml-5 space-y-1">
                            {(exp.points || (exp.responsibility ? [exp.responsibility] : [])).map((pt, idx) => (
                                <li key={idx} className="text-sm list-disc leading-snug">{pt}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        ) : null,

        projects: data.projects?.length > 0 ? (
            <section key="projects" className="mt-6">
                <CenteredHeader label="Projects" color={accentHex} />
                {data.projects.map((p, i) => (
                    <div key={i} className="mt-2">
                        <p className="font-bold text-sm">{p.title}</p>
                        <ul className="mt-1 ml-5 space-y-0.5">
                            <li className="text-sm list-disc">{p.description}</li>
                            {p.technologiesUsed?.length > 0 && (
                                <li className="text-sm list-disc">Built with: {p.technologiesUsed.join(", ")}</li>
                            )}
                        </ul>
                    </div>
                ))}
            </section>
        ) : null,

        skills: data.skills?.length > 0 ? (
            <section key="skills" className="mt-6">
                <CenteredHeader label="Skills" color={accentHex} />
                <div className="mt-2 text-sm">
                    <p><strong>Technical: </strong>{data.skills.map(getSkillName).join("; ")}</p>
                </div>
            </section>
        ) : null,

        certifications: data.certifications?.length > 0 ? (
            <section key="certifications" className="mt-6">
                <CenteredHeader label="Certifications" color={accentHex} />
                <div className="mt-2 space-y-1 text-sm">
                    {data.certifications.map((c, i) => (
                        <p key={i}><strong>{c.title}</strong> — {c.issuingOrganization} ({c.year})</p>
                    ))}
                </div>
            </section>
        ) : null,

        achievements: data.achievements?.length > 0 ? (
            <section key="achievements" className="mt-6">
                <CenteredHeader label="Leadership & Activities" color={accentHex} />
                {data.achievements.map((a, i) => (
                    <div key={i} className="mt-2 flex justify-between items-start">
                        <div>
                            <p className="font-bold text-sm">{a.title}</p>
                            {a.extraInformation && <p className="text-sm italic">{a.extraInformation}</p>}
                        </div>
                        <p className="text-sm">{a.year}</p>
                    </div>
                ))}
            </section>
        ) : null,

        languages: data.languages?.length > 0 ? (
            <section key="languages" className="mt-6">
                <CenteredHeader label="Languages" color={accentHex} />
                <p className="text-sm mt-2">{data.languages.map((l) => l.name || l).join(", ")}</p>
            </section>
        ) : null,
    };

    const order = sectionOrder.length > 0 ? sectionOrder : Object.keys(sections);

    return (
        <div className="w-[794px] min-h-[1123px] mx-auto bg-white text-black shadow-2xl px-16 py-12"
            style={{ fontFamily: fontFamily || "system-ui, sans-serif" }}>

            {/* Header */}
            <div className="text-center">
                <div className="border-t-2 border-black" />
                <h1 className="text-xl font-bold py-2 tracking-wide">{data.name}</h1>
                <div className="border-t border-black" />
                <p className="text-xs mt-2 text-zinc-600 tracking-wide">
                    {[data.location, data.email, data.phone].filter(Boolean).join(" • ")}
                </p>
                {data.linkedIn && <p className="text-xs text-zinc-600">{data.linkedIn}</p>}
            </div>

            {order.map((sec) => sections[sec] ?? null)}
        </div>
    );
};

function CenteredHeader({ label, color }) {
    return (
        <div className="text-center mt-2">
            <h2 className="text-sm font-bold tracking-widest" style={{ color }}>{label}</h2>
            <div className="border-t border-zinc-400 mt-1" />
        </div>
    );
}

export default AcademicClean;

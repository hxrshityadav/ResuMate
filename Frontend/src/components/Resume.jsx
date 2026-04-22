import React, { useRef } from "react";
import { Mail, Phone, Github, Linkedin, Download } from "lucide-react";
import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";

const Resume = ({ data }) => {
    const resumeRef = useRef(null);

    const personal = data?.personalInformation || {};

    const handleDownloadPdf = async () => {
        if (!resumeRef.current) return;

        try {
            const image = await toPng(resumeRef.current, {
                quality: 1,
                pixelRatio: 2,
                cacheBust: true
            });

            const pdf = new jsPDF("p", "mm", "a4");

            const imgProps = pdf.getImageProperties(image);
            const pdfWidth = 210;
            const pdfHeight =
                (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(image, "PNG", 0, 0, pdfWidth, pdfHeight);

            const fileName =
                personal.fullName?.replace(/\s+/g, "_") ||
                "resume";

            pdf.save(`${fileName}.pdf`);
        } catch (error) {
            console.error(error);
        }
    };

    const Section = ({ title, children }) => (
        <section className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500 border-b pb-2">
                {title}
            </h2>
            {children}
        </section>
    );

    return (
        <div className="space-y-5">
            {/* Download */}
            <div className="flex justify-end">
                <Button onClick={handleDownloadPdf}>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                </Button>
            </div>

            {/* Resume */}
            <div
                ref={resumeRef}
                className="bg-white text-slate-900 max-w-4xl mx-auto rounded-2xl shadow-xl border p-8 md:p-10 space-y-8"
            >
                {/* Header */}
                <header className="space-y-4">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight">
                            {personal.fullName || "Your Name"}
                        </h1>

                        <p className="text-slate-500 mt-1">
                            {personal.location}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        {personal.email && (
                            <span className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                                {personal.email}
              </span>
                        )}

                        {personal.phoneNumber && (
                            <span className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                                {personal.phoneNumber}
              </span>
                        )}

                        {personal.gitHub && (
                            <a
                                href={personal.gitHub}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 hover:text-black"
                            >
                                <Github className="h-4 w-4" />
                                GitHub
                            </a>
                        )}

                        {personal.linkedIn && (
                            <a
                                href={personal.linkedIn}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 hover:text-black"
                            >
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                            </a>
                        )}
                    </div>
                </header>

                {/* Summary */}
                {data?.summary && (
                    <Section title="Professional Summary">
                        <p className="leading-7 text-sm text-slate-700">
                            {data.summary}
                        </p>
                    </Section>
                )}

                {/* Skills */}
                {(data?.skills || []).length > 0 && (
                    <Section title="Skills">
                        <div className="flex flex-wrap gap-2">
                            {data.skills.map((skill, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 rounded-full bg-slate-100 text-sm"
                                >
                  {skill.title}
                                    {skill.level
                                        ? ` • ${skill.level}`
                                        : ""}
                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Experience */}
                {(data?.experience || []).length > 0 && (
                    <Section title="Experience">
                        <div className="space-y-5">
                            {data.experience.map((exp, index) => (
                                <div key={index}>
                                    <div className="flex justify-between gap-4 flex-wrap">
                                        <div>
                                            <h3 className="font-semibold">
                                                {exp.jobTitle}
                                            </h3>
                                            <p className="text-sm text-slate-600">
                                                {exp.company}
                                                {exp.location
                                                    ? ` • ${exp.location}`
                                                    : ""}
                                            </p>
                                        </div>

                                        <span className="text-sm text-slate-500">
                      {exp.duration}
                    </span>
                                    </div>

                                    <p className="mt-2 text-sm text-slate-700 leading-6">
                                        {exp.responsibility}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Projects */}
                {(data?.projects || []).length > 0 && (
                    <Section title="Projects">
                        <div className="space-y-5">
                            {data.projects.map((project, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold">
                                        {project.title}
                                    </h3>

                                    <p className="text-sm text-slate-700 mt-1 leading-6">
                                        {project.description}
                                    </p>

                                    <p className="text-sm text-slate-500 mt-2">
                                        Tech:{" "}
                                        {Array.isArray(
                                            project.technologiesUsed
                                        )
                                            ? project.technologiesUsed.join(
                                                ", "
                                            )
                                            : project.technologiesUsed ||
                                            ""}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Education */}
                {(data?.education || []).length > 0 && (
                    <Section title="Education">
                        <div className="space-y-4">
                            {data.education.map((edu, index) => (
                                <div key={index}>
                                    <h3 className="font-semibold">
                                        {edu.degree}
                                    </h3>

                                    <p className="text-sm text-slate-600">
                                        {edu.university}
                                        {edu.location
                                            ? ` • ${edu.location}`
                                            : ""}
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        {edu.graduationYear}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </Section>
                )}

                {/* Certifications */}
                {(data?.certifications || []).length > 0 && (
                    <Section title="Certifications">
                        <div className="space-y-3">
                            {data.certifications.map(
                                (cert, index) => (
                                    <div key={index}>
                                        <p className="font-medium text-sm">
                                            {cert.title}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {cert.issuingOrganization}
                                            {cert.year
                                                ? ` • ${cert.year}`
                                                : ""}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </Section>
                )}

                {/* Achievements */}
                {(data?.achievements || []).length > 0 && (
                    <Section title="Achievements">
                        <div className="space-y-4">
                            {data.achievements.map(
                                (item, index) => (
                                    <div key={index}>
                                        <p className="font-medium text-sm">
                                            {item.title}
                                        </p>
                                        <p className="text-sm text-slate-500">
                                            {item.year}
                                        </p>
                                        <p className="text-sm text-slate-700 mt-1">
                                            {item.extraInformation}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </Section>
                )}

                {/* Languages + Interests */}
                <div className="grid md:grid-cols-2 gap-8">
                    {(data?.languages || []).length > 0 && (
                        <Section title="Languages">
                            <ul className="space-y-2 text-sm text-slate-700">
                                {data.languages.map(
                                    (lang, index) => (
                                        <li key={index}>
                                            {lang.name}
                                        </li>
                                    )
                                )}
                            </ul>
                        </Section>
                    )}

                    {(data?.interests || []).length > 0 && (
                        <Section title="Interests">
                            <ul className="space-y-2 text-sm text-slate-700">
                                {data.interests.map(
                                    (item, index) => (
                                        <li key={index}>
                                            {item.name}
                                        </li>
                                    )
                                )}
                            </ul>
                        </Section>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Resume;
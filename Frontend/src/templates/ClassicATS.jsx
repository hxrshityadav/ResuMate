import React from "react";

const ClassicATS = ({ data, accent = "violet" }) => {
    const textColors = {
        violet: "text-violet-700",
        blue: "text-sky-700",
        emerald: "text-emerald-700",
        rose: "text-rose-700",
        amber: "text-amber-700",
    };

    const borderColors = {
        violet: "border-violet-300",
        blue: "border-sky-300",
        emerald: "border-emerald-300",
        rose: "border-rose-300",
        amber: "border-amber-300",
    };

    return (
        <div className="w-[794px] min-h-[1123px] mx-auto bg-white text-black p-12 rounded-2xl shadow-2xl">
            {/* Header Section */}
            <div className="text-center pb-6 border-b-2 border-zinc-200">
                <h1 className="text-5xl font-bold tracking-tight">{data.name}</h1>
                <p className={`text-xl mt-2 font-semibold ${textColors[accent]}`}>
                    {data.role}
                </p>
                <div className="flex justify-center gap-6 mt-4 text-sm text-zinc-600">
                    <span>📍 {data.location}</span>
                    <span>📧 {data.email}</span>
                    <span>📞 {data.phone}</span>
                </div>
            </div>

            {/* Summary */}
            <section className="mt-8">
                <h2
                    className={`text-lg font-bold uppercase tracking-wider pb-2 border-b ${borderColors[accent]} ${textColors[accent]}`}
                >
                    Professional Summary
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-zinc-800">
                    {data.summary}
                </p>
            </section>

            {/* Skills */}
            <section className="mt-8">
                <h2
                    className={`text-lg font-bold uppercase tracking-wider pb-2 border-b ${borderColors[accent]} ${textColors[accent]}`}
                >
                    Technical Skills
                </h2>
                <div className="mt-4 grid grid-cols-3 gap-2">
                    {data.skills.map((skill, i) => (
                        <div
                            key={i}
                            className="text-sm bg-zinc-50 px-3 py-2 rounded border border-zinc-200"
                        >
                            {skill}
                        </div>
                    ))}
                </div>
            </section>

            {/* Experience */}
            <section className="mt-8">
                <h2
                    className={`text-lg font-bold uppercase tracking-wider pb-2 border-b ${borderColors[accent]} ${textColors[accent]}`}
                >
                    Work Experience
                </h2>
                {data.experience.map((exp, i) => (
                    <div key={i} className="mt-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-base">{exp.title}</h3>
                                <p className="text-sm text-zinc-600">{exp.company}</p>
                            </div>
                            <span className="text-sm text-zinc-500 italic">
                                {exp.time}
                            </span>
                        </div>
                        <ul className="mt-2 space-y-1 text-sm text-zinc-700 ml-4">
                            {exp.points?.map((point, idx) => (
                                <li key={idx} className="list-disc">
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>

            {/* Education */}
            <section className="mt-8">
                <h2
                    className={`text-lg font-bold uppercase tracking-wider pb-2 border-b ${borderColors[accent]} ${textColors[accent]}`}
                >
                    Education
                </h2>
                <div className="mt-4 flex justify-between">
                    <div>
                        <h3 className="font-bold text-base">
                            {data.education.degree}
                        </h3>
                        <p className="text-sm text-zinc-600">
                            {data.education.college}
                        </p>
                    </div>
                    <span className="text-sm text-zinc-500 italic">
                        {data.education.year}
                    </span>
                </div>
            </section>
        </div>
    );
};

export default ClassicATS;
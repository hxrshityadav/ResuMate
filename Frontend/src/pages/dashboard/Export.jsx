import React from "react";

function Export() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-zinc-950 p-10">

                <h1 className="text-4xl font-bold leading-tight">
                    Download Your Resume
                    <br />
                    Like a Pro
                </h1>

                <p className="mt-4 text-zinc-400">
                    Export in PDF, DOCX and shareable formats.
                </p>

                <div className="grid md:grid-cols-3 gap-5 mt-10">
                    <button className="rounded-2xl bg-violet-500 px-5 py-4 font-semibold hover:bg-violet-600 transition">
                        Download PDF
                    </button>

                    <button className="rounded-2xl border border-white/10 px-5 py-4 hover:bg-white/5 transition">
                        Download DOCX
                    </button>

                    <button className="rounded-2xl border border-white/10 px-5 py-4 hover:bg-white/5 transition">
                        Share Resume Link
                    </button>
                </div>

            </div>
        </div>
    );
}

export default Export;
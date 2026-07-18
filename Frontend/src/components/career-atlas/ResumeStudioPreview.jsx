import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { CheckCircle2, Download, FileText, Gauge, Sparkles, Target, WandSparkles } from "lucide-react";
import {
  createSampleResume,
  SAMPLE_IMPROVED_BULLET,
  SAMPLE_ORIGINAL_BULLET,
  SAMPLE_TARGET_ROLE,
} from "../../data/sampleResume";

const cx = (...v) => v.filter(Boolean).join(" ");
const sampleResume = createSampleResume();
const primaryExperience = sampleResume.experience[0];
const skills = sampleResume.skills.slice(0, 4);
const formats = [["PDF", "PDF"], ["DOCX", "DOCX"], ["Markdown", "MD"]];

export function ResumeStudioPreview({ isDark, previewMode, setPreviewMode, accentColor }) {
  const improved = previewMode === "after";
  const panel = isDark ? "border-white/10 bg-white/[.035]" : "border-black/10 bg-[#f7f1e7]";
  const muted = isDark ? "text-[#97a4aa]" : "text-[#766f64]";
  const scope = useRef(null);
  const scoreRef = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .from("[data-studio-shell]", { autoAlpha: 0, y: 24, scale: 0.97, duration: 0.75, clearProps: "transform,opacity,visibility" })
        .from("[data-studio-header] > *", { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.08, clearProps: "transform,opacity,visibility" }, "-=0.35")
        .from("[data-studio-panel]", { autoAlpha: 0, y: 18, duration: 0.55, stagger: 0.09, clearProps: "transform,opacity,visibility" }, "-=0.2")
        .from("[data-progress]", { scaleX: 0, transformOrigin: "left center", duration: 0.65, stagger: 0.06, clearProps: "transform" }, "-=0.25");

      const counter = { value: 0 };
      gsap.to(counter, {
        value: 92,
        duration: 1.1,
        delay: 0.35,
        ease: "power2.out",
        onUpdate: () => {
          if (scoreRef.current) scoreRef.current.textContent = Math.round(counter.value);
        },
      });

      gsap.to("[data-float='coral']", { y: -10, rotation: 7, duration: 3.2, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("[data-float='sage']", { y: 9, rotation: -6, duration: 3.8, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to("[data-saved-dot]", { scale: 1.45, autoAlpha: 0.55, duration: 1.2, ease: "sine.inOut", repeat: -1, yoyo: true });
    });
    return () => media.revert();
  }, { scope });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo("[data-rewrite]",
        { autoAlpha: 0, x: improved ? 14 : -14 },
        { autoAlpha: 1, x: 0, duration: 0.42, ease: "power2.out", clearProps: "transform,opacity,visibility", overwrite: true },
      );
    });
    return () => media.revert();
  }, { scope, dependencies: [previewMode], revertOnUpdate: true });

  return (
    <div ref={scope} className="relative mx-auto w-full max-w-[680px] lg:ml-auto">
      <div data-float="coral" className={cx("absolute -left-8 top-12 hidden h-28 w-28 rotate-12 rounded-[34px] lg:block", isDark ? "bg-[#ff6a3d]/80" : "bg-[#d8a936]/80")} />
      <div data-float="sage" className={cx("absolute -right-7 bottom-10 hidden h-28 w-28 rounded-full border-[18px] lg:block", isDark ? "border-[#8faea4]/60" : "border-[#708f80]/60")} />
      <div data-studio-shell className={cx("relative overflow-hidden rounded-[30px] border p-3 shadow-2xl sm:p-4", isDark ? "border-white/10 bg-[#0d1218] shadow-black/40" : "border-black/10 bg-[#f2ebdf] shadow-[#776e5e]/20")}>
        <div className={cx("overflow-hidden rounded-[22px] border", isDark ? "border-white/10 bg-[#141b23]" : "border-black/10 bg-[#fffdf8]")}>
          <header data-studio-header className={cx("flex items-center justify-between border-b px-4 py-3", isDark ? "border-white/10" : "border-black/10")}>
            <div className="flex items-center gap-3">
              <div className={cx("grid h-9 w-9 place-items-center rounded-xl", isDark ? "bg-[#ff6a3d] text-[#140b08]" : "bg-[#292822] text-white")}><Sparkles className="h-4 w-4" /></div>
              <div><p className={cx("text-sm font-black", isDark ? "text-[#fff8ed]" : "text-[#25241f]")}>ResuMate Studio</p><p className={cx("text-[9px] font-bold uppercase tracking-[.16em]", muted)}>AI Resume Builder</p></div>
            </div>
            <span className={cx("flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold", isDark ? "border-[#8faea4]/20 bg-[#8faea4]/10 text-[#b8d2ca]" : "border-[#3b5b4f]/15 bg-[#3b5b4f]/10 text-[#3b5b4f]")}><i data-saved-dot className={cx("h-1.5 w-1.5 rounded-full", isDark ? "bg-[#8faea4]" : "bg-[#3b5b4f]")} />Saved</span>
          </header>

          <div className="grid gap-3 p-3 sm:p-4 md:grid-cols-[.8fr_1.2fr]">
            <aside className="space-y-3">
              <div data-studio-panel className={cx("rounded-2xl border p-4", panel)}>
                <div className="flex items-center justify-between">
                  <div><p className={cx("text-[9px] font-black uppercase tracking-[.17em]", muted)}>ATS score</p><div className="mt-1 flex items-baseline gap-1"><strong ref={scoreRef} className={cx("text-3xl font-black leading-none", isDark ? "text-[#fff8ed]" : "text-[#25241f]")}>92</strong><span className={cx("text-xs font-bold", muted)}>/100</span></div></div>
                  <div className="grid h-14 w-14 place-items-center rounded-full" style={{ background: "conic-gradient(" + accentColor + " 92%, " + (isDark ? "#28313a" : "#ded7ca") + " 0)" }}><div className={cx("grid h-10 w-10 place-items-center rounded-full", isDark ? "bg-[#141b23]" : "bg-[#fffdf8]")}><Gauge className="h-4 w-4" style={{ color: accentColor }} /></div></div>
                </div>
                <p className={cx("mt-3 flex items-center gap-2 text-[10px] font-bold leading-4", isDark ? "text-[#b8d2ca]" : "text-[#3b5b4f]")}><CheckCircle2 className="h-3.5 w-3.5 shrink-0" />18 role keywords matched</p>
              </div>
              <div data-studio-panel className={cx("rounded-2xl border p-4", panel)}>
                <div className="flex items-center gap-2.5">
                  <span className={cx("grid h-8 w-8 shrink-0 place-items-center rounded-lg", isDark ? "bg-[#ff6a3d]/10" : "bg-[#df5238]/10")}><Target className="h-4 w-4" style={{ color: accentColor }} /></span>
                  <div className="min-w-0"><p className={cx("text-[9px] font-black uppercase tracking-[.14em]", muted)}>Targeted for</p><p className={cx("truncate text-[10px] font-black", isDark ? "text-[#fff8ed]" : "text-[#25241f]")}>{SAMPLE_TARGET_ROLE}</p></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">{skills.map((s) => <span key={s} className={cx("rounded-full px-2 py-1 text-[9px] font-bold", isDark ? "bg-white/[.07] text-[#dfe7e9]" : "bg-white text-[#4e4a42] shadow-sm")}>{s}</span>)}</div>
              </div>
              <div data-studio-panel className="grid grid-cols-3 gap-1.5">{formats.map(([format, label]) => <button key={format} type="button" aria-label={"Download as " + format} title={"Download as " + format} className={cx("flex min-h-[70px] min-w-0 flex-col items-center justify-center rounded-xl border px-2 py-2.5 text-center transition hover:-translate-y-0.5", isDark ? "border-white/10 bg-white/[.035] hover:border-[#ff6a3d]/50 hover:bg-[#ff6a3d]/[.06]" : "border-black/10 bg-white hover:border-black/30 hover:bg-[#fff7ef]")}><Download className="mb-2 h-3.5 w-3.5" style={{ color: accentColor }} /><span className={cx("block text-[9px] font-black", isDark ? "text-[#fff8ed]" : "text-[#25241f]")}>{label}</span></button>)}</div>
            </aside>

            <section data-studio-panel className={cx("overflow-hidden rounded-2xl border", isDark ? "border-white/10 bg-[#10161d]" : "border-black/10 bg-white")}>
              <div className={cx("flex items-center justify-between border-b px-4 py-3", isDark ? "border-white/10" : "border-black/10")}><span className={cx("flex items-center gap-2 text-[9px] font-black uppercase tracking-[.15em]", muted)}><i className={cx("grid h-7 w-7 place-items-center rounded-lg", isDark ? "bg-[#ff6a3d]/10" : "bg-[#df5238]/10")}><FileText className="h-3.5 w-3.5" style={{ color: accentColor }} /></i>Live resume</span><span className={cx("rounded-full px-2.5 py-1 text-[8px] font-bold", isDark ? "bg-white/[.06] text-[#aebac0]" : "bg-[#f3eee5] text-[#766f63]")}>Harvard Classic</span></div>
              <div className="p-4">
                <div className={cx("border-b pb-3", isDark ? "border-white/10" : "border-black/10")}><p className={cx("atlas-serif text-xl font-bold", isDark ? "text-[#fff8ed]" : "text-[#25241f]")}>{sampleResume.name}</p><p className="text-[9px] font-black uppercase tracking-[.15em]" style={{ color: accentColor }}>{sampleResume.role}</p><p className={cx("mt-1 text-[8px]", muted)}>{sampleResume.location} · {sampleResume.email}</p></div>
                <div className={cx("mt-3 flex rounded-xl p-1 text-[9px] font-black", isDark ? "bg-black/30" : "bg-[#f2ede4]")}>
                  <button type="button" onClick={() => setPreviewMode("before")} className={cx("flex-1 rounded-lg py-2", !improved ? isDark ? "bg-white/10 text-white" : "bg-white shadow-sm" : muted)}>Original</button>
                  <button type="button" onClick={() => setPreviewMode("after")} className={cx("flex flex-1 items-center justify-center gap-1 rounded-lg py-2", improved ? isDark ? "bg-[#ff6a3d] text-[#160c08]" : "bg-[#292822] text-white" : muted)}><WandSparkles className="h-3 w-3" />AI improved</button>
                </div>
                <p className={cx("mt-4 text-[8px] font-black uppercase tracking-[.15em]", muted)}>{primaryExperience.title} · {primaryExperience.company}</p>
                <div data-rewrite className={cx("mt-2 rounded-xl border p-3 text-[10px] leading-5 transition", improved ? isDark ? "border-[#ff6a3d]/30 bg-[#ff6a3d]/10 text-[#ffd7c8]" : "border-[#df5238]/20 bg-[#fff2ec] text-[#58382f]" : isDark ? "border-white/10 bg-white/[.03] text-[#aab5ba]" : "border-black/10 bg-[#f7f4ed] text-[#6e685d]")}>{improved ? SAMPLE_IMPROVED_BULLET : SAMPLE_ORIGINAL_BULLET}</div>
                <div className="mt-4 grid grid-cols-2 gap-2">{[["Summary", 88], ["Experience", 94], ["Skills", 90], ["Format", 96]].map(([label, score]) => <div key={label} className={cx("rounded-lg px-2 py-2", isDark ? "bg-white/[.035]" : "bg-[#f7f4ed]")}><div className={cx("flex justify-between text-[8px] font-bold", muted)}><span>{label}</span><span>{score}%</span></div><div className={cx("mt-1.5 h-1 rounded-full", isDark ? "bg-white/10" : "bg-black/10")}><div data-progress className="h-full rounded-full" style={{ width: score + "%", backgroundColor: accentColor }} /></div></div>)}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

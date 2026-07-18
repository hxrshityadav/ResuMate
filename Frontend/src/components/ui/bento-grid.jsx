import React from "react";
import { cn } from "@/lib/utils";

/* ─── Bento Grid ──────────────────────────────────────────
   Asymmetric feature grid. Supports different card sizes.
   Each card has an optional hover glow effect.

   Usage:
   <BentoGrid>
     <BentoCard colSpan={2} rowSpan={1} ... />
     <BentoCard colSpan={1} rowSpan={1} ... />
   </BentoGrid>
───────────────────────────────────────────────────────── */

export function BentoGrid({ children, className }) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
                className
            )}
        >
            {children}
        </div>
    );
}

export function BentoCard({
    children,
    className,
    colSpan = 1,
    rowSpan = 1,
    glowColor,         // e.g. "violet", "blue", "emerald"
}) {
    const spanClasses = cn(
        colSpan === 2 && "md:col-span-2",
        colSpan === 3 && "lg:col-span-3",
        rowSpan === 2 && "md:row-span-2"
    );

    const glowMap = {
        violet: "hover:shadow-violet-500/10 dark:hover:shadow-violet-500/20",
        blue: "hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20",
        emerald: "hover:shadow-emerald-500/10 dark:hover:shadow-emerald-500/20",
        amber: "hover:shadow-amber-500/10 dark:hover:shadow-amber-500/20",
        pink: "hover:shadow-pink-500/10 dark:hover:shadow-pink-500/20",
        cyan: "hover:shadow-cyan-500/10 dark:hover:shadow-cyan-500/20",
    };

    return (
        <div
            className={cn(
                "group relative rounded-2xl border p-6 transition-all duration-300",
                "hover:-translate-y-0.5 hover:shadow-xl",
                "bg-white dark:bg-[#0f0f1c]",
                "border-black/[0.06] dark:border-white/[0.08]",
                "hover:border-black/[0.12] dark:hover:border-white/[0.14]",
                glowColor && glowMap[glowColor],
                spanClasses,
                className
            )}
        >
            {children}
        </div>
    );
}

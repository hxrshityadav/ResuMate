import React from "react";
import { cn } from "@/lib/utils";

/* ─── Marquee ─────────────────────────────────────────────
   Infinite horizontal scroll. CSS-only, no JS animation.
   Pause on hover. Works with any children.

   Usage:
   <Marquee pauseOnHover speed={40}>
     {items.map(item => <Card key={item.id} {...item} />)}
   </Marquee>
───────────────────────────────────────────────────────── */

export function Marquee({
    children,
    className,
    reverse = false,
    pauseOnHover = true,
    speed = 40,        // seconds for one full loop
    vertical = false,
}) {
    return (
        <div
            className={cn(
                "group flex overflow-hidden [--gap:1rem] gap-[var(--gap)]",
                vertical ? "flex-col" : "flex-row",
                className
            )}
            style={{ "--duration": `${speed}s` }}
        >
            {/* Track A */}
            <div
                className={cn(
                    "flex shrink-0 gap-[var(--gap)]",
                    vertical ? "flex-col animate-marquee-vertical" : "animate-marquee",
                    pauseOnHover && "group-hover:[animation-play-state:paused]",
                    reverse && "[animation-direction:reverse]"
                )}
            >
                {children}
            </div>
            {/* Track B — clone for seamless loop */}
            <div
                aria-hidden
                className={cn(
                    "flex shrink-0 gap-[var(--gap)]",
                    vertical ? "flex-col animate-marquee-vertical" : "animate-marquee",
                    pauseOnHover && "group-hover:[animation-play-state:paused]",
                    reverse && "[animation-direction:reverse]"
                )}
            >
                {children}
            </div>
        </div>
    );
}

export default Marquee;

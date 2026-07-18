import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function PageMotion({ routeKey, children }) {
  const scope = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();

    media.add({ reduceMotion: "(prefers-reduced-motion: reduce)" }, (context) => {
      const sections = gsap.utils.toArray("section", scope.current)
        .filter((section) => !section.parentElement?.closest("section"));
      const cards = gsap.utils.toArray("[data-motion-card]", scope.current);
      const page = scope.current?.firstElementChild;

      if (context.conditions.reduceMotion) {
        gsap.set([page, ...sections, ...cards].filter(Boolean), { clearProps: "all" });
        return;
      }

      if (page) {
        gsap.fromTo(page,
          { autoAlpha: 0, y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out", clearProps: "transform,opacity,visibility" },
        );
      }

      sections.slice(1).forEach((section) => {
        gsap.from(section, {
          autoAlpha: 0,
          y: 36,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform,opacity,visibility",
          scrollTrigger: { trigger: section, start: "top 88%", once: true },
        });
      });

      if (cards.length) {
        gsap.set(cards, { autoAlpha: 0, y: 22 });
        ScrollTrigger.batch(cards, {
          start: "top 92%",
          once: true,
          interval: 0.08,
          batchMax: 4,
          onEnter: (batch) => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "power2.out", overwrite: true, clearProps: "transform,opacity,visibility" }),
        });
      }
    });

    return () => media.revert();
  }, { scope, dependencies: [routeKey], revertOnUpdate: true });

  return <div ref={scope} className="min-h-screen">{children}</div>;
}

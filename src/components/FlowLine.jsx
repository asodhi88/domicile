// src/components/FlowLine.jsx
//
// Decorative connector: a straight gradient rail that runs down the left
// margin from the "Step 1 · Update your accounts" (BuildingsPanel) kicker to
// the "Step 2 · Enter a ticker" (TickerSearch) kicker, with a pulsing blip
// beside each. It overlays <main> (which must be position:relative) and
// measures the real DOM anchors, so it tracks layout across breakpoints.
// Purely decorative — aria-hidden, no text of its own.
//
// Colors come from the --flow-* CSS variables in index.css so they follow the
// theme: brass/moss/clay gradient with yellow dots in dark mode, and the dark
// theme's navy in light mode.

import { useLayoutEffect, useRef, useState } from "react";

export default function FlowLine() {
  const overlayRef = useRef(null);
  const [geo, setGeo] = useState(null);

  useLayoutEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    function measure() {
      const step1 = document.getElementById("step1-kicker");
      const step2 = document.getElementById("step2-kicker");
      if (!step1 || !step2) return;

      const base = overlay.getBoundingClientRect();
      const s1 = step1.getBoundingClientRect();
      const s2 = step2.getBoundingClientRect();

      // Straight rail in the margin just left of the left-aligned content
      // edge, running from the Step 1 kicker down to the Step 2 kicker.
      const s1y = s1.top - base.top + s1.height / 2;
      const s2y = s2.top - base.top + s2.height / 2;
      const railX = Math.max(10, s1.left - base.left - 26);

      const d = `M ${railX} ${s1y} L ${railX} ${s2y}`;

      setGeo({
        w: base.width,
        h: base.height,
        d,
        blips: [
          { x: railX, y: s1y },
          { x: railX, y: s2y },
        ],
      });
    }

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(overlay);
    // Re-measure once webfonts settle — they shift text metrics.
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
    >
      {geo && (
        <>
          <svg
            className="absolute inset-0"
            width={geo.w}
            height={geo.h}
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            fill="none"
          >
            <defs>
              <linearGradient
                id="flowLineGrad"
                gradientUnits="userSpaceOnUse"
                x1="0"
                y1="0"
                x2="0"
                y2={geo.h}
              >
                <stop offset="0%" style={{ stopColor: "var(--flow-stop-1)" }} />
                <stop offset="55%" style={{ stopColor: "var(--flow-stop-2)" }} />
                <stop offset="100%" style={{ stopColor: "var(--flow-stop-3)" }} />
              </linearGradient>
            </defs>

            {/* Static base line — stays visible under reduced motion. */}
            <path
              d={geo.d}
              stroke="url(#flowLineGrad)"
              strokeOpacity="0.6"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Bright segment flowing down the path. */}
            <path
              d={geo.d}
              stroke="url(#flowLineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              pathLength="100"
              strokeDasharray="14 86"
              className="animate-flowdash"
            />
          </svg>

          {geo.blips.map((b, i) => (
            <span
              key={i}
              className="absolute flex h-3 w-3 -translate-x-1/2 -translate-y-1/2"
              style={{ left: b.x, top: b.y }}
            >
              <span
                className="absolute inset-0 animate-ping rounded-full opacity-70"
                style={{ backgroundColor: "var(--flow-dot)" }}
              />
              <span
                className="relative h-3 w-3 rounded-full"
                style={{
                  backgroundColor: "var(--flow-dot)",
                  boxShadow: "0 0 8px var(--flow-dot-glow)",
                }}
              />
            </span>
          ))}
        </>
      )}
    </div>
  );
}

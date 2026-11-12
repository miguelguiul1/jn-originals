import type { CSSProperties } from "react";
import fullSvg from "../../public/img/brand/logo-jn.svg?raw";
import markSvg from "../../public/img/brand/mark-jn.svg?raw";

/** Logo inline: herda currentColor. Nunca reescrito em fonte. */
export function Logo({ variant = "full", className = "", label = true, style }: { variant?: "full" | "mark"; className?: string; label?: boolean; style?: CSSProperties }) {
  return (
    <span
      style={style}
      className={`logo block ${className}`}
      {...(label ? { role: "img", "aria-label": "JN Originals" } : { "aria-hidden": true })}
      dangerouslySetInnerHTML={{ __html: variant === "full" ? fullSvg : markSvg }}
    />
  );
}

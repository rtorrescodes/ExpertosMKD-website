import React from "react";

interface BorderBeamProps {
  className?: string;
  size?: number;
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
  delay?: number;
}

export const BorderBeam = ({
  className = "",
  duration = 8,
  colorFrom = "#06b6d4", // Cyan 500
  colorTo = "#a855f7",   // Purple 500
  borderWidth = 2,
}: BorderBeamProps) => {
  return (
    <div
      className={`pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden ${className}`}
      style={{
        padding: borderWidth,
        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
        maskComposite: "exclude",
        WebkitMaskComposite: "xor",
      }}
    >
      <div
        className="absolute left-1/2 top-1/2 aspect-square w-[300%] -translate-x-1/2 -translate-y-1/2 animate-spin"
        style={{
          background: `conic-gradient(from 0deg, transparent 70%, ${colorFrom} 85%, ${colorTo} 100%)`,
          animationDuration: `${duration}s`,
        }}
      />
    </div>
  );
};

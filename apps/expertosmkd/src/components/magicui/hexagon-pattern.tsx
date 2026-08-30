import React from "react";

interface HexagonPatternProps {
  className?: string;
  size?: number;
}

export function HexagonPattern({ className = "", size = 32 }: HexagonPatternProps) {
  const width = size * 1.732;
  const height = size * 3;

  return (
    <svg
      className={`absolute inset-0 h-full w-full pointer-events-none ${className}`}
      width="100%"
      height="100%"
    >
      <defs>
        <pattern
          id="hexagon-pattern"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1.5)"
        >
          {/* Main Hexagon */}
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            d={`M${width / 2} 0
               L${width} ${size * 0.5}
               L${width} ${size * 1.5}
               L${width / 2} ${size * 2}
               L0 ${size * 1.5}
               L0 ${size * 0.5}
               Z`}
          />
          {/* Vertical connecting line */}
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            d={`M${width / 2} ${size * 2} V${height}`}
          />
          {/* Offset Hexagon half-drawn to tile properly */}
          <path
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            d={`M0 ${size * 1.5}
               L${-width / 2} ${size * 2}
               L${-width / 2} ${size * 3}
               L0 ${size * 3.5}
               L${width / 2} ${size * 3}
               L${width / 2} ${size * 2}`}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
    </svg>
  );
}

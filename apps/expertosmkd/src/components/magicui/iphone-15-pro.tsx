import React from "react";

interface Iphone15ProProps {
  src?: string;
  className?: string;
  innerClassName?: string;
}

export function Iphone15Pro({
  src,
  className = "",
  innerClassName = "",
}: Iphone15ProProps) {
  return (
    <div className={`relative rounded-[2.5rem] p-1.5 bg-slate-900/40 border border-white/20 shadow-2xl aspect-[9/19] ${className}`}>
      {/* Outer Frame (Glassy border) */}
      {/* Dynamic Island / Notch Area */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-20 flex items-center justify-between px-2 shadow-inner border border-white/5">
           <div className="w-1.5 h-1.5 rounded-full bg-blue-900/50 ml-1"></div>
           <div className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700"></div>
        </div>

        {/* Inner Screen */}
        <div className={`relative w-full h-full rounded-[2.3rem] overflow-hidden bg-black border border-white/5 ${innerClassName}`}>
          {src && <img src={src} className="w-full h-full object-cover" alt="iPhone Mockup" />}
          
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-white/30 rounded-full z-20"></div>
        </div>

        {/* Buttons (Moved slightly to account for new padding) */}
        <div className="absolute -left-1 top-24 w-1 h-6 bg-white/20 rounded-l-md"></div>
        <div className="absolute -left-1 top-36 w-1 h-10 bg-white/20 rounded-l-md"></div>
        <div className="absolute -left-1 top-52 w-1 h-10 bg-white/20 rounded-l-md"></div>
        <div className="absolute -right-1 top-36 w-1 h-14 bg-white/20 rounded-r-md"></div>
      </div>
  );
}

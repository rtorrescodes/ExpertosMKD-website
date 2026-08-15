import React from "react";

interface SafariProps {
  url?: string;
  src?: string;
  className?: string;
  innerClassName?: string;
}

export function Safari({
  url = "expertosmkd.com",
  src,
  className = "",
  innerClassName = "",
}: SafariProps) {
  return (
    <div
      className={`relative rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl ${className}`}
    >
      {/* Top Bar */}
      <div className="flex items-center px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md">
        <div className="flex gap-2 w-16">
          <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-500/20"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-500/20"></div>
        </div>
        
        <div className="flex-1 flex justify-center">
          <div className="bg-black/40 text-center text-xs text-white/50 rounded-md py-1.5 px-6 border border-white/5 shadow-inner w-full max-w-xs flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            {url}
          </div>
        </div>
        
        <div className="w-16"></div>
      </div>
      
      {/* Content */}
      <div className={`relative w-full bg-black/40 ${innerClassName}`}>
        {src && <img src={src} className="w-full h-auto object-cover" alt="Browser Mockup" />}
      </div>
    </div>
  );
}

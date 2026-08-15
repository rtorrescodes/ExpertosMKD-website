import React from "react";

interface ShinyButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  className?: string;
  href?: string;
}

export const ShinyButton = ({ children, className = "", href, ...props }: ShinyButtonProps) => {
  return (
    <a
      href={href}
      className={`relative inline-flex h-14 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-50 hover:scale-105 transition-transform duration-300 ${className}`}
      {...props}
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-8 py-4 text-sm font-bold text-white backdrop-blur-3xl gap-2 z-10">
        {children}
      </span>
    </a>
  );
};

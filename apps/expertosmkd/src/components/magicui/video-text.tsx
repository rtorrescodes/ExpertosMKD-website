import React from "react";

interface VideoTextProps {
  text: string;
  videoSrc?: string;
  className?: string;
}

export const VideoText = ({
  text,
  videoSrc,
  className = "",
}: VideoTextProps) => {
  return (
    <span 
      className={`relative inline-block text-transparent bg-clip-text bg-[length:400%_400%] ${className}`}
      style={{
        backgroundImage: 'linear-gradient(270deg, #06b6d4, #3b82f6, #8b5cf6, #d946ef, #06b6d4)',
        animation: 'oceanWave 6s ease infinite',
      }}
    >
      {text}
      
      <style>{`
        @keyframes oceanWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </span>
  );
};

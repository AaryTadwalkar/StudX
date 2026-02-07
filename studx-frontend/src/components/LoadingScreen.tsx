
import React, { useEffect, useState } from 'react';

const LoadingScreen: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8fbff]">
      <div className="relative mb-8">
        <div className="flex items-center gap-2">
           <span className="text-4xl font-bold text-[#1a73e8]">Stud</span>
           <span className="text-4xl font-bold text-[#34a853]">X</span>
        </div>
        <div className="text-xs text-gray-400 font-medium tracking-widest text-center mt-1">
          CAMPUS MARKETPLACE
        </div>
        {/* Animated star spark icon */}
        <div className="absolute -top-4 -right-6 text-blue-500 animate-pulse">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
           </svg>
        </div>
      </div>

      <div className="w-64 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;

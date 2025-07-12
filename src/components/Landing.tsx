import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white animate-pulse-subtle"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-white opacity-30"></div>
        <div className="absolute top-1/2 left-10 w-16 h-16 border border-white opacity-20 transform rotate-45"></div>
      </div>
      
      {/* Content */}
      <div className="text-center z-10 px-4 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-light text-white mb-4 tracking-tight leading-tight">
          <span className="block font-extralight">Skill Match.</span>
          <span className="block font-light">Collaborate.</span>
          <span className="block font-medium">Grow.</span>
        </h1>
        
        <p className="text-white/60 text-lg mb-12 max-w-md mx-auto leading-relaxed">
          Connect with talented professionals and build amazing projects together
        </p>
        
        <button
          onClick={() => navigate('/home')}
          className="group relative px-12 py-4 bg-white text-black text-lg font-medium rounded-full transition-all duration-300 hover:scale-105 hover:shadow-large active:scale-95"
        >
          <span className="relative z-10">Enter Platform</span>
          <div className="absolute inset-0 bg-white rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
        </button>
        
        <p className="mt-8 text-white/40 text-sm">
          Placeholder for Spline 3D intro
        </p>
      </div>
    </div>
  );
};

export default Landing;
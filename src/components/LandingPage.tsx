import React from 'react';
import Spline from '@splinetool/react-spline';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Spline full screen background */}
      <Spline
        scene="https://prod.spline.design/NDZ5egs4mkmcGM3G/scene.splinecode"
        className="absolute inset-0 w-full h-full"
      />

      {/* Button container using safe padding */}
      <div className="absolute bottom-6 right-6 z-10">
        <button
          onClick={onGetStarted}
          className="px-6 py-3 bg-white text-black text-lg font-semibold rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          Enter Platform
        </button>
      </div>
    </div>
  );
};

export default LandingPage;

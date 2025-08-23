'use client';

// Temporary stub component - 3D functionality disabled due to React Three Fiber compatibility issues
export default function LandingPage3D() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0f1419] via-[#1a2332] to-[#2A3B4E] flex items-center justify-center">
      <div className="text-center text-[#4ECDC4]">
        <div className="text-3xl mb-4">📊</div>
        <h2 className="text-xl font-bold mb-2">Interactive 3D Experience</h2>
        <p className="text-sm opacity-70 max-w-md">
          Our 3D mathematical visualizations are temporarily unavailable while we resolve
          compatibility issues.
        </p>
        <p className="text-xs opacity-50 mt-3">Check back soon for enhanced 3D features!</p>
      </div>
    </div>
  );
}

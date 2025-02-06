'use client';

import React, { useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ParameterPanel from '@/components/ConfiguratorPage/ParameterPanel/ParameterPanel';

// Import ThreeViewer with no SSR
const ThreeViewer = dynamic(
  () => import('@/components/ConfiguratorPage/Viewer/ThreeViewer'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-neutral-900">
        <div className="text-white text-lg">Loading 3D Viewer...</div>
      </div>
    )
  }
);

const ConfiguratorPage = () => {
  const [frameColor, setFrameColor] = useState('#FF0000');

  return (
    <div className="h-screen flex flex-col bg-neutral-900">
      {/* Header */}
      <header className="h-16 px-4 flex items-center justify-between bg-neutral-800/50 backdrop-blur-md">
        <h1 className="text-xl font-bold text-white">Mango Bikes</h1>
        <div>
          <button className="px-6 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition-colors">
            Buy Now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Viewer */}
        <div className="flex-1 relative">
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center bg-neutral-900">
              <div className="text-white text-lg">Loading 3D Viewer...</div>
            </div>
          }>
            <ThreeViewer 
              modelPath="/models/Bike Frame.glb" 
              color={frameColor}
            />
          </Suspense>
        </div>

        {/* Parameter Panel */}
        <div className="w-[22rem] border-l border-neutral-800">
          <ParameterPanel 
            onColorChange={setFrameColor}
            initialColor={frameColor}
          />
        </div>
      </main>
    </div>
  );
};

export default ConfiguratorPage; 
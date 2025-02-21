'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ParameterPanel from '@/components/ConfiguratorPage/ParameterPanel/ParameterPanel';
import modelConfigs, { ModelConfig, colors } from '@/components/ConfiguratorPage/Viewer/defaults';
import BackgroundColorModal from '@/components/ConfiguratorPage/BackgroundColorModal/BackgroundColorModal';

// Import ThreeViewer with no SSR
const ThreeViewer = dynamic(
  () => import('@/components/ConfiguratorPage/Viewer/ThreeViewer'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-black text-lg">Loading 3D Viewer...</div>
      </div>
    )
  }
);

const ConfiguratorPage = () => {
  const [configs, setConfigs] = useState(modelConfigs);
  const [backgroundColor, setBackgroundColor] = useState(colors.mangoOrange.hex); // Default mango orange
  const [showColorPicker, setShowColorPicker] = useState(false);

  // Get background color from local storage or set default
  useEffect(() => {
    const storedColor = localStorage.getItem('configurator-background');
    if (storedColor) {
      setBackgroundColor(storedColor);
    } else {
      localStorage.setItem('configurator-background', colors.mangoOrange.hex);
    }
  }, []);

  // Function to update the configuration
  const handleConfigChange = (newConfigs: ModelConfig[]) => {
    console.log(newConfigs, "newConfigs");
    setConfigs(newConfigs);
  };

  // Function to handle background color change
  const handleColorChange = (color: any) => {
    setBackgroundColor(color.hex);
    localStorage.setItem('configurator-background', color.hex);
  };

  return (
    <div className="h-screen flex flex-col" style={{ backgroundColor }}>
      {/* Header */}
      <header className="h-16 px-4 flex items-center justify-between bg-black backdrop-blur-md">
        <h1 className="text-xl font-bold text-white">Mango Bikes</h1>
        <div className="flex items-center">
          <div 
            className="w-6 h-6 rounded-full cursor-pointer"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="100%"
              height="100%"
            >
              <g fill="none">
                <path
                  fill={colors.mangoOrange.hex}
                  d="M2.75 12A9.25 9.25 0 0 0 12 21.25V2.75A9.25 9.25 0 0 0 2.75 12"
                ></path>
                <path
                  stroke={colors.mangoOrange.hex}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 21.25a9.25 9.25 0 0 0 0-18.5m0 18.5a9.25 9.25 0 0 1 0-18.5m0 18.5V2.75"
                ></path>
              </g>
            </svg>
          </div>
          <button className="ml-4 px-6 py-2 text-sm font-medium text-white border border-mangoOrange bg-mangoOrange rounded-lg hover:bg-black transition-colors">
            Buy Now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {showColorPicker && 
          <div>
            <BackgroundColorModal 
              isOpen={showColorPicker} 
              onClose={() => setShowColorPicker(false)} 
              value={backgroundColor} 
              onChange={handleColorChange} 
            />
          </div>
        }
        {/* Parameter Panel */}
        <div>
          <ParameterPanel 
            onConfigChange={handleConfigChange}
            configs={configs}
          />
        </div>
        {/* Viewer */}
        <div className="flex-1 relative bg-[`${backgroundColor}`]">
          <div className="h-full relative">
            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-64 h-28 bg-no-repeat bg-contain" style={{ backgroundImage: "url('assets/mango-bikes.png')" }}></div>
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center z-10">
                <div className="text-black text-lg">Loading 3D Viewer...</div>
              </div>
            }>
              <ThreeViewer 
                configs={configs}
                setConfigs={setConfigs}
              />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ConfiguratorPage; 
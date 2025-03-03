'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import ParameterPanel from '@/components/ConfiguratorPage/ParameterPanel/ParameterPanel';
import modelConfigs, { ModelConfig, colors } from '@/components/ConfiguratorPage/Viewer/defaults';
import Header from '@/components/ConfiguratorPage/Header/Header';

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
  const [backgroundColor, setBackgroundColor] = useState(colors.mangoOrange.hex);

  // Function to update the configuration
  const handleConfigChange = (newConfigs: ModelConfig[]) => {
    console.log(newConfigs, "newConfigs");
    setConfigs(newConfigs);
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor }}>
      {/* Header */}
      <Header configs={configs} onConfigChange={handleConfigChange} onBackgroundColorChange={(color: string) => setBackgroundColor(color)}/>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
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
'use client';

import React, { useState, Suspense, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ParameterPanel from '@/components/ConfiguratorPage/ParameterPanel/ParameterPanel';
import modelConfigs, { ModelConfig } from '@/components/ConfiguratorPage/Viewer/defaults';

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
  // Bruk en enkelt useState for å håndtere alle parametere i en config
  const [configs, setConfigs] = useState(modelConfigs);


  // Funksjon for å oppdatere konfigurasjonen
  const handleConfigChange = (newConfigs: ModelConfig[]) => {
    console.log(newConfigs);
    setConfigs(newConfigs);
  };

  return (
    <div className="h-screen flex flex-col bg-neutral-900">
      {/* Header */}
      <header className="h-16 px-4 flex items-center justify-between bg-black backdrop-blur-md">
        <h1 className="text-xl font-bold text-white">Mango Bikes</h1>
        <div>
          <button className="px-6 py-2 text-sm font-medium text-white border border-mangoOrange bg-mangoOrange rounded-lg hover:bg-black transition-colors">
            Buy Now
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Parameter Panel */}
        <div className="border-l border-neutral-800">
          <ParameterPanel 
            onConfigChange={handleConfigChange}
            configs={configs}
          />
        </div>
        {/* Viewer */}
        <div className="flex-1 relative bg-mangoOrange">
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
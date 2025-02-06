'use client';

import React, { useState } from 'react';
import { ColorPicker } from './parameterTypes/ColorPicker';
import { PARAMETER_DEFINITIONS, type ParameterDefinition } from './parameterDefintions';

interface ParameterPanelProps {
  onColorChange: (color: string) => void;
  initialColor?: string;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({
  onColorChange,
  initialColor = '#FF0000'
}) => {
  const [activeTab, setActiveTab] = useState<'tubing' | 'geometry' | 'parts'>('tubing');
  const [frameColor, setFrameColor] = useState(initialColor);

  const handleColorChange = (color: string) => {
    setFrameColor(color);
    onColorChange(color);
  };

  return (
    <div className="h-full flex flex-col bg-opacity-80 bg-gray-800 backdrop-blur-md rounded-2xl overflow-hidden">
      {/* Category Navigation */}
      <div className="px-4 py-2 border-b border-gray-700">
        <div className="flex gap-2">
          {['tubing', 'geometry', 'parts'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 font-medium capitalize rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
              }`}
              onClick={() => setActiveTab(tab as typeof activeTab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {activeTab === 'tubing' && (
          <div className="space-y-6">
            <ColorPicker
              value={frameColor}
              onChange={handleColorChange}
              label="Frame Color"
            />
            {PARAMETER_DEFINITIONS
              .filter(param => param.category === 'tubing' && param.type !== 'color')
              .map(param => (
                <div key={param.id} className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">
                    {param.name}
                  </label>
                  {param.type === 'dropdown' && (
                    <select 
                      className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
                      value={param.value}
                    >
                      {param.options?.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
          </div>
        )}
        
        {activeTab === 'geometry' && (
          <div className="space-y-6">
            {PARAMETER_DEFINITIONS
              .filter(param => param.category === 'geometry')
              .map(param => (
                <div key={param.id} className="space-y-2">
                  <label className="text-gray-300 text-sm font-medium">
                    {param.name}
                  </label>
                  {param.type === 'slider' && (
                    <div className="space-y-1">
                      <input
                        type="range"
                        min={param.min}
                        max={param.max}
                        value={param.value}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-gray-400">
                        <span>{param.min}</span>
                        <span>{param.value}</span>
                        <span>{param.max}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
        
        {activeTab === 'parts' && (
          <div className="text-gray-400 text-center py-8">
            Parts configuration coming soon...
          </div>
        )}
      </div>
    </div>
  );
};

export default ParameterPanel; 
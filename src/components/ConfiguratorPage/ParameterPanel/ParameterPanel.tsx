'use client';

import React, { useState } from 'react';
import { ColorPicker } from './parameterTypes/ColorPicker';
import { PARAMETER_DEFINITIONS, type ParameterDefinition } from './parameterDefintions';
import { Grid } from './parameterTypes/Grid/Grid';
import { ModelConfig } from '../Viewer/defaults';
import { Dropdown } from './parameterTypes/Dropdown';
import { Color } from "./parameterTypes/ColorPicker";
import { LeftMenuIcons } from './LeftMenuIcons';

interface ParameterPanelProps {
  configs: ModelConfig[];
  onConfigChange: (newConfig: ModelConfig[]) => void;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ configs, onConfigChange }) => {
  const [activeTab, setActiveTab] = useState<'frame' | 'handlebars' | 'wheels' | 'tyres' | 'saddle' | 'pedals' | undefined >();

  const handleColorChange = (color: Color, model: string, subParts?: string[]) => {
    const updatedConfigs = configs.map(config => {  
      if (config.name === model && config.subParts && subParts) {
        return {
          ...config,
          subParts: config.subParts.map((part) =>
            subParts.includes(part.name) ? { ...part, color: color } : part
          ),
        };
      }
      
      return config;
    });
    onConfigChange(updatedConfigs);
  };
  

  const handleTypeChange = (value: string, model: string) => {
    const updatedConfigs = configs.map(config => {
      if (config.name === model) {
        return { ...config, path: value };
      }
      return config;
    });
    onConfigChange(updatedConfigs);
  };

  const findCurrentColor = (model: string, subPart?: string): string | undefined => {
    const config = configs.find(config => config.name === model);
    if (config && config.subParts) {
      const subPartConfig = config.subParts.find(part => part.name === subPart);
      return subPartConfig?.color?.hex || config.color;
    }
    if (config && !config.subParts) {
      return config.color;
    }
  };

  const renderParameters = (category: string) => {
    const params = PARAMETER_DEFINITIONS.filter(param => param.category === category);

    return params.map(param => (
      <div key={param.id} className="space-y-2">
        <label className="text-gray-300 text-sm font-medium">
          {param.name}
        </label>
        {param.type === 'dropdown' && (
          <Dropdown
            value={configs.find(config => config.name === param.model)?.path || param.value}
            options={param.options || []}
            onChange={(value) => handleTypeChange(value, param.model)}
            label={param.name}
          />
        )}

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
        {param.type === 'grid' && (
          <Grid
            definition={param}
            value={configs.find(config => config.name === param.model)?.path || param.value}
            onChange={(value) => handleTypeChange(value, param.model)}
          />
        )}
        {param.type === 'color' && (
          <ColorPicker
            value={findCurrentColor(param.model, param?.subPart?.[0]) || param.value}
            onChange={(color) => handleColorChange(color, param.model, param.subPart)} // Pass array of subparts
            colors={param.colors}
          />
        )}
      </div>
    ));
  };

  return (
    <div className={`h-full flex w-24 bg-black transition-width duration-300 pl-2 pr-2`}>
      <div className="max-h-full flex flex-col items-center justify-start py-4 space-y-3 text-white align-middle flex-1 overflow-y-auto custom-scrollbar">
        {['Frame', 'Handlebars', 'Stem', 'Grips', 'Wheels', 'Tyres', 'Saddle', 'Seat Post', 'Pedals', 'Chain'].map((tab) => (
          <button 
            key={tab}
            className={`relative w-full flex flex-col items-center justify-center pt-1 pb-1 rounded-lg 
                       ${activeTab === tab ? 'bg-mangoOrange' : 'hover:bg-neutral-800/50'}`}
            onClick={() => { activeTab === tab ? setActiveTab(undefined) : setActiveTab(tab as any); }}
          >
            <div className='w-12 h-12 flex justify-center items-center mb-1'>
              {LeftMenuIcons[tab as keyof typeof LeftMenuIcons] ? (
                <div className={`w-8 h-8 transition-colors duration-200 
                                ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}>
                  {LeftMenuIcons[tab as keyof typeof LeftMenuIcons]}
                </div>
              ) : (
                <img 
                  src={`assets/icons/${tab}.png`} 
                  alt={tab} 
                  className={`w-8 h-8 object-contain transition-opacity duration-200
                             ${activeTab === tab ? 'opacity-100' : 'opacity-70'}`}
                />
              )}
            </div>
            <span className={`text-xs text-center transition-colors duration-200
                            ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}>
              {tab}
            </span>
          </button>
        ))}
      </div>
      
      {activeTab && (
        <div className="absolute left-28 top-1/2 transform -translate-y-1/2 w-64 p-4 space-y-2 bg-black bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg z-10">
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-300 text-sm font-medium">
              {activeTab}
            </p>
            <button 
              className="text-gray-300 text-sm font-medium absolute right-5"
              onClick={() => setActiveTab(undefined)}
            >
              &#10006;&#xfe0e;
            </button>
          </div>
          {renderParameters(activeTab)}
        </div>
      )}
    </div>
  );
};

export default ParameterPanel;

'use client';

import React, { useState } from 'react';
import { ColorPicker } from './parameterTypes/ColorPicker';
import { PARAMETER_DEFINITIONS, type ParameterDefinition } from './parameterDefintions';
import { Grid } from './parameterTypes/Grid/Grid';
import { ModelConfig } from '../Viewer/defaults';
import { Dropdown } from './parameterTypes/Dropdown';
import { Color } from "./parameterTypes/ColorPicker";

interface ParameterPanelProps {
  configs: ModelConfig[];
  onConfigChange: (newConfig: ModelConfig[]) => void;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ configs, onConfigChange }) => {
  const [activeTab, setActiveTab] = useState<'frame' | 'handlebars' | 'wheels' | 'tyres' | 'saddle' | 'pedals' | undefined >();

  const handleColorChange = (color: Color, model: string, subParts?: string[]) => {
    const updatedConfigs = configs.map(config => {
      if (config.name === model && config.color) {
        return {
          ...config,
          color: color.hex
        };
      }
  
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
            value={findCurrentColor(param.model, param?.subPart) || param.value}
            onChange={(color) => handleColorChange(color, param.model, param.subPart)} // Pass array of subparts
            colors={param.colors}
          />
        )}
      </div>
    ));
  };

  return (
    <div className={`h-full flex w-24 bg-black transition-width duration-300`}>
      <div className="flex flex-col items-center justify-center py-4 space-y-6 text-white align-middle flex-1">
        {['frame', 'handlebars', 'wheels', 'tyres', 'saddle', 'pedals'].map((tab) => (
          <button 
            key={tab}
            className={`relative flex flex-col items-center justify-center bg-transparent p-0 m-0 pb-1`}
            onClick={() => { activeTab === tab ? setActiveTab(undefined) : setActiveTab(tab as any); }}
          >
            <img src={`assets/icons/${tab}.png`} alt={tab} className="w-10 h-10" />
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
            <div 
              className={`absolute bottom-0 left-0 h-0.5 bg-mangoOrange transition-all duration-300 transform origin-left ${activeTab === tab ? 'scale-x-100' : 'scale-x-0'}`}
              style={{ width: '100%' }}
            ></div>
          </button>
        ))}
      </div>
      
      {activeTab && (
        <div className="absolute left-28 top-1/2 transform -translate-y-1/2 w-64 p-4 space-y-2 bg-black bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg z-10">
          <div className="flex flex-col items-center justify-center">
            <button className="text-gray-300 text-sm font-medium">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
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

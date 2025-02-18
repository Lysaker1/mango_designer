'use client';

import React, { useState } from 'react';
import { ColorPicker } from './parameterTypes/ColorPicker';
import { PARAMETER_DEFINITIONS, type ParameterDefinition } from './parameterDefintions';
import { Grid } from './parameterTypes/Grid/Grid';
import { ModelConfig } from '../Viewer/defaults';
import { Dropdown } from './parameterTypes/Dropdown';
import { Color } from "./parameterTypes/ColorPicker";
import { getStyleSuggestion } from '@/services/styleAgent';

interface ParameterPanelProps {
  configs: ModelConfig[];
  onConfigChange: (newConfig: ModelConfig[]) => void;
}

interface StyleConfig {
  name: string;
  color?: string | { hex: string; label: string };
  subParts?: {
    name: string;
    color: { hex: string; label: string };
  }[];
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ configs, onConfigChange }) => {
  const [activeTab, setActiveTab] = useState<'frame' | 'handlebars' | 'wheels' | 'saddle' | 'pedals' | 'style' | undefined>();
  const [stylePrompt, setStylePrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStyleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await getStyleSuggestion(stylePrompt);
      const styleConfigs = response as StyleConfig[];
      
      const updatedConfigs = configs.map(config => {
        const styleConfig = styleConfigs.find((sc: StyleConfig) => sc.name === config.name);
        if (!styleConfig) return config;

        return {
          ...config,
          color: typeof styleConfig.color === 'object' ? styleConfig.color.hex : styleConfig.color,
          subParts: styleConfig.subParts ? styleConfig.subParts.map((part) => ({
            name: part.name,
            color: { hex: part.color.hex, label: part.color.label }
          })) : config.subParts
        };
      }) as ModelConfig[];

      onConfigChange(updatedConfigs);
    } catch (error) {
      console.error('Error applying style:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorChange = (color: Color, model: string ,subPart?:string) => {
    const updatedConfigs = configs.map(config => {
      if (config.name === model && config.color) {
        return {
          ...config,
          color: color.hex
        };
      }
      if (config.name === model && config.subParts) {
        return {
          ...config,
          subParts: config.subParts.map((part) =>
            part.name === subPart ? { ...part, color: color } : part
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

  const renderParameters = (category: string) => {
    if (category === 'style') {
      return (
        <div className="p-4">
          <h2 className="text-lg font-bold mb-4 text-white">Style Assistant</h2>
          <form onSubmit={handleStyleSubmit}>
            <input
              type="text"
              value={stylePrompt}
              onChange={(e) => setStylePrompt(e.target.value)}
              placeholder="Enter a style (e.g. 'Ireland')"
              className="w-full px-3 py-2 bg-white/10 rounded-md text-white placeholder-white/50 border border-white/20 mb-4"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-white/10 rounded-md text-white hover:bg-white/20 disabled:opacity-50"
            >
              {isLoading ? 'Thinking...' : 'Apply Style'}
            </button>
          </form>
        </div>
      );
    }

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
            value={configs.find(config => config.name === param.model)?.color || param.value}
            onChange={(color) => handleColorChange(color, param.model,param?.subPart)}
            colors={param.colors}
          />
        )}
      </div>
    ));
  };

  return (
    <div className={`h-full flex w-24 bg-black transition-width duration-300`}>
      <div className="flex flex-col items-center justify-center py-4 space-y-6 text-white align-middle flex-1">
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => { activeTab === 'frame' ? setActiveTab(undefined) : setActiveTab('frame');  }}
        >
          <img src="assets/icons/frame.png" alt="Frame" className="w-10 h-10" />
          <span>Frame</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => { activeTab === 'handlebars' ? setActiveTab(undefined) : setActiveTab('handlebars'); }}
        >
          <img src="assets/icons/handlebars.png" alt="Handlebars" className="w-10 h-10" />
          <span>Handlebars</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => { activeTab === 'wheels' ? setActiveTab(undefined) : setActiveTab('wheels'); }}
        >
          <img src="assets/icons/wheels.png" alt="Wheels" className="w-10 h-10" />
          <span>Wheels</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => { activeTab === 'saddle' ? setActiveTab(undefined) : setActiveTab('saddle'); }}
        >
          <img src="assets/icons/saddle.png" alt="Saddle" className="w-10 h-10" />
          <span>Saddle</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => { activeTab === 'pedals' ? setActiveTab(undefined) : setActiveTab('pedals'); }}
        >
          <img src="assets/icons/pedals.png" alt="Pedals" className="w-10 h-10" />
          <span>Pedals</span>
        </button>
        <button 
          className="flex flex-col items-center justify-center"
          onClick={() => { activeTab === 'style' ? setActiveTab(undefined) : setActiveTab('style'); }}
        >
          <div className="w-10 h-10 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>Style</span>
        </button>
      </div>
      {activeTab && (
        <div className="absolute left-28 top-1/2 transform -translate-y-1/2 w-64 p-4 space-y-2 bg-black bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg z-10">
          <div className="flex flex-col items-center justify-center">
            <button className="text-gray-300 text-sm font-medium">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
          {renderParameters(activeTab)}
        </div>
      )}
    </div>
  );
};

export default ParameterPanel; 
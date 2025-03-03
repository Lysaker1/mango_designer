'use client';

import React, { useState, ReactElement, SVGProps } from 'react';
import { ColorPicker } from './parameterTypes/ColorPicker';
import { PARAMETER_DEFINITIONS, type ParameterDefinition } from './parameterDefintions';
import { Grid } from './parameterTypes/Grid/Grid';
import {frames, ModelConfig, rearWheelDefaults} from '../Viewer/defaults';
import { Dropdown } from './parameterTypes/Dropdown';
import { Color } from "./parameterTypes/ColorPicker";
import { LeftMenuIcons } from './LeftMenuIcons';
import { getStyleSuggestion } from '../../../services/styleAgent';
import { colors } from '../Viewer/defaults';
import { StyleResponse, StyleConfig } from '../../../app/api/style/route';

interface ParameterPanelProps {
  configs: ModelConfig[];
  onConfigChange: (newConfig: ModelConfig[]) => void;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ configs, onConfigChange }) => {
  const [activeTab, setActiveTab] = useState<'Frame' | 'Fork' | 'Handlebars' | 'Stem' | 'Grips' | 'Wheels' | 'Tyres' | 'Saddle' | 'Seat Post' | 'Pedals' | 'Chain' | 'AI Style' | undefined>('AI Style');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [parameters, setParameters] = useState<ParameterDefinition[]>(PARAMETER_DEFINITIONS);

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
  

  const handleTypeChange = (value: string, model: string, type: string, param: ParameterDefinition, price?: number) => {
    // Get current frame type
    const currentFrameType = configs.find(config => config.name === "Frame")?.type;
    
    if(model === "Frame"){
      // User is changing the frame
      const updatedConfigs = configs.map((config) => {
        if (config.name === model) {
          return { ...config, path: value, type, price };
        }
        
        // Auto-select correct rear wheel based on frame type
        if (config.name === "Rear Wheel") {
          if (type === "DOG") {
            return { 
              ...config, 
              path: "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_DiscBrake.glb", 
              type: "Cassette Wheel",
              price 
            };
          } else if (type === "OG") {
            return { 
              ...config, 
              path: "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_RimBrake.glb", 
              type: "Cassette Wheel",
              price 
            };
          } else { // OSS or Moosher
            return { 
              ...config, 
              path: "/models/Mango_Wheels_Rear_MultiSpoke_SingleCog_RimBrake.glb", 
              type: "45mm Deep Dish Rim",
              price 
            };
          }
        }
        
        // Auto-select correct front wheel based on frame type
        if (config.name === "Front Wheel") {
          if (type === "DOG") {
            return { 
              ...config, 
              path: "/models/Mango_Wheels_Front_MultiSpoke_DiscBrake.glb", 
              type: "45mm Deep Dish Rim",
              price 
            };
          } else { // OG, OSS, or Moosher
            return { 
              ...config, 
              path: "/models/Mango_Wheels_Front_MultiSpoke_RimBrake.glb", 
              type: "45mm Deep Dish Rim",
              price 
            };
          }
        }
        
        return config;
      });  
      onConfigChange(updatedConfigs);
    } else if (model === "Front Wheel") {
      // User is manually changing front wheel
      const frameType = configs.find(config => config.name === "Frame")?.type;
      
      // Enforce compatibility with frame type
      let correctedValue = value;
      
      // If DOG frame but trying to use rim brake wheel, correct it
      if (frameType === "DOG" && !value.includes("DiscBrake") && value.includes("MultiSpoke")) {
        correctedValue = "/models/Mango_Wheels_Front_MultiSpoke_DiscBrake.glb";
      }
      
      // If non-DOG frame but trying to use disc brake wheel, correct it
      if (frameType !== "DOG" && value.includes("DiscBrake")) {
        correctedValue = "/models/Mango_Wheels_Front_MultiSpoke_RimBrake.glb";
      }
      
      const updatedConfigs = configs.map(config => {
        if (config.name === model) {
          return { ...config, path: correctedValue, type, price };
        }
        return config;
      });
      onConfigChange(updatedConfigs);
    } else if (model === "Rear Wheel") {
      // User is manually changing rear wheel
      const frameType = configs.find(config => config.name === "Frame")?.type;
      
      // Enforce compatibility with frame type
      let correctedValue = value;
      let correctedType = type;
      
      // Apply frame-specific corrections
      if (frameType === "DOG" && !value.includes("DiscBrake") && value.includes("MultiSpoke")) {
        correctedValue = "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_DiscBrake.glb";
        correctedType = "Cassette Wheel";
      } else if (frameType === "OG" && !value.includes("Cassette")) {
        correctedValue = "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_RimBrake.glb";
        correctedType = "Cassette Wheel";
      } else if ((frameType === "OSS" || frameType === "Moosher") && 
                 !value.includes("SingleCog") && 
                 !value.includes("6SpokeMag")) {
        correctedValue = "/models/Mango_Wheels_Rear_MultiSpoke_SingleCog_RimBrake.glb";
        correctedType = "45mm Deep Dish Rim";
      }
      
      const updatedConfigs = configs.map(config => {
        if (config.name === model) {
          return { ...config, path: correctedValue, type: correctedType, price };
        }
        return config;
      });
      onConfigChange(updatedConfigs);
    } else {
      // Regular component change (not frame or wheels)
      const updatedConfigs = configs.map(config => {
        if (config.name === model) {
          return { ...config, path: value, type, price };
        }
        return config;
      });
      onConfigChange(updatedConfigs);
    }
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

  const handleStyleGeneration = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    
    try {
      const response = await getStyleSuggestion(prompt);
      console.log("Raw API response:", response);
      
      const updatedConfigs = configs.map(config => {
        const styleConfig = response.find((sc: any) => sc.name === config.name);
        if (!styleConfig) return config;

        // Debug logging
        console.log(`Processing config for: ${config.name}`);
        console.log('StyleConfig:', styleConfig);

        const paramDefs = PARAMETER_DEFINITIONS.filter(
          param => param.model === config.name || 
                  (config.subParts?.some(part => param.subPart?.includes(part.name)))
        );

        // Debug logging
        console.log('Matching paramDefs:', paramDefs);

        const updatedSubParts = config.subParts?.map(part => {
          const stylePart = styleConfig.subParts?.find((sp: any) => 
            sp.name === part.name
          );
          
          // Debug logging
          console.log(`Processing part: ${part.name}`);
          console.log('StylePart found:', stylePart);

          if (!stylePart?.color?.label) return part;

          const matchingParamDefs = paramDefs.filter(
            param => param.subPart?.includes(part.name)
          );

          // Debug logging
          console.log('Matching paramDefs for part:', matchingParamDefs);

          for (const paramDef of matchingParamDefs) {
            if (paramDef?.colors) {
              const matchedColor = Object.entries(paramDef.colors).find(
                ([key, color]) => {
                  const styleLabel = stylePart.color.label.toLowerCase();
                  return key.toLowerCase() === styleLabel || 
                         color.label.toLowerCase() === styleLabel;
                }
              );

              if (matchedColor) {
                console.log(`Updating ${config.name} - ${part.name} to:`, matchedColor[1]);
                return {
                  ...part,
                  color: matchedColor[1]
                };
              }
            }
          }
          return part;
        });

        return {
          ...config,
          subParts: updatedSubParts
        };
      });

      console.log("Updated configs:", updatedConfigs);
      onConfigChange(updatedConfigs);
    } catch (error) {
      console.error('Error in style generation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderParameters = (category: string) => {
    if (category === 'AI Style') {
      return (
        <div className="p-4">
          <textarea
            className="w-full p-3 bg-neutral-800/50 text-white rounded-lg mb-2.5
                      border border-transparent hover:border-neutral-700 
                      focus:border-mangoOrange focus:outline-none"
            placeholder="Describe your bike style..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
          <button
            className={`w-full p-3 rounded-lg transition-colors duration-200
                      ${isLoading 
                        ? 'bg-neutral-700 text-gray-400 cursor-not-allowed' 
                        : 'bg-mangoOrange text-white hover:bg-opacity-90'}`}
            onClick={handleStyleGeneration}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate Style'}
          </button>
        </div>
      );
    }

    const params = PARAMETER_DEFINITIONS.filter(param => param.category === category);

    return params.map(param => !param.disabled && (
      <div key={param.id} className="space-y-2">
        <div className='flex justify-between'>
        <label className="text-gray-300 text-sm font-medium">
          {param.name}
        </label>

        {configs.find(config => config.name === param.model)?.price && 
         param.showPrice && (
          <label className="text-gray-300 text-sm font-medium">
            + £{configs.find(config => config.name === param.model)?.price}
          </label>
        )}
        </div>

        {param.type === 'dropdown' && (
          <Dropdown
            value={configs.find(config => config.name === param.model)?.path || param.value}
            options={param.options || []}
            onChange={(value,label) => handleTypeChange(value, param.model,label,param)}
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
            onChange={(value,model,label, price) => handleTypeChange(value, model, label ,param, price )}
            frameType={configs[0].type as string}
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

  const renderContent = () => {
    switch (activeTab) {
      case 'AI Style':
        return (
          <div className="rounded-3xl w-full mb-4">
            <textarea
              className="w-full p-3 bg-neutral-800/50 text-white rounded-lg mb-2.5
                        border border-transparent hover:border-neutral-700 
                        focus:border-mangoOrange focus:outline-none"
              placeholder="Describe your bike style..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
            />
            <button
              className={`w-full p-3 rounded-lg transition-colors duration-200
                        ${isLoading 
                          ? 'bg-neutral-700 text-gray-400 cursor-not-allowed' 
                          : 'bg-mangoOrange text-white hover:bg-opacity-90'}`}
              onClick={handleStyleGeneration}
              disabled={isLoading}
            >
              {isLoading ? 'Generating...' : 'Generate Style'}
            </button>
          </div>
        );
      case 'Frame':
      case 'Handlebars':
      case 'Stem':
      case 'Grips':
      case 'Wheels':
      case 'Tyres':
      case 'Saddle':
      case 'Seat Post':
      case 'Pedals':
      case 'Chain':
      case 'Fork':
        return renderParameters(activeTab);
      default:
        return null;
    }
  };

  return (
    <div className={`h-full flex w-24 bg-black transition-width duration-300 pl-2 pr-2`}>
      <div className="max-h-full flex flex-col items-center justify-start py-4 space-y-3 text-white align-middle flex-1 overflow-y-auto custom-scrollbar">
        {['AI Style', 'Frame', 'Fork', 'Handlebars', 'Stem', 'Grips', 'Wheels', 'Tyres', 'Saddle', 'Seat Post', 'Pedals', 'Chain'].map((tab) => (
          <button 
            key={tab}
            className={`relative w-full h-16 flex flex-col items-center justify-center pt-1 pb-1 rounded-lg 
                       ${activeTab === tab ? 'bg-mangoOrange' : 'hover:bg-neutral-800/50'}`}
            onClick={() => { activeTab === tab ? setActiveTab(undefined) : setActiveTab(tab as any); }}
          >
            <div className='w-12 h-12 flex justify-center items-center mb-1'>
              {LeftMenuIcons[tab as keyof typeof LeftMenuIcons] ? (
                <div className={`w-8 h-8 transition-colors duration-200 flex justify-center items-center
                                ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}>
                  {React.cloneElement(LeftMenuIcons[tab as keyof typeof LeftMenuIcons] as ReactElement<SVGProps<SVGSVGElement>>, {
                    className: 'w-full h-full',
                    style: {
                      stroke: 'currentColor',
                      strokeWidth: '1.5',
                      transform: 'scale(0.8)',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }
                  })}
                </div>
              ) : (
                <img 
                  src={`/assets/icons/${tab.toLowerCase()}.png`} 
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
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default ParameterPanel;
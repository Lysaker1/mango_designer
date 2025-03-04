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
import { 
  getDefaultConfigForFrame, 
  getCompatibleFrontWheel, 
  getCompatibleRearWheel,
  getHandlebarConfig,
  getHandlebarStyleFromPath
} from '../../../utils/componentManager';
// Make sure Slider is imported if it exists
// import { Slider } from './parameterTypes/Slider';

interface ParameterPanelProps {
  configs: ModelConfig[];
  onConfigChange: (newConfig: ModelConfig[]) => void;
}

const ParameterPanel: React.FC<ParameterPanelProps> = ({ configs, onConfigChange }) => {
  const [activeTab, setActiveTab] = useState<'Frame' | 'Fork' | 'Handlebars' | 'Stem' | 'Grips' | 'Wheels' | 'Tyres' | 'Saddle' | 'Seat Post' | 'Pedals' | 'Chain' | 'AI Style' | undefined>('AI Style');
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [parameters, setParameters] = useState<ParameterDefinition[]>(PARAMETER_DEFINITIONS);

  const handleColorChange = (color: Color, param: ParameterDefinition) => {
    const updatedConfigs = configs.map(config => {  
      if (config.name === param.model && config.subParts && param.subPart) {
        return {
          ...config,
          subParts: config.subParts.map((part) =>
            param.subPart?.includes(part.name) ? { ...part, color: color } : part
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
    
    if(model === "Frame") {
      // User is changing the frame type
      // Get default configuration for the new frame type
      const defaultConfig = getDefaultConfigForFrame(type);
      
      // Update all components based on the new frame
      const updatedConfigs = configs.map((config) => {
        if (config.name === model) {
          return { ...config, path: value, type, price };
        }
        
        // Update wheels based on frame compatibility
        if (config.name === "Front Wheel") {
          const frontWheel = defaultConfig.wheels.front;
          return { 
            ...config, 
            path: frontWheel.path, 
            type: frontWheel.type,
            price: frontWheel.price 
          };
        }
        
        if (config.name === "Rear Wheel") {
          const rearWheel = defaultConfig.wheels.rear;
          return { 
            ...config, 
            path: rearWheel.path, 
            type: rearWheel.type,
            price: rearWheel.price 
          };
        }
        
        // Update handlebar based on frame compatibility
        if (config.name === "Handlebar") {
          // Preserve the current handlebar style if possible
          const currentStyle = config.type;
          const handlebar = getHandlebarConfig(type, currentStyle);
          
          return {
            ...config,
            path: handlebar.path,
            type: handlebar.type,
            price: handlebar.price
          };
        }
        
        return config;
      });
      
      onConfigChange(updatedConfigs);
    } else if (model === "Front Wheel") {
      // User is manually changing front wheel
      const frameType = configs.find(config => config.name === "Frame")?.type || "OSS";
      
      // Get compatible front wheel based on frame type and requested wheel
      const compatibleWheel = getCompatibleFrontWheel(frameType, value);
      
      const updatedConfigs = configs.map(config => {
        if (config.name === model) {
          return { 
            ...config, 
            path: compatibleWheel.path, 
            type: compatibleWheel.type, 
            price: compatibleWheel.price || price 
          };
        }
        return config;
      });
      
      onConfigChange(updatedConfigs);
    } else if (model === "Rear Wheel") {
      // User is manually changing rear wheel
      const frameType = configs.find(config => config.name === "Frame")?.type || "OSS";
      
      // Get compatible rear wheel based on frame type and requested wheel
      const compatibleWheel = getCompatibleRearWheel(frameType, value);
      
      const updatedConfigs = configs.map(config => {
        if (config.name === model) {
          return { 
            ...config, 
            path: compatibleWheel.path, 
            type: compatibleWheel.type, 
            price: compatibleWheel.price || price 
          };
        }
        return config;
      });
      
      onConfigChange(updatedConfigs);
    } else if (model === "Handlebar") {
      // User is changing the handlebar type
      const frameType = configs.find(config => config.name === "Frame")?.type || "OSS";
      
      // Extract the style from the value (the path)
      const handlebarStyle = getHandlebarStyleFromPath(value);
      
      // Get the correct handlebar configuration
      const handlebar = getHandlebarConfig(frameType, handlebarStyle);
      
      const updatedConfigs = configs.map(config => {
        if (config.name === model) {
          return { 
            ...config, 
            path: handlebar.path, 
            type: handlebar.type, 
            price: handlebar.price || price 
          };
        }
        return config;
      });
      
      onConfigChange(updatedConfigs);
    } else {
      // Regular component change (not frame, handlebar, or wheels)
      const updatedConfigs = configs.map(config => {
        if (config.name === model) {
          return { ...config, path: value, type, price };
        }
        return config;
      });
      
      onConfigChange(updatedConfigs);
    }
  };

  const handleNonVisibleChange = (value: string, model: string, label: string, param: ParameterDefinition) => {
    const updatedConfigs = configs.map(config => {
      console.log('model', model, 'value', value)
      if (config.name === model) {
        let newConfig = { 
          ...config, 
          nonVisibleOptions: {
            ...config.nonVisibleOptions,
            [param.id]: {value: value, price: param.options?.find(option => option.value === value)?.price}
          }
        };
        
        if ((model === "Front Wheel" || model === "Rear Wheel") && value === "Gatorskin Tyre" && newConfig.subParts) {
          newConfig.subParts = newConfig.subParts.map(part => {
            if (part.name === "tube") {
              return {
                ...part,
                color: colors.black
              };
            }
            return part;
          });
        }
        
        return newConfig;
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

  /**
   * Handles the generation of bike styles based on user prompts using AI.
   * This function processes the user's text prompt, sends it to the style suggestion API,
   * and applies the returned style configurations to the bike model.
   */
  const handleStyleGeneration = async () => {
    // Don't proceed if the prompt is empty
    if (!prompt.trim()) return;
    
    // Set loading state to show feedback to the user
    setIsLoading(true);
    
    try {
      // Call the style suggestion API with the user's prompt
      const response = await getStyleSuggestion(prompt);
      console.log("Raw API response:", response);
      
      // Process each configuration in the current model
      const updatedConfigs = configs.map(config => {
        // Find the matching style configuration from the API response
        const styleConfig = response.find((sc: any) => sc.name === config.name);
        
        // If no matching style config is found, return the original config unchanged
        if (!styleConfig) return config;

        // Debug logging to track the processing of each component
        console.log(`Processing config for: ${config.name}`);
        console.log('StyleConfig:', styleConfig);

        // Find all parameter definitions that apply to this component
        // This includes both direct model matches and any that affect subparts
        const paramDefs = PARAMETER_DEFINITIONS.filter(
          param => param.model === config.name || 
                  (config.subParts?.some(part => param.subPart?.includes(part.name)))
        );

        // Debug logging for parameter definitions
        console.log('Matching paramDefs:', paramDefs);

        // Process each subpart of the component to apply style changes
        const updatedSubParts = config.subParts?.map(part => {
          
          // Check if this is a Gatorskin-tyre (front or rear) and set the color to black
          if (config.name === "Front Wheel" && 
            config.nonVisibleOptions?.frontTyreType?.value === "Gatorskin Tyre") {
          if (part.name === "tube") {
            return {
              ...part,
              color: colors.black
            };
          }
        }
        
        if (config.name === "Rear Wheel" && 
            config.nonVisibleOptions?.rearTyreType?.value === "Gatorskin Tyre") {
          console.log(`Rear Gatorskin-dekk funnet - setter fargen til svart`);
          if (part.name === "tube") {
            return {
              ...part,
              color: colors.black
            };
          }
        }
        
          // Find the matching subpart in the style configuration
          const stylePart = styleConfig.subParts?.find((sp: any) => 
            sp.name.toLowerCase() === part.name.toLowerCase()
          );
          
          // Debug logging for subpart processing
          console.log(`Processing part: ${part.name}`);
          console.log('StylePart found:', stylePart);

          // If no style part is found or it has no color label, keep the original part
          if (!stylePart?.color?.label) return part;

          // Find parameter definitions that affect this specific subpart
          const matchingParamDefs = paramDefs.filter(
            param => param.subPart?.includes(part.name)
          );

          // Debug logging for matching parameter definitions
          console.log('Matching paramDefs for part:', matchingParamDefs);

          // For each matching parameter definition, try to find a color match
          for (const paramDef of matchingParamDefs) {
            if (paramDef?.colors) {
              // Look for a color in the parameter definition that matches the style's color
              const matchedColor = Object.entries(paramDef.colors).find(
                ([key, color]) => {
                  const styleLabel = stylePart.color.label.toLowerCase();
                  // Match either by color key or by color label
                  return key.toLowerCase() === styleLabel || 
                         color.label.toLowerCase() === styleLabel;
                }
              );

              // If a matching color is found, update the part with this color
              if (matchedColor) {
                console.log(`Updating ${config.name} - ${part.name} to:`, matchedColor[1]);
                return {
                  ...part,
                  color: matchedColor[1]
                };
              }
            }
          }
          // If no matching color is found, return the original part
          return part;
        });

        // Return the updated configuration with new subpart colors
        return {
          ...config,
          subParts: updatedSubParts
        };
      });

      // Log the final updated configurations and update the model
      console.log("Updated configs:", updatedConfigs);
      onConfigChange(updatedConfigs);
    } catch (error) {
      // Handle any errors that occur during the style generation process
      console.error('Error in style generation:', error);
    } finally {
      // Reset loading state regardless of success or failure
      setIsLoading(false);
    }
  };

  const shouldShowParameter = (param: ParameterDefinition): boolean => {
    // Get current frame type
    const frameType = configs.find(config => config.name === "Frame")?.type as string;
    
    // ONLY hide wheel TYPE selectors when there's just one option
    if ((param.model === "Front Wheel" || param.model === "Rear Wheel") && param.type === 'grid') {
      // Get the options available for this frame type from the frames object
      const availableOptions = frames[frameType]?.[param.model] || {};
      
      // Only show TYPE selector if there are multiple options
      return Object.keys(availableOptions).length > 1;
    }
    
    // Hide color options for Gatorskin-tyres
    if (param.type === 'color') {
      if (param.id === "frontTyreColor") {
        const tyreType = configs.find(config => config.name === "Front Wheel")?.nonVisibleOptions?.["frontTyreType"]?.value;
        if (tyreType === "Gatorskin Tyre") {
          return false;
        }
      }
      
      if (param.id === "rearTyreColor") {
        const tyreType = configs.find(config => config.name === "Rear Wheel")?.nonVisibleOptions?.["rearTyreType"]?.value;
        if (tyreType === "Gatorskin Tyre") {
          return false;
        }
      }
    }
    
    // Always show ALL other parameters, including wheel/tire colors
    return true;
  };

  const renderParameters = (category: string) => {
    if (category === 'AI Style') {
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
    }

    const params = PARAMETER_DEFINITIONS.filter(param => param.category === category && !param.disabled);

    return params
      .filter((param) => shouldShowParameter(param))
      .map(param => {
        // Skip rendering wheel type selectors that should be hidden
        if (!shouldShowParameter(param)) {
          return null;
        }

        // For all other parameters, render normally
        return (
          <div key={param.id} className="space-y-2">
            <div className='flex justify-between'>
            <label className="text-gray-300 text-sm font-medium">
              {param.name}
            </label>

            {param.showPrice && (
              <>
                {param.type === 'dropdown' ? (
                  (() => {
                    const price = param.options?.find(option => 
                      option.value === configs.find(config => 
                        config.name === param.model
                      )?.nonVisibleOptions?.[param.id]?.value
                    )?.price;
                    return price && price > 0 ? (
                      <label className="text-gray-300 text-sm font-medium">
                        + £{price}
                      </label>
                    ) : null;
                  })()
                ) : param.type === 'grid' ? (
                  (() => {
                    const price = param.options?.find(option => 
                      option.value === configs.find(config => 
                        config.name === param.model
                      )?.path
                    )?.price;
                    return price && price > 0 ? (
                      <label className="text-gray-300 text-sm font-medium">
                        + £{price}
                      </label>
                    ) : null;
                  })()
                ) : null}
              </>
            )}
            </div>

            {param.type === 'dropdown' && (
              <Dropdown
                value={configs.find(config => config.name === param.model)?.nonVisibleOptions?.[param.id]?.value || ''}
                options={param.options || []}
                onChange={(value, label) => handleNonVisibleChange(value, param.model, label, param)}
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
                onChange={(color) => handleColorChange(color, param)}
                colors={param.colors}
              />
            )}
          </div>
        );
      })
      .filter(Boolean); // Filter out null values
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
              placeholder="Describe your colorway. Examples: British Flag, Manchester United, Pint of Guinness, Rainbow"
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
    <>
      <style jsx>{`
        @keyframes pulseGlow {
          0% {
            filter: drop-shadow(0 0 3px rgba(255, 0, 255, 0.7)) 
                    drop-shadow(0 0 1px rgba(255, 0, 255, 0.9));
          }
          50% {
            filter: drop-shadow(0 0 5px rgba(255, 0, 255, 1)) 
                    drop-shadow(0 0 2px rgba(255, 0, 255, 0.8));
          }
          100% {
            filter: drop-shadow(0 0 3px rgba(255, 0, 255, 0.7)) 
                    drop-shadow(0 0 1px rgba(255, 0, 255, 0.9));
          }
        }

        .glow-effect {
          animation: pulseGlow 2s infinite;
        }
      `}</style>
      <div className={`h-full flex w-24 bg-black transition-width duration-300 pl-2 pr-2`}>
        <div className="max-h-full flex flex-col items-center justify-start pt-4 pb-24 space-y-3 text-white align-middle flex-1 overflow-y-auto custom-scrollbar">
          {['AI Style', 'Frame', 'Fork', 'Handlebars', 'Stem', 'Grips', 'Wheels', 'Tyres', 'Saddle', 'Seat Post', 'Pedals', 'Chain'].map((tab) => (
            <button 
              key={tab}
              className={`relative w-full h-16 flex flex-col items-center justify-center pt-1 pb-1 rounded-lg 
                         ${activeTab === tab ? 'bg-mangoOrange' : 'hover:bg-neutral-800/50'}`}
              onClick={() => { activeTab === tab ? setActiveTab(undefined) : setActiveTab(tab as any); }}
            >
              <div className={`w-12 h-12 flex justify-center items-center mb-1 ${tab === 'AI Style' ? 'glow-effect' : ''}`}>
                {LeftMenuIcons[tab as keyof typeof LeftMenuIcons] ? (
                  <div className={`w-8 h-8 transition-colors duration-200 flex justify-center items-center
                                  ${activeTab === tab ? 'text-white' : 'text-gray-400'}`}>
                    {React.cloneElement(LeftMenuIcons[tab as keyof typeof LeftMenuIcons] as ReactElement<SVGProps<SVGSVGElement>>, {
                      className: 'w-full h-full',
                      style: {
                        stroke: tab === 'AI Style' && activeTab !== tab ? '#ff00ff' : 'currentColor',
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
    </>
  );
};

export default ParameterPanel;
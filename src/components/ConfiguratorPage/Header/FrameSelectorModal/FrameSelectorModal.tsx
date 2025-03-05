import React, { useEffect } from 'react';
import { ParameterDefinition } from '../../ParameterPanel/parameterDefintions';
import { getDefaultConfigForFrame } from '../../../../utils/componentManager';
import { ModelConfig } from '../../Viewer/defaults';

interface FrameSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string, label: string, price: number) => void;
  onFullConfigChange: (configs: ModelConfig[]) => void;
  configs: ModelConfig[];
  frameParameter: ParameterDefinition;
  frameType: string;
}

const FrameSelectorModal: React.FC<FrameSelectorModalProps> = ({
  isOpen,
  onClose,
  value,
  onChange,
  onFullConfigChange,
  configs,
  frameParameter,
  frameType
}) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      // Get the target element
      const target = event.target as Node;
      
      // Check if the click is outside the modal AND not inside the cookie banner
      const isInsideModal = document.getElementById('frame-selector-modal')?.contains(target);
      const isBikeSelector = document.getElementById('bike-selector-button')?.contains(target);
      const isInsideCookieBanner = document.querySelector('.cookie-banner')?.contains(target);
      
      // Only close if the click is outside modal, outside bike selector, AND outside cookie banner
      if (isOpen && !isInsideModal && !isBikeSelector && !isInsideCookieBanner) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Function to handle bike selection with full component update
  const handleBikeSelection = async (bikeValue: string, bikeLabel: string): Promise<void> => {
    const bikePrice = getBikePrice(bikeLabel);
    
    // First, call the original onChange to update the frame
    onChange(bikeValue, bikeLabel, bikePrice);
    
    // Then, get the default configuration for the new frame
    const defaultConfig = getDefaultConfigForFrame(bikeLabel);
    
    // Update all configs based on the default configuration
    const updatedConfigs = configs.map(config => {
      // Update the frame
      if (config.name === "Frame") {
        return { ...config, path: bikeValue, type: bikeLabel, price: bikePrice };
      }
      
      // Update front wheel
      if (config.name === "Front Wheel") {
        const frontWheel = defaultConfig.wheels.front;
        return {
          ...config,
          path: frontWheel.path,
          type: frontWheel.type,
          price: frontWheel.price
        };
      }
      
      // Update rear wheel
      if (config.name === "Rear Wheel") {
        const rearWheel = defaultConfig.wheels.rear;
        return {
          ...config,
          path: rearWheel.path,
          type: rearWheel.type,
          price: rearWheel.price
        };
      }
      
      // Update handlebar
      if (config.name === "Handlebar") {
        const handlebar = defaultConfig.handlebar;
        return {
          ...config,
          path: handlebar.path,
          type: handlebar.type,
          price: handlebar.price
        };
      }
      
      return config;
    });
    
    // Update all configurations
    onFullConfigChange(updatedConfigs);
    
    // Track the selection with detailed bike type
    try {
      await fetch('/api/track-event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: 'bike_selected',
          metadata: {
            bikeType: bikeLabel,
            timestamp: new Date().toISOString()
          }
        }),
      });
      console.log(`Tracked selection of ${bikeLabel} bike`);
    } catch (error) {
      console.error('Failed to track bike selection:', error);
      // Continue with normal flow - tracking failure shouldn't break UX
    }
    
    // Close the modal
    onClose();
  };

  // Function to get price for a specific model
  const getBikePrice = (bikeName: string): number => {
    const selectedOption = frameParameter.options?.find(option => option.label === bikeName);
    return selectedOption?.price || 0;
  };

  return (
    <div
      id="frame-selector-modal"
      className="fixed left-0 top-0 w-full h-full bg-mangoOrange z-50 overflow-auto"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white bg-black inline-block px-16 py-4 rounded-lg">
            CHOOSE YOUR WEAPON
          </h1>
        </div>
        
        {/* Bikes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* SINGLESPEED */}
          <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full">
            <div className="h-64 md:h-72 bg-white flex items-center justify-center">
              <img src="/assets/gridImages/OSS.png" alt="Singlespeed Bike" className="w-full h-full object-contain" />
            </div>
            <div className="bg-black text-white p-5 flex flex-col h-full">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-1">SINGLE SPEED</h2>
                <h3 className="text-xl font-medium mb-3">Fixie</h3>
                <ul className="space-y-2">
                  <li className="text-sm md:text-base">• No nonsense lightweight design</li>
                  <li className="text-sm md:text-base">• Single Gear to keep your ride low maintenance</li>
                  <li className="text-sm md:text-base">• Flip-flop hub allows for fixed or freewheel</li>
                  <li className="text-sm md:text-base">• Perfect for city cycling on your commute or for fun</li>
                </ul>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-800">
                <span className="text-[#ff5e14] text-2xl font-bold">£{getBikePrice('OSS')}</span>
                <button 
                  className="bg-white text-black px-4 py-2 rounded-lg font-medium"
                  onClick={() => handleBikeSelection('/models/Mango_OSS_Frame.glb', 'OSS')}
                >
                  Customize now
                </button>
              </div>
            </div>
          </div>

          {/* STEP-THRU */}
          <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full">
            <div className="h-64 md:h-72 bg-white flex items-center justify-center">
              <img src="/assets/gridImages/Moosher.png" alt="Step-Thru Bike" className="w-full h-full object-contain" />
            </div>
            <div className="bg-black text-white p-5 flex flex-col h-full">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-1">MOOSHER</h2>
                <h3 className="text-xl font-medium mb-3">Single Speed Step-Through</h3>
                <ul className="space-y-2">
                  <li className="text-sm md:text-base">• Classic design for a relaxed ride</li>
                  <li className="text-sm md:text-base">• Wider tyres improve your comfort and grant you extra grip</li>
                  <li className="text-sm md:text-base">• Strong frame designed for cruising</li>
                  <li className="text-sm md:text-base">• Ideal for riders looking for a bike they can relax on</li>
                </ul>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-800">
                <span className="text-[#ff5e14] text-2xl font-bold">£{getBikePrice('Moosher')}</span>
                <button 
                  className="bg-white text-black px-4 py-2 rounded-lg font-medium"
                  onClick={() => handleBikeSelection('/models/Mango_Moosher_Frame.glb', 'Moosher')}
                >
                  Customize now
                </button>
              </div>
            </div>
          </div>

          {/* GEARED */}
          <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full">
            <div className="h-64 md:h-72 bg-white flex items-center justify-center">
              <img src="/assets/gridImages/OG.png" alt="Geared Bike" className="w-full h-full object-contain" />
            </div>
            <div className="bg-black text-white p-5 flex flex-col h-full">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-1">OG</h2>
                <h3 className="text-xl font-medium mb-3">Original 8-Speed</h3>
                <ul className="space-y-2">
                  <li className="text-sm md:text-base">• 9-speed gearing gives you the versatility to tackle varied terrain</li>
                  <li className="text-sm md:text-base">• Seamless shifting to make everyday riding easier</li>
                  <li className="text-sm md:text-base">• Quick and nimble lightweight frame that lets you push yourself longer</li>
                  <li className="text-sm md:text-base">• Great for commuters that want an easy ride or fitness freaks that want to cycle for hours on end</li>
                </ul>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-800">
                <span className="text-[#ff5e14] text-2xl font-bold">£{getBikePrice('OG')}</span>
                <button 
                  className="bg-white text-black px-4 py-2 rounded-lg font-medium"
                  onClick={() => handleBikeSelection('/models/Mango_OG_Frame.glb', 'OG')}
                >
                  Customize now
                </button>
              </div>
            </div>
          </div>

          {/* GEARS & DISC BRAKES */}
          <div className="bg-white rounded-lg overflow-hidden flex flex-col h-full">
            <div className="h-64 md:h-72 bg-white flex items-center justify-center">
              <img src="/assets/gridImages/DOG.png" alt="Gears & Disc Brakes Bike" className="w-full h-full object-contain" />
            </div>
            <div className="bg-black text-white p-5 flex flex-col h-full">
              <div className="flex-grow">
                <h2 className="text-2xl font-bold mb-1">DOGG</h2>
                <h3 className="text-xl font-medium mb-3">Disc Brake Geared Bike</h3>
                <ul className="space-y-2">
                  <li className="text-sm md:text-base">• 9-speeds for top performance everywhere you go</li>
                  <li className="text-sm md:text-base">• Disc brakes make stopping easier in all conditions</li>
                  <li className="text-sm md:text-base">• Frame designed to be your go to bike, with the strength and comfort for daily use</li>
                  <li className="text-sm md:text-base">• Perfect for riders needing extra control and braking power</li>
                </ul>
              </div>
              
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-neutral-800">
                <span className="text-[#ff5e14] text-2xl font-bold">£{getBikePrice('DOG')}</span>
                <button 
                  className="bg-white text-black px-4 py-2 rounded-lg font-medium"
                  onClick={() => handleBikeSelection('/models/Mango_DOG_Frame.glb', 'DOG')}
                >
                  Customize now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameSelectorModal;
import React, { useEffect } from 'react';
import { ParameterDefinition } from '../../ParameterPanel/parameterDefintions';

interface FrameSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (value: string, label: string, price: number) => void;
  frameParameter: ParameterDefinition;
  frameType: string;
}

const FrameSelectorModal: React.FC<FrameSelectorModalProps> = ({ isOpen, onClose, value, onChange, frameParameter, frameType }) => {
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && !document.getElementById('frame-selector-modal')?.contains(event.target as Node) && !document.getElementById('bike-selector-button')?.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Function to handle bike selection
  const handleBikeSelection = (bikeValue: string, bikeLabel: string): void => {
    const bikePrice = getBikePrice(bikeLabel);
    onChange(bikeValue, bikeLabel, bikePrice);
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
                <h2 className="text-2xl font-bold mb-3">SINGLESPEED</h2>
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
                <h2 className="text-2xl font-bold mb-3">STEP-THRU</h2>
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
                <h2 className="text-2xl font-bold mb-3">GEARED</h2>
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
                <h2 className="text-2xl font-bold mb-3">GEARS & DISC BRAKES</h2>
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
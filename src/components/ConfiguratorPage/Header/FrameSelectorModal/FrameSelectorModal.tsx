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
  const handleBikeSelection = (bikeValue: string, bikeLabel: string) => {
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
          <div className="bg-white rounded-lg overflow-hidden h-full">
            <div className="h-72 bg-white flex items-center justify-center">
              <img src="/assets/gridImages/OSS.png" alt="Singlespeed Bike" className="w-full h-full object-contain" />
            </div>
            <div className="bg-black text-white p-5 flex flex-col justify-between h-[350px]">
              <div>
                <h2 className="text-2xl font-bold mb-3">SINGLESPEED</h2>
                <ul className="space-y-2 mb-4">
                  <li>• Lightweight and minimalistic design</li>
                  <li>• Single gear for a simple, low-maintenance ride</li>
                  <li>• Flip-flop hub for fixed or freewheel option</li>
                  <li>• Ideal for city commuting and urban riding</li>
                </ul>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#ff5e14] text-2xl font-bold">£449</span>
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
          <div className="bg-white rounded-lg overflow-hidden h-full">
            <div className="h-72 bg-white flex items-center justify-center">
              <img src="/assets/gridImages/Moosher.png" alt="Step-Thru Bike" className="w-full h-full object-contain" />
            </div>
            <div className="bg-black text-white p-5 flex flex-col justify-between h-[350px]">
              <div>
                <h2 className="text-2xl font-bold mb-3">STEP-THRU</h2>
                <ul className="space-y-2 mb-4">
                  <li>• Classic singlespeed with a relaxed, upright ride</li>
                  <li>• Wider tires for extra comfort and grip</li>
                  <li>• Sturdy frame built for cruising and casual rides</li>
                  <li>• Perfect for relaxed city and leisure cycling</li>
                </ul>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#ff5e14] text-2xl font-bold">£549</span>
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
          <div className="bg-white rounded-lg overflow-hidden h-full">
            <div className="h-72 bg-white flex items-center justify-center">
              <img src="/assets/gridImages/OG.png" alt="Geared Bike" className="w-full h-full object-contain" />
            </div>
            <div className="bg-black text-white p-5 flex flex-col justify-between h-[350px]">
              <div>
                <h2 className="text-2xl font-bold mb-3">GEARED</h2>
                <ul className="space-y-2 mb-4">
                  <li>• 9-speed gearing for versatility on varied terrain</li>
                  <li>• Smooth and efficient shifting for everyday riding</li>
                  <li>• Lightweight frame for speed and agility</li>
                  <li>• Great for commuters and fitness cyclists</li>
                </ul>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#ff5e14] text-2xl font-bold">£649</span>
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
          <div className="bg-white rounded-lg overflow-hidden h-full">
            <div className="h-72 bg-white flex items-center justify-center">
              <img src="/assets/gridImages/DOG.png" alt="Gears & Disc Brakes Bike" className="w-full h-full object-contain" />
            </div>
            <div className="bg-black text-white p-5 flex flex-col justify-between h-[350px]">
              <div>
                <h2 className="text-2xl font-bold mb-3">GEARS & DISC BRAKES</h2>
                <ul className="space-y-2 mb-4">
                  <li>• 9-speed gearing for all-around performance</li>
                  <li>• Disc brakes for improved stopping power in all weather</li>
                  <li>• Strong, reliable frame for daily use</li>
                  <li>• Perfect for riders needing extra control and braking power</li>
                </ul>
              </div>
              <div className="flex justify-between items-center mt-4">
                <span className="text-[#ff5e14] text-2xl font-bold">£749</span>
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
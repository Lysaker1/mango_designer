import React, { useEffect } from 'react';
import { Color, ColorPicker } from '../../ParameterPanel/parameterTypes/ColorPicker';
import { colors } from '../../Viewer/defaults';
import { Grid } from '../../ParameterPanel/parameterTypes/Grid/Grid';
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

  // Funksjon for å håndtere valg av sykkel
  const handleBikeSelection = (bikeValue: string, bikeLabel: string) => {
    // Finn riktig opsjon fra frameParameter for å hente prisen
    const bikePrice = getBikePrice(bikeLabel);
    
    onChange(bikeValue, bikeLabel, bikePrice);
    onClose();
  };

  // Funksjon for å hente pris for en spesifikk modell
  const getBikePrice = (bikeName: string): number => {
    const selectedOption = frameParameter.options?.find(option => option.label === bikeName);
    return selectedOption?.price || 0;
  };

  return (
    <div
      id="frame-selector-modal"
      className="absolute left-0 top-0 transform w-full h-full p-8 space-y-2 bg-black bg-opacity-95 backdrop-blur-md rounded-2xl shadow-lg z-20 transition-all duration-300 ease-in-out"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-300 text-xl font-semibold">Select the bike you want to customize</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {/* OSS */}
        <div 
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-all"
          onClick={() => handleBikeSelection('/models/Mango_OSS_Frame.glb', 'OSS')}
        >
          <div className="h-64 bg-[#7efd46] flex items-center justify-center">
            <img src="/assets/gridImages/OSS.png" alt="OSS Bike" className="w-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white text-xl font-bold">OSS</h3>
              <span className="text-green-400 font-bold">£{getBikePrice('OSS')}</span>
            </div>
            <ul className="text-gray-300 text-md list-disc pl-5">
              <li>Single-speed/fixed gear</li>
              <li>Lightweight frame</li>
            </ul>
          </div>
        </div>

        {/* OG */}
        <div 
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-all"
          onClick={() => handleBikeSelection('/models/Mango_OG_Frame.glb', 'OG')}
        >
          <div className="h-64 bg-[#b484ff] flex items-center justify-center">
            <img src="/assets/gridImages/OG.png" alt="OG Bike" className="w-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white text-xl font-bold">OG</h3>
              <span className="text-green-400 font-bold">£{getBikePrice('OG')}</span>
            </div>
            <ul className="text-gray-300 text-md list-disc pl-5">
              <li>1x10 gearing system</li>
              <li>Hydraulic disc brakes</li>
              <li>Urban and long-distance design</li>
            </ul>
          </div>
        </div>

        {/* DOG */}
        <div 
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-all"
          onClick={() => handleBikeSelection('/models/Mango_DOG_Frame.glb', 'DOG')}
        >
          <div className="h-64 bg-[#00c2c7] flex items-center justify-center">
            <img src="/assets/gridImages/DOG.png" alt="DOG Bike" className="w-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white text-xl font-bold">DOG</h3>
              <span className="text-green-400 font-bold">£{getBikePrice('DOG')}</span>
            </div>
            <ul className="text-gray-300 text-md list-disc pl-5">
              <li>1x11 gearing system</li>
              <li>Hydraulic disc brakes</li>
              <li>Off-road focused</li>
            </ul>
          </div>
        </div>

        {/* Moosher */}
        <div 
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:bg-gray-700 transition-all"
          onClick={() => handleBikeSelection('/models/Mango_Moosher_Frame.glb', 'Moosher')}
        >
          <div className="h-64 bg-[#ffff54] flex items-center justify-center">
            <img src="/assets/gridImages/Moosher.png" alt="Moosher Bike" className="w-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white text-xl font-bold">Moosher</h3>
              <span className="text-green-400 font-bold">£{getBikePrice('Moosher')}</span>
            </div>
            <ul className="text-gray-300 text-md list-disc pl-5">
              <li>Single-speed</li>
              <li>Sturdy frame</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FrameSelectorModal;

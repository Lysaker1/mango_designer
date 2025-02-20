import React, { useEffect } from 'react';
import { Color, ColorPicker } from '../ParameterPanel/parameterTypes/ColorPicker';
import { colors } from '../Viewer/defaults';

interface BackgroundColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  value: string;
  onChange: (color: Color) => void;
}

const availableColors = {
  mangoOrange: colors.mangoOrange,
  babyBlue: colors.babyBlue,
  purple: colors.purple,
  silver: colors.silver,
  gold: colors.gold,
  creamClassic: colors.creamClassic,
  aquaBlue: colors.aquaBlue,
  red: colors.red,
  brown: colors.brown,
  blue: colors.blue,
  pink: colors.pink,
  green: colors.green,  
}

const BackgroundColorModal: React.FC<BackgroundColorModalProps> = ({ isOpen, onClose, value, onChange }) => {

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (isOpen && !document.getElementById('background-color-modal')?.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="background-color-modal"
      className="absolute right-4 top-20 transform  w-64 p-4 space-y-2 bg-black bg-opacity-95 backdrop-blur-md rounded-2xl shadow-lg z-20"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-gray-300 text-sm font-semibold">Select background color</h2>
        <button onClick={onClose} className="text-gray-300 text-sm font-medium absolute right-5 cursor-pointer">
          &#10006;&#xfe0e;
        </button>
      </div>
      <ColorPicker onChange={onChange} colors={availableColors} value={value} />
    </div>
  );
};

export default BackgroundColorModal;

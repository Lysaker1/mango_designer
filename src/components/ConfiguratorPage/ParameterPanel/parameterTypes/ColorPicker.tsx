'use client';

import React from 'react';

interface Color {
  hex: string;
  label: string;
}

export const colorPalette: Record<string, Color> = {
  black: { hex: '#000000', label: 'Black' },
  white: { hex: '#FFFFFF', label: 'White' },
  red: { hex: '#FF0000', label: 'Red' },
  blue: { hex: '#0000FF', label: 'Blue' },
  green: { hex: '#00FF00', label: 'Green' },
  orange: { hex: '#FFA500', label: 'Orange' },
  purple: { hex: '#800080', label: 'Purple' },
  yellow: { hex: '#FFFF00', label: 'Yellow' },
};

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label = 'Frame Color'
}) => {
  return (
    <div className="p-4 rounded-lg bg-neutral-800/50">
      <div className="mb-2 text-white/90">{label}</div>
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(colorPalette).map(([key, color]) => (
          <button
            key={key}
            className={`aspect-square rounded-full border-2 transition-all
                      ${value === color.hex 
                        ? 'border-white scale-110 shadow-glow' 
                        : 'border-transparent hover:scale-105'}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => onChange(color.hex)}
            title={color.label}
          />
        ))}
      </div>
      <div className="mt-4">
        <label className="block text-white/90 mb-2">Custom Color</label>
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 rounded cursor-pointer bg-neutral-700/50"
        />
      </div>
    </div>
  );
}; 
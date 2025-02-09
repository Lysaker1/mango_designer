'use client';

import React from 'react';

export interface Color {
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
  colors?: Record<string, Color>;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  colors
}) => {

  const availableColors = colors || colorPalette;
  return (
    <div className="rounded-lg">
      <div className="grid grid-cols-6 gap-4">
        {Object.entries(availableColors).map(([key, color]) => (
          <button
            key={key}
            className={`aspect-square w-7 h-7 rounded-full border transition-all
                      ${value === color.hex 
                        ? 'border-white scale-105 shadow-glow'
                        : 'border-neutral-500 hover:scale-100'}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => {
              onChange(color.hex)
            }}

            title={color.label}
          />
        ))}
      </div>
    </div>
  );
}; 
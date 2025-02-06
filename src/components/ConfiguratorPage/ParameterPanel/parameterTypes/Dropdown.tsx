'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  label: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  value,
  options,
  onChange,
  label
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="p-4 rounded-lg bg-neutral-800/50" ref={dropdownRef}>
      <div className="mb-2 text-white/90">{label}</div>
      <div className="relative">
        <button 
          className="w-full px-4 py-2.5 flex justify-between items-center rounded-lg
                     bg-neutral-700/50 hover:bg-neutral-700 
                     border border-neutral-600 hover:border-neutral-500
                     text-white/90 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{value}</span>
          <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 w-full mt-1 
                         bg-neutral-800/95 backdrop-blur-md border border-neutral-700 
                         rounded-lg overflow-hidden z-50">
            {options.map((option) => (
              <button
                key={option}
                className="w-full p-3 text-left text-white/90 
                           hover:bg-neutral-700/50 transition-colors"
                onClick={() => {
                  onChange(option);
                  setIsOpen(false);
                }}
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 
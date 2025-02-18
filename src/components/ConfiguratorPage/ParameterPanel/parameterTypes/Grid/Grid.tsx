import React, { ReactElement } from 'react';
import { ParameterDefinition } from '../../parameterDefintions';
import { GridIcons } from './GridIcons';

interface GridProps {
  definition: ParameterDefinition;
  value: string | number;
  onChange: (value: any, definition: ParameterDefinition) => void;
}

interface IconType {
  type?: string;
  src?: string;
  icon?: ReactElement;
}

export const Grid = ({
  definition,
  value,
  onChange,
}: GridProps): ReactElement => {

  const renderIcon = (option: { label: string; value: string }): ReactElement | null => {
    const icon = GridIcons[option.label.replace(' mount', ' Mount') as keyof typeof GridIcons] as IconType | ReactElement;

    if (!icon) return null;

    if (typeof icon === 'object' && 'type' in icon && icon.type === 'svg' && 'icon' in icon) {
      return (
        <div className="flex justify-center items-center w-full h-full">
          {icon.icon}
        </div>
      );
    }

    if (typeof icon === 'object' && 'type' in icon && icon.type === 'image' && 'src' in icon) {
      const isMount = definition.name.toLowerCase().includes('mount');
      const isDropout = definition.name.toLowerCase().includes('drop out');
      const specialClass = isMount ? 'mount-image' : isDropout ? 'dropout-image' : '';

      return (
        <div className={`flex justify-center items-center w-full h-full ${specialClass}`}>
          <img
            src={icon.src}
            alt={option.label}
            className="w-9/10 h-9/10 object-contain"
          />
        </div>
      );
    }

    return (
      <div className="flex justify-center items-center w-full h-full">
        {icon as ReactElement}
      </div>
    );
  };

  return (
    <div className="rounded-3xl w-full mb-4">
      <div className={`grid gap-2.5 grid-cols-3`}>
        {definition.options?.map((option) => (
          <button
            key={option.value}
            className={`relative w-9/10 aspect-square flex flex-col items-center justify-center bg-white bg-opacity-10 rounded-lg cursor-pointer transition-all duration-200 ease-in-out border border-transparent ${
              value === option.value ? 'border-white bg-white bg-opacity-30' : ''
            }`}
            onClick={() => onChange(option.value, definition)}
            title={option.label}
          >
            {/* {renderIcon(option)} */}
            <img src={`assets/gridImages/${option.label}.png`} alt={option.label} className="w-full h-full object-contain" />
          </button>
        ))}
      </div>
    </div>
  );
};

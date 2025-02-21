import React, { ReactElement, SVGProps } from 'react';
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

  const renderIcon = (option: { label: string; value: string }): ReactElement => {
    const icon = GridIcons[option.label as keyof typeof GridIcons];
    
    if (!icon) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <img 
            src={`assets/gridImages/${option.label}.png`} 
            alt={option.label}
            className="w-full h-full object-contain p-2"
          />
        </div>
      );
    }
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        {React.cloneElement(icon as ReactElement<SVGProps<SVGSVGElement>>, {
          className: 'w-full h-full',
          style: {
            stroke: 'currentColor',
            strokeWidth: '1.5',
            fill: icon.props.fill || '#E7E7E7',
            transform: `${icon.props.style?.transform || ''} scale(0.8)`,
            maxWidth: '100%',
            maxHeight: '100%'
          }
        })}
      </div>
    );
  };

  return (
    <div className="rounded-3xl w-full mb-4">
      <div className="grid gap-2.5 grid-cols-3">
        {definition.options?.map((option) => (
          <button
            key={option.value}
            className={`relative aspect-square p-2
                       flex items-center justify-center 
                       rounded-lg
                       transition-colors duration-200
                       ${value === option.value 
                         ? 'bg-mangoOrange text-white' 
                         : 'text-gray-400 hover:text-white hover:bg-neutral-700/50 bg-neutral-800/50'}`}
            onClick={() => onChange(option.value, definition ,option.label)}
            title={option.label}
          >
            <div className="w-full h-full flex items-center justify-center">
              {renderIcon(option)}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

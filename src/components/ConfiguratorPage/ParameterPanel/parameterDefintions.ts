export interface ParameterDefinition {
  id: string;
  name: string;
  type: 'slider' | 'dropdown' | 'color';
  value: number | string;
  min?: number;
  max?: number;
  options?: string[];
  category: 'tubing' | 'geometry' | 'parts';
}

export const PARAMETER_DEFINITIONS: ParameterDefinition[] = [
  {
    id: 'frameColor',
    name: 'Frame Color',
    type: 'color',
    value: '#FF0000',
    category: 'tubing'
  },
  {
    id: 'Handlebar_id',
    name: 'Handlebar',
    type: 'dropdown',
    value: '1',
    options: ['1', '2', '3', '4'], //etc etc
    category: 'parts'
  },
  {
    id: 'tubingType',
    name: 'Tubing Type',
    type: 'dropdown',
    value: 'standard',
    options: ['OSS', 'OG', 'DOG', 'Moosher'],
    category: 'tubing'
  }
];
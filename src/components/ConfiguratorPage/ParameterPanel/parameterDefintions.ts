import { Color } from "./parameterTypes/ColorPicker";

export interface ParameterDefinition {
  id: string;
  name: string;
  type: 'slider' | 'dropdown' | 'color' | 'grid';
  colors?: Record<string, Color>;
  value: string;
  min?: number;
  max?: number;
  options?: { label: string; value: string}[];
  category: 'frame' | 'handlebars' | 'wheels' | 'saddle' | 'pedals';
  model: 'Frame' | 'Front Wheel' | 'Rear Wheel' | 'Handlebar' | 'Saddle';
}

export const PARAMETER_DEFINITIONS: ParameterDefinition[] = [
  {
    id: 'frameColor',
    name: 'Frame Color',
    type: 'color',
    value: '#ff0000',
    category: 'frame',
    model: 'Frame',
    colors: {
      orange: { hex: '#ff7f00', label: 'Orange' },
      yellow: { hex: '#ffff00', label: 'Yellow' },
      darkBlue: { hex: '#000080', label: 'Dark Blue' },
      babyBlue: { hex: '#87ceeb', label: 'Baby Blue' },
      purple: { hex: '#800080', label: 'Purple' },
      green: { hex: '#008000', label: 'Green' },
      black: { hex: '#000000', label: 'Black' },
      silver: { hex: '#c0c0c0', label: 'Silver' },
      creamClassic: { hex: '#f5f5dc', label: 'Cream Classic' },
      aquaBlue: { hex: '#00ffff', label: 'Aqua Blue' },
    }
  },
  {
    id: 'tubingType',
    name: 'Tubing Type',
    type: 'dropdown',
    value: 'OSS',
    options: [{ label: 'OSS', value: '/models/bikeFrame1_oss.glb' }, { label: 'OG', value: '/models/bikeFrame2_og.glb' }/* , { label: 'DOG', value: '/models/bikeFrame3_dog.glb' }, { label: 'Moosher', value: '/models/bikeFrame4_moosher.glb' } */],
    category: 'frame',
    model: 'Frame'
  },
  {
    id: 'frontWheelType',
    name: 'Front Wheel Type',
    type: 'grid',
    value: '/models/Wheel1_spoke.glb',
    options: [
      { label: '45mm Deep Dish Rim', value: "/models/FrontWheel1_spoke.glb" },
      { label: '3 Spoke Mag Wheel', value: "/models/FrontWheel2_3spokeMag.glb" },
    ],
    category: 'wheels',
    model: 'Front Wheel'
  },

  {
    id: 'frontWheelColor',
    name: 'Front Wheel Color',
    type: 'color',
    value: '#00ff00',
    category: 'wheels',
    model: 'Front Wheel',
    colors: {
      black: { hex: '#000000', label: 'Black' },
      blue: { hex: '#0000ff', label: 'Blue' },
      green: { hex: '#008000', label: 'Green' },
      orange: { hex: '#ff7f00', label: 'Orange' },
      pink: { hex: '#ffc0cb', label: 'Pink' },
      purple: { hex: '#800080', label: 'Purple' },
      red: { hex: '#ff0000', label: 'Red' },
      white: { hex: '#ffffff', label: 'White' },
      yellow: { hex: '#ffff00', label: 'Yellow' },
    }
  },
/*   {
    id: 'frontTireColor',
    name: 'Front Tire Color',
    type: 'color',
    value: '#FF0000',
    category: 'parts',
    model: 'Front Wheel'
  }, */
  {
    id: 'rearWheelType',
    name: 'Rear Wheel Type',
    type: 'grid',
    value: '/models/Wheel2_3spokeMag.glb',
    options: [
      { label: '45mm Deep Dish Rim', value: "/models/RearWheel1_spoke.glb" },
      { label: '3 Spoke Mag Wheel', value: "/models/RearWheel2_3spokeMag.glb" },
    ],
    category: 'wheels',
    model: 'Rear Wheel'
  },
  {
    id: 'rearWheelColor',
    name: 'Rear Wheel Color',
    type: 'color',
    value: '#ff0000',
    category: 'wheels',
    model: 'Rear Wheel',
    colors: {
      black: { hex: '#000000', label: 'Black' },
      blue: { hex: '#0000ff', label: 'Blue' },
      green: { hex: '#008000', label: 'Green' },
      orange: { hex: '#ff7f00', label: 'Orange' },
      pink: { hex: '#ffc0cb', label: 'Pink' },
      purple: { hex: '#800080', label: 'Purple' },
      red: { hex: '#ff0000', label: 'Red' },
      white: { hex: '#ffffff', label: 'White' },
      yellow: { hex: '#ffff00', label: 'Yellow' },
    }
  },
/*   {
    id: 'rearTireColor',
    name: 'Rear Tire Color',
    type: 'color',
    value: '#FF0000',
    category: 'parts',
    model: 'Rear Wheel'
  }, */
  {
    id: 'Handlebar_id',
    name: 'Handlebar',
    type: 'grid',
    value: '1',
    options: [
      { label: 'Riser', value: "/models/Handle1_Riser.glb" },
      { label: 'Drop Bars', value: "/models/Handle2_Drop.glb" },
      { label: 'Track Bar', value: "/models/Handle4_Track.glb" },
      { label: 'Flat Bars', value: "/models/Handle5_Flat.glb" },
      { label: 'Cruiser Bars', value: "/models/Handle6_Cruiser.glb" },
      { label: 'Jeb Bar', value: "/models/Handle7_Jeb.glb" },
    ],
    category: 'handlebars',
    model: 'Handlebar'
  },
  {
    id: 'handlebarColor',
    name: 'Handlebar Color',
    type: 'color',
    value: '#ff0000',
    category: 'handlebars',
    colors: {
      black: { hex: '#000000', label: 'Black' },
      gold: { hex: '#ffd700', label: 'Gold' },
      silver: { hex: '#c0c0c0', label: 'Silver' },
    },
    model: 'Handlebar'
  },
  {
    id: 'saddleColor',
    name: 'Saddle Color',
    type: 'color',
    value: '#ff0000',
    colors: {
      brown: { hex: '#a52a2a', label: 'Brown' },
      black: { hex: '#000000', label: 'Black' },
      white: { hex: '#ffffff', label: 'White' },
      pink: { hex: '#ffc0cb', label: 'Pink' },
      orange: { hex: '#ff7f00', label: 'Orange' },
      green: { hex: '#008000', label: 'Green' },
      purple: { hex: '#800080', label: 'Purple' },
      blue: { hex: '#0000ff', label: 'Blue' },
      yellow: { hex: '#ffff00', label: 'Yellow' },
      red: { hex: '#ff0000', label: 'Red' },
    },
    category: 'saddle',
    model: 'Saddle'
  }
];
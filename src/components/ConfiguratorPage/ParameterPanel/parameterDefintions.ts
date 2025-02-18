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
  subPart?:string
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
    value: '/models/Mango_OSS_Frame.glb',
    options: [{ label: 'OSS', value: '/models/Mango_OSS_Frame.glb' }, { label: 'OG', value: '/models/Mango_OG_Frame.glb' } , { label: 'DOG', value: '/models/Mango_DOG_Frame.glb' }, { label: 'Moosher', value: '/models/bikeFrame4_moosher.glb' }],
    category: 'frame',
    model: 'Frame'
  },
  {
    id: 'frontWheelType',
    name: 'Front Wheel Type',
    type: 'grid',
    value: '/models/Mango_Wheels_Front_MultiSpokes.glb',
    options: [
      { label: '45mm Deep Dish Rim', value: "/models/Mango_Wheels_Front_MultiSpokes.glb" },
      { label: '3 Spoke Mag Wheel', value: "/models/Mango_Wheels_Front_3SpokeMag.glb" },
    ],
    category: 'wheels',
    model: 'Front Wheel',
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
    },
    subPart:'Rim'
  },
  {
    id: 'frontTireColor',
    name: 'Front Tire Color',
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
    },
    subPart:'Tube'
  },
  {
    id: 'rearWheelType',
    name: 'Rear Wheel Type',
    type: 'grid',
    value: '/models/Mango_Wheels_Rear_3SpokeMag.glb',
    options: [
      { label: '45mm Deep Dish Rim', value: "/models/Mango_Wheels_Rear_MultiSpokes.glb" },
      { label: '3 Spoke Mag Wheel', value: "/models/Mango_Wheels_Rear_3SpokeMag.glb" },
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
    },
    subPart:'Rim',
  },

  {
    id: 'rearTireColor',
    name: 'Rear Tire Color',
    type: 'color',
    value: '#00ff00',
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
    },
    subPart:'Tube'
  },
  {
    id: 'Handlebar_id',
    name: 'Handlebar',
    type: 'grid',
    value: '1',
    options: [
      { label: 'Riser', value: "/models/Mango_Handle_Riser.glb" },
      { label: 'Drop', value: "/models/Mango_Handle_Drop.glb" },
      { label: 'Track', value: "/models/Mango_Handle_Track.glb" },
      { label: 'Flat', value: "/models/Mango_Handle_Flat.glb" },
      { label: 'Cruiser', value: "/models/Mango_Handle_Cruiser.glb" },
      { label: 'Jeb', value: "/models/Mango_Handle_Jeb.glb" },
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
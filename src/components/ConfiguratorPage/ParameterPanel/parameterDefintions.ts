import { Color } from "./parameterTypes/ColorPicker";
import { colors } from "../Viewer/defaults";

export interface ParameterDefinition {
  id: string;
  name: string;
  type: 'slider' | 'dropdown' | 'color' | 'grid';
  colors?: Record<string, Color>;
  value: string;
  min?: number;
  max?: number;
  options?: { label: string; value: string}[];
  category: 'frame' | 'handlebars' | 'wheels' | 'tyres' | 'saddle' | 'pedals';
  model: 'Frame' | 'Front Wheel' | 'Rear Wheel' | 'Handlebar' | 'Saddle' | 'Pedals';
  subPart?: string[]; 
  material?: { type: string; properties: any }; 
}

export const PARAMETER_DEFINITIONS: ParameterDefinition[] = [
  {
    id: 'frameColor',
    name: 'Color',
    type: 'color',
    value: '#000000',
    category: 'frame',
    model: 'Frame',
    colors: {
      orange: colors.orange,
      yellow: colors.yellow,
      darkBlue: colors.darkBlue,
      babyBlue: colors.babyBlue,
      purple: colors.purple,
      green: colors.green,
      black: colors.black,
      silver: colors.silver,
      creamClassic: colors.creamClassic,
      aquaBlue: colors.aquaBlue,
    },
    subPart: ['fork_mesh', 'frame_mesh'] 
  },
  {
    id: 'tubingType',
    name: 'Type',
    type: 'grid',
    value: '/models/Mango_OSS_Frame.glb',
    options: [{ label: 'OSS', value: '/models/Mango_OSS_Frame.glb' }, { label: 'OG', value: '/models/Mango_OG_Frame.glb' } , { label: 'DOG', value: '/models/Mango_DOG_Frame.glb' }, { label: 'Moosher', value: '/models/Mango_Moosher_Frame.glb' }],
    category: 'frame',
    model: 'Frame'
  },
  {
    id: 'frontWheelType',
    name: 'Front Type',
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
    name: 'Front Color',
    type: 'color',
    value: colors.green.hex,
    category: 'wheels',
    model: 'Front Wheel',
    colors: {
      black: colors.black,
      blue: colors.blue,
      green: colors.green,
      orange: colors.orange,
      pink: colors.pink,
      purple: colors.purple,
      red: colors.red,
      white: colors.white,
      yellow: colors.yellow,
    },
    subPart:['Rim']
  },
  {
    id: 'frontTireColor',
    name: 'Front Color',
    type: 'color',
    value: colors.green.hex,
    category: 'tyres',
    model: 'Front Wheel',
    colors: {
      black: colors.black,
      blue: colors.blue,
      green: colors.green,
      orange: colors.orange,
      pink: colors.pink,
      purple: colors.purple,
      red: colors.red,
      white: colors.white,
      yellow: colors.yellow,
    },
    subPart:['Tube']
  },
  {
    id: 'rearWheelType',
    name: 'Rear Type',
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
    name: 'Rear Color',
    type: 'color',
    value: colors.red.hex,
    category: 'wheels',
    model: 'Rear Wheel',
    colors: {
      black: colors.black,
      blue: colors.blue,
      green: colors.green,
      orange: colors.orange,
      pink: colors.pink,
      purple: colors.purple,
      red: colors.red,
      white: colors.white,
      yellow: colors.yellow,
    },
    subPart:['Rim'],
  },
  {
    id: 'rearTireColor',
    name: 'Rear Color',
    type: 'color',
    value: colors.green.hex,
    category: 'tyres',
    model: 'Rear Wheel',
    colors: {
      black: colors.black,
      blue: colors.blue,
      green: colors.green,
      orange: colors.orange,
      pink: colors.pink,
      purple: colors.purple,
      red: colors.red,
      white: colors.white,
      yellow: colors.yellow,
    },
    subPart:['Tube']
  },
  {
    id: 'Handlebar_id',
    name: 'Type',
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
    model: 'Handlebar',
    subPart: ['stem_mesh']
  },
  {
    id: 'handlebarColor',
    name: 'Handlebar Color',
    type: 'color',
    value: colors.black.hex,
    category: 'handlebars',
    colors: {
      black: colors.black,
      gold: colors.gold,
      silver: colors.silver,
    },
    model: 'Handlebar',
    subPart: ['handlebar_mesh']
  },
  {
    id: 'stemColor',
    name: 'Stem Color',
    type: 'color',
    value: colors.black.hex,
    category: 'handlebars',
    colors: {
      black: colors.black,
      gold: colors.gold,
      silver: colors.silver,
    },
    model: 'Handlebar',
    subPart: ['stem_mesh']
  },
  {
    id: 'gripColor',
    name: 'Grip Color',
    type: 'color',
    value: colors.black.hex,
    category: 'handlebars',
    colors: {
      black: colors.black,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      purple: colors.purple,
      pink: colors.pink,
      white: colors.white,
    },
    model: 'Handlebar',
    subPart: ['grip_mesh']
  },
  {
    id: 'saddleColor',
    name: 'Side Color',
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
    model: 'Saddle',
    subPart:['saddleSide_mesh'],
  },
  {
    id: 'saddleColor',
    name: 'Top Color',
    type: 'color',
    value: colors.brown.hex,
    colors: {
      brown: colors.brown,
      black: colors.black,
      white: colors.white,
      pink: colors.pink,
      orange: colors.orange,
      green: colors.green,
      purple: colors.purple,
      blue: colors.blue,
      yellow: colors.yellow,
      red: colors.red,
    },
    category: 'saddle',
    model: 'Saddle',
    subPart:['saddleSide_mesh'],
  },
  {
    id: 'seatPostColor',
    name: 'Post Color',
    type: 'color',
    value: colors.silver.hex,
    category: 'saddle',
    model: 'Saddle',
    subPart: ['seatPost_mesh'],
    colors: {
      black: colors.black,
      silver: colors.silver,
      gold: colors.gold,      
    }
  },
  {
    id: 'pedalType',
    name: 'Type',
    type: 'grid',
    value: '/models/Mango_Pedals_Standard.glb',
    options: [{ label: 'Standard', value: '/models/Mango_Pedals_Standard.glb' }, {label: 'Platform', value: '/models/Mango_Pedals_Platform.glb'}],
    category: 'pedals',
    model: 'Pedals',
  },
  {
    id: 'pedalColor',
    name: 'Color',
    type: 'color',
    value: colors.red.hex,
    category: 'pedals',
    colors: {
      black: colors.black,
      blue: colors.blue,
      green: colors.green,
      orange: colors.orange,
      pink: colors.pink,
      purple: colors.purple,
      red: colors.red,
      white: colors.white,
      yellow: colors.yellow,
    },
    model: 'Pedals',
    subPart: ['pedalTread_mesh']
  }
];
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
  options?: { label: string; value: string; price?: number}[];
  category: 'Frame' | 'Handlebars' | 'Stem' | 'Grips' | 'Wheels' | 'Tyres' | 'Saddle' | 'Seat Post' | 'Pedals' | 'Chain' | 'Fork';
  model: 'Frame' | 'Front Wheel' | 'Rear Wheel' | 'Handlebar' | 'Saddle' | 'Pedals';
  subPart?: string[]; 
  material?: { type: string; properties: any }; 
  disabled?:boolean;
  showPrice?:boolean;
}

export const PARAMETER_DEFINITIONS: ParameterDefinition[] = [
  {
    id: 'frameColor',
    name: 'Color',
    type: 'color',
    value: colors.silver.hex,
    category: 'Frame',
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
    subPart: ['frame_mesh']
  },
  {
    id: 'forkColor',
    name: 'Color',
    type: 'color',
    value: colors.silver.hex,
    category: 'Fork',
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
    subPart: ['fork_mesh'],
  },
  {
    id: 'frontWheelType',
    name: 'Front Type',
    type: 'grid',
    value: '/models/Mango_Wheels_Front_MultiSpokes.glb',
    options: [
      { label: '45mm Deep Dish Rim', value: "/models/Mango_Wheels_Front_MultiSpoke.glb"},
      { label: '6 Spoke Mag Wheel', value: "/models/Mango_Wheels_Front_6SpokeMag.glb", price: 58},
    ],
    category: 'Wheels',
    model: 'Front Wheel',
    showPrice: true,
  },
  {
    id: 'frontWheelColor',
    name: 'Front Color',
    type: 'color',
    value: colors.green.hex,
    category: 'Wheels',
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
    subPart:['rim']
  },
  {
    id: 'frontTireColor',
    name: 'Front Color',
    type: 'color',
    value: colors.green.hex,
    category: 'Tyres',
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
    subPart:['tube']
  },
  {
    id: 'rearWheelType',
    name: 'Rear Type',
    type: 'grid',
    value: '/models/Mango_Wheels_Rear_SS_MultiSpoke.glb',
    options: [
      { label: '45mm Deep Dish Rim', value: "/models/Mango_Wheels_Rear_SS_MultiSpoke.glb"},
      { label: '6 Spoke Mag Wheel', value: "/models/Mango_Wheels_Rear_6SpokeMag.glb"},
      { label: 'Cassette Wheel', value: "/models/Mango_Wheels_Rear_Cassette_MultiSpoke.glb"},
      { label: 'Flipflop Wheel', value: "/models/Mango_Wheels_Rear_Flipflop_MultiSpoke.glb"},
    ],
    category: 'Wheels',
    model: 'Rear Wheel',
    showPrice: true,
  },
  {
    id: 'rearWheelColor',
    name: 'Rear Color',
    type: 'color',
    value: colors.red.hex,
    category: 'Wheels',
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
    subPart:['rim'],
  },
  {
    id: 'rearTireColor',
    name: 'Rear Color',
    type: 'color',
    value: colors.green.hex,
    category: 'Tyres',
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
    subPart:['tube']
  },
  {
    id: 'handlebarType',
    name: 'Type',
    type: 'grid',
    value: '1',
    options: [
      { label: 'Riser', value: "/models/Mango_Handle_Riser.glb" },
      { label: 'Drop', value: "/models/Mango_Handle_Drop.glb", price: 60 },
      { label: 'Track', value: "/models/Mango_Handle_Track.glb" },
      { label: 'Flat', value: "/models/Mango_Handle_Flat.glb" },
      { label: 'Cruiser', value: "/models/Mango_Handle_Cruiser.glb" },
      { label: 'Jeb', value: "/models/Mango_Handle_Jeb.glb" },
    ],
    category: 'Handlebars',
    model: 'Handlebar',
    subPart: ['stem_mesh'],
    showPrice: true,
  },
  {
    id: 'handlebarColor',
    name: 'Color',
    type: 'color',
    value: colors.black.hex,
    category: 'Handlebars',
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
    name: 'Color',
    type: 'color',
    value: colors.black.hex,
    category: 'Stem',
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
    name: 'Color',
    type: 'color',
    value: colors.black.hex,
    category: 'Grips',
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
    id: 'saddleType',
    name: 'Type',
    type: 'grid',
    value: "/models/Mango_Saddle4.glb",
    options: [
      { label: 'Saddle 1', value: "/models/Mango_Saddle4.glb" }, 
      { label: 'Saddle 2', value: "/models/Mango_Saddle2.glb", price: 200 }, 
      { label: 'Saddle 3', value: "/models/Mango_Saddle3.glb", price: 300 }, 
      { label: 'Saddle 4', value: "/models/Mango_Saddle4.glb", price: 400 }, 
    ],
    category: 'Saddle',
    model: 'Saddle',
    subPart: ['saddleSide_mesh'],
    showPrice: true,
    disabled: true,
  },
  {
    id: 'saddleColor',
    name: 'Color',
    type: 'color',
    value: '#ff0000',
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
    category: 'Saddle',
    model: 'Saddle',
    subPart:['saddleSide_mesh'],
  },
  {
    id: 'seatPostColor',
    name: 'Post Color',
    type: 'color',
    value: colors.silver.hex,
    category: 'Seat Post',
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
    category: 'Pedals',
    model: 'Pedals',
    showPrice: true,
  },
  {
    id: 'pedalColor',
    name: 'Color',
    type: 'color',
    value: colors.red.hex,
    category: 'Pedals',
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
  },
  {
    id: 'chainColor',
    name: 'Color',
    type: 'color',
    value: colors.black.hex,
    category: 'Chain',
    model: 'Frame',
    subPart: ['chain_mesh'],
    colors: {
      black: colors.black,
      silver: colors.silver,
      white: colors.white,
      red: colors.red,
      orange: colors.orange,
      yellow: colors.yellow,
      green: colors.green,
      blue: colors.blue,
      purple: colors.purple,
      pink: colors.pink,
    }
  }
];
import * as THREE from 'three';

export interface ModelConfig {
  name: string;
  path: string;
  meshRequired: string;
  type:string;
  color?: string;
  position: THREE.Vector3; 
  rotation: THREE.Quaternion; 
  correctAxis:boolean;
  containsPlain:boolean;
  subParts: {name:string,color:{hex:string,label:string},texturePath?:string}[]
  price?: number;
  nonVisibleOptions?: { [key: string]: {value:string,price?:number} };
}

export const rearWheelDefaults = {
  OSS: { path: "/models/Mango_Wheels_Rear_MultiSpoke_SingleCog_RimBrake.glb", type: '45mm Deep Dish Rim' },
  OG: { path: "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_RimBrake.glb", type: 'Flipflop Wheel' },
  DOG: { path: "/models/Mango_Wheels_Rear_MultiSpoke_Cassette_DiscBrake.glb", type: 'Cassette Wheel' },
  Moosher: { path: "/models/Mango_Wheels_Rear_MultiSpoke_SingleCog_RimBrake.glb", type: '45mm Deep Dish Rim' },
};


//array contains those meshes which we want to hide for a specfic frame
export const frames: Record<string, Record<string,Record<string,string[]>>> = {
  OSS: {
    "Rear Wheel":{
      "45mm Deep Dish Rim":[],
      "6 Spoke Mag Wheel":[]
    },
    "Front Wheel":{
      "45mm Deep Dish Rim":[],
      "6 Spoke Mag Wheel":[]
    },
    "Handlebar":{
      'Riser':[],
      'Drop':[],
      'Track':[],
      'Flat':[],
      'Cruiser':[],
      'Jeb':[],
    },
    "Saddle":{
      'Saddle':[]
    },
    "Pedals":{
      'Standard':[],
      'Platform':[],
    }
  },
  OG: {
    "Rear Wheel":{
      "Flipflop Wheel":[],
    },
    "Front Wheel":{
      "45mm Deep Dish Rim":[],
      "6 Spoke Mag Wheel":[]
    },
    "Handlebar":{
      'Riser':[],
      'Drop':[],
      'Track':[],
      'Flat':[],
      'Cruiser':[],
      'Jeb':[],
    },
    "Saddle":{
      'Saddle':[]
    },
    "Pedals":{
      'Standard':[],
      'Platform':[],
    }
  },
  DOG: {
    "Rear Wheel":{
      "Cassette Wheel":[],
    },
    "Front Wheel":{
      "Cassette Wheel":[],
    },
    "Handlebar":{
      'Riser':[],
      'Drop':[],
      'Track':[],
      'Flat':[],
      'Cruiser':[],
      'Jeb':[],
    },
    "Saddle":{
      'Saddle':[]
    },
    "Pedals":{
      'Standard':[],
      'Platform':[],
    }
  },
  Moosher:{
      "Rear Wheel":{
        "45mm Deep Dish Rim":[],
        "6 Spoke Mag Wheel":[]
      },
      "Front Wheel":{
        "45mm Deep Dish Rim":[],
        "6 Spoke Mag Wheel":[]
      },
      "Handlebar":{
        'Riser':[],
        'Drop':[],
        'Track':[],
        'Flat':[],
        'Cruiser':[],
        'Jeb':[],
      },
      "Saddle":{
        'Saddle':[]
      },
      "Pedals":{
        'Standard':[],
        'Platform':[],
      }
    }
};

const textureURL="/models/MangoLogo.jpg"

export const colors = {
  mangoOrange: { hex: '#f35417', label: 'Mango Orange' },
  orange: { hex: '#ff7f00', label: 'Orange' },
  yellow: { hex: '#ffff00', label: 'Yellow' },
  darkBlue: { hex: '#000080', label: 'Dark Blue' },
  babyBlue: { hex: '#87ceeb', label: 'Baby Blue' },
  purple: { hex: '#bf77f6', label: 'Purple' },
  green: { hex: '#00FF00', label: 'Green' },
  white: { hex: '#ffffff', label: 'White' },
  black: { hex: '#000000', label: 'Black' },
  silver: { hex: '#c0c0c0', label: 'Silver' },
  creamClassic: { hex: '#f5f5dc', label: 'Cream Classic' },
  aquaBlue: { hex: '#00ffff', label: 'Aqua Blue' },
  red: { hex: '#ff0000', label: 'Red' },
  brown: { hex: '#964B00', label: 'Brown' },
  blue: { hex: '#0000ff', label: 'Blue' },
  pink: { hex: '#fc8eac', label: 'Pink' },
  gold: { hex: '#ffd700', label: 'Gold' },
  darkGrey: { hex: '#232423', label: 'Dark Grey' },
};

const modelConfigs: ModelConfig[] = [
  {
    name: "Frame",
    path: "/models/Mango_OSS_Frame.glb", 
    meshRequired: "frame_mesh",
    type: "OSS",
    // color: colors.black.hex,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: true,
    correctAxis: true,
    subParts: [
      { name: "frame_mesh", color: colors.silver },
      { name: "fork_mesh", color: colors.silver },
      { name: "chain_mesh", color: colors.green },
      { name: "wire_mesh", color: colors.black },
      { name: "frontBrake_mesh", color: colors.black },
      { name: "rearBrake_mesh", color: colors.black },
    ],
    nonVisibleOptions: {
      "frameSize": {value: "Medium"}
    }
  },
  {
    name: "Rear Wheel",
    path: "/models/Mango_Wheels_Rear_MultiSpoke_SingleCog_RimBrake.glb",
    meshRequired: "rearTyre_plane",
    type: "45mm Deep Dish Rim",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(), 
    containsPlain: false,
    correctAxis: true,
    subParts:[
      { name: "tube", color: colors.green },
      { name: "rim", color: colors.green },
      { name: "cog", color: colors.black },
      { name: "logoFront", color: colors.white ,texturePath:textureURL},
      { name: "logoBack", color: colors.white ,texturePath:textureURL},    
    ],
    nonVisibleOptions: {
      "rearTyreType": {value: "Standard"}
    }
  },
  {
    name: "Front Wheel",
    path: "/models/Mango_Wheels_Front_MultiSpoke_RimBrake.glb",
    type: "6 Spoke Mag Wheel",
    meshRequired: "fronTyre_plane",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: false,
    correctAxis: true,
    subParts:[
      { name: "tube", color: colors.pink },
      { name: "rim", color: colors.green },
      { name: "cog", color: colors.black },
      { name: "Spokes", color: colors.black },
      { name: "logoFront", color: colors.white ,texturePath:textureURL},
      { name: "logoBack", color: colors.white ,texturePath:textureURL},
    ],
    nonVisibleOptions: {
      "frontTyreType": {value: "Standard"}
    }
  },
  {
    name: "Saddle",
    path: "/models/Mango_Saddle4.glb",
    meshRequired: "seat_plane",
    type: "Saddle",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: false,
    correctAxis: false,
    subParts:[
      { name: "saddleSide_mesh", color: colors.white },
      { name: "saddleTop_mesh", color: colors.white },
      { name: "saddleFrame_mesh", color: colors.silver },
      { name: "seatPost_mesh", color: colors.gold },
      // { name: "logo_mesh", color: colors.white ,texturePath:"https://cdn11.bigcommerce.com/s-qmagntafvz/images/stencil/110x36/mango-logo-seo_1626684142__36638.original1_1700851933.original.png"},
    ]
  },

  {
    name: "Handlebar",
    path: "/models/Handle1_Riser_NoShifter.glb",
    meshRequired: "handle_plane",
    type: "Riser",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: false,
    correctAxis: false,
    subParts:[
      { name: "stem_mesh", color: colors.gold },
      { name: "handlebar_mesh", color: colors.black },
      { name: "grip_mesh", color: colors.pink },
      { name: "levers_mesh", color: colors.black },
      { name: "headsetSpacers_mesh", color: colors.black },
      { name: "wire_mesh", color: colors.black },
    ]
  },
  {
    name: "Pedals",
    path: "/models/Mango_Pedals_Standard.glb",
    meshRequired: "crank_plane",
    type:"Standard",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: false,
    correctAxis: true,
    subParts:[
      { name: "pedalTread_mesh", color: colors.green },
      { name: "pedalShaft_mesh", color: colors.black },
    ]
  },
];

export default modelConfigs;

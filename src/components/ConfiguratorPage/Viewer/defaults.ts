import * as THREE from 'three';

export interface ModelConfig {
  name: string;
  path: string;
  meshRequired: string;
  type?:string;
  color?: string;
  position: THREE.Vector3; 
  rotation: THREE.Quaternion; 
  correctAxis:boolean;
  containsPlain:boolean;
  subParts: {name:string,color:{hex:string,label:string},texturePath?:string}[]
}

//array contains those meshes which we want to hide for a specfic frame
export const frames: Record<string, Record<string, string[]>> = {
  OSS: {},
  OG: {},
  DOG: {
    "Handlebar": ["wire_mesh"], // Defines which objects to hide
  },
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
    path: "/models/Mango_DOG_Frame.glb", 
    meshRequired: "frame_mesh",
    type:"DOG",
    // color: colors.black.hex,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: true,
    correctAxis: true,
    subParts: [
      { name: "frame_mesh", color: colors.silver },
      { name: "fork_mesh", color: colors.silver },
      { name: "chain_mesh", color: colors.green },
    ]
  },
  {
    name: "Rear Wheel",
    path: "/models/Mango_Wheels_Rear_SS_MultiSpoke.glb", // Changed to multi spoke
    meshRequired: "rearTyre_plane",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(), 
    containsPlain: false,
    correctAxis: true,
    subParts:[
      { name: "tube", color: colors.green },
      { name: "rim", color: colors.green },
      { name: "cog", color: colors.black },
      { name: "logoFront", color: colors.white ,texturePath:textureURL},
      { name: "logoBack", color: colors.white ,texturePath:textureURL},    ]
  },
  {
    name: "Front Wheel",
    path: "/models/Mango_Wheels_Front_6SpokeMag.glb", // Changed to 3 spoke
    meshRequired: "fronTyre_plane",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: false,
    correctAxis: true,
    subParts:[
      { name: "tube", color: colors.pink },
      { name: "rim", color: colors.black },
      { name: "cog", color: colors.black },
      { name: "Spokes", color: colors.black },
      { name: "logoFront", color: colors.white ,texturePath:textureURL},
      { name: "logoBack", color: colors.white ,texturePath:textureURL},
    ]
  },
  {
    name: "Saddle",
    path: "/models/Mango_Saddle.glb",
    meshRequired: "seat_plane",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: false,
    correctAxis: false,
    subParts:[
      { name: "saddleSide_mesh", color: colors.white },
      { name: "saddleTop_mesh", color: colors.white },
      { name: "saddleFrame_mesh", color: colors.silver },
      { name: "seatPost_mesh", color: colors.gold },
      // { name: "logo_mesh", color: colors.white ,texturePath:textureURL},
    ]
  },

  {
    name: "Handlebar",
    path: "/models/Mango_Handle_Drop.glb", // Changed to dropdown
    meshRequired: "handle_plane",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: false,
    correctAxis: false,
    subParts:[
      { name: "stem_mesh", color: colors.gold },
      { name: "handlebar_mesh", color: colors.black },
      { name: "grip_mesh", color: colors.pink },
      { name: "levers_mesh", color: colors.darkGrey },
      { name: "headsetSpacers_mesh", color: colors.black },
      { name: "wire_mesh", color: colors.black },
    ]
  },
  {
    name: "Pedals",
    path: "/models/Mango_Pedals_Platform.glb",
    meshRequired: "crank_plane",
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

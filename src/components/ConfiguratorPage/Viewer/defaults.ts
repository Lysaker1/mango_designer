import * as THREE from 'three';

export interface ModelConfig {
  name: string;
  path: string;
  meshRequired: string;
  color?: string;
  position: THREE.Vector3; 
  rotation: THREE.Quaternion; 
  correctAxis:boolean;
  containsPlain:boolean;
  subParts: {name:string,color:{hex:string,label:string}}[]
}

export const colors = { 
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
};

const modelConfigs: ModelConfig[] = [
  {
    name: "Frame",
    path: "/models/Mango_OSS_Frame.glb",
    meshRequired: "frame_mesh",
    color: colors.black.hex,
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain: true,
    correctAxis: true,
    subParts: [
      { name: "frame_mesh", color: colors.orange },
      { name: "fork_mesh", color: colors.black },
      { name: "chain_mesh", color: colors.black },
    ]
  },
  {
    name: "Rear Wheel",
    path: "/models/Mango_Wheels_Rear_3SpokeMag.glb",
    meshRequired: "rearTyre_plane",
    // color: "#0000ff",
    position: new THREE.Vector3(0, 0, 0), 
    rotation: new THREE.Quaternion(),
    containsPlain:false,
    correctAxis:true,
    subParts:[
      { name: "Tube", color: colors.black },
      { name: "Rim", color: colors.green },
      { name: "Cog", color: colors.black },
      { name: "Logo", color: colors.black },
    ]
  },
  {
    name: "Front Wheel",
    path: "/models/Mango_Wheels_Front_MultiSpokes.glb",
    meshRequired: "fronTyre_plane",
    // color: "#ff0000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain:false,
    correctAxis:true,
    subParts:[
      { name: "Tube", color: colors.pink },
      { name: "Rim", color: colors.orange },
      { name: "Cog", color: colors.black },
      { name: "Spokes", color: colors.black },
    ]
  },
  {
    name: "Saddle",
    path: "/models/Mango_Saddle.glb",
    meshRequired: "seat_plane",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain:false,
    correctAxis:false,
    subParts:[
      { name: "saddleSide_mesh", color: colors.brown },
      { name: "saddleTop_mesh", color: colors.black },
      { name: "saddleFrame_mesh", color: colors.silver },
      { name: "seatPost_mesh", color: colors.silver },
    ]
  },
  {
    name: "Handlebar",
    path: "/models/Mango_Handle_Riser.glb",
    meshRequired: "handle_plane",
    // color: "#000000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain:false,
    correctAxis:false,
    subParts:[
      { name: "stem_mesh", color: colors.silver },
      { name: "handlebar_mesh", color: colors.black },
      { name: "grip_mesh", color: colors.purple },
      { name: "levers_mesh", color: colors.black },
      { name: "headsetSpacers_mesh", color: colors.black },
    ]
  },
  {
    name: "Pedals",
    path: "/models/Mango_Pedals_Platform.glb",
    meshRequired: "crank_plane",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain:false,
    correctAxis:true,
    subParts:[
      { name: "pedalTread_mesh", color: colors.purple },
      { name: "pedalShaft_mesh", color: colors.black },
    ]
  },
];

export default modelConfigs;


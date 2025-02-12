import * as THREE from 'three';

export interface ModelConfig {
  name: string;
  path: string;
  meshRequired: string; 
  color?: string;
  position: THREE.Vector3; 
  rotation: THREE.Quaternion; 
  correctAxis:boolean
  subParts?:{name:string,color:{hex:string,label:string}}[]
}

const colors = { 
  orange: { hex: '#ff7f00', label: 'Orange' },
  yellow: { hex: '#ffff00', label: 'Yellow' },
  darkBlue: { hex: '#000080', label: 'Dark Blue' },
  babyBlue: { hex: '#87ceeb', label: 'Baby Blue' },
  purple: { hex: '#800080', label: 'Purple' },
  green: { hex: '#008000', label: 'Green' },
  white: { hex: '#000000', label: 'White' },
  black: { hex: '#000000', label: 'Black' },
  silver: { hex: '#c0c0c0', label: 'Silver' },
  creamClassic: { hex: '#f5f5dc', label: 'Cream Classic' },
  aquaBlue: { hex: '#00ffff', label: 'Aqua Blue' },
};

const modelConfigs: ModelConfig[] = [
  {
    name: "Frame",
    path: "/models/MangoOSSFrameFinal.glb",
    meshRequired: "frame_mesh",
    color: "#000000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:true,
  },
  {
    name: "Rear Wheel",
    path: "/models/WheelType1.glb",
    meshRequired: "rearTyre_plane",
    // color: "#0000ff",
    position: new THREE.Vector3(0, 0, 0), 
    rotation: new THREE.Quaternion(),
    correctAxis:true,
    subParts:[
      { name: "Tube", color: colors.black },
      { name: "Rim", color: colors.green },
      { name: "Cog", color: colors.yellow },
      { name: "Logo", color: colors.purple },
    ]
  },
  {
    name: "Front Wheel",
    path: "/models/WheelType2.glb",
    meshRequired: "fronTyre_plane",
    // color: "#ff0000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:true,
    subParts:[
      { name: "Tube", color: colors.black },
      { name: "Rim", color: colors.silver },
      { name: "Cog", color: colors.silver },
      { name: "Logo", color: colors.white },
      { name: "Hub", color: colors.orange },
      { name: "Spokes", color: colors.black },
    ]
  },
  {
    name: "Saddle",
    path: "/models/Saddle1.glb",
    meshRequired: "seat_plane",
    color: "#0000ff",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:false,
  },
  {
    name: "Handlebar",
    path: "/models/Handle1_Riser.glb",
    meshRequired: "handle_plane",
    color: "#000000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:false,
  },
  {
    name: "Fork",
    path: "/models/Fork.glb",
    meshRequired: "fork_plane",
    color: "#000000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:false,
  },
  {
    name: "Crank",
    path: "/models/CrankSet.glb",
    meshRequired: "crank_plane",
    color: "#000000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:true,
  },
];

export default modelConfigs;


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
    path: "/models/Mango_OSS_Frame.glb",
    meshRequired: "frame_mesh",
    color: "#0000ff",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain:true,
    correctAxis:true,
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
      { name: "Rim", color: colors.silver },
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
      { name: "Tube", color: colors.black },
      { name: "Rim", color: colors.silver },
      { name: "Cog", color: colors.black },
      // { name: "Logo", color: colors.white },
      // { name: "Hub", color: colors.orange },
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
      { name: "saddleSide_mesh", color: colors.purple },
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
      { name: "stem_mesh", color: colors.purple },
      { name: "handlebar_mesh", color: colors.black },
      { name: "grip_mesh", color: colors.silver },
      { name: "levers_mesh", color: colors.silver },
      { name: "headsetSpacers_mesh", color: colors.silver },
    ]
  },
  {
    name: "Fork",
    path: "/models/Mango_OSS_Fork.glb",
    meshRequired: "fork_plane",
    color: "#000000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain:true,
    correctAxis:false,
  },
  {
    name: "Crank",
    path: "/models/Mango_OSS_CrankSet.glb",
    meshRequired: "crank_plane",
    color: "#000000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain:false,
    correctAxis:true,
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
      { name: "pedalTread_mesh", color: colors.aquaBlue },
      { name: "pedalShaft_mesh", color: colors.black },
    ]
  },
  {
    name: "Rear Brakes",
    path: "/models/Mango_Brake_Front.glb",
    meshRequired: "rearBrake_plane",
    color: "#000000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    containsPlain:false,
    correctAxis:false,
  },
  // {
  //   name: "Front Brakes",
  //   path: "/models/Mango_Brake_Front.glb",
  //   meshRequired: "brake_plane",
  //   color: "#000000",
  //   position: new THREE.Vector3(0, 0, 0),
  //   rotation: new THREE.Quaternion(),
  //   containsPlain:false,
  //   correctAxis:false,
  // },
];

export default modelConfigs;


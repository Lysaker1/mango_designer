import * as THREE from 'three';

export interface ModelConfig {
  name: string;
  path: string;
  meshRequired: string; 
  color: string;
  position: THREE.Vector3; 
  rotation: THREE.Quaternion; 
  correctAxis:boolean
}

const modelConfigs: ModelConfig[] = [
  {
    name: "Frame",
    path: "/models/bikeFrame1_oss.glb",
    meshRequired: "mesh_0_0",
    color: "#00ffff",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:false,
  },
  {
    name: "Rear Wheel",
    path: "/models/WheelType1.glb",
    meshRequired: "mesh_0_1",
    color: "#ff0000",
    position: new THREE.Vector3(0, 0, 0), 
    rotation: new THREE.Quaternion(),
    correctAxis:true,
  },
  {
    name: "Front Wheel",
    path: "/models/WheelType2.glb",
    meshRequired: "mesh_0_2",
    color: "#ffff00",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:true,
  },
  {
    name: "Saddle",
    path: "/models/Saddle1.glb",
    meshRequired: "mesh_0_4",
    color: "#0000ff",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:false,
  },
  {
    name: "Handlebar",
    path: "/models/Handle1_Riser.glb",
    meshRequired: "mesh_0_5",
    color: "#000000",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:false,
  },
];

export default modelConfigs;

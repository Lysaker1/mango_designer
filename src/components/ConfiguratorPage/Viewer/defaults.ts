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
    name: "Rear Wheel",
    path: "/models/WheelType1.glb",
    meshRequired: "mesh_0_2",
    color: "#ff0000",
    position: new THREE.Vector3(0, 0, 0), 
    rotation: new THREE.Quaternion(),
    correctAxis:true,
  },
  {
    name: "Front Wheel",
    path: "/models/WheelType2.glb",
    meshRequired: "mesh_0_1",
    color: "#0000ff",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:true,
  },
  {
    name: "Saddle",
    path: "/models/Saddle1.glb",
    meshRequired: "mesh_0_4",
    color: "#00ff00",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:false,
  },
  {
    name: "Handle",
    path: "/models/Handle1.glb",
    meshRequired: "mesh_0_5",
    color: "#444444",
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Quaternion(),
    correctAxis:false,
  },
];

export default modelConfigs;

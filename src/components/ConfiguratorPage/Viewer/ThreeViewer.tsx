'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Mesh, MeshStandardMaterial, Group } from 'three';
import * as THREE from 'three';
import modelConfigs, { ModelConfig } from './defaults';

interface ModelProps {
  modelPath: string;
  color: string;
  setUpdatedConfigs: (configs: ModelConfig[]) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  configs: ModelConfig[];
}


const Model = React.forwardRef<Group, ModelProps>(({ modelPath, color, setUpdatedConfigs, setIsLoading, configs }, ref) => {
  const { scene } = useGLTF(modelPath);

  useEffect(() => {
    console.log('Loaded GLB scene:', scene);

    const updatedConfigs = [...configs];
    

    scene.traverse((node) => {
      if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
        node.material.color.set(color);
      }

      if(node instanceof Mesh) {
        console.log(node.name);
        console.log(node)
      }

      const configIndex = updatedConfigs.findIndex((config) => config.meshRequired === node.name);
      if (configIndex !== -1 && node instanceof Mesh) {
        node.geometry.computeBoundingBox();
        const bbox = node.geometry.boundingBox;
        const center = new THREE.Vector3();
        bbox?.getCenter(center);
        const correctedCenter = new THREE.Vector3(center.x, center.z, center.y);

        const normal = new THREE.Vector3();
        const normals = node.geometry.attributes.normal.array as Float32Array;
        if (normals.length >= 3) {
          if(modelConfigs[configIndex].correctAxis)
            normal.set(normals[0], normals[1], normals[2]); 
          else
            normal.set(normals[0], normals[2], normals[1]); 
        }

        const upDirection = new THREE.Vector3(0, 1, 0);
        const axis = new THREE.Vector3();
        axis.crossVectors(upDirection, normal).normalize();
        const angle = upDirection.angleTo(normal);
        const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);

        updatedConfigs[configIndex] = {
          ...updatedConfigs[configIndex],
          position: correctedCenter,
          rotation: quaternion,
        };
      }
    });

    setUpdatedConfigs(updatedConfigs);
    setIsLoading(false);
  }, [scene, color]);

  // @ts-ignore - primitive is a valid element in React Three Fiber
  return <primitive object={scene} ref={ref} />;
});

Model.displayName = 'Model';

const Component = React.forwardRef<Group, { modelPath: string; position: THREE.Vector3; rotation: THREE.Quaternion,color:string }>(({ modelPath, position, rotation , color}, ref) => {
  const { scene } = useGLTF(modelPath);
  scene.traverse((node) => {
    if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
      node.material.color.set(color);
    }})
  // @ts-ignore - primitive is a valid element in React Three Fiber
  return <primitive object={scene} ref={ref} position={position} quaternion={rotation} />;
});

Component.displayName = 'Component';

interface ThreeViewerProps {
  configs: ModelConfig[];
  setConfigs: (configs: ModelConfig[]) => void;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ configs, setConfigs }) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center">
        <div className="text-gray-300 text-lg">Loading 3D Viewer...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <Model modelPath={configs[0].path} color={configs[0].color} setUpdatedConfigs={setConfigs} setIsLoading={setIsLoading} configs={configs} />
            {!isLoading &&
             configs.map(
                (model, index) =>
                  model.position && model.rotation && (
                    <Component key={index} modelPath={model.path} position={model.position} rotation={model.rotation} color={model.color}/>
                  )
              )}
          </Stage>
        </Suspense>
        <OrbitControls autoRotate={false} enableZoom={true} enablePan={true} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  );
};

export default ThreeViewer;

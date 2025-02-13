'use client';

import React, { ComponentProps, Suspense, useEffect, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Box, OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Mesh, MeshStandardMaterial, Group } from 'three';
import * as THREE from 'three';
import { ModelConfig } from './defaults';
import { GLTFLoader, SkeletonUtils } from 'three/examples/jsm/Addons.js';

interface ModelProps {
  modelPath: string;
  meshRequired: string;
  color?: string;
  setUpdatedConfigs: (configs: ModelConfig[]) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  configs: ModelConfig[];
}

const Model = React.forwardRef<Group, ModelProps>(({ modelPath, color, setUpdatedConfigs, setIsLoading, configs }, ref,) => {
  const { scene } = useGLTF(modelPath);
  if(color){
    scene.traverse((node) => {
      if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
        node.material.color.set(color);
      }
    });
  }

  useEffect(() => {
    const updatedConfigs=[...configs]
  
    scene.traverse((child) => {
      configs.forEach((config) => {
        if (child.name === config.meshRequired) {
          const matchingIndices = updatedConfigs
            .map((config, index) => (config.meshRequired === child.name ? index : -1))
            .filter(index => index !== -1);
      
          child.traverse((node) => {
            if (matchingIndices.length > 0 && node instanceof Mesh) {
              node.geometry.computeBoundingBox();
              const bbox = node.geometry.boundingBox;
              if (bbox) {
                const localCenter = new THREE.Vector3();
                bbox.getCenter(localCenter);
                const correctedCenter = new THREE.Vector3(localCenter.x, localCenter.z, localCenter.y);
      
                const normal = new THREE.Vector3();
                const normals = node.geometry.attributes.normal.array as Float32Array;
                if (normals.length >= 3) {
                  if (config.correctAxis)
                    normal.set(normals[0], normals[1], normals[2]);
                  else
                    normal.set(normals[0], normals[2], normals[1]);
                }
      
                const upDirection = new THREE.Vector3(0, 1, 0);
                const axis = new THREE.Vector3();
                axis.crossVectors(upDirection, normal).normalize();
                const angle = upDirection.angleTo(normal);
                const quaternion = new THREE.Quaternion().setFromAxisAngle(axis, angle);
      
                // Update all matching indices
                matchingIndices.forEach(index => {
                  updatedConfigs[index] = {
                    ...updatedConfigs[index],
                    position: correctedCenter,
                    rotation: quaternion,
                  };
                });
              }
            }
          });
        }
      });
      
    });
    setUpdatedConfigs([...updatedConfigs]);
    setIsLoading(false);

  }, [scene]);

  // @ts-ignore - primitive is a valid element in React Three Fiber
  return <primitive object={scene} ref={ref}/>;
});

Model.displayName = 'Model';

const Component = React.forwardRef<Group, { modelPath: string; position: THREE.Vector3; rotation: THREE.Quaternion; color?: string ,subParts?: { name: string; color: {hex:string ,label:string} }[];}>(
  ({ modelPath, position, rotation, color ,subParts }, ref) => {
    const { scene } = useGLTF(modelPath);
    const newScene = SkeletonUtils.clone(scene);
    if(color){
      newScene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // Ensure each child has a separate material instance
          child.material = child.material.clone(); 
          child.castShadow = true;
      
          // Default base color (applies to entire object first)
          child.material.color.set(color);
        }
      });
    }
    else{
      if (subParts) {
        subParts.forEach(({ name, color }) => {
          const part = newScene.getObjectByName(name); // 🔍 Find specific part by name
          if (part) {
            part.traverse((child) => {
              if (child instanceof THREE.Mesh && child.material) {
                
                // Clone material only for subpart meshes (so base color remains for other parts)
                child.material = child.material.clone();  
                child.material.color.set(color.hex);
                child.material.needsUpdate = true; 
              }
            });
          }
        });
      }
    }
    

  
  
    newScene.position.set(position.x,position.y,position.z);

  // @ts-ignore - primitive is a valid element in React Three Fiber

    return <primitive object={newScene} ref={ref} quaternion={rotation} />;
  }
);



Component.displayName = 'Component';





const ThreeViewer: React.FC<{ configs: ModelConfig[]; setConfigs: (configs: ModelConfig[]) => void }> = ({ configs, setConfigs }) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // const [updatedConfigs, setUpdatedConfigs] = useState(modelConfigs);

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
            {/* <Box scale={[19.9, 11.9, 11.9]} /> */}
            <Model modelPath={configs[0].path} meshRequired={configs[0].meshRequired} color={configs[0]?.color} setUpdatedConfigs={setConfigs} setIsLoading={setIsLoading} configs={configs} />
            {/* <Model2 modelPath={configs[1].path} meshRequired={configs[1].meshRequired} color={configs[1].color} setUpdatedConfigs={setConfigs} setIsLoading={setIsLoading} configs={configs} x={0} /> */}
            {/* <Model modelPath={configs[5].path} meshRequired={configs[5].meshRequired} color={configs[5].color} setUpdatedConfigs={setConfigs} setIsLoading={setIsLoading} configs={configs}  />  */}
            {/* <Model modelPath={configs[3].path} meshRequired={configs[3].meshRequired} color={configs[3].color} setUpdatedConfigs={setConfigs} setIsLoading={setIsLoading} configs={configs} x={0} /> */}
            {!isLoading &&
              configs.map(
                (model, index) =>
                  model.position && model.rotation && index!=0 && (
                    <Component key={index} modelPath={model.path} position={model.position} rotation={model.rotation} color={model?.color} subParts={model?.subParts}/>
                  )
              )}
          </Stage>
          {/* Adding GridHelper */}
          {/* @ts-ignore - primitive is a valid element in React Three Fiber */}
          {/* <primitive object={new THREE.GridHelper(100, 100, 'gray', 'lightgray')} /> */}
        </Suspense>

        <OrbitControls autoRotate={false} enableZoom={true} enablePan={true} minPolarAngle={Math.PI / 4} maxPolarAngle={Math.PI / 1.5} />
      </Canvas>
    </div>
  );
};

export default ThreeViewer;

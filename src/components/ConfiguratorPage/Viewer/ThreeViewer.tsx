'use client';

import React, { ComponentProps, Suspense, useEffect, useMemo, useState } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { Box, OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Mesh, MeshStandardMaterial, Group } from 'three';
import * as THREE from 'three';
import { frames, ModelConfig } from './defaults';
import { SkeletonUtils } from 'three/examples/jsm/Addons.js';
import { TextureLoader } from 'three';
import { PARAMETER_DEFINITIONS } from '../ParameterPanel/parameterDefintions';

interface ModelProps {
  modelPath: string;
  meshRequired: string;
  color?: string;
  setUpdatedConfigs: (configs: ModelConfig[]) => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  configs: ModelConfig[];
  subParts?: { name: string; color: { hex: string; label: string } }[];  // Added subParts prop
}

const Model = React.forwardRef<Group, ModelProps>(({ modelPath, color, setUpdatedConfigs, setIsLoading, configs, subParts }, ref) => {
  const { scene } = useGLTF(modelPath);
  console.log(scene,"scenen")
  // Apply color to the model if provided
  if (color) {
    scene.traverse((node) => {
      if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
        node.material.color.set(color);
      }
    });
  }

  // Handle subParts coloring
  if (subParts) {
    subParts.forEach(({ name, color }) => {
      const part = scene.getObjectByName(name); // 🔍 Find specific part by name
      if (part) {
        part.traverse((node) => {
          if (node instanceof Mesh && node.material) {
            // Clone material only for subpart meshes (so base color remains for other parts)
            node.material = node.material.clone();
            node.material.color.set(color.hex);
            node.material.needsUpdate = true; // Ensure the update
          }
        });
      }
    });
  }

  useEffect(() => {
    const updatedConfigs = [...configs];

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
  return <primitive object={scene} ref={ref} />;
});

Model.displayName = 'Model';

const Component = React.forwardRef<Group, { modelName:string, modelPath: string; position: THREE.Vector3; rotation: THREE.Quaternion; color?: string, subParts?: { name: string; color: { hex: string; label: string },texturePath?:string}[];frameType:string|undefined }>(({ modelName, modelPath, position, rotation, color, subParts, frameType }, ref) => {
  const { scene } = useGLTF(modelPath);
  const newScene = SkeletonUtils.clone(scene);
  console.log(newScene)
  const hiddenObjects = frameType && modelName && frames[frameType]?.[modelName] || [];

  // Apply color to the new scene if provided
  if (color) {
    newScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = child.material.clone(); 
        child.castShadow = true;
        child.material.color.set(color);
      }
    });
  } 
    if (subParts) {
      subParts.forEach(({ name, color , texturePath}) => {
        const part = newScene.getObjectByName(name); 
        let texture=null;
        
        if(texturePath){
          const newtexture = useLoader(TextureLoader, texturePath);
          texture=newtexture.clone()
        }
        if (part) {
          part.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              child.material = child.material.clone();  
              if (texture) {
                if(part.name == "logoBack"){
                  texture.rotation=Math.PI;
                }
                if(part.name == "logoFront"){
                texture.flipY = false;
                }
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.colorSpace = THREE.SRGBColorSpace;
                // Apply texture to material
                child.material.map = texture;            
            }
              child.material.color.set(color.hex);
              child.material.needsUpdate = true; 
            }
          });
        }
      });
  }
  hiddenObjects.forEach((name) => {
    const part = newScene.getObjectByName(name); // 🔍 Find specific part by name
    if (part) {
      part.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          child.visible = false; // Hide the mesh
        }
      });
    }

  });
  

  newScene.position.set(position.x, position.y, position.z);

  // @ts-ignore - primitive is a valid element in React Three Fiber
  return <primitive object={newScene} ref={ref} quaternion={rotation} />;
});

Component.displayName = 'Component';

const ThreeViewer: React.FC<{ configs: ModelConfig[]; setConfigs: (configs: ModelConfig[]) => void }> = ({ configs, setConfigs }) => {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Find all model paths based on the parameter definitions
  const allModelPaths = useMemo(() => {
    const paths = new Set<string>();
    PARAMETER_DEFINITIONS.forEach(definition => {
      definition.options?.forEach(option => {
        paths.add(option.value);
      });
    });
    return Array.from(paths);
  }, []);

  // Pre-load all models
  const preloadedScenes = useMemo(() => {
    return allModelPaths.map(path => {
      const { scene } = useGLTF(path);
      return { path, scene };
    });
  }, [allModelPaths]);

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
            {/* Model Rendering Logic */}
            <Model modelPath={configs[0].path} meshRequired={configs[0].meshRequired} color={configs[0]?.color} setUpdatedConfigs={setConfigs} setIsLoading={setIsLoading} configs={configs} subParts={configs[0]?.subParts} />
            {!isLoading &&
              configs.map(
                (model, index) =>
                  model.position && model.rotation && index !=0 && (
                    <Component key={index} modelName={model.name} modelPath={model.path} position={model.position} rotation={model.rotation} color={model?.color} subParts={model?.subParts} frameType={configs[0].type}/>
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
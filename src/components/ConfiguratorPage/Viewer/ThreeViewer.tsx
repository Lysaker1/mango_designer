'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Canvas, type RootState } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';
import { Mesh, Material, Group, MeshStandardMaterial } from 'three';

interface ModelProps {
  modelPath: string;
  color: string;
}

const Model = React.forwardRef<Group, ModelProps>(({ modelPath, color }, ref) => {
  const { scene } = useGLTF(modelPath);
  
  useEffect(() => {
    scene.traverse((node) => {
      if (node instanceof Mesh && node.material instanceof MeshStandardMaterial) {
        node.material.color.set(color);
      }
    });
  }, [scene, color]);

  // @ts-ignore - primitive is a valid element in React Three Fiber
  return <primitive object={scene} ref={ref} />;
});

Model.displayName = 'Model';

interface ThreeViewerProps {
  modelPath: string;
  color: string;
}

const ThreeViewer: React.FC<ThreeViewerProps> = ({ modelPath, color }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full min-h-[500px] bg-gray-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading 3D Viewer...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[500px] relative">
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 50 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5}>
            <Model modelPath={modelPath} color={color} />
          </Stage>
        </Suspense>
        <OrbitControls 
          autoRotate={false}
          enableZoom={true}
          enablePan={true}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
};

export default ThreeViewer; 

import * as THREE from 'three';

export type SupportedFormat = 'gltf' | 'glb' | 'obj' | 'stl';

// Determine file format from filename or URL
export const getFileFormat = (file: string): SupportedFormat | null => {
  const extension = file.split('.').pop()?.toLowerCase();
  
  if (['gltf', 'glb', 'obj', 'stl'].includes(extension || '')) {
    return extension as SupportedFormat;
  }
  
  return null;
};

// Create a proper material for models that need it
export const createDefaultMaterial = (): THREE.Material => {
  return new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.3,
    roughness: 0.7,
  });
};

// Simplified loader that relies on @react-three/drei's built-in loaders
export const loadModel = async (url: string): Promise<THREE.Object3D> => {
  // This is a simplified version that returns a promise
  // In reality, we're using @react-three/drei's useLoader in the component itself
  return new Promise((resolve, reject) => {
    // Create a placeholder object - the actual loading happens in the component
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = createDefaultMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    
    // This mesh will be replaced by the actual loaded model in the component
    resolve(mesh);
  });
};

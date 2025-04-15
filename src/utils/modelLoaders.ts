
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

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

// Load model based on file format
export const loadModel = async (url: string): Promise<THREE.Object3D> => {
  const format = getFileFormat(url);
  
  if (!format) {
    throw new Error('Unsupported file format');
  }
  
  return new Promise((resolve, reject) => {
    switch(format) {
      case 'stl':
        const stlLoader = new STLLoader();
        stlLoader.load(
          url,
          (geometry) => {
            const material = createDefaultMaterial();
            const mesh = new THREE.Mesh(geometry, material);
            resolve(mesh);
          },
          undefined,
          (error) => reject(new Error(`STL loading error: ${error}`))
        );
        break;
        
      case 'obj':
        const objLoader = new OBJLoader();
        objLoader.load(
          url,
          (object) => resolve(object),
          undefined,
          (error) => reject(new Error(`OBJ loading error: ${error}`))
        );
        break;
        
      case 'glb':
      case 'gltf':
        const gltfLoader = new GLTFLoader();
        gltfLoader.load(
          url,
          (gltf) => resolve(gltf.scene),
          undefined,
          (error) => reject(new Error(`GLTF loading error: ${error}`))
        );
        break;
        
      default:
        reject(new Error(`Format ${format} not implemented`));
    }
  });
};

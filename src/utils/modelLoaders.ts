
import * as THREE from 'three';
import { STLLoader } from 'three/addons/loaders/STLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export type SupportedFormat = 'gltf' | 'glb' | 'obj' | 'stl';

// Determine file format from filename or URL
export const getFileFormat = (file: string): SupportedFormat | null => {
  // Handle blob URLs from file uploads
  if (file.startsWith('blob:')) {
    // For blob URLs, try to extract format from the filename in query parameter if available
    const urlParts = file.split('/');
    const lastPart = urlParts[urlParts.length - 1];
    
    // Check if the blob URL contains any format indicators
    if (lastPart.includes('.stl') || lastPart.toLowerCase().includes('stl')) {
      return 'stl';
    } else if (lastPart.includes('.obj') || lastPart.toLowerCase().includes('obj')) {
      return 'obj';
    } else if (lastPart.includes('.glb') || lastPart.toLowerCase().includes('glb')) {
      return 'glb';
    } else if (lastPart.includes('.gltf') || lastPart.toLowerCase().includes('gltf')) {
      return 'gltf';
    }
  }
  
  // For regular URLs/filenames, extract the extension
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
  
  console.log("Detected format:", format, "for URL:", url);
  
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

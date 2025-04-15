
import { useState, useRef, Suspense, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Stage, 
  Html, 
  Environment, 
  Grid,
  ContactShadows
} from "@react-three/drei";
import { Card } from "@/components/ui/card";
import { SceneControls } from "@/components/ui/scene-controls";
import FileDropZone from "@/components/FileDropZone";
import * as THREE from 'three';
import { loadModel, SupportedFormat } from "@/utils/modelLoaders";
import { useToast } from "@/hooks/use-toast";

// Model component that handles various 3D formats
const Model = ({ url }: { url: string }) => {
  const [model, setModel] = useState<THREE.Object3D | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { camera } = useThree();
  const { toast } = useToast();
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    console.log("Attempting to load model from:", url);
    
    loadModel(url)
      .then(loadedModel => {
        setModel(loadedModel);
        setLoading(false);
        
        // Center and fit camera to model
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Calculate camera position based on object size
        const maxDim = Math.max(size.x, size.y, size.z);
        let cameraZ = maxDim * 2.5; // Adjusted positioning based on size
        
        // Position camera to look at center of model
        camera.position.set(center.x, center.y, center.z + cameraZ);
        camera.lookAt(center);
        
        console.log("Model loaded successfully:", loadedModel);
        toast({
          title: "Model loaded successfully",
          description: "3D model has been rendered.",
        });
      })
      .catch(err => {
        console.error("Error loading model:", err);
        setError(`Failed to load model: ${err.message}`);
        setLoading(false);
        toast({
          title: "Error loading model",
          description: err.message,
          variant: "destructive",
        });
      });
  }, [url, camera, toast]);
  
  if (loading) {
    return <Html center><div className="bg-gray-800 p-4 rounded text-white">Loading model...</div></Html>;
  }
  
  if (error) {
    return <Html center><div className="bg-red-900 p-4 rounded text-white">{error}</div></Html>;
  }
  
  if (!model) {
    return <Html center><div className="bg-orange-900 p-4 rounded text-white">No model data available</div></Html>;
  }
  
  return <primitive object={model} />;
};

// Environment options
const ENVIRONMENTS = [
  "city",
  "sunset",
  "dawn",
  "night",
  "warehouse",
  "forest",
  "apartment",
  "studio",
  "park",
  "lobby"
];

// Main ModelViewer component
const ModelViewer = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [environment, setEnvironment] = useState("city");
  const [showShadow, setShowShadow] = useState(true);
  const { toast } = useToast();
  
  // Handle file selection
  const handleFileSelected = (file: File) => {
    // Log details about the file for debugging
    console.log("File selected:", file.name, "Type:", file.type, "Size:", file.size);
    
    const url = URL.createObjectURL(file);
    console.log("File selected:", file.name, "URL:", url);
    setModelUrl(url);
    
    toast({
      title: "Processing 3D model",
      description: `Loading ${file.name}...`,
    });
  };

  // Handle screenshot
  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'model-screenshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  // Reset camera position
  const resetCamera = () => {
    // This will be handled by the OrbitControls reset
    if (document.querySelector('[data-reset-camera]')) {
      (document.querySelector('[data-reset-camera]') as HTMLElement).click();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow relative">
        {modelUrl ? (
          <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
            <color attach="background" args={["#111827"]} />
            <Suspense fallback={<Html center><p className="text-white">Loading model...</p></Html>}>
              <Stage environment={environment as "city" | "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "park" | "lobby"} intensity={lightIntensity} shadows={showShadow}>
                <Model url={modelUrl} />
              </Stage>
              {showGrid && <Grid infiniteGrid fadeStrength={1.5} fadeDistance={30} />}
              {showShadow && <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={1.5} far={10} />}
              <Environment preset={environment as "city" | "sunset" | "dawn" | "night" | "warehouse" | "forest" | "apartment" | "studio" | "park" | "lobby"} />
              <OrbitControls makeDefault />
            </Suspense>
          </Canvas>
        ) : (
          <FileDropZone 
            onFileSelected={handleFileSelected} 
            supportedFormats={['.glb', '.gltf', '.obj', '.stl']} 
          />
        )}
      </div>
      
      {modelUrl && (
        <Card className="mt-4 p-2 bg-gray-900 border-gray-800">
          <SceneControls
            onReset={() => setModelUrl(null)}
            onScreenshot={takeScreenshot}
            onShowGridToggle={() => setShowGrid(!showGrid)}
            showGrid={showGrid}
            lightIntensity={lightIntensity}
            onLightIntensityChange={(value) => setLightIntensity(value)}
            onResetView={resetCamera}
            environment={environment}
            environments={ENVIRONMENTS}
            onEnvironmentChange={setEnvironment}
            showShadow={showShadow}
            onShadowToggle={() => setShowShadow(!showShadow)}
          />
        </Card>
      )}
    </div>
  );
};

export default ModelViewer;

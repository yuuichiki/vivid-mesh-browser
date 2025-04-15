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
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { OptionsPanel } from "@/components/OptionsPanel";

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
        
        const box = new THREE.Box3().setFromObject(loadedModel);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        const maxDim = Math.max(size.x, size.y, size.z);
        let cameraZ = maxDim * 2.5;
        
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

const ModelViewer = () => {
  const [modelUrl, setModelUrl] = useState<string | null>(null);
  const [lightIntensity, setLightIntensity] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [environment, setEnvironment] = useState("city");
  const [showShadow, setShowShadow] = useState(true);
  const [showOptionsPanel, setShowOptionsPanel] = useState(true);
  const [isPanelPinned, setIsPanelPinned] = useState(false);
  const { toast } = useToast();
  
  const handleFileSelected = (file: File) => {
    console.log("File selected:", file.name, "Type:", file.type, "Size:", file.size);
    
    const url = URL.createObjectURL(file);
    console.log("File selected:", file.name, "URL:", url);
    setModelUrl(url);
    
    toast({
      title: "Processing 3D model",
      description: `Loading ${file.name}...`,
    });
  };

  const takeScreenshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'model-screenshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const resetCamera = () => {
    if (document.querySelector('[data-reset-camera]')) {
      (document.querySelector('[data-reset-camera]') as HTMLElement).click();
    }
  };

  const toggleOptionsPanel = () => {
    setShowOptionsPanel(!showOptionsPanel);
  };

  const togglePinPanel = () => {
    setIsPanelPinned(!isPanelPinned);
  };

  return (
    <div className="flex flex-col h-full">
      {modelUrl ? (
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg border border-gray-800">
          <ResizablePanel defaultSize={75} minSize={30} className="relative">
            <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 50 }}>
              <color attach="background" args={["#111827"]} />
              <Suspense fallback={<Html center><p className="text-white">Loading model...</p></Html>}>
                <Stage environment={environment as any} intensity={lightIntensity} shadows={showShadow}>
                  <Model url={modelUrl} />
                </Stage>
                {showGrid && <Grid infiniteGrid fadeStrength={1.5} fadeDistance={30} />}
                {showShadow && <ContactShadows position={[0, -1, 0]} opacity={0.5} scale={10} blur={1.5} far={10} />}
                <Environment preset={environment as any} />
                <OrbitControls makeDefault />
              </Suspense>
            </Canvas>
          </ResizablePanel>
          
          {showOptionsPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={25} minSize={15} maxSize={40}>
                <OptionsPanel 
                  modelUrl={modelUrl}
                  onReset={() => setModelUrl(null)}
                  onScreenshot={takeScreenshot}
                  onShowGridToggle={() => setShowGrid(!showGrid)}
                  showGrid={showGrid}
                  lightIntensity={lightIntensity}
                  onLightIntensityChange={setLightIntensity}
                  onResetView={resetCamera}
                  environment={environment}
                  environments={ENVIRONMENTS}
                  onEnvironmentChange={setEnvironment}
                  showShadow={showShadow}
                  onShadowToggle={() => setShowShadow(!showShadow)}
                  isPinned={isPanelPinned}
                  onTogglePin={togglePinPanel}
                  onClose={toggleOptionsPanel}
                />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      ) : (
        <FileDropZone 
          onFileSelected={handleFileSelected} 
          supportedFormats={['.glb', '.gltf', '.obj', '.stl']} 
        />
      )}
      
      {modelUrl && !showOptionsPanel && (
        <button 
          onClick={toggleOptionsPanel}
          className="absolute right-8 top-16 bg-gray-800 hover:bg-gray-700 rounded-full p-2 shadow-lg"
          title="Show options panel"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-settings">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      )}
      
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

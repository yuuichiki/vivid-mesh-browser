
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  RotateCcw,
  SunMoon,
  Grid as GridIcon,
  Image as ImageIcon,
  Maximize,
  Box,
  Lightbulb,
  Home,
  Mountain,
  Cloud
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SceneControlsProps {
  onReset: () => void;
  onScreenshot: () => void;
  onShowGridToggle: () => void;
  showGrid: boolean;
  lightIntensity: number;
  onLightIntensityChange: (value: number) => void;
  onResetView: () => void;
  environment?: string;
  environments?: string[];
  onEnvironmentChange?: (env: string) => void;
  showShadow?: boolean;
  onShadowToggle?: () => void;
}

export function SceneControls({
  onReset,
  onScreenshot,
  onShowGridToggle,
  showGrid,
  lightIntensity,
  onLightIntensityChange,
  onResetView,
  environment = "city",
  environments = [],
  onEnvironmentChange,
  showShadow = true,
  onShadowToggle
}: SceneControlsProps) {
  const [activeTab, setActiveTab] = useState("view");

  return (
    <div className="p-1">
      <Tabs defaultValue="view" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="view">Chế độ xem</TabsTrigger>
          <TabsTrigger value="lighting">Ánh sáng</TabsTrigger>
          <TabsTrigger value="actions">Thao tác</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="flex flex-wrap gap-2 justify-center">
          <Button size="sm" variant="outline" onClick={onResetView}>
            <Home className="h-4 w-4 mr-1" />
            Đặt lại góc nhìn
          </Button>
          <Button size="sm" variant="outline" onClick={onShowGridToggle}>
            <GridIcon className="h-4 w-4 mr-1" />
            {showGrid ? "Ẩn" : "Hiện"} lưới
          </Button>
          <Button size="sm" variant="outline" onClick={onReset}>
            <Box className="h-4 w-4 mr-1" />
            Tải mô hình khác
          </Button>
        </TabsContent>
        
        <TabsContent value="lighting" className="space-y-4">
          <div className="flex items-center gap-2 px-2 w-full max-w-xs">
            <Lightbulb className="h-4 w-4" />
            <span className="text-xs w-24">Cường độ ánh sáng</span>
            <Slider
              className="w-full"
              value={[lightIntensity]}
              min={0}
              max={2}
              step={0.1}
              onValueChange={(values) => onLightIntensityChange(values[0])}
            />
          </div>
          
          {environments.length > 0 && onEnvironmentChange && (
            <div className="flex items-center gap-2 px-2">
              <Mountain className="h-4 w-4" />
              <span className="text-xs">Môi trường:</span>
              <Select value={environment} onValueChange={onEnvironmentChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Chọn môi trường" />
                </SelectTrigger>
                <SelectContent>
                  {environments.map((env) => (
                    <SelectItem key={env} value={env}>
                      {env.charAt(0).toUpperCase() + env.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          
          {onShadowToggle && (
            <div className="px-2">
              <Button size="sm" variant="outline" onClick={onShadowToggle}>
                <Cloud className="h-4 w-4 mr-1" />
                {showShadow ? "Ẩn" : "Hiện"} đổ bóng
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="actions" className="flex flex-wrap gap-2 justify-center">
          <Button size="sm" variant="outline" onClick={onScreenshot}>
            <ImageIcon className="h-4 w-4 mr-1" />
            Chụp ảnh màn hình
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

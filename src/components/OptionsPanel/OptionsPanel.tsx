
import { ChevronRight, Pin, PinOff, X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OptionsPanelProps {
  modelUrl: string | null;
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
  isPinned: boolean;
  onTogglePin: () => void;
  onClose: () => void;
}

export const OptionsPanel = ({
  modelUrl,
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
  onShadowToggle,
  isPinned,
  onTogglePin,
  onClose
}: OptionsPanelProps) => {
  if (!modelUrl) return null;

  return (
    <Card className="flex flex-col h-full border-0 rounded-none bg-gray-900">
      <CardHeader className="flex flex-row items-center justify-between p-3 space-y-0 border-b border-gray-800">
        <CardTitle className="text-sm font-medium flex items-center">
          Tùy chọn
        </CardTitle>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={onTogglePin}
            title={isPinned ? "Unpin panel" : "Pin panel"}
          >
            {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7"
            onClick={onClose}
            title="Close panel"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow p-0 overflow-auto">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            <Tabs defaultValue="display" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="display">Hiển thị</TabsTrigger>
                <TabsTrigger value="lighting">Ánh sáng</TabsTrigger>
                <TabsTrigger value="camera">Camera</TabsTrigger>
              </TabsList>
              
              <TabsContent value="display" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Lưới</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onShowGridToggle} 
                    className="w-full justify-start"
                  >
                    {showGrid ? "Ẩn lưới" : "Hiện lưới"}
                  </Button>
                </div>
                
                {onShadowToggle && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Đổ bóng</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={onShadowToggle} 
                      className="w-full justify-start"
                    >
                      {showShadow ? "Ẩn đổ bóng" : "Hiện đổ bóng"}
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="lighting" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Cường độ ánh sáng</h3>
                  <Slider
                    value={[lightIntensity]}
                    min={0}
                    max={2}
                    step={0.1}
                    onValueChange={(values) => onLightIntensityChange(values[0])}
                  />
                  <div className="text-xs text-right text-gray-400">
                    {lightIntensity.toFixed(1)}
                  </div>
                </div>
                
                {environments.length > 0 && onEnvironmentChange && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Môi trường</h3>
                    <Select value={environment} onValueChange={onEnvironmentChange}>
                      <SelectTrigger className="w-full">
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
              </TabsContent>
              
              <TabsContent value="camera" className="space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Điều khiển camera</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onResetView} 
                    className="w-full justify-start"
                  >
                    Đặt lại góc nhìn
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </CardContent>
      
      <CardFooter className="border-t border-gray-800 p-3 flex justify-between">
        <Button variant="outline" size="sm" onClick={onScreenshot}>
          Chụp ảnh
        </Button>
        <Button variant="destructive" size="sm" onClick={onReset}>
          Tải mô hình khác
        </Button>
      </CardFooter>
    </Card>
  );
};

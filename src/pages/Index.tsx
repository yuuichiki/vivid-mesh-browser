
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ModelViewer from "@/components/ModelViewer";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-950 text-white p-4">
      <Card className="bg-gray-900 border-gray-800 text-white shadow-xl">
        <CardHeader className="border-b border-gray-800">
          <CardTitle className="text-2xl font-bold text-white">Trình xem mô hình 3D</CardTitle>
          <CardDescription className="text-gray-400">
            Hỗ trợ các định dạng: GLB, GLTF, OBJ, STL
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[85vh] p-4">
          <ModelViewer />
        </CardContent>
      </Card>
      
      <footer className="text-center mt-6 text-gray-500 text-sm">
        <p>Kéo thả mô hình 3D vào để xem. Sử dụng chuột để xoay, phóng to và di chuyển.</p>
      </footer>
    </div>
  );
};

export default Index;

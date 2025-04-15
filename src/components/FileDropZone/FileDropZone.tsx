
import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FileDropZoneProps {
  onFileSelected: (file: File) => void;
  supportedFormats?: string[];
  className?: string;
}

const FileDropZone = ({ 
  onFileSelected,
  supportedFormats = ['.glb', '.gltf', '.obj', '.stl'],
  className = ''
}: FileDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };
  
  const validateAndProcessFile = (file: File) => {
    // Check file extension
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    const isValidExtension = supportedFormats.some(format => 
      format.toLowerCase() === fileExtension || 
      format.toLowerCase() === fileExtension.substring(1)
    );
    
    if (isValidExtension) {
      console.log("File selected:", file.name, "Type:", file.type);
      onFileSelected(file);
      toast({
        title: "File uploaded successfully",
        description: `${file.name} is now being rendered.`,
      });
    } else {
      toast({
        title: "Unsupported file format",
        description: `Please use one of these formats: ${supportedFormats.join(', ')}`,
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className={`w-full h-full ${className}`}>
      <div
        className={`h-full w-full flex items-center justify-center rounded-md transition-colors ${
          isDragging ? 'bg-gray-800 border-2 border-dashed border-blue-500' : 'bg-gray-900'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Card className="p-8 w-96 text-center bg-gray-800 border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-white">Upload 3D Model</h2>
          <p className="mb-6 text-gray-400">
            Supported formats: {supportedFormats.join(', ')}
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={supportedFormats.join(',')}
            onChange={handleFileInput}
            className="hidden"
          />
          <Button 
            className="w-full mb-4" 
            onClick={() => fileInputRef.current?.click()}
          >
            Select File
          </Button>
          <p className="text-sm text-gray-400">
            Or drag and drop a file anywhere on this screen
          </p>
        </Card>
      </div>
    </div>
  );
};

export default FileDropZone;

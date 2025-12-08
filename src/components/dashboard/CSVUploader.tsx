import { useState } from "react";
import { Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { parseCSV, Student } from "@/lib/csvParser";

interface CSVUploaderProps {
  onDataLoaded: (students: Student[]) => void;
}

export const CSVUploader = ({ onDataLoaded }: CSVUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const text = await file.text();
      const students = parseCSV(text);
      
      if (students.length === 0) {
        toast({
          title: "No Data Found",
          description: "The CSV file doesn't contain valid student data",
          variant: "destructive"
        });
        return;
      }

      onDataLoaded(students);
      toast({
        title: "Upload Successful",
        description: `Loaded ${students.length} students from CSV`
      });
    } catch (error) {
      toast({
        title: "Error Parsing CSV",
        description: error instanceof Error ? error.message : "Failed to parse CSV file",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg p-8 transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-primary/50"
      } ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
    >
      <input
        type="file"
        accept=".csv"
        onChange={handleFileInput}
        disabled={isLoading}
        className="hidden"
        id="csv-input"
      />
      
      <label htmlFor="csv-input" className="cursor-pointer flex flex-col items-center gap-3">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="text-center">
          <p className="font-semibold text-sm">
            {isLoading ? "Processing CSV..." : "Drag and drop your CSV file here"}
          </p>
          <p className="text-xs text-muted-foreground">or click to select a file</p>
        </div>
      </label>

      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md flex gap-2">
        <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          CSV should include: ID, Name, Email, and completion status columns for each activity
        </p>
      </div>
    </div>
  );
};

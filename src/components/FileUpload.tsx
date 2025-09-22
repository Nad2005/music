import { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Song } from "@/data/songs";

interface FileUploadProps {
  onFilesUploaded: (songs: Song[]) => void;
}

interface UploadedFile {
  file: File;
  url: string;
  metadata: {
    title: string;
    artist: string;
    duration: string;
  };
}

const FileUpload = ({ onFilesUploaded }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const extractAudioMetadata = (file: File): Promise<{ title: string; artist: string; duration: string }> => {
    return new Promise((resolve) => {
      const audio = new Audio();
      const url = URL.createObjectURL(file);
      
      audio.addEventListener('loadedmetadata', () => {
        const duration = formatDuration(audio.duration);
        
        // Extract title and artist from filename or use defaults
        const filename = file.name.replace(/\.mp3$/i, '');
        const parts = filename.split(' - ');
        
        let title, artist;
        if (parts.length >= 2) {
          artist = parts[0].trim();
          title = parts.slice(1).join(' - ').trim();
        } else {
          title = filename;
          artist = 'Unknown Artist';
        }
        
        URL.revokeObjectURL(url);
        resolve({ title, artist, duration });
      });
      
      audio.addEventListener('error', () => {
        URL.revokeObjectURL(url);
        resolve({ 
          title: file.name.replace(/\.mp3$/i, ''), 
          artist: 'Unknown Artist', 
          duration: '0:00' 
        });
      });
      
      audio.src = url;
    });
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const processFiles = async (files: FileList) => {
    setUploading(true);
    const validFiles: File[] = [];
    
    // Filter for MP3 files
    Array.from(files).forEach(file => {
      if (file.type === 'audio/mpeg' || file.name.toLowerCase().endsWith('.mp3')) {
        if (file.size > 50 * 1024 * 1024) { // 50MB limit
          toast({
            title: "File too large",
            description: `${file.name} is larger than 50MB and cannot be uploaded.`,
            variant: "destructive",
          });
        } else {
          validFiles.push(file);
        }
      } else {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a valid MP3 file.`,
          variant: "destructive",
        });
      }
    });

    if (validFiles.length === 0) {
      setUploading(false);
      return;
    }

    try {
      const uploadedSongs: Song[] = [];
      
      for (const file of validFiles) {
        const url = URL.createObjectURL(file);
        const metadata = await extractAudioMetadata(file);
        
        const song: Song = {
          id: `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: metadata.title,
          artist: metadata.artist,
          album: 'Uploaded Music',
          genre: 'Local File',
          duration: metadata.duration,
          audioUrl: url,
          coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop',
          year: new Date().getFullYear()
        };
        
        uploadedSongs.push(song);
      }
      
      // Store uploaded songs metadata in localStorage (excluding the blob URLs)
      const existingUploaded = JSON.parse(localStorage.getItem('music_app_uploaded_songs') || '[]');
      const songsForStorage = uploadedSongs.map(song => ({
        ...song,
        audioUrl: '', // Don't store the blob URL in localStorage
        isUploaded: true
      }));
      
      localStorage.setItem('music_app_uploaded_songs', JSON.stringify([...existingUploaded, ...songsForStorage]));
      
      onFilesUploaded(uploadedSongs);
      
      toast({
        title: "Files uploaded successfully",
        description: `${uploadedSongs.length} song${uploadedSongs.length > 1 ? 's' : ''} added to your library.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error processing your files.",
        variant: "destructive",
      });
    }
    
    setUploading(false);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".mp3,audio/mpeg"
        multiple
        onChange={handleFileInput}
        className="hidden"
      />
      
      <Card
        className={`cursor-pointer transition-all duration-200 ${
          dragActive 
            ? 'border-primary bg-primary/10 scale-105' 
            : 'border-dashed border-border/50 hover:border-primary/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-3">
            <div className="p-3 rounded-full bg-primary/10">
              {uploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent" />
              ) : (
                <Upload className="h-6 w-6 text-primary" />
              )}
            </div>
            
            <div>
              <p className="font-medium text-foreground">
                {uploading ? 'Processing files...' : 'Upload MP3 Files'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Drag & drop or click to select MP3 files
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Max file size: 50MB per file
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FileUpload;
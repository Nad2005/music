import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Download } from "lucide-react";
import { Song } from "@/data/songs";
import { useToast } from "@/hooks/use-toast";

interface AudioPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const AudioPlayer = ({ currentSong, isPlaying, onPlayPause, onNext, onPrevious }: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([50]);
  const [isLiked, setIsLiked] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (currentSong && audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  useEffect(() => {
    if (currentSong) {
      // Check if song is liked/downloaded from localStorage
      const likedSongs = JSON.parse(localStorage.getItem('music_app_liked_songs') || '[]');
      const downloadedSongs = JSON.parse(localStorage.getItem('music_app_downloaded_songs') || '[]');
      
      setIsLiked(likedSongs.includes(currentSong.id));
      setIsDownloaded(downloadedSongs.includes(currentSong.id));
    }
  }, [currentSong]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const toggleLike = () => {
    if (!currentSong) return;
    
    const likedSongs = JSON.parse(localStorage.getItem('music_app_liked_songs') || '[]');
    let updatedLiked;
    
    if (isLiked) {
      updatedLiked = likedSongs.filter((id: string) => id !== currentSong.id);
      toast({ title: "Removed from liked songs" });
    } else {
      updatedLiked = [...likedSongs, currentSong.id];
      toast({ title: "Added to liked songs" });
    }
    
    localStorage.setItem('music_app_liked_songs', JSON.stringify(updatedLiked));
    setIsLiked(!isLiked);
  };

  const toggleDownload = () => {
    if (!currentSong) return;
    
    const downloadedSongs = JSON.parse(localStorage.getItem('music_app_downloaded_songs') || '[]');
    let updatedDownloaded;
    
    if (isDownloaded) {
      updatedDownloaded = downloadedSongs.filter((id: string) => id !== currentSong.id);
      toast({ title: "Removed from downloads" });
    } else {
      updatedDownloaded = [...downloadedSongs, currentSong.id];
      toast({ title: "Song downloaded for offline listening" });
    }
    
    localStorage.setItem('music_app_downloaded_songs', JSON.stringify(updatedDownloaded));
    setIsDownloaded(!isDownloaded);
  };

  if (!currentSong) return null;

  return (
    <div className="player-controls animate-slide-in">
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={onNext}
      />
      
      <div className="flex items-center justify-between">
        {/* Song Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <img
            src={currentSong.coverUrl}
            alt={currentSong.title}
            className="w-14 h-14 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="font-semibold text-foreground truncate">{currentSong.title}</p>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleLike}
            className={isLiked ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onPrevious}>
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={onPlayPause} 
            className="gradient-primary text-primary-foreground hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <Button variant="ghost" size="sm" onClick={onNext}>
            <SkipForward className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={toggleDownload}
            className={isDownloaded ? "text-green-500 hover:text-green-600" : "text-muted-foreground hover:text-foreground"}
          >
            <Download className={`h-4 w-4 ${isDownloaded ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Progress and Volume */}
        <div className="flex items-center space-x-4 flex-1 justify-end">
          <div className="flex items-center space-x-2 min-w-[200px]">
            <span className="text-xs text-muted-foreground w-10">{formatTime(currentTime)}</span>
            <Slider
              value={[currentTime]}
              max={duration}
              step={1}
              onValueChange={handleSeek}
              className="flex-1"
            />
            <span className="text-xs text-muted-foreground w-10">{formatTime(duration)}</span>
          </div>
          
          <div className="flex items-center space-x-2 min-w-[100px]">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={volume}
              max={100}
              step={1}
              onValueChange={setVolume}
              className="w-20"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
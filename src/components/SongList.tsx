import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, Heart, Download, Star, Plus } from "lucide-react";
import { Song } from "@/data/songs";
import { useToast } from "@/hooks/use-toast";

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onSongSelect: (song: Song) => void;
  onPlayPause: () => void;
}

const SongList = ({ songs, currentSong, isPlaying, onSongSelect, onPlayPause }: SongListProps) => {
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('music_app_ratings');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [likedSongs, setLikedSongs] = useState<string[]>(() => {
    const saved = localStorage.getItem('music_app_liked_songs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [downloadedSongs, setDownloadedSongs] = useState<string[]>(() => {
    const saved = localStorage.getItem('music_app_downloaded_songs');
    return saved ? JSON.parse(saved) : [];
  });

  const { toast } = useToast();

  const handlePlay = (song: Song) => {
    if (currentSong?.id === song.id) {
      onPlayPause();
    } else {
      onSongSelect(song);
    }
  };

  const handleRate = (songId: string, rating: number) => {
    const newRatings = { ...ratings, [songId]: rating };
    setRatings(newRatings);
    localStorage.setItem('music_app_ratings', JSON.stringify(newRatings));
    toast({ title: `Rated ${rating} stars` });
  };

  const toggleLike = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    const isLiked = likedSongs.includes(songId);
    let updatedLiked;
    
    if (isLiked) {
      updatedLiked = likedSongs.filter(id => id !== songId);
    } else {
      updatedLiked = [...likedSongs, songId];
    }
    
    setLikedSongs(updatedLiked);
    localStorage.setItem('music_app_liked_songs', JSON.stringify(updatedLiked));
    toast({ title: isLiked ? "Removed from liked" : "Added to liked" });
  };

  const toggleDownload = (e: React.MouseEvent, songId: string) => {
    e.stopPropagation();
    const isDownloaded = downloadedSongs.includes(songId);
    let updatedDownloaded;
    
    if (isDownloaded) {
      updatedDownloaded = downloadedSongs.filter(id => id !== songId);
    } else {
      updatedDownloaded = [...downloadedSongs, songId];
    }
    
    setDownloadedSongs(updatedDownloaded);
    localStorage.setItem('music_app_downloaded_songs', JSON.stringify(updatedDownloaded));
    toast({ title: isDownloaded ? "Removed from downloads" : "Downloaded for offline" });
  };

  return (
    <div className="space-y-2">
      {songs.map((song) => {
        const isCurrentSong = currentSong?.id === song.id;
        const songRating = ratings[song.id] || 0;
        const isLiked = likedSongs.includes(song.id);
        const isDownloaded = downloadedSongs.includes(song.id);

        return (
          <Card
            key={song.id}
            className={`p-4 cursor-pointer transition-all duration-200 hover:bg-accent/50 ${
              isCurrentSong ? 'bg-accent border-primary' : 'bg-card hover:bg-card/80'
            } gradient-card smooth-hover`}
            onClick={() => handlePlay(song)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div className="relative">
                  <img
                    src={song.coverUrl}
                    alt={song.title}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlay(song);
                      }}
                    >
                      {isCurrentSong && isPlaying ? 
                        <Pause className="h-4 w-4 text-white" /> : 
                        <Play className="h-4 w-4 text-white" />
                      }
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {song.title}
                    </h3>
                    {isCurrentSong && (
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {song.genre}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{song.duration}</span>
                    {isDownloaded && (
                      <Badge variant="outline" className="text-xs text-green-500 border-green-500">
                        Downloaded
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {/* Rating Stars */}
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRate(song.id, star);
                      }}
                    >
                      <Star
                        className={`h-3 w-3 ${
                          star <= songRating
                            ? 'text-yellow-500 fill-current'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </Button>
                  ))}
                </div>

                {/* Action Buttons */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  onClick={(e) => toggleLike(e, song.id)}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isLiked ? 'text-red-500 fill-current' : 'text-muted-foreground'
                    }`}
                  />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm" 
                  className="p-2"
                  onClick={(e) => toggleDownload(e, song.id)}
                >
                  <Download
                    className={`h-4 w-4 ${
                      isDownloaded ? 'text-green-500 fill-current' : 'text-muted-foreground'
                    }`}
                  />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <Plus className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default SongList;
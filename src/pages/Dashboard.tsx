import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { songs, Song, Playlist, getRandomRecommendations } from "@/data/songs";
import AudioPlayer from "@/components/AudioPlayer";
import SongList from "@/components/SongList";
import FileUpload from "@/components/FileUpload";
import { Music, Search, LogOut, Plus, Heart, Download, Star, Shuffle, Upload } from "lucide-react";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSongs, setFilteredSongs] = useState<Song[]>(songs);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<string | null>(null);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [uploadedSongs, setUploadedSongs] = useState<Song[]>([]);
  const [showUpload, setShowUpload] = useState(false);
  const [allSongs, setAllSongs] = useState<Song[]>(songs);

  // Load playlists and uploaded songs on mount
  useEffect(() => {
    const savedPlaylists = localStorage.getItem('music_app_playlists');
    if (savedPlaylists) {
      setPlaylists(JSON.parse(savedPlaylists));
    }
    
    // Load uploaded songs metadata (URLs will be empty, need to re-upload for session)
    const savedUploaded = localStorage.getItem('music_app_uploaded_songs');
    if (savedUploaded) {
      const uploadedMetadata = JSON.parse(savedUploaded);
      // These will show in the list but won't be playable until re-uploaded
      setAllSongs([...songs, ...uploadedMetadata]);
    }
    
    // Load initial recommendations
    setRecommendations(getRandomRecommendations());
  }, []);

  // Filter songs based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredSongs(allSongs);
    } else {
      const filtered = allSongs.filter(song =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, allSongs]);

  const handleSongSelect = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    const index = filteredSongs.findIndex(s => s.id === song.id);
    setCurrentIndex(index);
    
    // Update recommendations when a new song is selected
    setRecommendations(getRandomRecommendations(song.id));
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (currentIndex < filteredSongs.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentSong(filteredSongs[nextIndex]);
      setIsPlaying(true);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      setCurrentSong(filteredSongs[prevIndex]);
      setIsPlaying(true);
    }
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      songIds: [],
      createdAt: new Date().toISOString(),
    };
    
    const updatedPlaylists = [...playlists, newPlaylist];
    setPlaylists(updatedPlaylists);
    localStorage.setItem('music_app_playlists', JSON.stringify(updatedPlaylists));
    setNewPlaylistName('');
    
    toast({ title: `Playlist "${newPlaylistName}" created` });
  };

  const getPlaylistSongs = (playlist: Playlist): Song[] => {
    return playlist.songIds.map(id => songs.find(song => song.id === id)).filter(Boolean) as Song[];
  };

  const handleFilesUploaded = (newSongs: Song[]) => {
    setUploadedSongs(prev => [...prev, ...newSongs]);
    setAllSongs(prev => [...prev, ...newSongs]);
    setShowUpload(false);
    toast({ title: `${newSongs.length} song${newSongs.length > 1 ? 's' : ''} uploaded successfully!` });
  };

  const getLikedSongs = (): Song[] => {
    const likedSongIds = JSON.parse(localStorage.getItem('music_app_liked_songs') || '[]');
    return allSongs.filter(song => likedSongIds.includes(song.id));
  };

  const getDownloadedSongs = (): Song[] => {
    const downloadedSongIds = JSON.parse(localStorage.getItem('music_app_downloaded_songs') || '[]');
    return allSongs.filter(song => downloadedSongIds.includes(song.id));
  };

  const displaySongs = selectedPlaylist
    ? selectedPlaylist === 'liked'
      ? getLikedSongs()
      : selectedPlaylist === 'downloaded'
      ? getDownloadedSongs()
      : getPlaylistSongs(playlists.find(p => p.id === selectedPlaylist)!)
    : filteredSongs;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="glass border-b border-border/50 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Music className="h-8 w-8 text-primary" />
                <span className="text-2xl font-bold neon-text">SoundStream</span>
              </div>
              
              {/* Search Bar */}
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search songs, artists, albums, or genres..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input/50 border-border focus:border-primary"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Welcome, {user?.name}!</span>
              <Button variant="ghost" onClick={logout} className="text-muted-foreground hover:text-foreground">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3">
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Music className="h-5 w-5" />
                  <span>Your Library</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={!selectedPlaylist ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPlaylist(null)}
                >
                  <Shuffle className="h-4 w-4 mr-2" />
                  All Songs
                </Button>
                
                <Button
                  variant="ghost"
                  className="w-full justify-start text-primary hover:text-primary/80"
                  onClick={() => setShowUpload(true)}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload MP3 Files
                </Button>
                
                <Button
                  variant={selectedPlaylist === 'liked' ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPlaylist('liked')}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Liked Songs
                </Button>
                
                <Button
                  variant={selectedPlaylist === 'downloaded' ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedPlaylist('downloaded')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Downloaded
                </Button>

                <div className="pt-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Input
                      placeholder="New playlist name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="text-sm"
                    />
                    <Button size="sm" onClick={createPlaylist}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {playlists.map((playlist) => (
                    <Button
                      key={playlist.id}
                      variant={selectedPlaylist === playlist.id ? "secondary" : "ghost"}
                      className="w-full justify-start mb-1"
                      onClick={() => setSelectedPlaylist(playlist.id)}
                    >
                      <Music className="h-4 w-4 mr-2" />
                      {playlist.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="gradient-card border-border/50 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="h-5 w-5" />
                  <span>Recommended</span>
                </CardTitle>
                <CardDescription>Songs you might like</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendations.map((song) => (
                  <div 
                    key={song.id}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => handleSongSelect(song)}
                  >
                    <img
                      src={song.coverUrl}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{song.title}</p>
                      <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="col-span-9">
            {showUpload ? (
              <Card className="gradient-card border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Upload Your Music</CardTitle>
                      <CardDescription>
                        Add your own MP3 files to your music library
                      </CardDescription>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowUpload(false)}
                    >
                      Back to Library
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <FileUpload onFilesUploaded={handleFilesUploaded} />
                  
                  {uploadedSongs.length > 0 && (
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-3">Recently Uploaded</h3>
                      <div className="grid gap-3">
                        {uploadedSongs.slice(-5).map((song) => (
                          <div 
                            key={song.id}
                            className="flex items-center space-x-3 p-3 rounded-lg bg-accent/20 border border-border/50"
                          >
                            <img
                              src={song.coverUrl}
                              alt={song.title}
                              className="w-12 h-12 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{song.title}</p>
                              <p className="text-sm text-muted-foreground truncate">{song.artist}</p>
                            </div>
                            <Button
                              size="sm"
                              onClick={() => {
                                handleSongSelect(song);
                                setShowUpload(false);
                              }}
                              className="gradient-primary text-primary-foreground"
                            >
                              Play
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card className="gradient-card border-border/50">
                <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>
                      {selectedPlaylist === 'liked' ? 'Liked Songs' :
                       selectedPlaylist === 'downloaded' ? 'Downloaded Songs' :
                       selectedPlaylist ? playlists.find(p => p.id === selectedPlaylist)?.name :
                       searchQuery ? `Search Results for "${searchQuery}"` : 'All Songs'}
                    </CardTitle>
                    <CardDescription>
                      {displaySongs.length} song{displaySongs.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  
                  {displaySongs.length > 0 && (
                    <Button 
                      onClick={() => handleSongSelect(displaySongs[0])}
                      className="gradient-primary text-primary-foreground"
                    >
                      <Shuffle className="h-4 w-4 mr-2" />
                      Shuffle Play
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {displaySongs.length === 0 ? (
                  <div className="text-center py-12">
                    <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      {searchQuery ? 'No songs found matching your search.' : 'No songs in this collection.'}
                    </p>
                  </div>
                ) : (
                  <SongList
                    songs={displaySongs}
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onSongSelect={handleSongSelect}
                    onPlayPause={handlePlayPause}
                  />
                )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Audio Player */}
      <AudioPlayer
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default Dashboard;
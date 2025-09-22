export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  audioUrl: string;
  coverUrl: string;
  year: number;
}

// Dummy song data for the music streaming app
export const songs: Song[] = [
  {
    id: "1",
    title: "Midnight Groove",
    artist: "Neon Dreams",
    album: "Electric Nights",
    genre: "Electronic",
    duration: "3:42",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    year: 2023
  },
  {
    id: "2",
    title: "Ocean Waves",
    artist: "Azure Coast",
    album: "Tidal Memories",
    genre: "Ambient",
    duration: "4:15",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    coverUrl: "https://images.unsplash.com/photo-1519145450259-4b379d1dd699?w=300&h=300&fit=crop",
    year: 2022
  },
  {
    id: "3",
    title: "City Lights",
    artist: "Urban Pulse",
    album: "Metropolitan",
    genre: "Hip Hop",
    duration: "3:28",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    year: 2023
  },
  {
    id: "4",
    title: "Sunset Boulevard",
    artist: "Golden Hour",
    album: "California Dreams",
    genre: "Rock",
    duration: "4:03",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    year: 2021
  },
  {
    id: "5",
    title: "Digital Love",
    artist: "Cyber Romance",
    album: "Future Hearts",
    genre: "Electronic",
    duration: "3:55",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop",
    year: 2023
  },
  {
    id: "6",
    title: "Mountain Echo",
    artist: "Alpine Sounds",
    album: "Natural Harmony",
    genre: "Folk",
    duration: "5:12",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
    year: 2020
  },
  {
    id: "7",
    title: "Jazz Café",
    artist: "Smooth Operators",
    album: "Late Night Sessions",
    genre: "Jazz",
    duration: "6:22",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    year: 2022
  },
  {
    id: "8",
    title: "Thunderstorm",
    artist: "Storm Chasers",
    album: "Weather Patterns",
    genre: "Rock",
    duration: "4:44",
    audioUrl: "https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    year: 2023
  }
];

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  createdAt: string;
}

export const getRandomRecommendations = (excludeId?: string): Song[] => {
  const filtered = excludeId ? songs.filter(song => song.id !== excludeId) : songs;
  const shuffled = [...filtered].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
};
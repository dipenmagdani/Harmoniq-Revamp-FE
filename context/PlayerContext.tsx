"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { Song } from "../types";
import { getAudioUrl, api } from "@/app/lib/api";

interface PlayerContextType {
  currentSong: Song | null;
  isPlaying: boolean;
  isLoading: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Song[];
  originalQueue: Song[]; // To maintain order when shuffling
  isShuffling: boolean;
  repeatMode: "off" | "all" | "one";
  isFullScreen: boolean;

  playSong: (song: Song, contextQueue?: Song[]) => void;
  togglePlay: () => void;
  playNext: () => void;
  playPrev: () => void;
  setVolume: (val: number) => void;
  seek: (time: number) => void;
  addToQueue: (song: Song) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  toggleFullScreen: (state?: boolean) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [queue, setQueue] = useState<Song[]>([]);
  const [originalQueue, setOriginalQueue] = useState<Song[]>([]);

  const [isShuffling, setIsShuffling] = useState(false);
  const [repeatMode, setRepeatMode] = useState<"off" | "all" | "one">("off");
  const [isFullScreen, setIsFullScreen] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;
    audioRef.current.crossOrigin = "anonymous"; // For visualizations if needed

    const audio = audioRef.current;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };
    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
    };
  }, [repeatMode]); // Re-bind if repeat mode changes logic in listener (though here we call playNext which reads state)

  // Helper to shuffle
  const shuffleArray = (array: Song[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  const playSong = useCallback(
    async (song: Song, contextQueue?: Song[]) => {
      // Update Queue Logic
      if (contextQueue) {
        setOriginalQueue(contextQueue);
        if (isShuffling) {
          setQueue(shuffleArray(contextQueue));
        } else {
          setQueue(contextQueue);
        }
      } else {
        // Playing a single song not in a playlist context
        // If queue is empty, just add it. If not, add to next.
        if (queue.length === 0) {
          setQueue([song]);
          setOriginalQueue([song]);
        }
      }

      setIsLoading(true);
      let fullSong = song;
      let audioUrl = "";

      if (song.download_url && song.download_url.length > 0) {
        audioUrl = getAudioUrl(song);
      }

      if (!audioUrl) {
        try {
          const res = await api.getSong(song.id);
          if (res.data && res.data.songs && res.data.songs.length > 0) {
            fullSong = res.data.songs[0];
            audioUrl = getAudioUrl(fullSong);
          }
        } catch (e) {
          console.error("Failed to fetch full song details", e);
        }
      }

      setCurrentSong(fullSong);

      if (audioRef.current && audioUrl) {
        audioRef.current.src = audioUrl;
        audioRef.current
          .play()
          .catch((e) => console.error("Playback failed", e));
        setIsPlaying(true);

        // Update Media Session
        if ("mediaSession" in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: fullSong.name,
            artist:
              fullSong.artist_map?.primary_artists?.[0]?.name || "Harmoniq",
            artwork: fullSong.image?.map((img) => ({
              src: img.link,
              sizes: img.quality,
              type: "image/jpeg",
            })),
          });
        }
      }
      setIsLoading(false);
    },
    [isShuffling, queue]
  ); // Added queue to deps to fix single play logic if needed, but mostly contextQueue handles it

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentSong) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [isPlaying, currentSong]);

  const playNext = useCallback(() => {
    // If repeat one, we handle in onEnded, but manual click should go next
    if (!currentSong || queue.length === 0) return;

    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);

    if (currentIndex < queue.length - 1) {
      playSong(queue[currentIndex + 1]);
    } else if (repeatMode === "all") {
      playSong(queue[0]);
    } else {
      setIsPlaying(false);
    }
  }, [currentSong, queue, playSong, repeatMode]);

  const playPrev = useCallback(() => {
    if (!currentSong || queue.length === 0) return;

    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    const currentIndex = queue.findIndex((s) => s.id === currentSong.id);
    if (currentIndex > 0) {
      playSong(queue[currentIndex - 1]);
    } else if (repeatMode === "all") {
      playSong(queue[queue.length - 1]);
    }
  }, [currentSong, queue, playSong, repeatMode]);

  const toggleShuffle = useCallback(() => {
    const newShuffleState = !isShuffling;
    setIsShuffling(newShuffleState);

    if (newShuffleState) {
      setQueue(shuffleArray(originalQueue));
    } else {
      setQueue(originalQueue);
    }
  }, [isShuffling, originalQueue]);

  const toggleRepeat = useCallback(() => {
    setRepeatMode((prev) => {
      if (prev === "off") return "all";
      if (prev === "all") return "one";
      return "off";
    });
  }, []);

  const toggleFullScreen = useCallback((state?: boolean) => {
    setIsFullScreen((prev) => (state !== undefined ? state : !prev));
  }, []);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
    }
  }, []);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setProgress(time);
    }
  }, []);

  const addToQueue = useCallback((song: Song) => {
    setQueue((prev) => [...prev, song]);
    setOriginalQueue((prev) => [...prev, song]);
  }, []);

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        isLoading,
        volume,
        progress,
        duration,
        queue,
        originalQueue,
        isShuffling,
        repeatMode,
        isFullScreen,
        playSong,
        togglePlay,
        playNext,
        playPrev,
        setVolume,
        seek,
        addToQueue,
        toggleShuffle,
        toggleRepeat,
        toggleFullScreen,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context)
    throw new Error("usePlayer must be used within a PlayerProvider");
  return context;
};

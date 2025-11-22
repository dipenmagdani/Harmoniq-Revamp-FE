"use client";

import React from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  ChevronDown,
  Repeat,
  Shuffle,
  ListMusic,
} from "lucide-react";
import { getImageUrl, getArtistNames } from "@/app/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";

export const FullScreenPlayer = () => {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    playNext,
    playPrev,
    volume,
    setVolume,
    progress,
    duration,
    seek,
    isFullScreen,
    toggleFullScreen,
    queue,
    playSong,
    isShuffling,
    toggleShuffle,
    repeatMode,
    toggleRepeat,
  } = usePlayer();

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentSong) return null;

  const image = getImageUrl(currentSong.image);

  return (
    <AnimatePresence>
      {isFullScreen && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[100] bg-black flex flex-col text-white overflow-hidden"
        >
          {/* Dynamic Background */}
          <div className="absolute inset-0 z-0">
            <div
              className="absolute inset-0 bg-cover bg-center blur-[100px] opacity-40 scale-125"
              style={{ backgroundImage: `url(${image})` }}
            ></div>
            <div className="absolute inset-0 bg-black/60"></div>
          </div>

          {/* Header */}
          <div className="relative z-10 px-8 py-6 flex items-center justify-between">
            <button
              onClick={() => toggleFullScreen(false)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronDown size={28} />
            </button>
            <div className="flex flex-col items-center">
              <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                Now Playing
              </span>
              <span className="text-sm font-bold">
                {currentSong.album || "Single"}
              </span>
            </div>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <ListMusic size={24} />
            </button>
          </div>

          {/* Main Content */}
          <div className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 px-8 pb-8 md:px-16 overflow-y-auto custom-scrollbar">
            {/* Left: Art & Controls */}
            <div className="flex flex-col justify-center items-center lg:items-start gap-8 h-full">
              {/* Artwork */}
              <div className="w-full max-w-[400px] aspect-square relative group mx-auto lg:mx-0">
                <img
                  src={image}
                  alt="Cover"
                  className={clsx(
                    "w-full h-full object-cover rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 transition-transform duration-500",
                    isPlaying ? "scale-100" : "scale-95 grayscale-[0.2]"
                  )}
                />
              </div>

              {/* Info & Track */}
              <div className="w-full max-w-[500px] space-y-6 mx-auto lg:mx-0">
                <div className="flex justify-between items-end">
                  <div className="overflow-hidden">
                    <motion.h2
                      layoutId="player-title"
                      className="text-3xl md:text-4xl font-bold truncate text-glow"
                    >
                      {currentSong.name}
                    </motion.h2>
                    <motion.p
                      layoutId="player-artist"
                      className="text-lg text-zinc-400 truncate"
                    >
                      {getArtistNames(currentSong)}
                    </motion.p>
                  </div>
                  {/* Like Button placeholder */}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div
                    className="h-1.5 bg-white/10 rounded-full relative group cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      seek(percent * duration);
                    }}
                  >
                    <div
                      className="absolute top-0 left-0 h-full bg-primary rounded-full relative"
                      style={{ width: `${(progress / duration) * 100}%` }}
                    >
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg scale-0 group-hover:scale-100 transition-transform" />
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-zinc-500">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Main Controls */}
                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={toggleShuffle}
                    className={clsx(
                      "p-2 transition-colors",
                      isShuffling
                        ? "text-primary"
                        : "text-zinc-500 hover:text-white"
                    )}
                  >
                    <Shuffle size={22} />
                  </button>

                  <div className="flex items-center gap-8">
                    <button
                      onClick={playPrev}
                      className="text-white hover:text-primary transition-colors hover:scale-110 active:scale-95"
                    >
                      <SkipBack size={32} fill="currentColor" />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="w-20 h-20 bg-primary text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(211,0,0,0.4)] transition-all"
                    >
                      {isPlaying ? (
                        <Pause size={32} fill="currentColor" />
                      ) : (
                        <Play size={32} fill="currentColor" className="ml-1" />
                      )}
                    </button>
                    <button
                      onClick={playNext}
                      className="text-white hover:text-primary transition-colors hover:scale-110 active:scale-95"
                    >
                      <SkipForward size={32} fill="currentColor" />
                    </button>
                  </div>

                  <button
                    onClick={toggleRepeat}
                    className={clsx(
                      "p-2 transition-colors",
                      repeatMode !== "off"
                        ? "text-primary"
                        : "text-zinc-500 hover:text-white"
                    )}
                  >
                    <Repeat size={22} />
                    {repeatMode === "one" && (
                      <span className="absolute text-[8px] font-bold ml-3 -mt-2">
                        1
                      </span>
                    )}
                  </button>
                </div>

                {/* Volume - Simple Slider */}
                <div className="flex items-center gap-4 pt-4">
                  <Volume2 size={20} className="text-zinc-400" />
                  <div className="flex-1 h-1 bg-white/10 rounded-full relative">
                    <div
                      className="h-full bg-white rounded-full"
                      style={{ width: `${volume * 100}%` }}
                    ></div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Queue */}
            <div className="hidden lg:flex flex-col bg-white/5 rounded-3xl p-6 border border-white/5 backdrop-blur-md">
              <h3 className="text-xl font-bold mb-6">Up Next</h3>
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-2">
                {queue.map((song, idx) => {
                  const isCurrent = song.id === currentSong.id;
                  return (
                    <div
                      key={`${song.id}-${idx}`}
                      onClick={() => playSong(song)}
                      className={clsx(
                        "flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all group",
                        isCurrent
                          ? "bg-white/10 border border-primary/30"
                          : "hover:bg-white/5 border border-transparent"
                      )}
                    >
                      <div className="relative w-10 h-10 rounded overflow-hidden shrink-0">
                        <img
                          src={getImageUrl(song.image)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {isCurrent && isPlaying && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div className="w-1 h-3 bg-primary animate-pulse mx-[1px]"></div>
                            <div className="w-1 h-5 bg-primary animate-pulse mx-[1px] animation-delay-100"></div>
                            <div className="w-1 h-2 bg-primary animate-pulse mx-[1px] animation-delay-200"></div>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p
                          className={clsx(
                            "font-medium truncate",
                            isCurrent ? "text-primary" : "text-white"
                          )}
                        >
                          {song.name}
                        </p>
                        <p className="text-xs text-zinc-400 truncate">
                          {getArtistNames(song)}
                        </p>
                      </div>
                      <span className="text-xs text-zinc-600 group-hover:text-zinc-400">
                        {song.duration ? formatTime(Number(song.duration)) : ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

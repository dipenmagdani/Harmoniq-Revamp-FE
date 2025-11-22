"use client";

import React from "react";
import { usePlayer } from "../context/PlayerContext";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Mic2,
  Maximize2,
  ChevronUp,
} from "lucide-react";
import { getImageUrl, getArtistNames } from "@/app/lib/api";
import { clsx } from "clsx";
import { motion } from "framer-motion";

export const Player = () => {
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
    toggleFullScreen,
    isFullScreen,
  } = usePlayer();

  if (!currentSong || isFullScreen) return null;

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progressPercent = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-6 left-0 right-0 z-40 px-4 pointer-events-none flex justify-center">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-[95%] md:max-w-6xl pointer-events-auto cursor-pointer"
        onClick={(e) => {
          // Prevent maximizing if clicking specific controls
          if (
            (e.target as HTMLElement).closest("button") ||
            (e.target as HTMLElement).closest("input")
          )
            return;
          toggleFullScreen(true);
        }}
      >
        <div className="glass-strong rounded-2xl p-3 flex items-center justify-between relative overflow-hidden group hover:border-white/10 transition-colors">
          {/* Background Blur/Glow from Album Art */}
          <div
            className="absolute inset-0 opacity-20 blur-3xl -z-10 transition-colors duration-1000"
            style={{
              background: `radial-gradient(circle at 20% 50%, ${isPlaying ? "#D30000" : "#333"}, transparent 70%)`,
            }}
          />

          {/* Left: Track Info */}
          <div className="flex items-center gap-4 w-[30%] min-w-0">
            <div className="relative group/img">
              <img
                src={getImageUrl(currentSong.image)}
                alt="Cover"
                className={clsx(
                  "w-14 h-14 rounded-lg object-cover shadow-lg border border-white/10 transition-transform group-hover/img:scale-105",
                  isPlaying && "animate-pulse-slow"
                )}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                <ChevronUp size={20} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col overflow-hidden">
              <motion.span
                layoutId="player-title"
                className="text-white font-bold text-sm truncate hover:text-primary transition-colors"
              >
                {currentSong.name}
              </motion.span>
              <motion.span
                layoutId="player-artist"
                className="text-zinc-400 text-xs truncate"
              >
                {getArtistNames(currentSong)}
              </motion.span>
            </div>
          </div>

          {/* Center: Controls & Progress */}
          <div className="flex flex-col items-center gap-2 w-[40%]">
            <div className="flex items-center gap-6">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playPrev();
                }}
                className="text-zinc-300 hover:text-primary transition-colors hover:scale-110 active:scale-95"
              >
                <SkipBack size={24} fill="currentColor" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 hover:bg-primary hover:text-white active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.3)]"
              >
                {isPlaying ? (
                  <Pause size={20} fill="currentColor" />
                ) : (
                  <Play size={20} fill="currentColor" className="ml-0.5" />
                )}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playNext();
                }}
                className="text-zinc-300 hover:text-primary transition-colors hover:scale-110 active:scale-95"
              >
                <SkipForward size={24} fill="currentColor" />
              </button>
            </div>

            <div className="w-full flex items-center gap-3 text-xs font-medium text-zinc-500">
              <span className="w-10 text-right tabular-nums">
                {formatTime(progress)}
              </span>
              <div className="flex-1 h-1 bg-white/10 rounded-full relative group/bar">
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary shadow-[0_0_10px_#D30000] relative"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  value={progress}
                  onChange={(e) => {
                    e.stopPropagation();
                    seek(Number(e.target.value));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="w-10 tabular-nums">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Volume & Actions */}
          <div className="flex items-center justify-end gap-4 w-[30%]">
            <div className="flex items-center gap-2 group/vol hidden md:flex">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setVolume(volume === 0 ? 0.7 : 0);
                }}
                className="text-zinc-400 group-hover/vol:text-white"
              >
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <div className="w-20 h-1 bg-white/10 rounded-full relative overflow-hidden">
                <div
                  className="h-full bg-white group-hover/vol:bg-primary transition-colors"
                  style={{ width: `${volume * 100}%` }}
                ></div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => {
                    e.stopPropagation();
                    setVolume(Number(e.target.value));
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleFullScreen(true);
              }}
              className="text-zinc-500 hover:text-white"
            >
              <Maximize2 size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

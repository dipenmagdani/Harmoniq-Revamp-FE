"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api, getImageUrl, getArtistNames } from "@/app/lib/api";
import { usePlayer } from "@/context/PlayerContext";
import { Play, Clock, Heart, Shuffle, Pause } from "lucide-react";
import { Song, Artist } from "@/types";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import Link from "next/link";
import { Sidebar } from "@/components/Sidebar";
import { Player } from "@/components/Player";
import { FullScreenPlayer } from "@/components/FullScreenPlayer";

export default function AlbumPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<any>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    playSong,
    currentSong,
    isPlaying,
    togglePlay,
    isShuffling,
    toggleShuffle,
  } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setData(null);
      setRecommendations([]);
      setArtists([]);
      try {
        const res = await api.getAlbum(id);

        const resultData = res.data;
        setData(resultData);
        setSongs(resultData.songs || []);

        // Extract Artists
        if (resultData.artist_map?.primary_artists) {
          setArtists(resultData.artist_map.primary_artists);
        } else if (resultData.artist_map?.artists) {
          setArtists(resultData.artist_map.artists);
        }

        // Fetch Recommendations if songs exist
        if (resultData.songs && resultData.songs.length > 0) {
          api
            .getRecommendations(resultData.songs[0].id)
            .then((recRes) => {
              if (recRes.data) setRecommendations(recRes.data);
            })
            .catch(console.error);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handlePlayAll = () => {
    if (songs.length > 0) {
      if (isShuffling) toggleShuffle();
      playSong(songs[0], songs);
    }
  };

  const handleShufflePlay = () => {
    if (songs.length > 0) {
      if (!isShuffling) toggleShuffle();
      playSong(songs[Math.floor(Math.random() * songs.length)], songs);
    }
  };

  const isCurrentContext = songs.some((s) => s.id === currentSong?.id);
  const isPlayingContext = isCurrentContext && isPlaying;

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (!data)
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="p-10 text-center text-zinc-500">Details not found.</div>
      </div>
    );

  const image = getImageUrl(data.image);
  const title = data.name || data.title;
  const subtitle = getArtistNames(data);

  return (
    <div className="flex h-screen w-full bg-background text-white overflow-hidden font-sans selection:bg-primary selection:text-white">
      <Sidebar />
      <main className="flex-1 h-full overflow-y-auto relative scroll-smooth custom-scrollbar bg-gradient-to-b from-[#050505] to-black">
        <div className="pb-32 min-h-screen relative">
          {/* Blurred Background Header */}
          <div className="absolute top-0 left-0 right-0 h-[500px] overflow-hidden -z-10 mask-gradient-to-b">
            <div
              className="w-full h-full bg-cover bg-center blur-[80px] opacity-40 scale-110"
              style={{ backgroundImage: `url(${image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black" />
          </div>

          {/* Content Container */}
          <div className="max-w-[1600px] mx-auto px-6 md:px-10 pt-10">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row items-end gap-8 mb-10">
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="relative group shrink-0"
                initial={{ opacity: 0, scale: 0.9 }}
              >
                <img
                  alt={title}
                  className="w-64 h-64 shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-2xl object-cover border border-white/10"
                  src={image}
                />
              </motion.div>

              <div className="flex flex-col gap-2 w-full">
                <span className="text-primary font-bold uppercase tracking-widest text-xs mb-2 flex items-center gap-2">
                  Album
                  {data.explicit && (
                    <span className="border border-zinc-500 text-[10px] px-1 rounded text-zinc-400">
                      E
                    </span>
                  )}
                </span>
                <h1 className="text-4xl md:text-7xl font-display font-black text-white leading-none tracking-tight text-glow mb-4">
                  {title}
                </h1>
                <p className="text-zinc-300 text-lg font-medium max-w-2xl">
                  {subtitle}
                </p>
                <div className="flex items-center gap-3 text-sm font-semibold text-zinc-500 mt-4">
                  <span>{data.year || data.last_updated || "2024"}</span>
                  <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                  <span>{songs.length} Songs</span>
                  <span className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                  <span>
                    {data.duration
                      ? Math.floor(data.duration / 60) + " min"
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-4 mb-8">
              <button
                className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-[0_0_40px_rgba(211,0,0,0.4)] hover:scale-105 hover:bg-primary-glow active:scale-95 transition-all"
                onClick={isPlayingContext ? togglePlay : handlePlayAll}
              >
                {isPlayingContext ? (
                  <Pause fill="currentColor" size={32} />
                ) : (
                  <Play className="ml-1" fill="currentColor" size={32} />
                )}
              </button>
              <button
                className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors"
                title="Shuffle Play"
                onClick={handleShufflePlay}
              >
                <Shuffle size={20} />
              </button>
              <button className="w-12 h-12 rounded-full border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-colors">
                <Heart size={20} />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
              {/* Tracklist */}
              <div className="flex-1 glass-strong rounded-3xl p-2 md:p-6 overflow-hidden h-fit">
                <div className="grid grid-cols-[30px_1fr_40px] md:grid-cols-[40px_1fr_1fr_60px] gap-4 px-4 py-3 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-white/5 mb-2">
                  <span className="text-center">#</span>
                  <span>Title</span>
                  <span className="hidden md:block">Artist</span>
                  <span className="text-right">
                    <Clock className="inline" size={14} />
                  </span>
                </div>

                <div className="flex flex-col">
                  {songs.map((song, idx) => {
                    const isCurrent = currentSong?.id === song.id;
                    return (
                      <div
                        key={song.id}
                        className={clsx(
                          "grid grid-cols-[30px_1fr_40px] md:grid-cols-[40px_1fr_1fr_60px] gap-4 px-4 py-3.5 rounded-xl items-center group cursor-pointer transition-colors",
                          isCurrent ? "bg-white/10" : "hover:bg-white/5"
                        )}
                        onClick={() => playSong(song, songs)}
                      >
                        <div className="flex justify-center">
                          {isCurrent && isPlaying ? (
                            <div className="flex gap-0.5 items-end h-3">
                              <span className="w-0.5 h-full bg-primary animate-[bounce_1s_infinite]" />
                              <span className="w-0.5 h-2/3 bg-primary animate-[bounce_1.2s_infinite]" />
                              <span className="w-0.5 h-full bg-primary animate-[bounce_0.8s_infinite]" />
                            </div>
                          ) : (
                            <span className="text-sm font-medium text-zinc-500 group-hover:hidden">
                              {idx + 1}
                            </span>
                          )}
                          <Play
                            className={clsx(
                              "hidden text-white",
                              !isCurrent && "group-hover:block"
                            )}
                            fill="currentColor"
                            size={16}
                          />
                        </div>

                        <div className="min-w-0">
                          <div
                            className={clsx(
                              "text-sm font-semibold truncate",
                              isCurrent ? "text-primary" : "text-white"
                            )}
                          >
                            {song.name}
                          </div>
                          <div className="text-xs text-zinc-400 truncate md:hidden">
                            {getArtistNames(song)}
                          </div>
                        </div>

                        <div className="hidden md:block text-sm text-zinc-400 truncate group-hover:text-zinc-200">
                          {getArtistNames(song)}
                        </div>

                        <div className="text-right text-sm font-medium text-zinc-500 tabular-nums">
                          {song.duration
                            ? Math.floor(Number(song.duration) / 60) +
                              ":" +
                              (Number(song.duration) % 60)
                                .toString()
                                .padStart(2, "0")
                            : "-:--"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar Info (Artists & Related) */}
              <div className="w-full lg:w-[350px] flex flex-col gap-8">
                {/* Artists */}
                {artists.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      Artists
                    </h3>
                    <div className="flex flex-col gap-3">
                      {artists.map((artist) => (
                        <Link
                          key={artist.id}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors group"
                          href={`/artist/${artist.id}`}
                        >
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-800">
                            <img
                              alt={artist.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                              src={getImageUrl(artist.image)}
                            />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-white group-hover:text-primary">
                              {artist.name}
                            </p>
                            <p className="text-xs text-zinc-500 capitalize">
                              {artist.role || "Artist"}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommended */}
                {recommendations.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-4">
                      You Might Also Like
                    </h3>
                    <div className="space-y-3">
                      {recommendations.slice(0, 5).map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 cursor-pointer group"
                          onClick={() => playSong(song)}
                        >
                          <img
                            alt=""
                            className="w-10 h-10 rounded-md"
                            src={getImageUrl(song.image)}
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-bold truncate group-hover:text-primary">
                              {song.name}
                            </p>
                            <p className="text-xs text-zinc-500 truncate">
                              {getArtistNames(song)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Player />
        <FullScreenPlayer />
      </main>
    </div>
  );
}
